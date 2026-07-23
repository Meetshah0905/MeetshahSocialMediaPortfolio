import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth/session";
import {
  listReports,
  saveReport,
  logAdminAction,
  StorageNotConfiguredError,
  isChannelSlug,
  isReportWindow,
  type ChannelSlug,
  type ReportWindow,
  type ReportStatus,
} from "@/lib/storage/db";
import { buildNewReportRecord, isPeriodValid } from "@/lib/storage/reports";

/**
 * POST — create a new report draft (metadata only). The PDF is uploaded in a
 * separate call to /api/admin/reports/[reportId]/pdf so the browser can show
 * upload progress without also blocking on record creation.
 *
 * GET — list all reports for the admin library (drafts + published + archived).
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

const metricsSchema = z
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
  .optional();

const createSchema = z.object({
  channel: z.string().refine(isChannelSlug, "Unknown channel"),
  reportWindow: z.string().refine(isReportWindow, "Unknown window"),
  periodStart: isoDate,
  periodEnd: isoDate,
  title: z.string().max(160).optional(),
  executiveSummary: z.string().max(2000).optional(),
  highlights: z.array(z.string().max(240)).max(5).optional(),
  metrics: metricsSchema,
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid report data" },
        { status: 400 },
      );
    }
    const input = parsed.data;

    if (!isPeriodValid(input.periodStart, input.periodEnd)) {
      return NextResponse.json(
        { error: "The end date cannot be before the start date." },
        { status: 400 },
      );
    }

    const report = buildNewReportRecord({
      channel: input.channel as ChannelSlug,
      reportWindow: input.reportWindow as ReportWindow,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      title: input.title,
      executiveSummary: input.executiveSummary,
      highlights: input.highlights,
      metrics: input.metrics,
    });

    await saveReport(report);
    await logAdminAction({
      id: `audit-${Date.now()}`,
      adminId: "admin",
      action: "CREATE_DRAFT_REPORT",
      entityType: "REPORT",
      entityId: report.id,
      createdAt: report.createdAt,
    });

    return NextResponse.json({ success: true, reportId: report.id, report });
  } catch (err) {
    if (err instanceof StorageNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("Report creation failed:", err);
    return NextResponse.json(
      { error: "Failed to save the report." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const channelParam = searchParams.get("channel");
    const windowParam = searchParams.get("window");
    const statusParam = searchParams.get("status");

    const reports = await listReports({
      channel: channelParam && isChannelSlug(channelParam) ? channelParam : undefined,
      reportWindow: windowParam && isReportWindow(windowParam) ? windowParam : undefined,
      status:
        statusParam === "draft" ||
        statusParam === "published" ||
        statusParam === "archived" ||
        statusParam === "all"
          ? (statusParam as ReportStatus | "all")
          : "all",
    });
    return NextResponse.json(reports);
  } catch (err) {
    console.error("Report list failed:", err);
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
  }
}
