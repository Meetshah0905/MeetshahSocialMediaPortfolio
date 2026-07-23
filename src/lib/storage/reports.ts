import type { AnalyticsReport, ChannelSlug, ReportWindow } from "./db";
import { CHANNEL_DISPLAY, formatReportWindow } from "./db";

/**
 * Shared helpers for building AnalyticsReport records.
 */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function nowIso(): string {
  return new Date().toISOString();
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function suggestReportTitle(
  channel: ChannelSlug,
  reportWindow: ReportWindow,
): string {
  const channelName = CHANNEL_DISPLAY[channel].name;
  if (reportWindow === "custom") {
    return `${channelName} — Custom Period Insights Report`;
  }
  return `${channelName} — ${reportWindow}-Day Insights Report`;
}

export function buildNewReportRecord(input: {
  channel: ChannelSlug;
  reportWindow: ReportWindow;
  periodStart: string;
  periodEnd: string;
  title?: string;
  executiveSummary?: string;
  highlights?: string[];
  metrics?: AnalyticsReport["metrics"];
  createdByAdminId?: string;
}): AnalyticsReport {
  const timestamp = nowIso();
  const title = input.title?.trim() || suggestReportTitle(input.channel, input.reportWindow);
  const id = `${input.channel}-${input.periodStart}-${shortId()}`;
  const slug = slugify(
    `${input.channel}-${formatReportWindow(input.reportWindow).toLowerCase()}-${input.periodEnd}-${shortId()}`,
  );

  return {
    id,
    slug,

    channel: input.channel,
    reportWindow: input.reportWindow,

    periodStart: input.periodStart,
    periodEnd: input.periodEnd,

    title,
    executiveSummary: input.executiveSummary,
    highlights: input.highlights,
    metrics: input.metrics,

    // PDF fields are empty until upload completes.
    pdfUrl: "",
    pdfStorageKey: "",
    originalPdfFilename: "",
    pdfSizeBytes: 0,

    coverImageUrl: null,
    coverImageStorageKey: null,

    status: "draft",
    publishedAt: null,
    archivedAt: null,

    createdByAdminId: input.createdByAdminId ?? "admin",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/** Days elapsed between two YYYY-MM-DD dates, inclusive. */
export function daysBetween(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

export function isPeriodValid(startIso: string, endIso: string): boolean {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return Number.isFinite(start) && Number.isFinite(end) && start <= end;
}
