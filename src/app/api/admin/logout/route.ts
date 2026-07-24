import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
    redirectUrl: "/admin/login",
  });
  clearAdminSession(response);
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  clearAdminSession(response);
  return response;
}
