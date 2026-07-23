import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  getPlatformProfile,
  savePlatformProfile,
  saveAudienceMetricHistory,
  logAdminAction,
  formatCompactCount,
} from "@/lib/storage/db";
import { isAuthenticated } from "@/lib/auth/session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { profileId } = await params;
    const body = await request.json();
    const { currentValue, manualAudienceOverride, manualOverrideEnabled, published } = body;

    const profile = await getPlatformProfile(profileId);
    if (!profile) {
      return NextResponse.json({ error: "Platform channel not found" }, { status: 404 });
    }

    const targetCount =
      manualAudienceOverride != null
        ? Number(manualAudienceOverride)
        : Number(currentValue);

    if (isNaN(targetCount) || targetCount < 0 || !Number.isInteger(targetCount)) {
      return NextResponse.json(
        { error: "Audience count must be a non-negative integer" },
        { status: 400 }
      );
    }

    const previousValue = profile.manualAudienceCount ?? profile.manualAudienceOverride ?? profile.currentValue;
    const now = new Date().toISOString();

    const updatedProfile = {
      ...profile,
      currentValue: targetCount,
      currentAudienceCount: targetCount,
      manualAudienceCount: manualOverrideEnabled || manualAudienceOverride != null ? targetCount : null,
      manualAudienceOverride: manualOverrideEnabled || manualAudienceOverride != null ? targetCount : null,
      manualOverrideEnabled: Boolean(manualOverrideEnabled || manualAudienceOverride != null),
      previousValue,
      updatedAt: now,
      published: published ?? true,
      isPublished: published ?? true,
    };

    // 1. Save updated profile in persistent DB
    await savePlatformProfile(updatedProfile);

    // 2. Log audience metric history entry (§4)
    await saveAudienceMetricHistory({
      id: `hist-${Date.now()}`,
      channelId: profile.slug || profile.id,
      previousValue,
      newValue: targetCount,
      source: "manual-admin",
      effectiveDate: now,
      changedByAdminId: "admin",
      createdAt: now,
    });

    // 3. Log admin audit action (§11)
    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: "UPDATE_AUDIENCE_COUNT",
      entityType: "CHANNEL",
      entityId: profile.slug || profile.id,
      previousValue,
      newValue: targetCount,
      createdAt: now,
    });

    // 4. Invalidate Next.js cache tags and paths (§9)
    try {
      // Next 16 signature: (tag, profile) — 'max' = stale-while-revalidate.
      revalidateTag("creator-metrics", "max");
    } catch {
      // Ignore fallback if tag not registered
    }

    // Every route that renders audience counts. (/youtube does not exist —
    // the YouTube surface lives at /analytics/youtube.)
    const revalidatedPaths = [
      "/",
      "/fitness",
      "/finance",
      "/analytics",
      "/analytics/fitness",
      "/analytics/finance",
      "/analytics/youtube",
      "/work-with-me",
      "/ugc",
    ];

    for (const path of revalidatedPaths) {
      try {
        revalidatePath(path);
      } catch {
        // Ignore fallback
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${profile.displayName} to ${targetCount.toLocaleString()} (${formatCompactCount(targetCount)}) everywhere on public website.`,
      channel: updatedProfile,
      revalidatedPaths,
    });
  } catch (err) {
    console.error("Failed to update platform profile:", err);
    return NextResponse.json({ error: "Server error during metric update" }, { status: 500 });
  }
}
