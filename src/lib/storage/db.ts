import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

export * from "./reportShared";
import type {
  AnalyticsReport,
  ChannelSlug,
  ReportStatus,
  ReportWindow,
} from "./reportShared";

// Core Creator Channels Configuration
export const creatorChannels = [
  {
    slug: "instagram-fitness" as const,
    platform: "instagram" as const,
    displayName: "Instagram Fitness",
    handle: "@meetsofficial",
    audienceLabel: "Followers",
  },
  {
    slug: "instagram-finance" as const,
    platform: "instagram" as const,
    displayName: "Instagram Finance",
    handle: "@meet.fitfix",
    audienceLabel: "Followers",
  },
  {
    slug: "youtube-main" as const,
    platform: "youtube" as const,
    displayName: "YouTube Main",
    handle: "Meet Shah",
    audienceLabel: "Subscribers",
  },
];

/** Legacy alias kept for the chatbot route + platform profile helpers. */
export type AnalyticsSource = "instagram_fitness" | "instagram_finance" | "youtube_main";

/**
 * Map channel slug ↔ legacy persona used by the chatbot + platform profile
 * records. Old snake_case ids stay in profiles/history/audit; new AnalyticsReport
 * records use the kebab-case slug.
 */
export function channelSlugToPersona(slug: ChannelSlug): AnalyticsSource {
  if (slug === "instagram-fitness") return "instagram_fitness";
  if (slug === "instagram-finance") return "instagram_finance";
  return "youtube_main";
}

// Persistent Channel Model
export type CreatorChannel = {
  id: string;
  slug: ChannelSlug;
  platform: "instagram" | "youtube";
  displayName: string;
  handle: string;
  profileUrl?: string;
  url?: string | null;

  currentAudienceCount: number;

  manualOverrideEnabled: boolean;
  manualAudienceCount?: number | null;

  lastApiAudienceCount?: number | null;
  lastSyncedAt?: string | null;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
};

// Platform Profile CMS Schema (Compatible Alias)
export type PlatformProfile = CreatorChannel & {
  primaryMetric: "followers" | "subscribers";
  currentValue: number;
  manualAudienceOverride?: number | null;
  previousValue?: number | null;
  effectiveAt: string;
  updatedBy: string;
  published: boolean;
};

// Audience Metric History
export type AudienceMetricHistory = {
  id: string;
  channelId: string;

  previousValue?: number;
  newValue: number;

  source: "manual-admin" | "screenshot-report" | "instagram-api" | "youtube-api";

  effectiveDate: string;
  changedByAdminId?: string;

  createdAt: string;
};

// Platform Profile Snapshots History
export type PlatformMetricSnapshot = {
  id: string;
  profileId: string;
  channelId?: string;
  metric: "followers" | "subscribers";
  value: number;
  effectiveAt: string;
  createdAt: string;
  source: "manual-admin" | "published-report" | "screenshot-ai" | "instagram-api" | "youtube-api";
  sourceReportId: string | null;
  isReviewed?: boolean;
  isPublished?: boolean;
};

// Admin Audit Log
export type AdminAuditLog = {
  id: string;
  adminId: string;
  action: string;
  entityType: string;
  entityId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  createdAt: string;
};

// Effective Audience Count Resolution
export function getEffectiveAudienceCount(channel: PlatformProfile | CreatorChannel): number {
  if (channel.manualOverrideEnabled && channel.manualAudienceCount != null && channel.manualAudienceCount > 0) {
    return channel.manualAudienceCount;
  }
  if ((channel as PlatformProfile).manualAudienceOverride != null && (channel as PlatformProfile).manualAudienceOverride! > 0) {
    return (channel as PlatformProfile).manualAudienceOverride!;
  }
  if (channel.lastApiAudienceCount != null && channel.lastApiAudienceCount > 0) {
    return channel.lastApiAudienceCount;
  }
  if (channel.currentAudienceCount != null && channel.currentAudienceCount > 0) {
    return channel.currentAudienceCount;
  }
  return 0;
}

