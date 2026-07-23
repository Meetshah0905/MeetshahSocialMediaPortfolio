import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  clearAdminSession(response);
  return response;
}
