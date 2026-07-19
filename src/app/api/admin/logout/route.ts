import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  clearAdminSession(response);
  return response;
}
