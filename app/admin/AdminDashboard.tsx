"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Building,
  CalendarCheck,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Ticket,
  Users,
  X,
} from "lucide-react";
import {
  type Appointment,
  type Clinic,
  type DoctorAccount,
  type InviteCode,
} from "@/lib/admin-types";
import { adminLogout } from "./actions";
import {
  deleteClinicAction,
  generateCodeAction,
  revokeCodeAction,
  saveClinicAction,
  toggleClinicAction,
} from "./data-actions";
import { OverviewSection } from "./sections/OverviewSection";
import { HospitalsSection } from "./sections/HospitalsSection";
import { CodesSection } from "./sections/CodesSection";
import { DoctorsSection } from "./sections/DoctorsSection";
import { AppointmentsSection } from "./sections/AppointmentsSection";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hospitals", label: "Hospitals", icon: Building },
  { id: "codes", label: "Invite codes", icon: Ticket },
  { id: "doctors", label: "Doctors", icon: Users },
  { id: "appointments", label: "Appointments", icon: CalendarCheck },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function AdminDashboard({
  initialClinics,
  initialCodes,
  initialDoctors,
  initialAppointments,
}: {
  initialClinics: Clinic[];
  initialCodes: InviteCode[];
  initialDoctors: DoctorAccount[];
  initialAppointments: Appointment[];
}) {
  const [section, setSection] = useState<SectionId>("overview");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [codes, setCodes] = useState(initialCodes);
  const [doctors] = useState(initialDoctors);
  const [appointments] = useState(initialAppointments);
  const [codeClinicId, setCodeClinicId] = useState(initialClinics[0]?.id ?? "");

  const pending = appointments.filter((a) => a.status === "requested");
  const scheduled = appointments.filter((a) => a.status === "scheduled");
  const doctorsCountByClinic = Object.fromEntries(
    clinics.map((c) => [
      c.id,
      doctors.filter((d) => d.clinicId === c.id).length,
    ])
  );

  const goCodes = (clinicId: string) => {
    setCodeClinicId(clinicId);
    setSection("codes");
  };

  // Write buttons (add/edit/generate/...) need a privileged key. With only
  // the publishable key they fail — show why instead of crashing.
  const [mutError, setMutError] = useState<string | null>(null);
  const friendlyError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : "Save failed.";
    if (/row-level security/i.test(msg)) {
      return "Not allowed with the publishable key. Add SUPABASE_SECRET_KEY to .env.local and restart dev to enable editing.";
    }
    return msg;
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* Top bar — same language as the site navbar */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-md bg-white/85 border-[#E5EDE8]/60">
        <div className="flex justify-between items-center gap-3 w-full px-4 sm:px-6 md:px-12 max-w-[1200px] mx-auto h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0">
            <Image
              src="/skinlens-icon.png"
              alt="SkinLens app icon"
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-sm ring-1 ring-[#E5EDE8] shrink-0"
            />
            <span className="font-display text-[18px] sm:text-[20px] font-semibold tracking-tight text-[#10241A] truncate">
              SkinLens
            </span>
            <span className="hidden min-[400px]:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF6EE] border border-[#DCFCE7] text-[#15803D] text-[11px] font-semibold whitespace-nowrap">
              <LockKeyhole size={12} />
              Admin
            </span>
          </Link>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="bg-white border border-[#E5EDE8] hover:bg-[#EAF6EE] text-[#10241A] text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
            >
              <LogOut size={16} className="text-[#15803D]" />
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Heading band */}
      <div className="hero-wash border-b border-[#E5EDE8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 pt-10 sm:pt-14 pb-8 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#EAF6EE] border border-[#DCFCE7] text-[#15803D] text-[11px] sm:text-[12px] font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse shrink-0" />
            <span className="inline-flex items-center gap-1.5">
              <Inbox size={13} />
              {pending.length} request{pending.length === 1 ? "" : "s"} waiting
              for a doctor
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-[28px] leading-[36px] sm:text-[40px] sm:leading-[48px] font-semibold tracking-tight text-[#10241A] text-balance mt-4"
          >
            Hospitals, doctors &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14532D] via-[#15803D] to-[#2E6A41]">
              appointments
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-[15px] sm:text-[16px] leading-relaxed text-[#3F4A44] max-w-xl mt-3 text-pretty"
          >
            Manage the verified hospitals in the app, issue doctor invite
            codes, and follow every appointment.
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10">
        {/* Section nav */}
        <nav
          aria-label="Admin sections"
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`px-5 py-2.5 rounded-full text-[13px] sm:text-[14px] font-medium flex items-center gap-2 whitespace-nowrap transition-all min-h-[44px] active:scale-[0.98] ${
                  active
                    ? "custom-pill-cta text-white shadow-md"
                    : "bg-white border border-[#E5EDE8] text-[#3f493f] hover:bg-[#EAF6EE] hover:text-[#00652c]"
                }`}
              >
                <Icon size={16} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <motion.div
          key={section}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          {mutError ? (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[16px] bg-[#FEF3F2] border border-[#FECDCA] px-4 py-3"
            >
              <p className="text-[13px] font-medium text-[#B42318]">
                {mutError}
              </p>
              <button
                onClick={() => setMutError(null)}
                className="text-[13px] font-semibold text-[#B42318] underline underline-offset-2"
              >
                Dismiss
              </button>
            </div>
          ) : null}
          {section === "overview" ? (
            <OverviewSection
              hospitalCount={clinics.filter((c) => c.isActive).length}
              doctorCount={doctors.length}
              pendingCount={pending.length}
              todayCount={scheduled.length}
              pendingRequests={pending}
              onGo={(s) => setSection(s)}
            />
          ) : null}

          {section === "hospitals" ? (
            <HospitalsSection
              clinics={clinics}
              doctorsCountByClinic={doctorsCountByClinic}
              onToggleActive={(id) => {
                const next = !clinics.find((c) => c.id === id)?.isActive;
                setClinics((cs) =>
                  cs.map((c) => (c.id === id ? { ...c, isActive: next } : c))
                );
                toggleClinicAction(id, next).catch((err) => {
                  // Roll back on failure.
                  setClinics((cs) =>
                    cs.map((c) =>
                      c.id === id ? { ...c, isActive: !next } : c
                    )
                  );
                  setMutError(friendlyError(err));
                });
              }}
              onSave={async (clinic) => {
                setMutError(null);
                try {
                  const saved = await saveClinicAction(clinic);
                  setClinics((cs) => {
                    const exists = cs.some((c) => c.id === saved.id);
                    return exists
                      ? cs.map((c) => (c.id === saved.id ? saved : c))
                      : [...cs, saved];
                  });
                } catch (err) {
                  setMutError(friendlyError(err));
                }
              }}
              onDelete={(id) => {
                setMutError(null);
                const removed = clinics.find((c) => c.id === id);
                setClinics((cs) => cs.filter((c) => c.id !== id));
                // Keep the invite-code tab pointing at a hospital that exists.
                if (codeClinicId === id) {
                  const remaining = clinics.filter((c) => c.id !== id);
                  setCodeClinicId(remaining[0]?.id ?? "");
                }
                deleteClinicAction(id).catch((err) => {
                  // Roll back on failure (e.g. linked doctors/codes block it).
                  if (removed) setClinics((cs) => [...cs, removed]);
                  setMutError(friendlyError(err));
                });
              }}
              onManageCodes={goCodes}
            />
          ) : null}

          {section === "codes" ? (
            <CodesSection
              clinics={clinics}
              codes={codes}
              selectedClinicId={codeClinicId}
              onSelectClinic={setCodeClinicId}
              onGenerate={async (clinicId) => {
                setMutError(null);
                try {
                  const created = await generateCodeAction(clinicId);
                  setCodes((prev) => [created, ...prev]);
                } catch (err) {
                  setMutError(friendlyError(err));
                }
              }}
              onRevoke={async (codeId) => {
                setCodes((prev) =>
                  prev.map((c) =>
                    c.id === codeId ? { ...c, isActive: false } : c
                  )
                );
                revokeCodeAction(codeId).catch((err) => {
                  setCodes((prev) =>
                    prev.map((c) =>
                      c.id === codeId ? { ...c, isActive: true } : c
                    )
                  );
                  setMutError(friendlyError(err));
                });
              }}
            />
          ) : null}

          {section === "doctors" ? (
            <DoctorsSection doctors={doctors} clinics={clinics} />
          ) : null}

          {section === "appointments" ? (
            <AppointmentsSection appointments={appointments} />
          ) : null}
        </motion.div>
      </div>

      <AnimatePresence>
        {logoutOpen ? (
          <LogoutConfirmModal onClose={() => setLogoutOpen(false)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function LogoutConfirmModal({ onClose }: { onClose: () => void }) {
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
      aria-label="Log out of admin"
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
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[18px] font-semibold text-[#10241A] leading-snug">
              Log out of admin?
            </h3>
            <p className="text-[13px] leading-relaxed text-[#3F4A44] mt-1.5">
              You&apos;ll need the admin password to log back in.
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
          <form action={adminLogout} className="flex-1">
            <button
              type="submit"
              className="w-full px-5 py-3 rounded-full custom-pill-cta text-white text-[14px] font-medium shadow-md flex items-center justify-center min-h-[48px] active:scale-[0.98]"
            >
              Log out
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
