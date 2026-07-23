import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReport, saveReport, logAdminAction } from "@/lib/storage/db";

type Params = { params: Promise<{ reportId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await params;
    const existing = await getReport(reportId);
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      status: "draft" as const,
      publishedAt: null,
      updatedAt: now,
    };
    await saveReport(updated);

    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: "UNPUBLISH_REPORT",
      entityType: "REPORT",
      entityId: existing.id,
      createdAt: now,
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (err) {
    console.error("Unpublish failed:", err);
    return NextResponse.json({ error: "Failed to unpublish report" }, { status: 500 });
  }
}
