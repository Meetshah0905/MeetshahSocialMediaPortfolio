import { NextResponse } from "next/server";
import { listPlatformProfiles } from "@/lib/storage/db";

/**
 * PUBLIC channel metrics.
 *
 * Published channels only, and only presentation-safe fields — the admin
 * endpoint (/api/admin/platforms) returns full records including override
 * flags and audit fields, and now correctly sits behind the admin session.
 */
export async function GET() {
  try {
    const profiles = await listPlatformProfiles();
    const published = profiles
      .filter((p) => p.published || p.isPublished)
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        platform: p.platform,
        displayName: p.displayName,
        handle: p.handle,
        url: p.url ?? null,
        primaryMetric: p.primaryMetric,
        currentValue: p.currentValue || 0,
        updatedAt: p.updatedAt,
      }));
    return NextResponse.json(published);
  } catch (err) {
    console.error("Public platforms fetch failed:", err);
    return NextResponse.json({ error: "Failed to load channels" }, { status: 500 });
  }
}
