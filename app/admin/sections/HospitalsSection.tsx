"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Building,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  MoreVertical,
  Navigation,
  Pencil,
  Phone,
  Plus,
  Search,
  Star,
  Ticket,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { Clinic } from "@/lib/admin-types";
import { ActivePill, Panel } from "../ui";
import {
  HospitalMap,
  isValidCoord,
  mapLinks,
  parseCoord,
} from "./HospitalMap";
import { HospitalsOverviewMap } from "./HospitalsOverviewMap";

const EMPTY_FORM: Omit<Clinic, "id"> = {
  name: "",
  specialty: "Dermatology",
  address: "",
  phone: "",
  website: "",
  hours: "",
  description: "",
  latitude: null,
  longitude: null,
  rating: 0,
  availableToday: false,
  isActive: true,
};

function HospitalModal({
  initial,
  onClose,
  onSave,
}: {
  initial: Clinic | null;
  onClose: () => void;
  onSave: (clinic: Omit<Clinic, "id"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState<Omit<Clinic, "id">>(
    initial
      ? {
          name: initial.name,
          specialty: initial.specialty,
          address: initial.address,
          phone: initial.phone,
          website: initial.website,
          hours: initial.hours,
          description: initial.description,
          latitude: initial.latitude,
          longitude: initial.longitude,
          rating: initial.rating,
          availableToday: initial.availableToday,
          isActive: initial.isActive,
        }
      : EMPTY_FORM
  );

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Coordinates and rating stay as text while typing, parsed on save.
  const [latStr, setLatStr] = useState(
    initial?.latitude != null ? String(initial.latitude) : ""
  );
  const [lngStr, setLngStr] = useState(
    initial?.longitude != null ? String(initial.longitude) : ""
  );
  const [ratingStr, setRatingStr] = useState(
    initial && initial.rating > 0 ? String(initial.rating) : ""
  );

  const inputCls =
    "h-12 rounded-[14px] bg-white border border-[#E5EDE8] px-4 text-[14px] text-[#10241A] placeholder:text-[#9CA3AF] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/15 w-full";

  const previewLat = parseCoord(latStr, "lat");
  const previewLng = parseCoord(lngStr, "lng");
  const previewValid =
    previewLat != null &&
    previewLng != null &&
    isValidCoord(previewLat, previewLng);

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
      aria-label={initial ? "Edit hospital" : "Add hospital"}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full sm:max-w-lg bg-white rounded-t-[20px] sm:rounded-[20px] border border-[#E5EDE8] p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-[20px] font-semibold text-[#10241A]">
            {initial ? "Edit hospital" : "Add hospital"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-10 h-10 rounded-full border border-[#E5EDE8] flex items-center justify-center text-[#10241A] hover:bg-[#EAF6EE] shrink-0"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-[13px] text-[#6B7280] mt-1">
          Active hospitals show up in the app&apos;s verified list.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Hospital name"
            className={inputCls}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={form.specialty}
              onChange={(e) => set("specialty", e.target.value)}
              placeholder="Specialty"
              className={inputCls}
            />
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="Phone"
              className={inputCls}
            />
          </div>
          <input
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Address"
            className={inputCls}
          />
          <input
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            placeholder="Website (optional)"
            className={inputCls}
          />
          <input
            value={form.hours}
            onChange={(e) => set("hours", e.target.value)}
            placeholder="Hours, e.g. Mon–Sat, 9:00 AM – 5:00 PM"
            className={inputCls}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={latStr}
              onChange={(e) => setLatStr(e.target.value)}
              placeholder="Latitude, e.g. 14.5995"
              inputMode="decimal"
              className={inputCls}
            />
            <input
              value={lngStr}
              onChange={(e) => setLngStr(e.target.value)}
              placeholder="Longitude, e.g. 120.9842"
              inputMode="decimal"
              className={inputCls}
            />
          </div>
          <div>
            {previewValid ? (
              <div className="flex flex-col gap-2">
                <HospitalMap
                  latitude={previewLat as number}
                  longitude={previewLng as number}
                  label={form.name || "hospital"}
                  height={160}
                />
                <a
                  href={mapLinks(previewLat as number, previewLng as number).googleSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#15803D] hover:underline w-fit"
                >
                  <ExternalLink size={13} />
                  Verify pin in Google Maps
                </a>
              </div>
            ) : (
              <p className="text-[12px] text-[#6B7280] bg-[#F4F7F5] border border-[#E5EDE8] rounded-[12px] px-3 py-2.5">
                Enter a valid latitude (-90 to 90) and longitude (-180 to
                180) to preview the map pin here.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={ratingStr}
              onChange={(e) => setRatingStr(e.target.value)}
              placeholder="Rating 0–5, e.g. 4.8"
              inputMode="decimal"
              className={inputCls}
            />
            <label className="flex items-center gap-2.5 px-4 h-12 rounded-[14px] bg-white border border-[#E5EDE8] text-[14px] text-[#3F4A44] font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={form.availableToday}
                onChange={(e) => set("availableToday", e.target.checked)}
                className="w-5 h-5 accent-[#15803D]"
              />
              Available today
            </label>
          </div>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short description"
            rows={3}
            className="rounded-[14px] bg-white border border-[#E5EDE8] px-4 py-3 text-[14px] text-[#10241A] placeholder:text-[#9CA3AF] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/15 w-full resize-none"
          />
          <label className="flex items-center gap-2.5 text-[14px] text-[#3F4A44] font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="w-5 h-5 accent-[#15803D]"
            />
            Active — visible in the app
          </label>
          <button
            onClick={() => {
              if (!form.name.trim()) return;
              const lat = parseFloat(latStr);
              const lng = parseFloat(lngStr);
              const parsedRating = parseFloat(ratingStr);
              const rating =
                Number.isFinite(parsedRating)
                  ? Math.min(5, Math.max(0, parsedRating))
                  : 0;
              onSave({
                ...form,
                name: form.name.trim(),
                latitude: Number.isFinite(lat) ? lat : null,
                longitude: Number.isFinite(lng) ? lng : null,
                rating,
                // No id for new hospitals — DB auto-generates the uuid.
                // Only include id when editing an existing row.
                ...(initial?.id ? { id: initial.id } : {}),
              });
            }}
            className="custom-pill-cta text-white text-[14px] font-medium px-7 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center min-h-[52px] active:scale-[0.99] mt-1"
          >
            {initial ? "Save changes" : "Add hospital"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteHospitalModal({
  clinic,
  doctorCount,
  onClose,
  onConfirm,
}: {
  clinic: Clinic;
  doctorCount: number;
  onClose: () => void;
  onConfirm: () => void;
}) {
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
      aria-label={`Delete ${clinic.name}`}
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
              Delete “{clinic.name}”?
            </h3>
            <p className="text-[13px] leading-relaxed text-[#3F4A44] mt-1.5">
              This permanently removes the hospital from the verified list.
              {doctorCount > 0
                ? ` ${doctorCount} doctor${doctorCount === 1 ? "" : "s"} and any invite codes linked to it will no longer work.`
                : " Any invite codes linked to it will no longer work."}{" "}
              This can&apos;t be undone.
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
            Delete hospital
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HospitalsSection({
  clinics,
  doctorsCountByClinic,
  onToggleActive,
  onSave,
  onDelete,
  onManageCodes,
}: {
  clinics: Clinic[];
  doctorsCountByClinic: Record<string, number>;
  onToggleActive: (id: string) => void;
  onSave: (clinic: Omit<Clinic, "id"> & { id?: string }) => void;
  onDelete: (id: string) => void;
  onManageCodes: (clinicId: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [deleting, setDeleting] = useState<Clinic | null>(null);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openMenuId]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? clinics.filter((c) =>
        [c.name, c.address, c.specialty, c.phone, c.description]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
    : clinics;

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4 sm:mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[14px] text-[#3F4A44]">
            {clinics.filter((c) => c.isActive).length} of {clinics.length}{" "}
            hospitals active in the app
          </p>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="custom-pill-cta text-white text-[13px] sm:text-[14px] font-medium px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2 min-h-[44px] active:scale-[0.98]"
          >
            <Plus size={16} />
            Add hospital
          </button>
        </div>
        <div className="relative">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hospitals by name, address, or specialty…"
            aria-label="Search hospitals"
            className="h-12 w-full rounded-full bg-white border border-[#E5EDE8] pl-11 pr-11 text-[14px] text-[#10241A] placeholder:text-[#9CA3AF] outline-none focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/15"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#EAF6EE] hover:text-[#10241A]"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
        {q ? (
          <p className="text-[13px] text-[#6B7280]">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-[#10241A]">
              “{query.trim()}”
            </span>
          </p>
        ) : null}
      </div>

      <HospitalsOverviewMap clinics={filtered} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filtered.map((c) => (
          <Panel key={c.id}>
            <div className="flex items-start gap-3.5">
              <span className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#15803D] flex items-center justify-center shrink-0">
                <Building size={24} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-[17px] font-semibold text-[#10241A] leading-snug">
                    {c.name}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <ActivePill active={c.isActive} />
                  {c.availableToday ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EAF6EE] border border-[#DCFCE7] text-[#15803D] text-[11px] font-semibold whitespace-nowrap">
                      Available today
                    </span>
                  ) : null}
                  <span className="text-[12px] font-semibold text-[#15803D]">
                    {c.specialty}
                  </span>
                  {c.rating > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#10241A]">
                      <Star size={13} className="text-[#F59E0B]" />
                      {c.rating.toFixed(1)}
                    </span>
                  ) : null}
                  <span className="text-[12px] text-[#6B7280]">
                    {doctorsCountByClinic[c.id] ?? 0} doctors
                  </span>
                </div>
              </div>
              <div className="relative shrink-0">
                <button
                  onClick={() =>
                    setOpenMenuId((prev) => (prev === c.id ? null : c.id))
                  }
                  aria-label={`More actions for ${c.name}`}
                  aria-haspopup="menu"
                  aria-expanded={openMenuId === c.id}
                  className="w-10 h-10 rounded-full border border-[#E5EDE8] flex items-center justify-center text-[#10241A] hover:bg-[#EAF6EE] transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                {openMenuId === c.id ? (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div
                      role="menu"
                      aria-label={`Actions for ${c.name}`}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-[#E5EDE8] shadow-xl py-2 z-20"
                    >
                      <button
                        role="menuitem"
                        onClick={() => {
                          setEditing(c);
                          setModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[13px] font-medium text-[#10241A] hover:bg-[#EAF6EE] text-left"
                      >
                        <Pencil size={15} className="text-[#15803D]" />
                        Edit
                      </button>
                      <button
                        role="menuitem"
                        onClick={() => {
                          onToggleActive(c.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[13px] font-medium text-[#10241A] hover:bg-[#EAF6EE] text-left"
                      >
                        {c.isActive ? (
                          <EyeOff size={15} className="text-[#15803D]" />
                        ) : (
                          <Eye size={15} className="text-[#15803D]" />
                        )}
                        {c.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <div className="my-1.5 border-t border-[#EEF2EF]" />
                      <button
                        role="menuitem"
                        onClick={() => {
                          setDeleting(c);
                          setOpenMenuId(null);
                        }}
                        aria-label={`Delete ${c.name}`}
                        className="w-full px-4 py-2.5 flex items-center gap-2.5 text-[13px] font-medium text-[#B42318] hover:bg-[#FEF3F2] text-left"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-[13px] text-[#3F4A44]">
              <span className="flex items-start gap-2">
                <MapPin size={15} className="text-[#15803D] shrink-0 mt-0.5" />
                <span className="min-w-0">{c.address || "No address yet"}</span>
              </span>
              <span className="flex items-center gap-2">
                <Navigation size={15} className="text-[#15803D] shrink-0" />
                {c.latitude != null && c.longitude != null ? (
                  <span className="font-mono tabular-nums">
                    {c.latitude}, {c.longitude}
                  </span>
                ) : (
                  "No map pin yet"
                )}
              </span>
              <span className="flex items-center gap-2">
                <Phone size={15} className="text-[#15803D] shrink-0" />
                {c.phone || "No phone yet"}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={15} className="text-[#15803D] shrink-0" />
                {c.hours || "Hours not set"}
              </span>
              {c.website ? (
                <span className="flex items-center gap-2 min-w-0">
                  <Globe size={15} className="text-[#15803D] shrink-0" />
                  <span className="truncate">{c.website}</span>
                </span>
              ) : null}
            </div>

            <div className="pt-4 border-t border-[#EEF2EF] mt-4">
              <button
                onClick={() => onManageCodes(c.id)}
                className="w-full px-4 py-2.5 rounded-full custom-pill-cta text-white text-[13px] font-medium flex items-center justify-center gap-1.5 min-h-[44px] active:scale-[0.98]"
              >
                <Ticket size={15} />
                Codes
              </button>
            </div>
          </Panel>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="mt-4 bg-white rounded-[18px] border border-[#E5EDE8] px-6 py-10 text-center">
          <p className="font-display text-[16px] font-semibold text-[#10241A]">
            No hospitals match your search
          </p>
          <p className="text-[13px] text-[#6B7280] mt-1">
            Try a different name, address, or specialty — or clear the search
            to see all hospitals.
          </p>
          {q ? (
            <button
              onClick={() => setQuery("")}
              className="mt-4 px-5 py-2.5 rounded-full bg-white border border-[#E5EDE8] text-[#10241A] text-[13px] font-medium hover:bg-[#EAF6EE] min-h-[44px]"
            >
              Clear search
            </button>
          ) : null}
        </div>
      ) : null}

      <AnimatePresence>
        {modalOpen ? (
          <HospitalModal
            initial={editing}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
            onSave={(clinic) => {
              onSave(clinic);
              setModalOpen(false);
              setEditing(null);
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {deleting ? (
          <DeleteHospitalModal
            clinic={deleting}
            doctorCount={doctorsCountByClinic[deleting.id] ?? 0}
            onClose={() => setDeleting(null)}
            onConfirm={() => {
              onDelete(deleting.id);
              setDeleting(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
