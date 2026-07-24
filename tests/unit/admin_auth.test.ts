import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  validateAdminCredentials,
  createSessionToken,
  verifySessionToken,
  isAuthConfigured,
} from "@/lib/auth/session";

describe("Admin Authentication & Session Security", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns isAuthConfigured() === false when env vars are missing", () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ANALYTICS_SESSION_SECRET;

    expect(isAuthConfigured()).toBe(false);
  });

  it("fails closed on validateAdminCredentials when env vars are missing", async () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;

    const ok = await validateAdminCredentials("admin@meetshah.com", "secret123");
    expect(ok).toBe(false);
  });

  it("validates credentials correctly when env vars match", async () => {
    process.env.ADMIN_EMAIL = "editsbymks@gmail.com";
    process.env.ADMIN_PASSWORD = "meet12345password";

    const valid = await validateAdminCredentials("editsbymks@gmail.com", "meet12345password");
    expect(valid).toBe(true);

    const invalidEmail = await validateAdminCredentials("wrong@email.com", "meet12345password");
    expect(invalidEmail).toBe(false);

    const invalidPass = await validateAdminCredentials("editsbymks@gmail.com", "wrongpassword");
    expect(invalidPass).toBe(false);
  });

  it("creates and verifies a valid signed session token", async () => {
    process.env.ANALYTICS_SESSION_SECRET = "0123456789abcdef0123456789abcdef";

    const token = await createSessionToken();
    expect(token).toBeTypeOf("string");
    expect(token).toContain(".");

    const isValid = await verifySessionToken(token!);
    expect(isValid).toBe(true);
  });

  it("rejects forged or expired session tokens", async () => {
    process.env.ANALYTICS_SESSION_SECRET = "0123456789abcdef0123456789abcdef";

    // Expired token
    const pastExpiry = Date.now() - 10000;
    const invalidToken = `${pastExpiry}.forgedsignature`;
    expect(await verifySessionToken(invalidToken)).toBe(false);

    // Tampered token
    const token = await createSessionToken();
    const tampered = token + "tampered";
    expect(await verifySessionToken(tampered)).toBe(false);
  });
});
