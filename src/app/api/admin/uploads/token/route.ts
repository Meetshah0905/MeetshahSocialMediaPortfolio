import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized admin session" }, { status: 401 });
    }

    const { pathname } = await request.json();

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Return a simulated payload structure for mock file upload redirection
      return NextResponse.json({
        mock: true,
        pathname,
        uploadUrl: "/api/admin/uploads/mock",
      });
    }

    // Dynamic import to prevent crash if module loading completes later
    const { generateClientTokenPayload } = require("@vercel/blob/next");
    const jsonResponse = await generateClientTokenPayload({
      pathname,
      onUploadCompleted: "/api/admin/uploads/completed",
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("Vercel Blob token route error", error);
    return NextResponse.json({ error: "Failed to generate token payload" }, { status: 500 });
  }
}
