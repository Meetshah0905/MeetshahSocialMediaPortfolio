/**
 * Client-safe report shared types and display helpers.
 *
 * `src/lib/storage/db.ts` imports Node's `fs` module for the local JSON
 * adapter, so client components cannot import from it. Any type or helper
 * that both server AND client code needs lives here instead.
 */

export type ChannelSlug = "instagram-fitness" | "instagram-finance" | "youtube-main";
export type ReportWindow = "30" | "60" | "90" | "custom";
export type ReportStatus = "draft" | "published" | "archived";

export type AnalyticsReportMetrics = {
  audienceEnd?: number;
  audienceGrowth?: number;
  views?: number;
  reach?: number;
  impressions?: number;
  interactions?: number;
  engagementRate?: number;
  watchTimeMinutes?: number;
  averageViewDurationSeconds?: number;

  // YouTube specific metrics (§2)
  subscribersStart?: number;
  subscribersEnd?: number;
  subscribersGained?: number;
  subscribersLost?: number;
  shortsViews?: number;
  longFormViews?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  publishedShorts?: number;
  publishedLongFormVideos?: number;
};

export type AnalyticsReport = {
  id: string;
  slug: string;

  channel: ChannelSlug;
  reportWindow: ReportWindow;

  periodStart: string;
  periodEnd: string;

  title: string;
  executiveSummary?: string;
  highlights?: string[];

  metrics?: AnalyticsReportMetrics;

  pdfUrl: string;
  pdfStorageKey: string;
  originalPdfFilename: string;
  pdfSizeBytes: number;
  pdfSha256?: string;

  coverImageUrl?: string | null;
  coverImageStorageKey?: string | null;

  status: ReportStatus;

  publishedAt?: string | null;
  archivedAt?: string | null;

  createdByAdminId: string;
  createdAt: string;
  updatedAt: string;
};

export const CHANNEL_DISPLAY: Record<ChannelSlug, {
  name: string;
  handle: string;
  platform: "instagram" | "youtube";
}> = {
  "instagram-fitness": {
    name: "Instagram Fitness",
    handle: "@meetsofficial",
    platform: "instagram",
  },
  "instagram-finance": {
    name: "Instagram Finance",
    handle: "@meet.fitfix",
    platform: "instagram",
  },
  "youtube-main": {
    name: "YouTube Main",
    handle: "@im_meetshah",
    platform: "youtube",
  },
};

export function formatReportWindow(window: ReportWindow): string {
  if (window === "custom") return "Custom Period";
  return `${window} Days`;
}

export function isChannelSlug(value: string): value is ChannelSlug {
  return (
    value === "instagram-fitness" ||
    value === "instagram-finance" ||
    value === "youtube-main"
  );
}

export function isReportWindow(value: string): value is ReportWindow {
  return value === "30" || value === "60" || value === "90" || value === "custom";
}

export function formatPdfFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
