import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "meet_shah_admin_session";

/** Session lifetime: 2 hours. */
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

/**
 * Signed admin session.
 *
 * Cookie value is `<expiryEpochMs>.<hmacHex>` where the HMAC is computed over
 * the expiry with ANALYTICS_SESSION_SECRET. Forging a session requires the
 * secret; the previous implementation used the static string
 * "active_authenticated_session", which anyone could set by hand.
 *
 * Web Crypto (crypto.subtle) is used so the same code verifies in both the
 * proxy (middleware) runtime and Node route handlers.
 */

function getSessionSecret(): string | null {
  const secret = process.env.ANALYTICS_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  return null;
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Constant-time-ish comparison: hash both sides with a fresh random key and
 * compare digests. Avoids leaking match position through string comparison
 * without needing Node's timingSafeEqual (unavailable in the edge runtime).
 */
async function digestsEqual(a: string, b: string): Promise<boolean> {
  const salt = crypto.getRandomValues(new Uint8Array(16)).join(",");
  const [ha, hb] = await Promise.all([hmacHex(salt, a), hmacHex(salt, b)]);
  return ha === hb;
}

export async function createSessionToken(): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  const expiry = String(Date.now() + SESSION_TTL_MS);
  const sig = await hmacHex(secret, expiry);
  return `${expiry}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const expiry = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || expiryMs < Date.now()) return false;

  const expected = await hmacHex(secret, expiry);
  return digestsEqual(sig, expected);
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function setAdminSession(response: NextResponse): Promise<boolean> {
  const token = await createSessionToken();
  if (!token) return false;

  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
  return true;
}

export function clearAdminSession(response: NextResponse): void {
  response.cookies.delete(ADMIN_COOKIE_NAME);
}

/**
 * Credential check. FAILS CLOSED: if ADMIN_EMAIL / ADMIN_PASSWORD are not
 * configured, no login is possible. The previous implementation fell back to
 * hardcoded defaults ("admin@meetshah.com" / "meetshah2026"), which meant any
 * deployment without env vars had a publicly known admin password.
 */
export async function validateAdminCredentials(
  email?: string,
  password?: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return false;
  if (!email || !password) return false;

  const [emailOk, passwordOk] = await Promise.all([
    digestsEqual(email, adminEmail),
    digestsEqual(password, adminPassword),
  ]);
  return emailOk && passwordOk;
}

/** True when auth is configured at all — used to show a setup hint on login. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      getSessionSecret(),
  );
}
