import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";

/**
 * Route protection.
 *
 * Pages under /admin and /analytics/admin redirect to login; /api/admin/*
 * (except login) get a 401. Session verification is a signed-HMAC check —
 * see src/lib/auth/session.ts.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage =
    (pathname.startsWith("/admin") || pathname.startsWith("/analytics/admin")) &&
    !pathname.startsWith("/admin/login");

  const isAdminApi =
    pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (await isAuthenticated(request)) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/analytics/admin/:path*", "/api/admin/:path*"],
};
