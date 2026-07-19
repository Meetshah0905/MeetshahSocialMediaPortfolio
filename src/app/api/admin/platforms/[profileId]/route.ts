import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getPlatformProfile, savePlatformProfile, savePlatformMetricSnapshot, PlatformProfile, PlatformMetricSnapshot } from "@/lib/storage/db";

type Params = {
  params: Promise<{
    profileId: string;
  }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    // 1. Verify Authentication Session
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized admin session" }, { status: 401 });
    }

    const { profileId: rawProfileId } = await params;
    const profileId = rawProfileId as PlatformProfile["id"];
    const { value, effectiveAt, note } = await request.json();

    // 2. Validate Inputs
    const parsedValue = Number(value);
    if (isNaN(parsedValue) || parsedValue < 0) {
      return NextResponse.json({ error: "Invalid metric value" }, { status: 400 });
    }

    // 3. Fetch current platform profile
    const profile = await getPlatformProfile(profileId);
    if (!profile) {
      return NextResponse.json({ error: "Platform profile not found" }, { status: 404 });
    }

    // 4. Update Profile Fields
    const previousValue = profile.currentValue;
    const updatedProfile: PlatformProfile = {
      ...profile,
      previousValue,
      currentValue: parsedValue,
      effectiveAt: effectiveAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: "admin-quick-editor",
    };

    await savePlatformProfile(updatedProfile);

    // 5. Generate Metric History Snapshot
    const snapshotId = `snap-${profileId}-${Date.now()}`;
    const newSnapshot: PlatformMetricSnapshot = {
      id: snapshotId,
      profileId,
      metric: profile.primaryMetric,
      value: parsedValue,
      effectiveAt: effectiveAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      source: "manual-admin-update",
      sourceReportId: null,
    };

    await savePlatformMetricSnapshot(newSnapshot);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${profile.displayName} to ${parsedValue.toLocaleString()}`,
      profile: updatedProfile,
      snapshot: newSnapshot,
    });
  } catch (err: any) {
    console.error("Platform update API failed", err);
    return NextResponse.json({ error: "Failed to update platform profile count" }, { status: 500 });
  }
}

// Support fetching history for this profile as well
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { profileId } = await params;
    const { getPlatformMetricHistory } = require("@/lib/storage/db");
    const history = await getPlatformMetricHistory(profileId as any);
    return NextResponse.json(history);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch platform metrics history" }, { status: 500 });
  }
}
