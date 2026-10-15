"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAdminCookieName, verifyAdminToken } from "@/lib/admin-session";
import { getSupabaseAdmin, missingSupabaseEnv } from "@/lib/supabase-admin";
import { toDisplayDate } from "@/lib/admin-db";
import { generateInviteCode, type Clinic, type InviteCode } from "@/lib/admin-types";

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

export async function saveClinicAction(
  input: Omit<Clinic, "id"> & { id?: string }
): Promise<Clinic> {
  await requireAdmin();
  const db = requireDb();

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
  const { error } = await db.from("clinics").update({ is_active: isActive }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}

export async function deleteClinicAction(id: string): Promise<void> {
  await requireAdmin();
  const db = requireDb();
  const { error } = await db.from("clinics").delete().eq("id", id);
  if (error) throw new Error(error.message);
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
  const { error } = await db
    .from("clinic_invite_codes")
    .update({ is_active: false })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
}
