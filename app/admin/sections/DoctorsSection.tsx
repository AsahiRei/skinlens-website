"use client";

import { useState } from "react";
import { Building, Loader2, Stethoscope } from "lucide-react";
import type { Clinic, DoctorAccount } from "@/lib/admin-types";
import { ActivePill, Panel, PillSelect } from "../ui";

export function DoctorsSection({
  doctors,
  clinics,
  onSetActive,
  onReassign,
}: {
  doctors: DoctorAccount[];
  clinics: Clinic[];
  onSetActive: (doctorId: string, isActive: boolean) => Promise<void>;
  onReassign: (doctorId: string, clinicId: string) => Promise<void>;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  // A hospital picked in the pill, waiting for Confirm / Cancel.
  const [pendingMove, setPendingMove] = useState<{
    doctorId: string;
    clinicId: string;
  } | null>(null);

  const clinicName = (id: string) =>
    clinics.find((c) => c.id === id)?.name ?? "Unknown hospital";
  const activeClinics = clinics.filter((c) => c.isActive);
  // Active hospitals, plus the doctor's current one even if it's inactive.
  const clinicOptions = (currentId: string) => [
    ...(activeClinics.some((c) => c.id === currentId)
      ? []
      : [{ value: currentId, label: clinicName(currentId) }]),
    ...activeClinics.map((c) => ({ value: c.id, label: c.name })),
  ];

  const run = async (doctorId: string, task: () => Promise<void>) => {
    setBusyId(doctorId);
    try {
      await task();
    } finally {
      setBusyId(null);
      setConfirmingId(null);
      setPendingMove(null);
    }
  };

  return (
    <Panel>
      <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
        Doctors
      </h2>
      <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1">
        {doctors.length} registered via invite code. Deactivating a doctor
        hides them from patients and returns their open appointments to the
        hospital queue.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {doctors.length === 0 ? (
          <p className="text-[14px] text-[#6B7280] py-4 text-center">
            No doctors yet. Generate an invite code and share it with the
            hospital.
          </p>
        ) : (
          doctors.map((d) => {
            const busy = busyId === d.id;
            const confirming = confirmingId === d.id;
            const move = pendingMove?.doctorId === d.id ? pendingMove : null;
            return (
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
                    {[d.email, clinicName(d.clinicId)].filter(Boolean).join(" • ")}
                  </p>
                  <p className="text-[12px] text-[#6B7280] truncate">
                    {d.specialty} • Since {d.registeredAt}
                  </p>
                </div>

                <PillSelect
                  label={`Hospital for ${d.name}`}
                  icon={Building}
                  value={pendingMove?.doctorId === d.id ? pendingMove.clinicId : d.clinicId}
                  options={clinicOptions(d.clinicId)}
                  disabled={busy}
                  menuWidthClassName="w-64"
                  pillClassName="bg-white border-[#E5EDE8] text-[#10241A] max-w-[240px]"
                  onChange={(clinicId) => {
                    setConfirmingId(null);
                    setPendingMove(
                      clinicId === d.clinicId ? null : { doctorId: d.id, clinicId }
                    );
                  }}
                />

                <ActivePill active={d.isActive} />

                {busy ? (
                  <Loader2 size={18} className="animate-spin text-[#15803D]" />
                ) : move ? (
                  <span className="flex flex-wrap items-center gap-2 basis-full sm:basis-auto">
                    <span className="text-[12px] text-[#3F4A44]">
                      Move to <span className="font-semibold text-[#10241A]">{clinicName(move.clinicId)}</span>? Open
                      appointments go back to the old hospital&apos;s queue.
                    </span>
                    <button
                      onClick={() => run(d.id, () => onReassign(d.id, move.clinicId))}
                      className="px-4 py-2 rounded-full custom-pill-cta text-white text-[13px] font-medium min-h-[44px] active:scale-[0.98]"
                    >
                      Move
                    </button>
                    <button
                      onClick={() => setPendingMove(null)}
                      className="px-4 py-2 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[13px] font-medium min-h-[44px]"
                    >
                      Cancel
                    </button>
                  </span>
                ) : confirming ? (
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => run(d.id, () => onSetActive(d.id, false))}
                      className="px-4 py-2 rounded-full bg-[#B42318] text-white text-[13px] font-medium min-h-[44px] active:scale-[0.98]"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="px-4 py-2 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[13px] font-medium min-h-[44px]"
                    >
                      Cancel
                    </button>
                  </span>
                ) : d.isActive ? (
                  <button
                    onClick={() => {
                      setPendingMove(null);
                      setConfirmingId(d.id);
                    }}
                    className="px-4 py-2 rounded-full bg-white border border-[#FECDCA] text-[#B42318] text-[13px] font-medium hover:bg-[#FEF3F2] min-h-[44px] active:scale-[0.98]"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => run(d.id, () => onSetActive(d.id, true))}
                    className="px-4 py-2 rounded-full bg-white border border-[#E5EDE8] text-[#15803D] text-[13px] font-medium hover:bg-[#EAF6EE] min-h-[44px] active:scale-[0.98]"
                  >
                    Activate
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}
