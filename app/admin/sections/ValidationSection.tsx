"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  Hourglass,
  RefreshCw,
  ScanFace,
  ShieldCheck,
} from "lucide-react";
import { MIN_REVIEWS_FOR_RATE } from "@/lib/admin-types";
import type { ReviewTally, ValidationStats } from "@/lib/admin-validation";
import { getValidationStatsAction } from "../data-actions";
import { Panel, StatCard } from "../ui";

const pct = (n: number) => `${Math.round(n * 100)}%`;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Agreement rate, or an honest "too few" when the sample is tiny. */
function agreement(t: ReviewTally): string | null {
  return t.reviewed >= MIN_REVIEWS_FOR_RATE ? pct(t.confirmed / t.reviewed) : null;
}

function formatHours(h: number | null): string {
  if (h === null) return "No reviews yet";
  if (h < 1) return "Under 1 hour";
  if (h < 48) return `${Math.round(h)} hours`;
  return `${Math.round(h / 24)} days`;
}

const th =
  "px-4 py-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider whitespace-nowrap";
const td = "px-4 py-3 text-[13px] text-[#3F4A44] tabular-nums whitespace-nowrap";

function RateCell({ tally }: { tally: ReviewTally }) {
  const rate = agreement(tally);
  return rate ? (
    <span className="font-semibold text-[#10241A]">{rate}</span>
  ) : (
    <span className="text-[#6B7280]">
      {tally.reviewed === 0 ? "No reviews" : "Too few reviews"}
    </span>
  );
}

