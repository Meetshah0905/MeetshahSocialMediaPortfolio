import { NextRequest, NextResponse } from "next/server";
import { listPlatformProfiles } from "@/lib/storage/db";

export async function GET(request: NextRequest) {
  try {
    const list = await listPlatformProfiles();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch platform profiles" }, { status: 500 });
  }
}
