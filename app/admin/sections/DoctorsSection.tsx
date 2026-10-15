"use client";

import { Stethoscope } from "lucide-react";
import type { Clinic, DoctorAccount } from "@/lib/admin-types";
import { ActivePill, Panel } from "../ui";

export function DoctorsSection({
  doctors,
  clinics,
}: {
  doctors: DoctorAccount[];
  clinics: Clinic[];
}) {
  const clinicName = (id: string) =>
    clinics.find((c) => c.id === id)?.name ?? "Unknown hospital";

  return (
    <Panel>
      <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
        Doctors
      </h2>
      <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1">
        {doctors.length} registered via invite code. New doctors appear here
        after signing up in the app.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {doctors.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] py-4 text-center">
            No doctors yet. Generate an invite code and share it with the
            hospital.
          </p>
        ) : (
          doctors.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center gap-3 rounded-[16px] border border-[#E5EDE8] px-4 py-3"
            >
              <span className="w-10 h-10 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center shrink-0">
                <Stethoscope size={20} />
              </span>
              <div className="min-w-0 flex-1 basis-48">
                <p className="text-[14px] font-semibold text-[#10241A] truncate">
                  {d.name}
                </p>
                <p className="text-[12px] text-[#6B7280] truncate">
                  {d.email} • {clinicName(d.clinicId)}
                </p>
              </div>
              <span className="text-[12px] font-medium text-[#15803D] whitespace-nowrap">
                {d.specialty}
              </span>
              <span className="text-[12px] text-[#6B7280] whitespace-nowrap">
                Since {d.registeredAt}
              </span>
              <ActivePill active={d.isActive} />
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
