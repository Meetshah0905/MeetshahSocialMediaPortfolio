import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "meet_shah_admin_session";

export function isAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get(COOKIE_NAME)?.value;
  return session === "active_authenticated_session";
}

export function setAdminSession(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "active_authenticated_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export function clearAdminSession(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME);
}