function ReviewTable({
  firstColumn,
  rows,
  extra,
}: {
  firstColumn: string;
  rows: (ReviewTally & { label: string; scans: number })[];
  extra?: { header: string; cell: (i: number) => React.ReactNode };
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E5EDE8]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#F9FBFA] border-b border-[#E5EDE8]">
            <th className={th}>{firstColumn}</th>
            <th className={`${th} text-right`}>Scans</th>
            {extra ? <th className={`${th} text-right`}>{extra.header}</th> : null}
            <th className={`${th} text-right`}>Reviewed</th>
            <th className={`${th} text-right`}>Confirmed</th>
            <th className={`${th} text-right`}>Flagged</th>
            <th className={`${th} text-right`}>Doctor agrees</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5EDE8]">
          {rows.map((r, i) => (
            <tr key={r.label}>
              <td className={`${td} font-medium text-[#10241A]`}>{capitalize(r.label)}</td>
              <td className={`${td} text-right`}>{r.scans}</td>
              {extra ? <td className={`${td} text-right`}>{extra.cell(i)}</td> : null}
              <td className={`${td} text-right`}>{r.reviewed}</td>
              <td className={`${td} text-right`}>{r.confirmed}</td>
              <td className={`${td} text-right`}>{r.needsReview}</td>
              <td className={`${td} text-right`}>
                <RateCell tally={r} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ValidationSection() {
  const [stats, setStats] = useState<ValidationStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getValidationStatsAction();
      if (res.error !== undefined) setError(res.error);
      else setStats(res.stats);
    } catch {
      setError("Could not load validation stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount; state updates happen after the await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-4 border-[#E5EDE8] border-t-[#15803D] rounded-full animate-spin" />
        <p className="text-[14px] text-[#3F4A44]">Loading validation stats...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div role="alert" className="p-4 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-[14px] font-medium">
        {error}
      </div>
    );
  }

  if (!stats) return null;
  const overallRate = agreement(stats.overall);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-[20px] font-semibold text-[#10241A]">
            AI validation
          </h2>
          <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1 max-w-[640px]">
            How often dermatologists agree with the AI&apos;s detected
            condition. Rates appear once a group has at least{" "}
            {MIN_REVIEWS_FOR_RATE} reviews. Patients are not identified here.
          </p>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[13px] font-medium hover:bg-[#EAF6EE] min-h-[44px] disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error ? (
        <div role="alert" className="p-3 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-[13px] font-medium">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard index={0} icon={ScanFace} value={String(stats.aiScans)} label="AI scans" />
        <StatCard
          index={1}
          icon={ClipboardCheck}
          value={String(stats.overall.reviewed)}
          label="Reviewed by a doctor"
        />
        <StatCard
          index={2}
          icon={ShieldCheck}
          value={overallRate ?? "Too few"}
          label={
            overallRate
              ? `Doctor agrees (${stats.overall.confirmed} of ${stats.overall.reviewed})`
              : `Doctor agrees (${stats.overall.reviewed} of ${MIN_REVIEWS_FOR_RATE} reviews needed)`
          }
        />
        <StatCard
          index={3}
          icon={Hourglass}
          value={String(stats.awaitingReview)}
          label={
            stats.oldestWaitDays !== null
              ? `Waiting for review (oldest ${stats.oldestWaitDays} day${stats.oldestWaitDays === 1 ? "" : "s"})`
              : "Waiting for review"
          }
        />
      </div>

      <p className="text-[13px] text-[#6B7280]">
        Median time from scan to review: {formatHours(stats.medianReviewHours)}.
        {stats.unlabeledResults > 0
          ? ` ${stats.unlabeledResults} of ${stats.totalResults} results have no AI-detected condition (survey only) and are not counted` +
            (stats.unlabeledReviewed > 0
              ? `, including ${stats.unlabeledReviewed} doctor review${stats.unlabeledReviewed === 1 ? "" : "s"} of them.`
              : ".")
          : ""}
      </p>

      <Panel>
        <h3 className="font-display text-[18px] font-semibold text-[#10241A]">By condition</h3>
        <p className="text-[13px] text-[#6B7280] mt-1">
          A low agreement rate means the model often detects this condition
          when a doctor disagrees.
        </p>
        {stats.conditions.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] py-6 text-center">No AI scans yet.</p>
        ) : (
          <ReviewTable
            firstColumn="Condition"
            rows={stats.conditions}
            extra={{
              header: "Avg confidence",
              cell: (i) => {
                const c = stats.conditions[i].avgConfidence;
                return c === null ? "–" : pct(c);
              },
            }}
          />
        )}
      </Panel>

      <Panel>
        <h3 className="font-display text-[18px] font-semibold text-[#10241A]">By model confidence</h3>
        <p className="text-[13px] text-[#6B7280] mt-1">
          If agreement drops below a confidence level, the app could tell
          users to see a doctor for scans under it.
        </p>
        <ReviewTable firstColumn="Confidence" rows={stats.confidenceBands} />
      </Panel>

      <Panel>
        <h3 className="font-display text-[18px] font-semibold text-[#10241A]">
          Flagged by doctors
        </h3>
        <p className="text-[13px] text-[#6B7280] mt-1">
          Most recent 20 results a doctor marked as needing review.
        </p>
        <div className="mt-4 flex flex-col gap-2.5">
          {stats.flagged.length === 0 ? (
            <p className="text-[14px] text-[#6B7280] py-4 text-center">
              No flagged results.
            </p>
          ) : (
            stats.flagged.map((f) => (
              <div key={f.id} className="rounded-[16px] border border-[#E5EDE8] px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-[#FEF3F2] border-[#FECDCA] text-[#B42318] text-[11px] font-semibold">
                    <CircleAlert size={12} aria-hidden />
                    Needs review
                  </span>
                  <span className="text-[14px] font-semibold text-[#10241A]">
                    AI said: {f.label ? capitalize(f.label) : "No condition"}
                    {f.confidence !== null ? ` (${pct(f.confidence)})` : ""}
                  </span>
                  <span className="text-[12px] text-[#6B7280]">Result #{f.id}</span>
                </div>
                <p className="text-[12px] text-[#6B7280] mt-1">
                  Scanned {f.scannedAt} • Reviewed {f.reviewedAt} by {f.doctorName}
                  {f.clinicName ? `, ${f.clinicName}` : ""}
                </p>
                <p className="text-[13px] text-[#3F4A44] mt-2">
                  {f.notes ? `“${f.notes}”` : "No note left."}
                </p>
              </div>
            ))
          )}
        </div>
        {stats.overall.confirmed > 0 ? (
          <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-[#15803D] font-medium">
            <CircleCheck size={16} aria-hidden />
            {stats.overall.confirmed} result{stats.overall.confirmed === 1 ? "" : "s"} confirmed by doctors.
          </p>
        ) : null}
      </Panel>
    </div>
  );
}
