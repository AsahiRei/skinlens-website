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
  Loader2,
  FileText,
  Download,
} from "lucide-react";
import {
  type Appointment,
  type AppointmentStatus,
  type Clinic,
  type DoctorAccount,
  type InviteCode,
} from "@/lib/admin-types";
import { adminLogout } from "./actions";
import {
  deleteClinicAction,
  deleteCodeAction,
  generateCodeAction,
  reassignDoctorAction,
  revokeCodeAction,
  saveDownloadUrlAction,
  saveClinicAction,
  setDoctorActiveAction,
  toggleClinicAction,
  updateAppointmentStatusAction,
} from "./data-actions";
import { OverviewSection } from "./sections/OverviewSection";
import { HospitalsSection } from "./sections/HospitalsSection";
import { CodesSection } from "./sections/CodesSection";
import { DoctorsSection } from "./sections/DoctorsSection";
import { AppointmentsSection } from "./sections/AppointmentsSection";
import { AuditLogsSection } from "./sections/AuditLogsSection";
import { DownloadSection } from "./sections/DownloadSection";
import { ToastProvider, useToast } from "./toast";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hospitals", label: "Hospitals", icon: Building },
  { id: "codes", label: "Invite codes", icon: Ticket },
  { id: "doctors", label: "Doctors", icon: Users },
  { id: "appointments", label: "Appointments", icon: CalendarCheck },
  { id: "download", label: "Download link", icon: Download },
  { id: "audit", label: "Audit Logs", icon: FileText },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

type AdminDashboardProps = {
  initialClinics: Clinic[];
  initialCodes: InviteCode[];
  initialDoctors: DoctorAccount[];
  initialAppointments: Appointment[];
  initialDownloadUrl: string;
};

export function AdminDashboard(props: AdminDashboardProps) {
  return (
    <ToastProvider>
      <AdminDashboardContent {...props} />
    </ToastProvider>
  );
}

