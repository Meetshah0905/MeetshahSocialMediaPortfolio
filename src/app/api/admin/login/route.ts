import { NextRequest, NextResponse } from "next/server";
import {
  validateAdminCredentials,
  setAdminSession,
  isAuthConfigured,
} from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { logAdminAction } from "@/lib/storage/db";

export async function GET() {
  const configured = isAuthConfigured();
  return NextResponse.json({ configured });
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit before touching credentials
    if (!(await checkRateLimit("login", request))) {
      return NextResponse.json(
        { error: "Too many attempts. Try again in a minute." },
        { status: 429 },
      );
    }

    if (!isAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            "Admin authentication is not configured. Required server-side environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, ANALYTICS_SESSION_SECRET) are missing.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { email, password } = body ?? {};

    if (!(await validateAdminCredentials(email, password))) {
      // Generic message — never reveal which specific credential was incorrect (§20.1)
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true, redirectUrl: "/admin" });
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