// Compact Count Formatter
export function formatCompactCount(value: number): string {
  if (value === 0) return "0";
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export const formatAudienceCount = (value: number, format: "exact" | "compact" = "compact") => {
  return format === "exact" ? value.toLocaleString() : formatCompactCount(value);
};

// Redis / Persistent Storage Config
const isRedisConfigured =
  typeof process !== "undefined" &&
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const REPORTS_PATH = path.join(process.cwd(), "data", "reports.json");
const PROFILES_PATH = path.join(process.cwd(), "data", "profiles.json");
const HISTORY_PATH = path.join(process.cwd(), "data", "history.json");
const AUDIT_PATH = path.join(process.cwd(), "data", "audit.json");

function makeSeedProfile(
  id: string,
  slug: PlatformProfile["slug"],
  platform: PlatformProfile["platform"],
  displayName: string,
  handle: string,
  url: string,
  primaryMetric: PlatformProfile["primaryMetric"],
  initialCount = 0,
): PlatformProfile {
  const now = new Date().toISOString();
  return {
    id,
    slug,
    platform,
    displayName,
    handle,
    url,
    primaryMetric,
    currentValue: initialCount,
    currentAudienceCount: initialCount,
    manualOverrideEnabled: false,
    manualAudienceCount: null,
    manualAudienceOverride: null,
    lastApiAudienceCount: null,
    previousValue: null,
    effectiveAt: now,
    updatedAt: now,
    updatedBy: "system-seed",
    published: true,
    isPublished: true,
    createdAt: now,
  };
}

const SEED_PROFILES: PlatformProfile[] = [
  makeSeedProfile(
    "instagram_fitness",
    "instagram-fitness",
    "instagram",
    "Instagram Fitness",
    "@meetsofficial",
    "https://www.instagram.com/meetsofficial/",
    "followers",
    12000,
  ),
  makeSeedProfile(
    "instagram_finance",
    "instagram-finance",
    "instagram",
    "Instagram Finance",
    "@meet.fitfix",
    "https://www.instagram.com/meet.fitfix/",
    "followers",
    15300,
  ),
  makeSeedProfile(
    "youtube_main",
    "youtube-main",
    "youtube",
    "YouTube Main",
    "Meet Shah",
    "https://www.youtube.com/@meetshah",
    "subscribers",
    19700,
  ),
];

/**
 * Central metrics loader for published creator metrics (§3).
 * Calculates combined community dynamically.
 */
export async function getPublishedCreatorMetrics() {
  const profiles = await listPlatformProfiles();
  const published = profiles.filter((p) => p.published || p.isPublished);

  const fitness = published.find((p) => p.slug === "instagram-fitness" || p.id === "instagram_fitness");
  const finance = published.find((p) => p.slug === "instagram-finance" || p.id === "instagram_finance");
  const youtube = published.find((p) => p.slug === "youtube-main" || p.id === "youtube_main");

  const fitVal = fitness ? getEffectiveAudienceCount(fitness) : 12000;
  const finVal = finance ? getEffectiveAudienceCount(finance) : 15300;
  const ytVal = youtube ? getEffectiveAudienceCount(youtube) : 19700;

  const combined = fitVal + finVal + ytVal;

  return {
    instagramFitness: {
      exact: fitVal,
      compact: formatCompactCount(fitVal),
      source: fitness?.updatedBy || "manual-admin",
      updatedAt: fitness?.updatedAt || new Date().toISOString(),
    },
    instagramFinance: {
      exact: finVal,
      compact: formatCompactCount(finVal),
      source: finance?.updatedBy || "manual-admin",
      updatedAt: finance?.updatedAt || new Date().toISOString(),
    },
    youtubeMain: {
      exact: ytVal,
      compact: formatCompactCount(ytVal),
      source: youtube?.updatedBy || "manual-admin",
      updatedAt: youtube?.updatedAt || new Date().toISOString(),
    },
    combinedCommunity: {
      exact: combined,
      compact: formatCompactCount(combined),
    },
  };
}

const isProductionWithoutRedis =
  process.env.NODE_ENV === "production" && !isRedisConfigured;

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Persistent storage is not configured. Connect Upstash Redis (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) — production cannot write to the local filesystem.",
    );
    this.name = "StorageNotConfiguredError";
  }
}

