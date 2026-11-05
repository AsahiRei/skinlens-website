"use server";

import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath, updateTag } from "next/cache";
import { DOWNLOAD_URL_TAG, normalizeDownloadUrl } from "@/lib/site-settings";
import { getAdminCookieName, verifyAdminToken } from "@/lib/admin-session";
import { getSupabaseAdmin, missingSupabaseEnv } from "@/lib/supabase-admin";
import { toDisplayDate } from "@/lib/admin-db";
import { getValidationStats, type ValidationStats } from "@/lib/admin-validation";
import type { AppointmentStatus, Clinic, InviteCode } from "@/lib/admin-types";

const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "requested",
  "scheduled",
  "completed",
  "cancelled",
  "declined",
];

async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!verifyAdminToken(store.get(getAdminCookieName())?.value)) {
    throw new Error("Not authorized.");
  }
}

function requireDb() {
  const db = getSupabaseAdmin();
  if (!db) {
    throw new Error(
      `Supabase is not configured (missing: ${missingSupabaseEnv().join(", ")}). ` +
        "Set them in .env.local."
    );
  }
  return db;
}

function isUuid(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
  );
}

/** Random `SKN-XXXXXX` code from a CSPRNG. The code is what grants the
 *  doctor role, so it must not be predictable. */
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[randomInt(chars.length)];
  return `SKN-${suffix}`;
}

async function logAuditAction(
  action: string,
  entityType: string,
  entityId: string | null,
  oldValue: unknown,
  newValue: unknown
): Promise<void> {
  const db = requireDb();
  const { error } = await db.from("audit_logs").insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue,
    new_value: newValue,
  });
  // The change itself already succeeded, so don't fail the request, but a
  // missing audit entry must never be silent.
  if (error) {
    console.error(
      `[admin] audit log write failed for ${action} ${entityType}/${entityId}: ${error.message}`
    );
  }
}

export async function saveClinicAction(
  input: Omit<Clinic, "id"> & { id?: string }
): Promise<Clinic> {
  await requireAdmin();
  const db = requireDb();

  let oldClinic: unknown = null;
  if (isUuid(input.id)) {
    const { data } = await db.from("clinics").select().eq("id", input.id).single();
    oldClinic = data;
  }

  const row = {
    name: input.name,
    specialty: input.specialty || "Dermatology",
    address: input.address,
    phone: input.phone,
    website: input.website,
    hours: input.hours,
    description: input.description,
    latitude: input.latitude,
    longitude: input.longitude,
    rating: input.rating,
    available_today: input.availableToday,
    is_active: input.isActive,
  };

  // Only treat input.id as an update if it's a real uuid.
  // Anything else (undefined, "clinic-...") means INSERT and
  // the DB auto-generates id via gen_random_uuid() default.
  const query = isUuid(input.id)
    ? db.from("clinics").update(row).eq("id", input.id).select().single()
    : db.from("clinics").insert(row).select().single();

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  const c = data as Record<string, unknown>;

  await logAuditAction("SAVE_CLINIC", "clinics", c.id as string, oldClinic, row);

  revalidatePath("/admin");
  return {
    id: c.id as string,
    name: (c.name as string) ?? "",
    specialty: (c.specialty as string) ?? "Dermatology",
    address: (c.address as string) ?? "",
    phone: (c.phone as string) ?? "",
    website: (c.website as string) ?? "",
    hours: (c.hours as string) ?? "",
    description: (c.description as string) ?? "",
    latitude: (c.latitude as number | null) ?? null,
    longitude: (c.longitude as number | null) ?? null,
    rating: typeof c.rating === "number" ? c.rating : 0,
    availableToday: c.available_today === true,
    isActive: (c.is_active as boolean) ?? true,
  };
}

export async function toggleClinicAction(
  id: string,
  isActive: boolean
): Promise<void> {
  await requireAdmin();
  const db = requireDb();

  const { data: old } = await db.from("clinics").select("is_active").eq("id", id).single();

  const { error } = await db.from("clinics").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);

  await logAuditAction("TOGGLE_CLINIC", "clinics", id, { is_active: old?.is_active }, { is_active: isActive });

  revalidatePath("/admin");
}

/**
 * Deletes a hospital that has no doctors or appointments. Hospitals with
 * history can't be deleted (FK `on delete restrict`), so deactivate those.
 * Invite codes go with the hospital via the `on delete cascade` FK in the
 * same statement, so a failed delete never loses them.
 *
 * Returns the error instead of throwing: thrown messages are redacted in
 * production builds, and this one tells the admin what to do.
 */
