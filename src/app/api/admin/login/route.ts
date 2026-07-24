import { NextRequest, NextResponse } from "next/server";
import {
  setAdminSession,
  isAuthConfigured,
  safeStringEqual,
} from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { logAdminAction } from "@/lib/storage/db";

export const runtime = "nodejs";

export async function GET() {
  const configured = isAuthConfigured();
  return NextResponse.json({ configured });
}

export async function POST(request: NextRequest) {
  let stage = "request-start";

  try {
    stage = "read-environment";
    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const configuredPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ANALYTICS_SESSION_SECRET;

    if (
      !configuredEmail ||
      !configuredPassword ||
      !sessionSecret ||
      sessionSecret.length < 16
    ) {
      console.warn("[admin-login]", {
        stage,
        code: "AUTH_NOT_CONFIGURED",
      });

      return NextResponse.json(
        {
          success: false,
          error: "Admin authentication is not configured.",
        },
        { status: 503 },
      );
    }

    stage = "rate-limit-check";
    if (!(await checkRateLimit("login", request))) {
      console.warn("[admin-login]", { stage, code: "RATE_LIMITED" });
      return NextResponse.json(
        {
          success: false,
          error: "Too many attempts. Try again in a minute.",
        },
        { status: 429 },
      );
    }

    stage = "parse-request";
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    const submittedEmail =
      typeof (body as Record<string, unknown>)?.email === "string"
        ? ((body as Record<string, unknown>).email as string).trim().toLowerCase()
        : "";

    const submittedPassword =
      typeof (body as Record<string, unknown>)?.password === "string"
        ? ((body as Record<string, unknown>).password as string)
        : "";

    if (!submittedEmail || !submittedPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    stage = "compare-credentials";
    const emailMatches = safeStringEqual(submittedEmail, configuredEmail);
    const passwordMatches = safeStringEqual(submittedPassword, configuredPassword);

    if (!emailMatches || !passwordMatches) {
      console.warn("[admin-login]", {
        stage,
        code: "INVALID_CREDENTIALS",
        emailMatches,
        passwordMatches,
        submittedPasswordLength: submittedPassword.length,
        configuredPasswordLength: configuredPassword.length,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    stage = "create-response";
    const response = NextResponse.json(
      {
        success: true,
        redirectUrl: "/admin",
        redirectTo: "/admin",
      },
      { status: 200 },
    );

    stage = "set-cookie";
    const sessionSet = await setAdminSession(response);
    if (!sessionSet) {
      console.error("[admin-login]", {
        stage,
        code: "SESSION_SIGN_FAILURE",
      });

      return NextResponse.json(
        {
          success: false,
          error: "Session creation failed.",
        },
        { status: 503 },
      );
    }

    stage = "audit-log";
    try {
      await logAdminAction({
        id: `audit-${Date.now()}`,
        adminId: "admin",
        action: "LOGIN",
        entityType: "AUTH",
        createdAt: new Date().toISOString(),
      });
    } catch (auditErr) {
      console.warn("[admin-login] audit-log-failed-non-blocking", auditErr);
    }

    stage = "complete";
    console.log("[admin-login]", { stage, code: "LOGIN_SUCCESS" });
    return response;
  } catch (error) {
    console.error("[admin-login]", {
      stage,
      code: "LOGIN_ROUTE_EXCEPTION",
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed.",
      },
      { status: 500 },
    );
  }
}
