import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth/session";
import {
  getReport,
  saveReport,
  deleteReport,
  logAdminAction,
  isChannelSlug,
  isReportWindow,
} from "@/lib/storage/db";
import { isPeriodValid } from "@/lib/storage/reports";
import { deleteStoredBlob } from "@/lib/storage/pdfBlob";
import { deleteReportFromStorage } from "@/lib/storage/supabaseStorage";
import { logReportAudit } from "@/lib/storage/auditLog";

type Params = { params: Promise<{ reportId: string }> };

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const patchSchema = z.object({
  channel: z.string().refine(isChannelSlug).optional(),
  reportWindow: z.string().refine(isReportWindow).optional(),
  periodStart: isoDate.optional(),
  periodEnd: isoDate.optional(),
  title: z.string().max(160).optional(),
  executiveSummary: z.string().max(2000).nullable().optional(),
  highlights: z.array(z.string().max(240)).max(5).nullable().optional(),
  metrics: z
    .object({
      audienceEnd: z.number().nonnegative().optional(),
      audienceGrowth: z.number().optional(),
      views: z.number().nonnegative().optional(),
      reach: z.number().nonnegative().optional(),
      impressions: z.number().nonnegative().optional(),
      interactions: z.number().nonnegative().optional(),
      engagementRate: z.number().min(0).max(100).optional(),
      watchTimeMinutes: z.number().nonnegative().optional(),
      averageViewDurationSeconds: z.number().nonnegative().optional(),
    })
    .partial()
    .nullable()
    .optional(),
});

export async function GET(request: NextRequest, { params }: Params) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { reportId } = await params;
  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { reportId } = await params;
    const existing = await getReport(reportId);
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 },
      );
    }
    const input = parsed.data;

    const nextStart = input.periodStart ?? existing.periodStart;
    const nextEnd = input.periodEnd ?? existing.periodEnd;
    if (!isPeriodValid(nextStart, nextEnd)) {
      return NextResponse.json(
        { error: "The end date cannot be before the start date." },
        { status: 400 },
      );
    }

    const updated = {
      ...existing,
      ...(input.channel ? { channel: input.channel as typeof existing.channel } : {}),
      ...(input.reportWindow
        ? { reportWindow: input.reportWindow as typeof existing.reportWindow }
        : {}),
      periodStart: nextStart,
      periodEnd: nextEnd,
      ...(input.title !== undefined ? { title: input.title } : {}),
      executiveSummary:
        input.executiveSummary === undefined
          ? existing.executiveSummary
          : input.executiveSummary ?? undefined,
      highlights:
        input.highlights === undefined
          ? existing.highlights
          : input.highlights ?? undefined,
      metrics:
        input.metrics === undefined
          ? existing.metrics
          : input.metrics ?? undefined,
      updatedAt: new Date().toISOString(),
    };

    await saveReport(updated);
    return NextResponse.json({ success: true, report: updated });
  } catch (err) {
    console.error("Report update failed:", err);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

import { invalidateReportCaches } from "@/lib/storage/cacheInvalidation";
import { blobExists } from "@/lib/storage/pdfBlob";

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { reportId } = await params;
    const existing = await getReport(reportId);
    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    let pdfWasAlreadyMissing = false;
    let pdfDeleted = false;

    if (existing.pdfStorageKey) {
      try {
        const exists = await blobExists(existing.pdfStorageKey);
        if (!exists) {
          pdfWasAlreadyMissing = true;
        } else {
          await deleteStoredBlob(existing.pdfStorageKey);
          await deleteReportFromStorage(existing.pdfStorageKey);
          pdfDeleted = true;
        }
      } catch (storageErr) {
        console.warn("Storage deletion warning (proceeding with DB delete):", storageErr);
      }
    } else {
      pdfWasAlreadyMissing = true;
    }

    if (existing.coverImageStorageKey) {
      try {
        await deleteStoredBlob(existing.coverImageStorageKey);
        await deleteReportFromStorage(existing.coverImageStorageKey);
      } catch {
        // Ignored
      }
    }

    // Always delete the database record idempotently
    await deleteReport(existing.id);
    if (existing.slug && existing.slug !== existing.id) {
      await deleteReport(existing.slug);
    }

    // Invalidate caches across public and admin pages
    invalidateReportCaches(existing.channel, existing.slug);

    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: "DELETE_REPORT",
      entityType: "REPORT",
      entityId: existing.id,
      createdAt: new Date().toISOString(),
    });

    await logReportAudit("deleted", existing.id, "admin", {
      title: existing.title,
      channel: existing.channel,
      pdfStorageKey: existing.pdfStorageKey,
    });

    return NextResponse.json({
      success: true,
      databaseRecordDeleted: true,
      pdfDeleted,
      pdfWasAlreadyMissing,
    });
  } catch (err) {
    console.error("Report delete failed:", err);
    return NextResponse.json(
      { error: "The report was not deleted. Review the error and try again." },
      { status: 500 },
    );
  }
}
