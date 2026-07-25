import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReport, saveReport, logAdminAction } from "@/lib/storage/db";
import { blobExists } from "@/lib/storage/pdfBlob";

import { invalidateReportCaches } from "@/lib/storage/cacheInvalidation";

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

    if (!existing.pdfStorageKey || !existing.pdfUrl) {
      return NextResponse.json(
        { error: "Upload the PDF before publishing." },
        { status: 400 },
      );
    }

    // Verify the file is still present before making the record public.
    const present = await blobExists(existing.pdfStorageKey);
    if (!present) {
      return NextResponse.json(
        { error: "The PDF file is missing from storage. Re-upload before publishing." },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const updated = {
      ...existing,
      status: "published" as const,
      publishedAt: now,
      archivedAt: null,
      updatedAt: now,
    };
    await saveReport(updated);

    invalidateReportCaches(existing.channel, existing.slug);

    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: "PUBLISH_REPORT",
      entityType: "REPORT",
      entityId: existing.id,
      createdAt: now,
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (err) {
    console.error("Publish failed:", err);
    return NextResponse.json({ error: "Failed to publish report" }, { status: 500 });
  }
}
