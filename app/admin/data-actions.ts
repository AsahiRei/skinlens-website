"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAdminCookieName, verifyAdminToken } from "@/lib/admin-session";
import { getSupabaseAdmin, missingSupabaseEnv } from "@/lib/supabase-admin";
import { toDisplayDate } from "@/lib/admin-db";
import { generateInviteCode, type AppointmentStatus, type Clinic, type InviteCode } from "@/lib/admin-types";

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

async function logAuditAction(
  action: string,
  entityType: string,
  entityId: string | null,
  oldValue: any,
  newValue: any
): Promise<void> {
  const db = requireDb();
  await db.from("audit_logs").insert({
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue,
    new_value: newValue,
  });
}

export async function saveClinicAction(
  input: Omit<Clinic, "id"> & { id?: string }
): Promise<Clinic> {
  await requireAdmin();
  const db = requireDb();

  let oldClinic: any = null;
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

export async function deleteClinicAction(id: string): Promise<void> {
  await requireAdmin();
  const db = requireDb();

  const { data: old } = await db.from("clinics").select().eq("id", id).single();

  // Delete associated invite codes first to avoid foreign key violations
  await db.from("clinic_invite_codes").delete().eq("clinic_id", id);

  const { error } = await db.from("clinics").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAuditAction("DELETE_CLINIC", "clinics", id, old, null);

  revalidatePath("/admin");
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