export async function deleteClinicAction(
  id: string
): Promise<{ error?: string }> {
  await requireAdmin();
  if (!isUuid(id)) return { error: "Invalid hospital id." };
  const db = requireDb();

  const [doctorsRes, apptsRes] = await Promise.all([
    db.from("doctors").select("user_id", { count: "exact", head: true }).eq("clinic_id", id),
    db.from("appointments").select("id", { count: "exact", head: true }).eq("clinic_id", id),
  ]);
  if (doctorsRes.error) return { error: doctorsRes.error.message };
  if (apptsRes.error) return { error: apptsRes.error.message };

  const doctorCount = doctorsRes.count ?? 0;
  const apptCount = apptsRes.count ?? 0;
  if (doctorCount > 0 || apptCount > 0) {
    const parts = [
      doctorCount > 0 ? `${doctorCount} doctor${doctorCount === 1 ? "" : "s"}` : null,
      apptCount > 0 ? `${apptCount} appointment${apptCount === 1 ? "" : "s"}` : null,
    ].filter(Boolean);
    return {
      error: `This hospital has ${parts.join(" and ")}, so it can't be deleted. Deactivate it instead to hide it from the app.`,
    };
  }

  const { data: old } = await db.from("clinics").select().eq("id", id).maybeSingle();

  const { error } = await db.from("clinics").delete().eq("id", id);
  if (error) return { error: error.message };

  await logAuditAction("DELETE_CLINIC", "clinics", id, old, null);

  revalidatePath("/admin");
  return {};
}