function readJSONFile<T>(filePath: string, seed: T): T {
  try {
    const parentDir = path.dirname(filePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      if (!isProductionWithoutRedis) {
        writeJSONFile(filePath, seed);
      }
      return seed;
    }

    const data = fs.readFileSync(filePath, "utf-8");
    if (!data || !data.trim()) return seed;
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading JSON file ${filePath}:`, err);
    return seed;
  }
}

function writeJSONFile<T>(filePath: string, data: T) {
  if (isProductionWithoutRedis) {
    throw new StorageNotConfiguredError();
  }
  const parentDir = path.dirname(filePath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 6)}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

// 1. Platform Profiles CRUD
export async function getPlatformProfile(
  id: string
): Promise<PlatformProfile | null> {
  const list = await listPlatformProfiles();
  return list.find((p) => p.id === id || p.slug === id) || null;
}

export async function savePlatformProfile(profile: PlatformProfile): Promise<void> {
  const normalizedId = profile.id || profile.slug;
  if (redis) {
    await redis.set(`platform-profile:${normalizedId}`, profile);
    return;
  }
  const list = readJSONFile(PROFILES_PATH, SEED_PROFILES);
  const idx = list.findIndex((p) => p.id === normalizedId || p.slug === normalizedId || p.id === profile.id);
  if (idx >= 0) {
    list[idx] = profile;
  } else {
    list.push(profile);
  }
  writeJSONFile(PROFILES_PATH, list);
}

function getCanonicalId(p: PlatformProfile): string {
  if (p.id === "instagram-fitness" || p.id === "instagram_fitness" || p.slug === "instagram-fitness") return "instagram_fitness";
  if (p.id === "instagram-finance" || p.id === "instagram_finance" || p.slug === "instagram-finance") return "instagram_finance";
  if (p.id === "youtube-main" || p.id === "youtube_main" || p.slug === "youtube-main") return "youtube_main";
  return p.id || p.slug || "unknown";
}

export async function listPlatformProfiles(): Promise<PlatformProfile[]> {
  let rawList: PlatformProfile[] = [];
  if (redis) {
    const keys = await redis.keys("platform-profile:*");
    for (const k of keys) {
      const p = await redis.get<PlatformProfile>(k);
      if (p) rawList.push(p);
    }
  }
  if (rawList.length < 3) {
    rawList = readJSONFile(PROFILES_PATH, SEED_PROFILES);
  }

  const map = new Map<string, PlatformProfile>();
  for (const p of rawList) {
    const cid = getCanonicalId(p);
    if (!map.has(cid) || (p.updatedAt && map.get(cid)!.updatedAt < p.updatedAt)) {
      map.set(cid, p);
    }
  }

  for (const seed of SEED_PROFILES) {
    const cid = getCanonicalId(seed);
    if (!map.has(cid)) {
      map.set(cid, seed);
    }
  }

  return Array.from(map.values());
}

// 2. Audience Metric History CRUD
export async function saveAudienceMetricHistory(
  history: AudienceMetricHistory
): Promise<void> {
  if (redis) {
    await redis.set(`audience-history:${history.channelId}:${history.id}`, history);
    return;
  }
  const list = readJSONFile<AudienceMetricHistory[]>(HISTORY_PATH, []);
  list.push(history);
  writeJSONFile(HISTORY_PATH, list);
}

export async function getAudienceMetricHistory(
  channelId: string
): Promise<AudienceMetricHistory[]> {
  if (redis) {
    const keys = await redis.keys(`audience-history:${channelId}:*`);
    const list: AudienceMetricHistory[] = [];
    for (const k of keys) {
      const h = await redis.get<AudienceMetricHistory>(k);
      if (h) list.push(h);
    }
    return list.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  }
  const list = readJSONFile<AudienceMetricHistory[]>(HISTORY_PATH, []);
  return list
    .filter((h) => h.channelId === channelId)
    .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
}

// 3. Analytics Report CRUD

const REPORT_KEY = (id: string) => `analytics-report:${id}`;

function isPublished(r: AnalyticsReport): boolean {
  return r.status === "published" && !!r.publishedAt;
}

/** publishedAt DESC, then createdAt DESC — matches spec §16. */
function comparePublishedAtDesc(a: AnalyticsReport, b: AnalyticsReport): number {
  const ap = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
  const bp = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
  if (ap !== bp) return bp - ap;
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function getReport(id: string): Promise<AnalyticsReport | null> {
  if (redis) {
    const direct = await redis.get<AnalyticsReport>(REPORT_KEY(id));
    if (direct) return direct;
    const all = await loadAllReports();
    return all.find((r) => r.id === id || r.slug === id) || null;
  }
  const list = readJSONFile<AnalyticsReport[]>(REPORTS_PATH, []);
  return list.find((r) => r.id === id || r.slug === id) || null;
}

export async function saveReport(report: AnalyticsReport): Promise<void> {
  if (redis) {
    await redis.set(REPORT_KEY(report.id), report);
    return;
  }
  const list = readJSONFile<AnalyticsReport[]>(REPORTS_PATH, []);
  const idx = list.findIndex((r) => r.id === report.id);
  if (idx >= 0) {
    list[idx] = report;
  } else {
    list.push(report);
  }
  writeJSONFile(REPORTS_PATH, list);
}

export async function deleteReport(id: string): Promise<void> {
  if (redis) {
    await redis.del(REPORT_KEY(id));
    return;
  }
  const list = readJSONFile<AnalyticsReport[]>(REPORTS_PATH, []);
  writeJSONFile(REPORTS_PATH, list.filter((r) => r.id !== id));
}

export type ListReportsOptions = {
  channel?: ChannelSlug;
  reportWindow?: ReportWindow;
  status?: ReportStatus | "all";
  publishedOnly?: boolean;
};

async function loadAllReports(): Promise<AnalyticsReport[]> {
  if (redis) {
    const keys = await redis.keys("analytics-report:*");
    const list: AnalyticsReport[] = [];
    for (const key of keys) {
      const r = await redis.get<AnalyticsReport>(key);
      if (r) list.push(r);
    }
    return list;
  }
  return readJSONFile<AnalyticsReport[]>(REPORTS_PATH, []);
}

export async function listReports(
  options: ListReportsOptions = {},
): Promise<AnalyticsReport[]> {
  const all = await loadAllReports();
  const filtered = all.filter((r) => {
    if (options.channel && r.channel !== options.channel) return false;
    if (options.reportWindow && r.reportWindow !== options.reportWindow) return false;
    if (options.publishedOnly && !isPublished(r)) return false;
    if (options.status && options.status !== "all" && r.status !== options.status)
      return false;
    return true;
  });
  return filtered.sort(comparePublishedAtDesc);
}

export async function getLatestPublishedReport(
  channel?: ChannelSlug,
): Promise<AnalyticsReport | null> {
  const list = await listReports({ channel, publishedOnly: true });
  return list[0] ?? null;
}

// 4. Admin Audit Log
export async function logAdminAction(log: AdminAuditLog): Promise<void> {
  try {
    if (redis) {
      await redis.set(`admin-audit:${log.id}`, log);
      return;
    }
    if (isProductionWithoutRedis) {
      console.warn("[admin-audit] Skipping filesystem audit log write in production (Upstash Redis not configured)");
      return;
    }
    const list = readJSONFile<AdminAuditLog[]>(AUDIT_PATH, []);
    list.push(log);
    writeJSONFile(AUDIT_PATH, list);
  } catch (err) {
    console.error("[admin-audit] Failed to write audit log:", err);
  }
}

export async function listAdminAuditLogs(): Promise<AdminAuditLog[]> {
  if (redis) {
    const keys = await redis.keys("admin-audit:*");
    const logs: AdminAuditLog[] = [];
    for (const k of keys) {
      const log = await redis.get<AdminAuditLog>(k);
      if (log) logs.push(log);
    }
    return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return readJSONFile<AdminAuditLog[]>(AUDIT_PATH, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export interface YouTubeContent {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  format: "short" | "long-form";
  topic: "fitness" | "finance" | "business" | "ai" | "creator" | "ugc" | "other";
  videoUrl: string;
  thumbnailUrl: string;
  publishedAt?: string;
  durationSeconds?: number;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

const YOUTUBE_PATH = path.join(process.cwd(), "data", "youtube_content.json");
const YOUTUBE_KEY = (id: string) => `youtube-video:${id}`;

export async function listYouTubeVideos(opts?: {
  publishedOnly?: boolean;
  format?: "short" | "long-form";
  topic?: string;
}): Promise<YouTubeContent[]> {
  let list: YouTubeContent[] = [];
  if (redis) {
    const keys = await redis.keys("youtube-video:*");
    for (const key of keys) {
      const item = await redis.get<YouTubeContent>(key);
      if (item) list.push(item);
    }
  } else {
    list = readJSONFile<YouTubeContent[]>(YOUTUBE_PATH, []);
  }

  if (opts?.publishedOnly) {
    list = list.filter((item) => item.isPublished);
  }
  if (opts?.format) {
    list = list.filter((item) => item.format === opts.format);
  }
  if (opts?.topic && opts.topic !== "all") {
    list = list.filter((item) => item.topic === opts.topic);
  }

  return list.sort((a, b) => {
    if ((a.displayOrder ?? 99) !== (b.displayOrder ?? 99)) {
      return (a.displayOrder ?? 99) - (b.displayOrder ?? 99);
    }
    return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
  });
}

export async function getYouTubeVideo(id: string): Promise<YouTubeContent | null> {
  if (redis) {
    return await redis.get<YouTubeContent>(YOUTUBE_KEY(id));
  }
  const list = readJSONFile<YouTubeContent[]>(YOUTUBE_PATH, []);
  return list.find((item) => item.id === id || item.videoId === id) || null;
}

export async function getYouTubeVideoByVideoId(videoId: string): Promise<YouTubeContent | null> {
  const list = await listYouTubeVideos();
  return list.find((item) => item.videoId === videoId) || null;
}

export async function saveYouTubeVideo(video: YouTubeContent): Promise<YouTubeContent> {
  if (redis) {
    await redis.set(YOUTUBE_KEY(video.id), video);
  } else {
    const list = readJSONFile<YouTubeContent[]>(YOUTUBE_PATH, []);
    const idx = list.findIndex((v) => v.id === video.id);
    if (idx >= 0) {
      list[idx] = video;
    } else {
      list.push(video);
    }
    writeJSONFile(YOUTUBE_PATH, list);
  }
  return video;
}

export async function deleteYouTubeVideo(id: string): Promise<boolean> {
  if (redis) {
    await redis.del(YOUTUBE_KEY(id));
    return true;
  }
  const list = readJSONFile<YouTubeContent[]>(YOUTUBE_PATH, []);
  const filtered = list.filter((v) => v.id !== id);
  writeJSONFile(YOUTUBE_PATH, filtered);
  return true;
}
