import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();
    const adminPasscode = process.env.ADMIN_PASSCODE || "meet123";

    if (passcode !== adminPasscode) {
      return NextResponse.json({ error: "Invalid admin passcode" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, message: "Login successful" });
    setAdminSession(response);
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
