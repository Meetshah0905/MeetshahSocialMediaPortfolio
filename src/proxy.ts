import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";

/**
 * Route protection proxy middleware.
 *
 * Pages under /admin and /analytics/admin redirect to /admin/login; /api/admin/*
 * (except login) get a 401 JSON error.
 * Session verification is a signed HMAC-SHA256 token check.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userIsAuth = await isAuthenticated(request);

  // If user is already authenticated and visits /admin/login, redirect to /admin
  if (pathname === "/admin/login") {
    if (userIsAuth) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Exempt public login API endpoint
  if (pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const isAdminPage =
    pathname.startsWith("/admin") || pathname.startsWith("/analytics/admin");

  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (userIsAuth) {
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
