"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { Appointment, AppointmentStatus } from "@/lib/admin-types";
import { Panel, StatusPill } from "../ui";

const FILTERS: { id: AppointmentStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "requested", label: "Requested" },
  { id: "scheduled", label: "Scheduled" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "declined", label: "Declined" },
];

export function AppointmentsSection({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const visible =
    filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <Panel>
      <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
        Appointments
      </h2>
      <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1">
        Every request and scheduled visit across hospitals. Scheduling itself
        happens in the app, by the doctor.
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
              <StatusPill status={a.status} />
              <span
                className={`inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap ${
                  a.hasPdf ? "text-[#15803D]" : "text-[#9CA3AF]"
                }`}
              >
                <FileText size={15} />
                {a.hasPdf ? "PDF attached" : "No PDF"}
              </span>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
