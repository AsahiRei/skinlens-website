import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;
let cachedKey: string | null = null;

function supabaseUrl(): string {
  return (
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  );
}

// Best available key: privileged secret when present (full admin), otherwise
// the publishable key (anonymous — can only read tables with public policies,
// e.g. the hospital directory from migration 0004).
function serverKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  );
}

/** True when the website can reach Supabase at all. */
export function isSupabaseConfigured(): boolean {
  return missingSupabaseEnv().length === 0;
}

/** Names of the required env vars that are currently missing/empty. */
export function missingSupabaseEnv(): string[] {
  const missing: string[] = [];
  if (!supabaseUrl()) missing.push("SUPABASE_URL");
  if (!serverKey()) missing.push("SUPABASE_SECRET_KEY");
  return missing;
}

/** True when only the publishable key is present — reads of public tables
 *  work, but all writes and locked tables need SUPABASE_SECRET_KEY. */
export function isReadOnlyMode(): boolean {
  return Boolean(
    supabaseUrl() &&
      !process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.SUPABASE_SECRET_KEY
  );
}

/**
 * Server-side client for the admin page. ONLY import from server code —
 * a secret key must never reach the browser. Returns null when no usable
 * key is configured at all.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const key = serverKey();
  if (!supabaseUrl() || !key) return null;
  if (!cached || cachedKey !== key) {
    cached = createClient(supabaseUrl(), key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    cachedKey = key;
  }
  return cached;
}
