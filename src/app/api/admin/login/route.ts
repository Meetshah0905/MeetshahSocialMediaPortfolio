import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  setAdminSession,
  isAuthConfigured,
} from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { logAdminAction } from "@/lib/storage/db";

export async function POST(request: NextRequest) {
  try {
    // Rate limit before touching credentials (§18).
    if (!(await checkRateLimit("login", request))) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in a minute." },
        { status: 429 },
      );
    }

    if (!isAuthConfigured()) {
      // Fail closed, but tell the operator what's wrong — this replaces the
      // old hardcoded default credentials, which were a public backdoor.
      return NextResponse.json(
        {
          error:
            "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ANALYTICS_SESSION_SECRET in .env.local.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { email, password } = body ?? {};

    if (!(await validateAdminCredentials(email, password))) {
      // Generic message — never reveal which field was wrong (§20.1).
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    const sessionSet = await setAdminSession(response);
    if (!sessionSet) {
      return NextResponse.json(
        { error: "Session secret is not configured." },
        { status: 503 },
      );
    }

    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: "LOGIN",
      entityType: "AUTH",
      createdAt: new Date().toISOString(),
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
