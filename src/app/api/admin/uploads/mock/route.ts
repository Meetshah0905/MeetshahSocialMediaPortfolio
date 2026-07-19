import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read bytes
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Setup file name
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${cleanName}`;
    
    // Save directory inside public
    const uploadDir = path.join(process.cwd(), "public", "uploads", "screenshots");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    const relativeUrl = `/uploads/screenshots/${filename}`;

    return NextResponse.json({
      url: relativeUrl,
      pathname: relativeUrl,
    });
  } catch (err: any) {
    console.error("Local mock upload failed", err);
    return NextResponse.json({ error: "Failed to upload file locally" }, { status: 500 });
  }
}
