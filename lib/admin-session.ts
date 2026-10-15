import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "sl_admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-only-insecure-secret-change-me"
  );
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function createAdminToken(): string {
  const expiry = String(Date.now() + SESSION_TTL_MS);
  const sig = createHmac("sha256", getSecret())
    .update(`admin:${expiry}`)
    .digest("hex");
  return `${expiry}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token || !token.includes(".")) return false;
  const [expiryStr, sig] = token.split(".");
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = createHmac("sha256", getSecret())
    .update(`admin:${expiryStr}`)
    .digest("hex");

  if (sig.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function isAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  // Dev fallback so the page works out of the box.
  // Set ADMIN_PASSWORD in .env.local for real use.
  const configured = expected && expected.length > 0 ? expected : "admin1234";
  if (password.length !== configured.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(configured));
  } catch {
    return false;
  }
}
