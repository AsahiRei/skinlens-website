"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Ban,
  Check,
  Copy,
  MoreVertical,
  Plus,
  Ticket,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { Clinic, InviteCode } from "@/lib/admin-types";
import { Panel } from "../ui";
import { useToast } from "../toast";

export function CodesSection({
  clinics,
  codes,
  selectedClinicId,
  onSelectClinic,
  onGenerate,
  onRevoke,
  onDelete,
}: {
  clinics: Clinic[];
  codes: InviteCode[];
  selectedClinicId: string;
  onSelectClinic: (clinicId: string) => void;
  onGenerate: (clinicId: string) => void;
  onRevoke: (codeId: string) => void;
  onDelete: (codeId: string) => void;
}) {
  const toast = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InviteCode | null>(null);
  const visible = codes.filter((c) => c.clinicId === selectedClinicId);
  const clinic = clinics.find((c) => c.id === selectedClinicId);

  const copy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1500);
    } catch {
      // Clipboard blocked (permissions / insecure context). The code is
      // still on screen, so say so instead of failing silently.
      toast.error(`Couldn't copy ${code}. Select it and copy it manually.`);
    }
  };

  useEffect(() => {
    if (!openMenuId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenuId]);

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
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === c.id ? null : c.id)
                      }
                      aria-label={`Actions for code ${c.code}`}
                      aria-expanded={openMenuId === c.id}
                      className="w-11 h-11 rounded-full bg-white border border-[#E5EDE8] flex items-center justify-center text-[#10241A] hover:bg-[#EAF6EE] active:scale-95"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {openMenuId === c.id ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-12 z-30 w-44 bg-white rounded-2xl border border-[#E5EDE8] shadow-lg overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              copy(c.id, c.code);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-[#10241A] hover:bg-[#EAF6EE] transition-colors"
                          >
                            {copiedId === c.id ? (
                              <Check size={15} className="text-[#15803D]" />
                            ) : (
                              <Copy size={15} />
                            )}
                            {copiedId === c.id ? "Copied" : "Copy"}
                          </button>
                          {c.isActive ? (
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onRevoke(c.id);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-[#B42318] hover:bg-[#FEF3F2] transition-colors"
                            >
                              <Ban size={15} />
                              Revoke
                            </button>
                          ) : null}
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setDeleteTarget(c);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-[#B42318] hover:bg-[#FEF3F2] transition-colors"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
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

      <AnimatePresence>
        {deleteTarget ? (
          <DeleteCodeModal
            code={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={() => {
              onDelete(deleteTarget.id);
              setDeleteTarget(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function DeleteCodeModal({
  code,
  onClose,
  onConfirm,
}: {
  code: InviteCode;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-[#10241A]/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Delete code ${code.code}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full sm:max-w-md bg-white rounded-t-[20px] sm:rounded-[20px] border border-[#E5EDE8] p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <span className="w-12 h-12 rounded-full bg-[#FEF3F2] text-[#B42318] flex items-center justify-center shrink-0">
            <TriangleAlert size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[18px] font-semibold text-[#10241A] leading-snug">
              Delete &quot;{code.code}&quot;?
            </h3>
            <p className="text-[13px] leading-relaxed text-[#3F4A44] mt-1.5">
              This permanently removes the invite code. Any doctor who hasn&apos;t
              used it yet won&apos;t be able to register with it. This can&apos;t be
              undone.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full border border-[#E5EDE8] flex items-center justify-center text-[#10241A] hover:bg-[#EAF6EE] shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[14px] font-medium hover:bg-[#EAF6EE] min-h-[48px] active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 rounded-full bg-[#B42318] text-white text-[14px] font-medium hover:bg-[#912018] flex items-center justify-center gap-2 min-h-[48px] active:scale-[0.98]"
          >
            <Trash2 size={16} />
            Delete code
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
