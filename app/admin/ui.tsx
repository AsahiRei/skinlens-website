"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { AppointmentStatus } from "@/lib/admin-types";

export function StatCard({
  icon: Icon,
  value,
  label,
  foot,
  index = 0,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  value: string;
  label: string;
  foot?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{
        y: -6,
        boxShadow: "0 18px 40px -18px rgba(16,36,26,.22)",
      }}
      className="bg-white rounded-[18px] sm:rounded-[20px] p-6 border border-[#E5EDE8] shadow-xs flex flex-col justify-between cursor-default min-w-0"
    >
      <div>
        <div className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center mb-5">
          <Icon size={24} />
        </div>
        <p className="font-display text-[26px] leading-[32px] text-[#10241A] font-semibold tabular-nums">
          {value}
        </p>
        <h3 className="font-display text-[16px] text-[#10241A] font-semibold mt-1">
          {label}
        </h3>
      </div>
      {foot && (
        <div className="pt-4 border-t border-[#EEF2EF] mt-5 flex items-center justify-between text-[12px] text-[#15803D] font-semibold">
          <span>{foot}</span>
          <ArrowRight size={18} />
        </div>
      )}
    </motion.div>
  );
}

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  requested:
    "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]",
  scheduled:
    "bg-[#EAF6EE] border-[#DCFCE7] text-[#15803D]",
  completed: "bg-[#F4F7F5] border-[#E5EDE8] text-[#3F4A44]",
  cancelled: "bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]",
  declined: "bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]",
};

export function StatusPill({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-semibold capitalize whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

export function ActivePill({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold whitespace-nowrap ${
        active
          ? "bg-[#EAF6EE] border-[#DCFCE7] text-[#15803D]"
          : "bg-[#F4F7F5] border-[#E5EDE8] text-[#6B7280]"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#15803D]" : "bg-[#9CA3AF]"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-[18px] sm:rounded-[20px] p-5 sm:p-6 border border-[#E5EDE8] shadow-xs ${className}`}
    >
      {children}
    </div>
  );
}

export type PillOption<T extends string> = { value: T; label: string };

/**
 * Pill-shaped dropdown used for in-row choices (appointment status, a
 * doctor's hospital). `pillClassName` sets the pill's colors so each use can
 * match its meaning (status colors, or neutral).
 */
export function PillSelect<T extends string>({
  value,
  options,
  onChange,
  pillClassName,
  label,
  disabled = false,
  menuWidthClassName = "w-36",
  capitalize = false,
  icon: Icon,
}: {
  value: T;
  options: PillOption<T>[];
  onChange: (value: T) => void;
  pillClassName: string;
  /** Accessible name, e.g. "Status for Maria". */
  label: string;
  disabled?: boolean;
  menuWidthClassName?: string;
  capitalize?: boolean;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="relative inline-block min-w-0 max-w-full">
      <button
        type="button"
        disabled={disabled}
        aria-label={`${label}: ${current}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        className={`flex items-center gap-2 max-w-full pl-3 pr-3 py-1.5 rounded-full border text-[12px] font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ease-in-out hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#15803D]/30 disabled:opacity-60 disabled:cursor-default ${capitalize ? "capitalize" : ""} ${pillClassName}`}
      >
        {Icon ? <Icon size={14} className="shrink-0 opacity-70" /> : null}
        <span className="truncate">{current}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 pointer-events-none opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            role="listbox"
            aria-label={label}
            className={`absolute right-0 mt-1 z-20 ${menuWidthClassName} max-h-64 overflow-y-auto bg-white border border-[#E5EDE8] rounded-[12px] shadow-lg py-1`}
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                title={o.label}
                onClick={() => {
                  setIsOpen(false);
                  if (o.value !== value) onChange(o.value);
                }}
                className={`w-full text-left px-3 py-2 text-[12px] truncate transition-colors hover:bg-[#F4F7F5] ${capitalize ? "capitalize" : ""} ${
                  o.value === value
                    ? "font-semibold text-[#15803D] bg-[#EAF6EE]"
                    : "text-[#3F4A44]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