function AdminDashboardContent({
  initialClinics,
  initialCodes,
  initialDoctors,
  initialAppointments,
  initialDownloadUrl,
}: AdminDashboardProps) {
  const toast = useToast();
  const [section, setSection] = useState<SectionId>("overview");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [codes, setCodes] = useState(initialCodes);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [downloadUrl, setDownloadUrl] = useState(initialDownloadUrl);
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

  // Open visits a doctor lost (deactivated / moved) are back in the queue.
  const markReleased = (ids: string[]) => {
    if (ids.length === 0) return;
    const set = new Set(ids);
    setAppointments((prev) =>
      prev.map((a) =>
        set.has(a.id)
          ? { ...a, status: "requested", doctorName: null, scheduledAt: null }
          : a
      )
    );
  };
  const clinicLabel = (id: string) =>
    clinics.find((c) => c.id === id)?.name ?? "The hospital";
  const releasedNotice = (ids: string[]) =>
    ids.length > 0
      ? ` ${ids.length} open appointment${ids.length === 1 ? " was" : "s were"} returned to the hospital queue.`
      : "";
  const showError = (err: unknown) => toast.error(friendlyError(err));
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
          className="green-scroll flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`px-5 py-2.5 rounded-full text-[13px] sm:text-[14px] font-medium flex items-center gap-2 shrink-0 whitespace-nowrap transition-all min-h-[44px] active:scale-[0.98] ${
                  active
                    ? "custom-pill-cta text-white shadow-md"
                    : "bg-white border border-[#E5EDE8] text-[#3f493f] hover:bg-[#EAF6EE] hover:text-[#00652c]"
                }`}
              >
                <Icon size={16} className="shrink-0" aria-hidden />
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
                const name = clinicLabel(id);
                toggleClinicAction(id, next)
                  .then(() =>
                    toast.success(
                      next
                        ? `${name} is active and visible in the app.`
                        : `${name} is hidden from the app.`
                    )
                  )
                  .catch((err) => {
                    // Roll back on failure.
                    setClinics((cs) =>
                      cs.map((c) =>
                        c.id === id ? { ...c, isActive: !next } : c
                      )
                    );
                    showError(err);
                  });
              }}
              onSave={async (clinic) => {
                try {
                  const saved = await saveClinicAction(clinic);
                  const isNew = !clinics.some((c) => c.id === saved.id);
                  setClinics((cs) => {
                    const exists = cs.some((c) => c.id === saved.id);
                    return exists
                      ? cs.map((c) => (c.id === saved.id ? saved : c))
                      : [...cs, saved];
                  });
                  toast.success(isNew ? `${saved.name} added.` : `${saved.name} saved.`);
                  return true;
                } catch (err) {
                  showError(err);
                  return false;
                }
              }}
              onDelete={(id) => {
                const removed = clinics.find((c) => c.id === id);
                setClinics((cs) => cs.filter((c) => c.id !== id));
                // Keep the invite-code tab pointing at a hospital that exists.
                if (codeClinicId === id) {
                  const remaining = clinics.filter((c) => c.id !== id);
                  setCodeClinicId(remaining[0]?.id ?? "");
                }
                const rollback = (message: string) => {
                  // e.g. the hospital still has doctors or appointments.
                  if (removed) setClinics((cs) => [...cs, removed]);
                  toast.error(message);
                };
                deleteClinicAction(id)
                  .then((res) => {
                    if (res.error) return rollback(res.error);
                    // Its invite codes were deleted with it (FK cascade).
                    setCodes((prev) => prev.filter((c) => c.clinicId !== id));
                    toast.success(`${removed?.name ?? "Hospital"} deleted.`);
                  })
                  .catch((err) => rollback(friendlyError(err)));
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
                try {
                  const created = await generateCodeAction(clinicId);
                  setCodes((prev) => [created, ...prev]);
                  toast.success(`Code ${created.code} created for ${clinicLabel(clinicId)}.`);
                } catch (err) {
                  showError(err);
                }
              }}
              onRevoke={async (codeId) => {
                setCodes((prev) =>
                  prev.map((c) =>
                    c.id === codeId ? { ...c, isActive: false } : c
                  )
                );
                const code = codes.find((c) => c.id === codeId)?.code ?? "Code";
                revokeCodeAction(codeId)
                  .then(() => toast.success(`${code} revoked. It can no longer be used.`))
                  .catch((err) => {
                    setCodes((prev) =>
                      prev.map((c) =>
                        c.id === codeId ? { ...c, isActive: true } : c
                      )
                    );
                    showError(err);
                  });
              }}
              onDelete={async (codeId) => {
                let removed: InviteCode | undefined;
                setCodes((prev) => {
                  removed = prev.find((c) => c.id === codeId);
                  return prev.filter((c) => c.id !== codeId);
                });
                const code = codes.find((c) => c.id === codeId)?.code ?? "Code";
                deleteCodeAction(codeId)
                  .then(() => toast.success(`${code} deleted.`))
                  .catch((err) => {
                    if (removed) setCodes((prev) => [...prev, removed!]);
                    showError(err);
                  });
              }}
            />
          ) : null}

          {section === "doctors" ? (
            <DoctorsSection
              doctors={doctors}
              clinics={clinics}
              onSetActive={async (doctorId, isActive) => {
                const name = doctors.find((d) => d.id === doctorId)?.name ?? "Doctor";
                try {
                  const res = await setDoctorActiveAction(doctorId, isActive);
                  if (res.error) {
                    toast.error(res.error);
                    return;
                  }
                  setDoctors((prev) =>
                    prev.map((d) => (d.id === doctorId ? { ...d, isActive } : d))
                  );
                  const ids = res.releasedIds ?? [];
                  markReleased(ids);
                  toast.success(
                    (isActive ? `${name} activated.` : `${name} deactivated.`) +
                      releasedNotice(ids)
                  );
                } catch (err) {
                  showError(err);
                }
              }}
              onReassign={async (doctorId, clinicId) => {
                const name = doctors.find((d) => d.id === doctorId)?.name ?? "Doctor";
                try {
                  const res = await reassignDoctorAction(doctorId, clinicId);
                  if (res.error) {
                    toast.error(res.error);
                    return;
                  }
                  setDoctors((prev) =>
                    prev.map((d) => (d.id === doctorId ? { ...d, clinicId } : d))
                  );
                  const ids = res.releasedIds ?? [];
                  markReleased(ids);
                  toast.success(
                    `${name} moved to ${clinicLabel(clinicId)}.` + releasedNotice(ids)
                  );
                } catch (err) {
                  showError(err);
                }
              }}
            />
          ) : null}

          {section === "appointments" ? (
            <AppointmentsSection
              appointments={appointments}
              onError={(message) => showError(new Error(message))}
              onStatusChange={(id, status) => {
                let prevStatus: AppointmentStatus | undefined;
                setAppointments((prev) => {
                  prevStatus = prev.find((a) => a.id === id)?.status;
                  return prev.map((a) => (a.id === id ? { ...a, status } : a));
                });
                const patient =
                  appointments.find((a) => a.id === id)?.patientName ?? "Patient";
                updateAppointmentStatusAction(id, status)
                  .then(() =>
                    toast.success(`${patient}'s appointment marked ${status}.`)
                  )
                  .catch((err) => {
                    // Roll back the pill if the server rejected the change.
                    setAppointments((prev) =>
                      prev.map((a) =>
                        a.id === id && prevStatus
                          ? { ...a, status: prevStatus }
                          : a
                      )
                    );
                    showError(err);
                  });
              }}
            />
          ) : null}

          {section === "download" ? (
            <DownloadSection
              url={downloadUrl}
              onSave={async (next) => {
                try {
                  const res = await saveDownloadUrlAction(next);
                  if (res.error) {
                    toast.error(res.error);
                    return false;
                  }
                  setDownloadUrl(res.url ?? "");
                  toast.success(
                    res.url
                      ? "Download link saved. The landing page now uses it."
                      : "Download link cleared. The landing page shows \"Coming soon\"."
                  );
                  return true;
                } catch (err) {
                  showError(err);
                  return false;
                }
              }}
            />
          ) : null}

          {section === "audit" ? <AuditLogsSection /> : null}
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  async function handleLogout() {
    setIsLoggingOut(true);
    await adminLogout();
  }

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
            disabled={isLoggingOut}
            className="flex-1 px-5 py-3 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[14px] font-medium hover:bg-[#EAF6EE] min-h-[48px] active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>
          <form action={handleLogout} className="flex-1">
            <button
              type="submit"
              disabled={isLoggingOut}
              className="w-full px-5 py-3 rounded-full custom-pill-cta text-white text-[14px] font-medium shadow-md flex items-center justify-center min-h-[48px] active:scale-[0.98] disabled:opacity-70"
            >
              {isLoggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Log out"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
