import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "sl_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

const DEV_PASSWORD = "admin1234";
const DEV_SECRET = "dev-only-insecure-secret-change-me";
const MIN_SECRET_LENGTH = 32;

const isProduction = () => process.env.NODE_ENV === "production";

// Fail closed in production: with no configured password/secret the panel
// must be unusable, never fall back to a value that's public in this repo.
// The dev fallbacks exist only so `next dev` works out of the box.
function getPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD;
  if (configured) return configured;
  return isProduction() ? null : DEV_PASSWORD;
}

function getSecret(): string | null {
  const configured = process.env.ADMIN_SESSION_SECRET;
  if (configured && configured.length >= MIN_SECRET_LENGTH) return configured;
  return isProduction() ? null : configured || DEV_SECRET;
}

/** Why admin login is disabled, or null when it's correctly configured. */
export function adminConfigError(): string | null {
  if (!getPassword()) {
    return "ADMIN_PASSWORD is not set. Admin login is disabled.";
  }
  if (!getSecret()) {
    return `ADMIN_SESSION_SECRET must be set to a random value of at least ${MIN_SECRET_LENGTH} characters. Admin login is disabled.`;
  }
  return null;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

function sign(secret: string, expiry: string): string {
  return createHmac("sha256", secret).update(`admin:${expiry}`).digest("hex");
}

export function createAdminToken(): string {
  const secret = getSecret();
  if (!secret) throw new Error("Admin session secret is not configured.");
  const expiry = String(Date.now() + SESSION_TTL_MS);
  return `${expiry}.${sign(secret, expiry)}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token || !token.includes(".")) return false;
  const [expiryStr, sig] = token.split(".");
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = sign(secret, expiryStr);
  if (!sig || sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAdminPassword(password: string): boolean {
  const configured = getPassword();
  if (!configured) return false;
  // Compare fixed-length digests so the check doesn't leak the length.
  const a = createHmac("sha256", "pw").update(password).digest();
  const b = createHmac("sha256", "pw").update(configured).digest();
  return timingSafeEqual(a, b);
}
