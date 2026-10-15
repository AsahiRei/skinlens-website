"use client";

import { Building, CalendarCheck, Inbox, Plus, Ticket, Users } from "lucide-react";
import type { Appointment } from "@/lib/admin-types";
import { Panel, StatCard, StatusPill } from "../ui";

export function OverviewSection({
  hospitalCount,
  doctorCount,
  pendingCount,
  todayCount,
  pendingRequests,
  onGo,
}: {
  hospitalCount: number;
  doctorCount: number;
  pendingCount: number;
  todayCount: number;
  pendingRequests: Appointment[];
  onGo: (section: "hospitals" | "codes" | "appointments") => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          index={0}
          icon={Building}
          value={String(hospitalCount)}
          label="Hospitals"
          foot="Verified locations"
        />
        <StatCard
          index={1}
          icon={Users}
          value={String(doctorCount)}
          label="Doctors"
          foot="Registered via code"
        />
        <StatCard
          index={2}
          icon={Inbox}
          value={String(pendingCount)}
          label="Pending requests"
          foot="Waiting for a doctor"
        />
        <StatCard
          index={3}
          icon={CalendarCheck}
          value={String(todayCount)}
          label="Scheduled"
          foot="Confirmed appointments"
        />
      </div>

      <Panel className="mt-4 sm:mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
              Requests waiting for a doctor
            </h2>
            <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1">
              Patients sent these with their skin report PDF. Doctors schedule
              them from the app.
            </p>
          </div>
          <button
            onClick={() => onGo("appointments")}
            className="px-5 py-2.5 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[13px] font-medium hover:bg-[#EAF6EE] transition-all active:scale-[0.98] min-h-[44px]"
          >
            View all
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {pendingRequests.length === 0 ? (
            <p className="text-[14px] text-[#6B7280] py-4 text-center">
              No pending requests. New patient requests will show up here.
            </p>
          ) : (
            pendingRequests.map((a) => (
              <div
                key={a.id}
                className="flex flex-wrap items-center gap-2.5 sm:gap-4 rounded-[16px] border border-[#E5EDE8] px-4 py-3"
              >
                <div className="min-w-0 flex-1 basis-48">
                  <p className="text-[14px] font-semibold text-[#10241A] truncate">
                    {a.patientName}
                  </p>
                  <p className="text-[12px] text-[#6B7280] truncate">
                    {a.clinicName} • {a.requestedAt}
                  </p>
                </div>
                <StatusPill status={a.status} />
                <span className="text-[12px] font-medium text-[#15803D]">
                  {a.hasPdf ? "PDF attached" : "No PDF"}
                </span>
              </div>
            ))
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <button
          onClick={() => onGo("hospitals")}
          className="bg-white rounded-[18px] sm:rounded-[20px] p-6 border border-[#E5EDE8] shadow-xs text-left hover:bg-[#EAF6EE]/40 transition-all active:scale-[0.99] flex items-center gap-4"
        >
          <span className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center shrink-0">
            <Plus size={24} />
          </span>
          <span>
            <span className="block font-display text-[16px] font-semibold text-[#10241A]">
              Add a hospital
            </span>
            <span className="block text-[13px] text-[#6B7280] mt-0.5">
              It appears in the app once active
            </span>
          </span>
        </button>
        <button
          onClick={() => onGo("codes")}
          className="bg-white rounded-[18px] sm:rounded-[20px] p-6 border border-[#E5EDE8] shadow-xs text-left hover:bg-[#EAF6EE]/40 transition-all active:scale-[0.99] flex items-center gap-4"
        >
          <span className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center shrink-0">
            <Ticket size={24} />
          </span>
          <span>
            <span className="block font-display text-[16px] font-semibold text-[#10241A]">
              Generate a doctor code
            </span>
            <span className="block text-[13px] text-[#6B7280] mt-0.5">
              Ties registration to one hospital
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
