import { getSupabaseAdmin, missingSupabaseEnv } from "./supabase-admin";
import type {
  Appointment,
  Clinic,
  DoctorAccount,
  InviteCode,
} from "./admin-types";

export type AdminData = {
  clinics: Clinic[];
  codes: InviteCode[];
  doctors: DoctorAccount[];
  appointments: Appointment[];
};

export function toDisplayDate(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── live reads (no mock fallback — throws when Supabase is unreachable) ───
export async function getAdminData(): Promise<AdminData> {
  const db = getSupabaseAdmin();
  if (!db) {
    throw new Error(
      `Supabase is not configured (missing: ${missingSupabaseEnv().join(", ")}). ` +
        "Set them in .env.local and restart the dev server."
    );
  }

  const [clinicsRes, codesRes, doctorsRes, apptsRes] = await Promise.all([
    db.from("clinics").select("*").order("name"),
    db
      .from("clinic_invite_codes")
      .select("*")
      .order("created_at", { ascending: false }),
    db.from("doctors").select("*").order("created_at", { ascending: false }),
    db
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  if (clinicsRes.error) throw new Error(clinicsRes.error.message);
  if (codesRes.error) throw new Error(codesRes.error.message);
  if (doctorsRes.error) throw new Error(doctorsRes.error.message);
  if (apptsRes.error) throw new Error(apptsRes.error.message);

  const clinicNameById = new Map(
    ((clinicsRes.data ?? []) as Record<string, unknown>[]).map((c) => [
      c.id as string,
      c.name as string,
    ])
  );

  const clinics: Clinic[] = ((clinicsRes.data ?? []) as Record<string, unknown>[]).map(
    (c) => ({
      id: c.id as string,
      name: (c.name as string) ?? "",
      specialty: (c.specialty as string) ?? "Dermatology",
      address: (c.address as string) ?? "",
      phone: (c.phone as string) ?? "",
      website: (c.website as string) ?? "",
      hours: (c.hours as string) ?? "",
      description: (c.description as string) ?? "",
      latitude: (c.latitude as number | null) ?? null,
      longitude: (c.longitude as number | null) ?? null,
      rating: typeof c.rating === "number" ? c.rating : 0,
      availableToday: c.available_today === true,
      isActive: (c.is_active as boolean) ?? true,
    })
  );

  const codes: InviteCode[] = ((codesRes.data ?? []) as Record<string, unknown>[]).map(
    (c) => ({
      id: c.id as string,
      code: c.code as string,
      clinicId: c.clinic_id as string,
      maxUses: c.max_uses as number,
      usedCount: c.used_count as number,
      expiresAt: toDisplayDate(c.expires_at as string),
      isActive: c.is_active as boolean,
      createdAt: toDisplayDate(c.created_at as string),
    })
  );

  const doctors: DoctorAccount[] = (
    (doctorsRes.data ?? []) as Record<string, unknown>[]
  ).map((d) => ({
    id: d.user_id as string,
    name: (d.display_name as string) || "Doctor",
    email: "",
    clinicId: d.clinic_id as string,
    specialty: (d.specialty as string) ?? "Dermatology",
    registeredAt: toDisplayDate(d.created_at as string),
    isActive: (d.is_active as boolean) ?? true,
  }));

  // Doctor display names for appointments (batch lookup, no PII beyond names).
  const doctorIds = [
    ...new Set(
      ((apptsRes.data ?? []) as Record<string, unknown>[])
        .map((a) => a.doctor_id as string | null)
        .filter((v): v is string => Boolean(v))
    ),
  ];
  let doctorNameById = new Map<string, string>();
  if (doctorIds.length > 0) {
    const { data } = await db
      .from("doctors")
      .select("user_id, display_name")
      .in("user_id", doctorIds);
    doctorNameById = new Map(
      ((data ?? []) as Record<string, unknown>[]).map((d) => [
        d.user_id as string,
        (d.display_name as string) || "Doctor",
      ])
    );
  }

  // Patient display names (batch lookup from user_profile, no extra PII).
  const patientIds = [
    ...new Set(
      ((apptsRes.data ?? []) as Record<string, unknown>[]).map(
        (a) => a.patient_id as string
      )
    ),
  ];
  let patientNameById = new Map<string, string>();
  if (patientIds.length > 0) {
    const { data } = await db
      .from("user_profile")
      .select("id, username")
      .in("id", patientIds);
    patientNameById = new Map(
      ((data ?? []) as Record<string, unknown>[]).map((p) => [
        p.id as string,
        (p.username as string) || "Patient",
      ])
    );
  }

  const appointments: Appointment[] = (
    (apptsRes.data ?? []) as Record<string, unknown>[]
  ).map((a) => {
    return {
      id: a.id as string,
      patientName: patientNameById.get(a.patient_id as string) ?? "Patient",
      clinicId: a.clinic_id as string,
      clinicName:
        clinicNameById.get(a.clinic_id as string) || "Unknown hospital",
      doctorName: a.doctor_id
        ? (doctorNameById.get(a.doctor_id as string) ?? "Doctor")
        : null,
      requestedAt: toDisplayDate(a.created_at as string),
      scheduledAt: a.scheduled_at
        ? toDisplayDate(a.scheduled_at as string)
        : null,
      status: a.status as Appointment["status"],
      hasPdf: Boolean(a.report_pdf_path),
    };
  });

  return { clinics, codes, doctors, appointments };
}
