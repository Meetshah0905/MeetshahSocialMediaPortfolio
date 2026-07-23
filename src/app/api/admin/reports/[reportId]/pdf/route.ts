import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReport, saveReport, logAdminAction } from "@/lib/storage/db";
import {
  storePdf,
  deleteStoredBlob,
  InvalidUploadError,
  BlobNotConfiguredError,
  MAX_PDF_BYTES,
} from "@/lib/storage/pdfBlob";

/**
 * POST — upload (or replace) the PDF file for a report. Multipart body with
 * one field: `file`. On replace, the old blob is deleted only AFTER the new
 * one is stored, so a mid-upload failure never leaves the record pointing at
 * a missing file.
 */

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await params;
    const existing = await getReport(reportId);
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file was uploaded." },
        { status: 400 },
      );
    }

    const stored = await storePdf({
      file,
      channel: existing.channel,
      reportWindow: existing.reportWindow,
      periodStart: existing.periodStart,
      periodEnd: existing.periodEnd,
    });

    const previousStorageKey = existing.pdfStorageKey;

    const updated = {
      ...existing,
      pdfUrl: stored.url,
      pdfStorageKey: stored.storageKey,
      pdfSizeBytes: stored.sizeBytes,
      pdfSha256: stored.sha256,
      originalPdfFilename: file.name,
      updatedAt: new Date().toISOString(),
    };
    await saveReport(updated);

    if (previousStorageKey && previousStorageKey !== stored.storageKey) {
      await deleteStoredBlob(previousStorageKey);
    }

    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: previousStorageKey ? "REPLACE_REPORT_PDF" : "UPLOAD_REPORT_PDF",
      entityType: "REPORT",
      entityId: existing.id,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (err) {
    if (err instanceof InvalidUploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof BlobNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("PDF upload failed:", err);
    return NextResponse.json(
      {
        error: `The PDF could not be uploaded. Max size ${MAX_PDF_BYTES / 1024 / 1024} MB.`,
      },
      { status: 500 },
    );
  }
}
