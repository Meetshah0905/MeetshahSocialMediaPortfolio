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
    currentValue: 0,
    currentAudienceCount: 0,
    manualOverrideEnabled: false,
    manualAudienceCount: null,
    manualAudienceOverride: null,
    lastApiAudienceCount: null,
    previousValue: null,
    effectiveAt: now,
    updatedAt: now,
    updatedBy: "system-seed",
    published: false,
    isPublished: false,
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
  ),
  makeSeedProfile(
    "instagram_finance",
    "instagram-finance",
    "instagram",
    "Instagram Finance",
    "@meet.fitfix",
    "https://www.instagram.com/meet.fitfix/",
    "followers",
  ),
  makeSeedProfile(
    "youtube_main",
    "youtube-main",
    "youtube",
    "YouTube Main",
    "Meet Shah",
    "https://www.youtube.com/@meetshah",
    "subscribers",
  ),
];

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
        fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
      }
      return seed;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch {
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
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
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
    return await redis.get<AnalyticsReport>(REPORT_KEY(id));
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
  if (redis) {
    await redis.set(`admin-audit:${log.id}`, log);
    return;
  }
  const list = readJSONFile<AdminAuditLog[]>(AUDIT_PATH, []);
  list.push(log);
  writeJSONFile(AUDIT_PATH, list);
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

