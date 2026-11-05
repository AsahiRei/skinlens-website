import type { SupabaseClient } from "@supabase/supabase-js";
import { toDisplayDate } from "./admin-db";

// Server-only module (pulls in the Supabase admin client). Client components
// may only `import type` from here; shared constants live in admin-types.

// ── AI result validation stats ────────────────────────────────────────────
// Doctors confirm or flag a patient's latest AI result through the app's
// validate_ai_result() RPC (migration 0007). These stats turn those reviews
// into a measure of how often the model agrees with a dermatologist.
//
// Patient identity is deliberately left out: the admin sees conditions,
// confidence and the doctor's verdict, never who the patient is.

export type ReviewTally = {
  reviewed: number;
  confirmed: number;
  needsReview: number;
};

export type ConditionStats = ReviewTally & {
  label: string;
  scans: number;
  /** Mean model confidence (0–1) over all scans with this label. */
  avgConfidence: number | null;
};

export type ConfidenceBand = ReviewTally & {
  label: string;
  scans: number;
};

export type FlaggedResult = {
  id: number;
  label: string | null;
  confidence: number | null;
  scannedAt: string;
  reviewedAt: string;
  doctorName: string;
  clinicName: string;
  notes: string | null;
};

export type ValidationStats = {
  totalResults: number;
  /** Results with no AI label (survey-only), excluded from accuracy. */
  unlabeledResults: number;
  /** Doctor reviews of those unlabeled results (also excluded). */
  unlabeledReviewed: number;
  aiScans: number;
  overall: ReviewTally;
  /** Median hours from scan to doctor review, over reviewed scans. */
  medianReviewHours: number | null;
  /** Patients with an open appointment whose latest result isn't reviewed. */
  awaitingReview: number;
  /** Days the oldest of those has waited since the appointment request. */
  oldestWaitDays: number | null;
  conditions: ConditionStats[];
  confidenceBands: ConfidenceBand[];
  flagged: FlaggedResult[];
};

type ResultRow = {
  id: number;
  user_id: string;
  detection_label: string | null;
  confidence: number | null;
  validation_status: "pending" | "confirmed" | "needs_review" | null;
  created_at: string | null;
  validated_at: string | null;
};

const BANDS: { label: string; min: number; max: number }[] = [
  { label: "Under 40%", min: 0, max: 0.4 },
  { label: "40–50%", min: 0.4, max: 0.5 },
  { label: "50–60%", min: 0.5, max: 0.6 },
  { label: "60% and up", min: 0.6, max: Infinity },
];

const PAGE = 1000; // PostgREST's default max rows per request

async function fetchAllResults(db: SupabaseClient): Promise<ResultRow[]> {
  const rows: ResultRow[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from("results")
      .select(
        "id, user_id, detection_label, confidence, validation_status, created_at, validated_at"
      )
      .order("id")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as ResultRow[]));
    if (!data || data.length < PAGE) return rows;
  }
}

function emptyTally(): ReviewTally {
  return { reviewed: 0, confirmed: 0, needsReview: 0 };
}

