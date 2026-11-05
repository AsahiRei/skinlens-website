import { cacheLife, cacheTag } from "next/cache";
import { getSupabaseAdmin } from "./supabase-admin";

export const DOWNLOAD_URL_TAG = "download-url";

/** Accepts only absolute http(s) URLs; empty string means "not set". */
export function normalizeDownloadUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return "";
  if (value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Landing-page download link set from /admin. Cached and invalidated by the
 * save action via DOWNLOAD_URL_TAG. Returns "" when unset or unreadable, so
 * the landing page falls back to the "Coming soon" modal.
 */
export async function getDownloadUrl(): Promise<string> {
  "use cache";
  cacheTag(DOWNLOAD_URL_TAG);
  cacheLife("days");

  const db = getSupabaseAdmin();
  if (!db) return "";
  const { data, error } = await db
    .from("site_settings")
    .select("value")
    .eq("key", "download_url")
    .maybeSingle();
  if (error) {
    // Table not created yet: expected before migration 0013_site_settings.sql runs.
    if (/site_settings/.test(error.message)) {
      console.warn(
        "[site-settings] site_settings table missing. Run migration 0013_site_settings.sql in the Supabase SQL Editor."
      );
    } else {
      console.error(`[site-settings] download_url read failed: ${error.message}`);
    }
    return "";
  }
  return normalizeDownloadUrl((data?.value as string | undefined) ?? "") ?? "";
}