export async function generateCodeAction(clinicId: string): Promise<InviteCode> {
  await requireAdmin();
  const db = requireDb();

  const { data, error } = await db
    .from("clinic_invite_codes")
    .insert({
      clinic_id: clinicId,
      code: generateInviteCode(),
      max_uses: 5,
      expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  const c = data as Record<string, unknown>;

  await logAuditAction("GENERATE_CODE", "clinic_invite_codes", c.id as string, null, c);

  revalidatePath("/admin");
  return {
    id: c.id as string,
    code: c.code as string,
    clinicId: c.clinic_id as string,
    maxUses: c.max_uses as number,
    usedCount: c.used_count as number,
    expiresAt: toDisplayDate(c.expires_at as string),
    isActive: c.is_active as boolean,
    createdAt: toDisplayDate(c.created_at as string),
  };
}

export async function revokeCodeAction(id: string): Promise<void> {
  await requireAdmin();
  const db = requireDb();

  const { data: old } = await db.from("clinic_invite_codes").select("is_active").eq("id", id).single();

  const { error } = await db
    .from("clinic_invite_codes")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAuditAction("REVOKE_CODE", "clinic_invite_codes", id, { is_active: old?.is_active }, { is_active: false });

  revalidatePath("/admin");
}

export async function deleteCodeAction(id: string): Promise<void> {
  await requireAdmin();
  const db = requireDb();

  const { data: old } = await db.from("clinic_invite_codes").select().eq("id", id).single();

  const { error } = await db
    .from("clinic_invite_codes")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAuditAction("DELETE_CODE", "clinic_invite_codes", id, old, null);

  revalidatePath("/admin");
}

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  await requireAdmin();
  if (!APPOINTMENT_STATUSES.includes(status)) {
    throw new Error(`Unknown status "${status}".`);
  }
  const db = requireDb();

  const { data: old } = await db.from("appointments").select("status").eq("id", id).single();

  const { error } = await db
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await logAuditAction("UPDATE_APPOINTMENT_STATUS", "appointments", id, { status: old?.status }, { status });

  revalidatePath("/admin");
}

export async function getAuditLogsAction() {
  await requireAdmin();
  const db = requireDb();

  const { data, error } = await db
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return data;
}

export async function getAppointmentReportUrlAction(
  appointmentId: string
): Promise<string> {
  await requireAdmin();
  const db = requireDb();

  const { data, error } = await db
    .from("appointments")
    .select("report_pdf_path")
    .eq("id", appointmentId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const raw = (data as Record<string, unknown> | null)?.report_pdf_path as
    | string
    | null;
  if (!raw) {
    throw new Error("This appointment has no report PDF attached.");
  }

  // Same key cleanup as the app (utils/report.ts): strip a "reports/" prefix.
  const key = raw.replace(/^reports\//, "").replace(/^\/+/, "").trim();
  if (!key) {
    throw new Error("This appointment has no report file path.");
  }

  const { data: signed, error: signError } = await db.storage
    .from("reports")
    .createSignedUrl(key, 600);
  if (signError || !signed?.signedUrl) {
    throw new Error(
      signError?.message ?? "Could not create a link to the report PDF."
    );
  }
  return signed.signedUrl;
}

// ── doctors ──────────────────────────────────────────────────────────────

/**
 * Same release rule as redeem_clinic_code() (migration 0010): a doctor's
 * still-open visits go back to the clinic queue so another active doctor can
 * pick them up. History (completed/cancelled/declined) is untouched.
 */
async function releaseOpenAppointments(
  doctorId: string,
  clinicId: string
): Promise<string[]> {
  const db = requireDb();
  const { data, error } = await db
    .from("appointments")
    .update({ doctor_id: null, scheduled_at: null, status: "requested" })
    .eq("clinic_id", clinicId)
    .eq("doctor_id", doctorId)
    .in("status", ["requested", "scheduled"])
    .select("id");
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.id as string);
}

/**
 * Activates/deactivates a doctor. Inactive doctors are hidden from patients
 * and lose RLS access to their clinic's queue, so deactivating also releases
 * their open appointments. Otherwise those would be stuck with nobody able
 * to act on them.
 */
export async function setDoctorActiveAction(
  doctorId: string,
  isActive: boolean
): Promise<{ error?: string; releasedIds?: string[] }> {
  await requireAdmin();
  if (!isUuid(doctorId)) return { error: "Invalid doctor id." };
  const db = requireDb();

  const { data: old, error: readError } = await db
    .from("doctors")
    .select("clinic_id, is_active")
    .eq("user_id", doctorId)
    .maybeSingle();
  if (readError) return { error: readError.message };
  if (!old) return { error: "Doctor not found." };

  const { error } = await db
    .from("doctors")
    .update({ is_active: isActive })
    .eq("user_id", doctorId);
  if (error) return { error: error.message };

  let releasedIds: string[] = [];
  if (!isActive) {
    try {
      releasedIds = await releaseOpenAppointments(doctorId, old.clinic_id as string);
    } catch (err) {
      console.error("[admin] releasing appointments failed:", err);
      return {
        error:
          "Doctor was deactivated, but their open appointments could not be released. Try deactivating again.",
      };
    }
  }

  await logAuditAction(
    isActive ? "ACTIVATE_DOCTOR" : "DEACTIVATE_DOCTOR",
    "doctors",
    doctorId,
    { is_active: old.is_active },
    { is_active: isActive, released_appointments: releasedIds.length }
  );

  revalidatePath("/admin");
  return { releasedIds };
}

/** Moves a doctor to another active hospital (admin-side hospital switch). */
export async function reassignDoctorAction(
  doctorId: string,
  clinicId: string
): Promise<{ error?: string; releasedIds?: string[] }> {
  await requireAdmin();
  if (!isUuid(doctorId) || !isUuid(clinicId)) return { error: "Invalid id." };
  const db = requireDb();

  const [{ data: old, error: readError }, { data: clinic, error: clinicError }] =
    await Promise.all([
      db.from("doctors").select("clinic_id").eq("user_id", doctorId).maybeSingle(),
      db.from("clinics").select("id, is_active").eq("id", clinicId).maybeSingle(),
    ]);
  if (readError) return { error: readError.message };
  if (clinicError) return { error: clinicError.message };
  if (!old) return { error: "Doctor not found." };
  if (!clinic) return { error: "Hospital not found." };
  if (!clinic.is_active) return { error: "That hospital is inactive. Activate it first." };
  if (old.clinic_id === clinicId) return { releasedIds: [] };

  // Release first: if the move then fails, the visits are simply back in the
  // old clinic's queue (safe) rather than owned by a doctor who can't see them.
  let releasedIds: string[] = [];
  try {
    releasedIds = await releaseOpenAppointments(doctorId, old.clinic_id as string);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not release appointments." };
  }

  const { error } = await db
    .from("doctors")
    .update({ clinic_id: clinicId })
    .eq("user_id", doctorId);
  if (error) return { error: error.message };

  await logAuditAction(
    "REASSIGN_DOCTOR",
    "doctors",
    doctorId,
    { clinic_id: old.clinic_id },
    { clinic_id: clinicId, released_appointments: releasedIds.length }
  );

  revalidatePath("/admin");
  return { releasedIds };
}

// ── landing-page download link ───────────────────────────────────────────

export async function saveDownloadUrlAction(
  input: string
): Promise<{ error?: string; url?: string }> {
  await requireAdmin();
  const url = normalizeDownloadUrl(input);
  if (url === null) {
    return { error: "Enter a full link starting with https://, or leave it empty." };
  }
  const db = requireDb();

  const { data: old } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "download_url")
    .maybeSingle();

  const { error } = await db
    .from("site_settings")
    .upsert({ key: "download_url", value: url, updated_at: new Date().toISOString() });
  if (error) {
    if (/site_settings/.test(error.message)) {
      return {
        error: "The site_settings table is missing. Run migration 0013_site_settings.sql in the Supabase SQL Editor.",
      };
    }
    return { error: error.message };
  }

  await logAuditAction(
    "UPDATE_DOWNLOAD_URL",
    "site_settings",
    null,
    { download_url: old?.value ?? null },
    { download_url: url }
  );

  updateTag(DOWNLOAD_URL_TAG);
  revalidatePath("/admin");
  return { url };
}

// ── AI validation stats ──────────────────────────────────────────────────

export async function getValidationStatsAction(): Promise<
  { stats: ValidationStats; error?: undefined } | { stats?: undefined; error: string }
> {
  await requireAdmin();
  try {
    return { stats: await getValidationStats(requireDb()) };
  } catch (err) {
    console.error("[admin] validation stats failed:", err);
    return { error: err instanceof Error ? err.message : "Could not load validation stats." };
  }
}
