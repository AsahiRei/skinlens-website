"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
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
  foot: string;
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
      <div className="pt-4 border-t border-[#EEF2EF] mt-5 flex items-center justify-between text-[12px] text-[#15803D] font-semibold">
        <span>{foot}</span>
        <ArrowRight size={18} />
      </div>
    </motion.div>
  );
}

const STATUS_STYLES: Record<AppointmentStatus, string> = {
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
