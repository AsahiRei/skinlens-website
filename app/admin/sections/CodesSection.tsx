"use client";

import { useState } from "react";
import { Ban, Check, Copy, Plus, Ticket } from "lucide-react";
import type { Clinic, InviteCode } from "@/lib/admin-types";
import { Panel } from "../ui";

export function CodesSection({
  clinics,
  codes,
  selectedClinicId,
  onSelectClinic,
  onGenerate,
  onRevoke,
}: {
  clinics: Clinic[];
  codes: InviteCode[];
  selectedClinicId: string;
  onSelectClinic: (clinicId: string) => void;
  onGenerate: (clinicId: string) => void;
  onRevoke: (codeId: string) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const visible = codes.filter((c) => c.clinicId === selectedClinicId);
  const clinic = clinics.find((c) => c.id === selectedClinicId);

  const copy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1500);
    } catch {
      /* clipboard unavailable — code is still visible to copy manually */
    }
  };

  return (
    <div>
      <Panel>
        <h2 className="font-display text-[20px] leading-[28px] text-[#10241A] font-semibold">
          Doctor invite codes
        </h2>
        <p className="text-[14px] leading-[22px] text-[#3F4A44] mt-1 max-w-2xl">
          A code ties a doctor&apos;s registration to one hospital. Share it
          with the hospital&apos;s doctors — revoke it any time to stop new
          registrations.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-1 mt-4 -mx-1 px-1">
          {clinics.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">
              No hospitals yet — add one first.
            </p>
          ) : (
            clinics.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectClinic(c.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all min-h-[40px] active:scale-[0.98] ${
                  c.id === selectedClinicId
                    ? "custom-pill-cta text-white shadow-md"
                    : "bg-white border border-[#E5EDE8] text-[#3f493f] hover:bg-[#EAF6EE]"
                }`}
              >
                {c.name}
              </button>
            ))
          )}
        </div>

        <button
          onClick={() => onGenerate(selectedClinicId)}
          disabled={clinics.length === 0}
          className="mt-4 px-5 py-2.5 rounded-full custom-pill-cta text-white text-[13px] sm:text-[14px] font-medium flex items-center gap-2 min-h-[44px] active:scale-[0.98] disabled:opacity-50"
        >
          <Plus size={16} />
          Generate code{clinic ? ` for ${clinic.name}` : ""}
        </button>
      </Panel>

      <div className="flex flex-col gap-3 mt-4">
        {visible.length === 0 ? (
          <Panel>
            <p className="text-[14px] text-[#6B7280] py-4 text-center">
              No codes for this hospital yet. Generate one above.
            </p>
          </Panel>
        ) : (
          visible.map((c) => {
            const usedUp = c.usedCount >= c.maxUses;
            return (
              <Panel key={c.id}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center shrink-0">
                    <Ticket size={22} />
                  </span>
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="font-mono text-[17px] font-bold tracking-widest text-[#10241A]">
                      {c.code}
                    </p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">
                      Created {c.createdAt} • Expires {c.expiresAt}
                    </p>
                  </div>
                  <span
                    className={`text-[12px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                      c.isActive && !usedUp
                        ? "bg-[#EAF6EE] border-[#DCFCE7] text-[#15803D]"
                        : "bg-[#F4F7F5] border-[#E5EDE8] text-[#6B7280]"
                    }`}
                  >
                    {usedUp
                      ? "Used up"
                      : c.isActive
                        ? `${c.usedCount}/${c.maxUses} used`
                        : "Revoked"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copy(c.id, c.code)}
                      aria-label={`Copy code ${c.code}`}
                      className="w-11 h-11 rounded-full bg-white border border-[#E5EDE8] flex items-center justify-center text-[#10241A] hover:bg-[#EAF6EE] active:scale-95"
                    >
                      {copiedId === c.id ? (
                        <Check size={18} className="text-[#15803D]" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                    {c.isActive ? (
                      <button
                        onClick={() => onRevoke(c.id)}
                        className="h-11 px-4 rounded-full bg-white border border-[#E5EDE8] text-[13px] font-medium text-[#B42318] hover:bg-[#FEF3F2] flex items-center gap-1.5 active:scale-[0.98]"
                      >
                        <Ban size={15} />
                        Revoke
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-[#EFF6F0] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#15803D] transition-all"
                    style={{
                      width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%`,
                    }}
                  />
                </div>
              </Panel>
            );
          })
        )}
      </div>
    </div>
  );
}