function addReview(t: ReviewTally, status: ResultRow["validation_status"]) {
  if (status === "confirmed") {
    t.reviewed++;
    t.confirmed++;
  } else if (status === "needs_review") {
    t.reviewed++;
    t.needsReview++;
  }
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const time = (v: string | null) => (v ? new Date(v).getTime() : NaN);

export async function getValidationStats(
  db: SupabaseClient
): Promise<ValidationStats> {
  const [results, openApptsRes, flaggedRes] = await Promise.all([
    fetchAllResults(db),
    db
      .from("appointments")
      .select("patient_id, created_at")
      .in("status", ["requested", "scheduled"]),
    db
      .from("results")
      .select(
        "id, detection_label, confidence, created_at, validated_at, validated_by, doctor_notes"
      )
      .eq("validation_status", "needs_review")
      .order("validated_at", { ascending: false })
      .limit(20),
  ]);
  if (openApptsRes.error) throw new Error(openApptsRes.error.message);
  if (flaggedRes.error) throw new Error(flaggedRes.error.message);

  // ── accuracy over AI-labelled scans ──
  const labeled = results.filter((r) => r.detection_label);
  const overall = emptyTally();
  const byLabel = new Map<string, ConditionStats & { confSum: number; confN: number }>();
  const bands = BANDS.map((b) => ({ ...b, scans: 0, ...emptyTally() }));
  const reviewHours: number[] = [];

  for (const r of labeled) {
    const label = r.detection_label as string;
    let c = byLabel.get(label);
    if (!c) {
      c = { label, scans: 0, avgConfidence: null, confSum: 0, confN: 0, ...emptyTally() };
      byLabel.set(label, c);
    }
    c.scans++;
    addReview(c, r.validation_status);
    addReview(overall, r.validation_status);

    if (typeof r.confidence === "number") {
      c.confSum += r.confidence;
      c.confN++;
      const band = bands.find((b) => r.confidence! >= b.min && r.confidence! < b.max);
      if (band) {
        band.scans++;
        addReview(band, r.validation_status);
      }
    }

    const hours = (time(r.validated_at) - time(r.created_at)) / 3_600_000;
    if (r.validation_status !== "pending" && Number.isFinite(hours) && hours >= 0) {
      reviewHours.push(hours);
    }
  }

  const conditions: ConditionStats[] = [...byLabel.values()]
    .map(({ confSum, confN, ...c }) => ({
      ...c,
      avgConfidence: confN > 0 ? confSum / confN : null,
    }))
    .sort((a, b) => b.scans - a.scans || a.label.localeCompare(b.label));

  // ── review backlog: open appointment + latest result still pending ──
  // Doctors can only review a patient's LATEST result, and only while that
  // patient has an open appointment, so that's what "waiting" means.
  const latestByPatient = new Map<string, ResultRow>();
  for (const r of results) {
    const prev = latestByPatient.get(r.user_id);
    if (!prev || time(r.created_at) > time(prev.created_at)) {
      latestByPatient.set(r.user_id, r);
    }
  }
  const oldestRequestByPatient = new Map<string, number>();
  for (const a of (openApptsRes.data ?? []) as { patient_id: string; created_at: string }[]) {
    const t = time(a.created_at);
    const prev = oldestRequestByPatient.get(a.patient_id);
    if (prev === undefined || t < prev) oldestRequestByPatient.set(a.patient_id, t);
  }
  let awaitingReview = 0;
  let oldestWait: number | null = null;
  for (const [patientId, requestedAt] of oldestRequestByPatient) {
    const latest = latestByPatient.get(patientId);
    if (!latest || (latest.validation_status ?? "pending") !== "pending") continue;
    awaitingReview++;
    if (oldestWait === null || requestedAt < oldestWait) oldestWait = requestedAt;
  }

  // ── flagged results with reviewer + hospital (no patient identity) ──
  const flaggedRows = (flaggedRes.data ?? []) as {
    id: number;
    detection_label: string | null;
    confidence: number | null;
    created_at: string | null;
    validated_at: string | null;
    validated_by: string | null;
    doctor_notes: string | null;
  }[];
  const reviewerIds = [
    ...new Set(flaggedRows.map((f) => f.validated_by).filter((v): v is string => Boolean(v))),
  ];
  const reviewerById = new Map<string, { name: string; clinicId: string }>();
  const clinicNameById = new Map<string, string>();
  if (reviewerIds.length > 0) {
    const { data } = await db
      .from("doctors")
      .select("user_id, display_name, clinic_id")
      .in("user_id", reviewerIds);
    for (const d of (data ?? []) as { user_id: string; display_name: string; clinic_id: string }[]) {
      reviewerById.set(d.user_id, { name: d.display_name || "Doctor", clinicId: d.clinic_id });
    }
    const clinicIds = [...new Set([...reviewerById.values()].map((r) => r.clinicId))];
    if (clinicIds.length > 0) {
      const { data: clinics } = await db.from("clinics").select("id, name").in("id", clinicIds);
      for (const c of (clinics ?? []) as { id: string; name: string }[]) {
        clinicNameById.set(c.id, c.name);
      }
    }
  }

  const flagged: FlaggedResult[] = flaggedRows.map((f) => {
    const reviewer = f.validated_by ? reviewerById.get(f.validated_by) : undefined;
    return {
      id: f.id,
      label: f.detection_label,
      confidence: f.confidence,
      scannedAt: toDisplayDate(f.created_at),
      reviewedAt: toDisplayDate(f.validated_at),
      // Current hospital of the reviewer (doctors can move after reviewing).
      doctorName: reviewer?.name ?? "Former doctor",
      clinicName: reviewer ? clinicNameById.get(reviewer.clinicId) ?? "Unknown hospital" : "",
      notes: f.doctor_notes,
    };
  });

  return {
    totalResults: results.length,
    unlabeledResults: results.length - labeled.length,
    unlabeledReviewed: results.filter(
      (r) => !r.detection_label && r.validation_status && r.validation_status !== "pending"
    ).length,
    aiScans: labeled.length,
    overall,
    medianReviewHours: median(reviewHours),
    awaitingReview,
    oldestWaitDays:
      oldestWait === null ? null : Math.floor((Date.now() - oldestWait) / 86_400_000),
    conditions,
    confidenceBands: bands.map(({ label, scans, reviewed, confirmed, needsReview }) => ({
      label,
      scans,
      reviewed,
      confirmed,
      needsReview,
    })),
    flagged,
  };
}
