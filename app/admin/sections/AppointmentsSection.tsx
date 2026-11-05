"use client";

import { useState } from "react";
import { ChevronDown, FileText, Loader2 } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/lib/admin-types";
import { getAppointmentReportUrlAction } from "../data-actions";
import { Panel, STATUS_STYLES } from "../ui";

const FILTERS: { id: AppointmentStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "requested", label: "Requested" },
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "declined", label: "Declined" },
];

const STATUSES: AppointmentStatus[] = [
  "requested",
  "scheduled",
  "completed",
  "cancelled",
  "declined",
];

function StatusSelect({
  value,
  onChange,
}: {
  value: AppointmentStatus;
  onChange: (status: AppointmentStatus) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 pl-3 pr-7 py-1.5 rounded-full border text-[12px] font-medium capitalize whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out ${STATUS_STYLES[value]} hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#15803D]/30`}
      >
        {value}
        <ChevronDown
          size={14}
          className={`pointer-events-none opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 z-20 w-36 bg-white border border-[#E5EDE8] rounded-[12px] shadow-lg overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[12px] capitalize transition-colors hover:bg-[#F4F7F5] ${
                  s === value ? "font-semibold text-[#15803D] bg-[#EAF6EE]" : "text-[#3F4A44]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AppointmentsSection({
  appointments,
  onStatusChange,
  onError,
}: {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onError?: (message: string) => void;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [openingPdfId, setOpeningPdfId] = useState<string | null>(null);
  const visible =
    filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  // Mint a short-lived signed URL on the server and open it in a new tab.
  const openPdf = async (appointmentId: string) => {
    if (openingPdfId) return;
    setOpeningPdfId(appointmentId);
    try {
      const url = await getAppointmentReportUrlAction(appointmentId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Couldn't open the PDF.");
    } finally {
      setOpeningPdfId(null);
    }
  };

  return (
    <Panel>
      <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
        Appointments
      </h2>
      <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1">
        Every request and scheduled visit across hospitals. Change a status
        with the pill — the app reflects it right away.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 mt-4 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all min-h-[40px] active:scale-[0.98] ${
              filter === f.id
                ? "custom-pill-cta text-white shadow-md"
                : "bg-white border border-[#E5EDE8] text-[#3f493f] hover:bg-[#EAF6EE]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {visible.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] py-4 text-center">
            Nothing with this status.
          </p>
        ) : (
          visible.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-2.5 sm:gap-4 rounded-[16px] border border-[#E5EDE8] px-4 py-3"
            >
              <div className="min-w-0 flex-1 basis-52">
                <p className="text-[14px] font-semibold text-[#10241A] truncate">
                  {a.patientName}
                </p>
                <p className="text-[12px] text-[#6B7280] truncate">
                  {a.clinicName}
                  {a.doctorName ? ` • ${a.doctorName}` : " • No doctor yet"}
                </p>
                <p className="text-[12px] text-[#6B7280] truncate">
                  Asked {a.requestedAt}
                  {a.scheduledAt ? ` • Visit ${a.scheduledAt}` : ""}
                </p>
              </div>
              <StatusSelect
                value={a.status}
                onChange={(s) => {
                  if (s !== a.status) onStatusChange(a.id, s);
                }}
              />
              {a.hasPdf ? (
                <button
                  type="button"
                  onClick={() => void openPdf(a.id)}
                  disabled={Boolean(openingPdfId)}
                  aria-label="View report PDF"
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap text-[#15803D] hover:underline disabled:opacity-60"
                >
                  {openingPdfId === a.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <FileText size={15} />
                  )}
                  {openingPdfId === a.id ? "Opening…" : "View PDF"}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap text-[#9CA3AF]">
                  <FileText size={15} />
                  No PDF
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
