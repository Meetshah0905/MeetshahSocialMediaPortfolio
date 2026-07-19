import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

// Core Sources
export type AnalyticsSource = "instagram_fitness" | "instagram_finance" | "youtube_main";

// Platform Metrics Profile CMS (§13)
export type PlatformProfile = {
  id: "instagram_fitness" | "instagram_finance" | "youtube_main";
  platform: "instagram" | "youtube";
  displayName: string;
  handle: string | null;
  url: string | null;
  primaryMetric: "followers" | "subscribers";
  currentValue: number;
  previousValue: number | null;
  effectiveAt: string;
  updatedAt: string;
  updatedBy: string;
  published: boolean;
};

// Platform Profile Snapshots History (§13)
export type PlatformMetricSnapshot = {
  id: string;
  profileId: PlatformProfile["id"];
  metric: "followers" | "subscribers";
  value: number;
  effectiveAt: string;
  createdAt: string;
  source: "manual-admin-update" | "published-report";
  sourceReportId: string | null;
};

// Analytics Report Schemas (§20, §21)
export type AnalyticsReport = {
  id: string;
  schemaVersion: number;
  persona: AnalyticsSource;
  period: {
    type: "30d" | "90d" | "custom";
    startDate: string;
    endDate: string;
    label: string;
    days: number;
  };
  source: {
    type: "instagram-insights-screenshots";
    screenshotCount: number;
    uploadedAt: string;
    screenshotUrls?: string[]; // Vercel Blob signed private URLs (§17)
  };
  metrics: {
    // Instagram specific
    followers?: number | null;
    followerChange?: number | null;
    reach?: number | null;
    impressions?: number | null;
    profileVisits?: number | null;
    accountsEngaged?: number | null;
    contentInteractions?: number | null;
    reelPlays?: number | null;
    likes?: number | null;
    comments?: number | null;
    shares?: number | null;
    saves?: number | null;
    engagementRate?: number | null;
    storyViews?: number | null;

    // YouTube specific
    subscribers?: number | null;
    subscriberChange?: number | null;
    views?: number | null;
    uniqueViewers?: number | null;
    watchTimeHours?: number | null;
    averageViewDurationSeconds?: number | null;
    impressionsClickThroughRate?: number | null;
    returningViewers?: number | null;
    newViewers?: number | null;
  };
  demographics: {
    gender: {
      male: number | null;
      female: number | null;
      otherOrUnspecified: number | null;
    };
    ageRanges: Array<{
      label: string;
      percentage: number;
    }>;
    topCities: Array<{
      name: string;
      percentage: number | null;
    }>;
    topStates?: Array<{
      name: string;
      percentage: number | null;
    }>;
    topCountries: Array<{
      name: string;
      percentage: number | null;
    }>;
  };
  series: Array<{
    metric: "followers" | "subscribers" | "reach" | "impressions" | "views" | "interactions";
    points: Array<{
      date: string | null;
      label: string;
      value: number;
    }>;
  }>;
  topContent: Array<{
    id: string;
    title: string;
    mediaType: "reel" | "post" | "story" | "video" | "unknown";
    url: string | null;
    thumbnail: string | null;
    views: number | null;
    reach: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    saves: number | null;
  }>;
  extraction: {
    confidence: "high" | "medium" | "low";
    warnings: string[];
    unreadableFields: string[];
  };
  creatorNotes: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

// Initialize Upstash client if keys are present
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
const SNAPSHOTS_PATH = path.join(process.cwd(), "data", "snapshots.json");

// Seeds
const SEED_PROFILES: PlatformProfile[] = [
  {
    id: "instagram_fitness",
    platform: "instagram",
    displayName: "Instagram Fitness",
    handle: "@meetsofficial",
    url: "https://www.instagram.com/meetsofficial/",
    primaryMetric: "followers",
    currentValue: 11900,
    previousValue: null,
    effectiveAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    updatedBy: "system-seed",
    published: true,
  },
  {
    id: "instagram_finance",
    platform: "instagram",
    displayName: "Instagram Finance",
    handle: "@meet.fitfix",
    url: "https://www.instagram.com/meet.fitfix/",
    primaryMetric: "followers",
    currentValue: 15100,
    previousValue: null,
    effectiveAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    updatedBy: "system-seed",
    published: true,
  },
  {
    id: "youtube_main",
    platform: "youtube",
    displayName: "YouTube Main",
    handle: "YouTube",
    url: null, // Hidden until real URL added (§13)
    primaryMetric: "subscribers",
    currentValue: 19700,
    previousValue: null,
    effectiveAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-01T00:00:00Z",
    updatedBy: "system-seed",
    published: true,
  },
];

const SEED_SNAPSHOTS: PlatformMetricSnapshot[] = [
  {
    id: "snap-fitness-seed",
    profileId: "instagram_fitness",
    metric: "followers",
    value: 11900,
    effectiveAt: "2026-07-01T00:00:00Z",
    createdAt: "2026-07-01T00:00:00Z",
    source: "manual-admin-update",
    sourceReportId: null,
  },
  {
    id: "snap-finance-seed",
    profileId: "instagram_finance",
    metric: "followers",
    value: 15100,
    effectiveAt: "2026-07-01T00:00:00Z",
    createdAt: "2026-07-01T00:00:00Z",
    source: "manual-admin-update",
    sourceReportId: null,
  },
  {
    id: "snap-youtube-seed",
    profileId: "youtube_main",
    metric: "subscribers",
    value: 19700,
    effectiveAt: "2026-07-01T00:00:00Z",
    createdAt: "2026-07-01T00:00:00Z",
    source: "manual-admin-update",
    sourceReportId: null,
  },
];

const SEED_REPORTS: AnalyticsReport[] = [
  {
    id: "fitness-q2-2026",
    schemaVersion: 1,
    persona: "instagram_fitness",
    period: {
      type: "30d",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      label: "June 2026",
      days: 30,
    },
    source: {
      type: "instagram-insights-screenshots",
      screenshotCount: 4,
      uploadedAt: "2026-07-01T12:00:00Z",
    },
    metrics: {
      followers: 11900,
      followerChange: 450,
      reach: 24500,
      impressions: 48000,
      profileVisits: 1200,
      accountsEngaged: 1800,
      contentInteractions: 3100,
      reelPlays: 18500,
      likes: 1200,
      comments: 210,
      shares: 680,
      saves: 1010,
      engagementRate: 3.2,
    },
    demographics: {
      gender: {
        male: 72,
        female: 25,
        otherOrUnspecified: 3,
      },
      ageRanges: [
        { label: "18-24", percentage: 38 },
        { label: "25-34", percentage: 46 },
        { label: "35-44", percentage: 11 },
        { label: "45+", percentage: 5 },
      ],
      topCities: [
        { name: "Ahmedabad", percentage: 28 },
        { name: "Mumbai", percentage: 22 },
        { name: "Delhi NCR", percentage: 16 },
        { name: "Bangalore", percentage: 12 },
      ],
      topCountries: [
        { name: "India", percentage: 94 },
        { name: "United States", percentage: 3 },
        { name: "Others", percentage: 3 },
      ],
    },
    series: [
      {
        metric: "reach",
        points: [
          { date: "2026-06-05", label: "Jun 05", value: 4500 },
          { date: "2026-06-12", label: "Jun 12", value: 6800 },
          { date: "2026-06-19", label: "Jun 19", value: 7200 },
          { date: "2026-06-26", label: "Jun 26", value: 6000 },
        ],
      },
    ],
    topContent: [
      {
        id: "reel-squat-form",
        title: "Technique Fix: The Proper Squat Depth",
        mediaType: "reel",
        url: "https://www.instagram.com/p/squatform",
        thumbnail: null,
        views: 8500,
        reach: 7200,
        likes: 620,
        comments: 88,
        shares: 240,
        saves: 410,
      },
    ],
    extraction: {
      confidence: "high",
      warnings: [],
      unreadableFields: [],
    },
    creatorNotes: "Steady organic growth driven by the Squat Depth Technique breakdown reel.",
    status: "published",
    createdAt: "2026-07-01T12:00:00Z",
    updatedAt: "2026-07-01T12:00:00Z",
    publishedAt: "2026-07-01T12:00:00Z",
  },
  {
    id: "finance-q2-2026",
    schemaVersion: 1,
    persona: "instagram_finance",
    period: {
      type: "30d",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      label: "June 2026",
      days: 30,
    },
    source: {
      type: "instagram-insights-screenshots",
      screenshotCount: 4,
      uploadedAt: "2026-07-01T12:30:00Z",
    },
    metrics: {
      followers: 15100,
      followerChange: 680,
      reach: 32000,
      impressions: 61000,
      profileVisits: 1900,
      accountsEngaged: 2500,
      contentInteractions: 4200,
      reelPlays: 24000,
      likes: 1800,
      comments: 320,
      shares: 910,
      saves: 1170,
      engagementRate: 2.9,
    },
    demographics: {
      gender: {
        male: 68,
        female: 28,
        otherOrUnspecified: 4,
      },
      ageRanges: [
        { label: "18-24", percentage: 34 },
        { label: "25-34", percentage: 48 },
        { label: "35-44", percentage: 13 },
        { label: "45+", percentage: 5 },
      ],
      topCities: [
        { name: "Mumbai", percentage: 26 },
        { name: "Ahmedabad", percentage: 20 },
        { name: "Delhi NCR", percentage: 19 },
        { name: "Bangalore", percentage: 15 },
      ],
      topCountries: [
        { name: "India", percentage: 91 },
        { name: "United Arab Emirates", percentage: 4 },
        { name: "Others", percentage: 5 },
      ],
    },
    series: [
      {
        metric: "reach",
        points: [
          { date: "2026-06-05", label: "Jun 05", value: 6100 },
          { date: "2026-06-12", label: "Jun 12", value: 8900 },
          { date: "2026-06-19", label: "Jun 19", value: 9200 },
          { date: "2026-06-26", label: "Jun 26", value: 7800 },
        ],
      },
    ],
    topContent: [
      {
        id: "reel-mutual-funds",
        title: "Mutual Funds vs Stocks for Beginners",
        mediaType: "reel",
        url: "https://www.instagram.com/p/mutualfunds",
        thumbnail: null,
        views: 12000,
        reach: 9800,
        likes: 920,
        comments: 145,
        shares: 380,
        saves: 520,
      },
    ],
    extraction: {
      confidence: "high",
      warnings: [],
      unreadableFields: [],
    },
    creatorNotes: "Strong audience saves on the Mutual Funds explanation reel.",
    status: "published",
    createdAt: "2026-07-01T12:30:00Z",
    updatedAt: "2026-07-01T12:30:00Z",
    publishedAt: "2026-07-01T12:30:00Z",
  },
  {
    id: "youtube-q2-2026",
    schemaVersion: 1,
    persona: "youtube_main",
    period: {
      type: "30d",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      label: "June 2026",
      days: 30,
    },
    source: {
      type: "instagram-insights-screenshots",
      screenshotCount: 3,
      uploadedAt: "2026-07-01T12:45:00Z",
    },
    metrics: {
      subscribers: 19700,
      subscriberChange: 840,
      views: 45000,
      uniqueViewers: 32000,
      watchTimeHours: 1200,
      averageViewDurationSeconds: 96,
      impressionsClickThroughRate: 4.8,
      returningViewers: 14000,
      newViewers: 18000,
      likes: 3100,
      comments: 450,
      shares: 1200,
    },
    demographics: {
      gender: {
        male: 75,
        female: 22,
        otherOrUnspecified: 3,
      },
      ageRanges: [
        { label: "18-24", percentage: 40 },
        { label: "25-34", percentage: 45 },
        { label: "35-44", percentage: 10 },
        { label: "45+", percentage: 5 },
      ],
      topCities: [
        { name: "Mumbai", percentage: 28 },
        { name: "Ahmedabad", percentage: 22 },
        { name: "Delhi NCR", percentage: 17 },
        { name: "Bangalore", percentage: 14 },
      ],
      topCountries: [
        { name: "India", percentage: 93 },
        { name: "United States", percentage: 4 },
        { name: "Others", percentage: 3 },
      ],
    },
    series: [
      {
        metric: "views",
        points: [
          { date: "2026-06-05", label: "Jun 05", value: 8500 },
          { date: "2026-06-12", label: "Jun 12", value: 11000 },
          { date: "2026-06-19", label: "Jun 19", value: 14200 },
          { date: "2026-06-26", label: "Jun 26", value: 11300 },
        ],
      },
    ],
    topContent: [
      {
        id: "video-beginner-wealth",
        title: "How I Built My First Portfolio at 20",
        mediaType: "video",
        url: "https://www.youtube.com/watch?v=wealth20",
        thumbnail: null,
        views: 18000,
        reach: null,
        likes: 1200,
        comments: 185,
        shares: 450,
        saves: null,
      },
    ],
    extraction: {
      confidence: "high",
      warnings: [],
      unreadableFields: [],
    },
    creatorNotes: "Strong viewership growth on the portfolio builder guide.",
    status: "published",
    createdAt: "2026-07-01T12:45:00Z",
    updatedAt: "2026-07-01T12:45:00Z",
    publishedAt: "2026-07-01T12:45:00Z",
  },
];

// Helper to load files
function readJSONFile<T>(filePath: string, seed: T): T {
  try {
    const parentDir = path.dirname(filePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
      return seed;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (err) {
    return seed;
  }
}

function writeJSONFile<T>(filePath: string, data: T) {
  try {
    const parentDir = path.dirname(filePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Write failed to ${filePath}`, err);
  }
}

// 1. Platform Profiles CRUD
export async function getPlatformProfile(
  id: PlatformProfile["id"]
): Promise<PlatformProfile | null> {
  if (redis) {
    return await redis.get<PlatformProfile>(`platform-profile:${id}`);
  }
  const list = readJSONFile(PROFILES_PATH, SEED_PROFILES);
  return list.find((p) => p.id === id) || null;
}

export async function savePlatformProfile(profile: PlatformProfile): Promise<void> {
  if (redis) {
    await redis.set(`platform-profile:${profile.id}`, profile);
    return;
  }
  const list = readJSONFile(PROFILES_PATH, SEED_PROFILES);
  const idx = list.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    list[idx] = profile;
  } else {
    list.push(profile);
  }
  writeJSONFile(PROFILES_PATH, list);
}

export async function listPlatformProfiles(): Promise<PlatformProfile[]> {
  if (redis) {
    const keys = await redis.keys("platform-profile:*");
    const list: PlatformProfile[] = [];
    for (const k of keys) {
      const p = await redis.get<PlatformProfile>(k);
      if (p) list.push(p);
    }
    return list;
  }
  return readJSONFile(PROFILES_PATH, SEED_PROFILES);
}

// 2. Metric Snapshot history
export async function getPlatformMetricHistory(
  profileId: PlatformProfile["id"]
): Promise<PlatformMetricSnapshot[]> {
  if (redis) {
    const keys = await redis.keys(`platform-history:${profileId}:*`);
    const list: PlatformMetricSnapshot[] = [];
    for (const k of keys) {
      const s = await redis.get<PlatformMetricSnapshot>(k);
      if (s) list.push(s);
    }
    return list.sort(
      (a, b) => new Date(b.effectiveAt).getTime() - new Date(a.effectiveAt).getTime()
    );
  }
  const list = readJSONFile(SNAPSHOTS_PATH, SEED_SNAPSHOTS);
  return list
    .filter((s) => s.profileId === profileId)
    .sort((a, b) => new Date(b.effectiveAt).getTime() - new Date(a.effectiveAt).getTime());
}

export async function savePlatformMetricSnapshot(
  snapshot: PlatformMetricSnapshot
): Promise<void> {
  if (redis) {
    await redis.set(`platform-history:${snapshot.profileId}:${snapshot.id}`, snapshot);
    return;
  }
  const list = readJSONFile(SNAPSHOTS_PATH, SEED_SNAPSHOTS);
  list.push(snapshot);
  writeJSONFile(SNAPSHOTS_PATH, list);
}

// 3. Analytics Report CRUD
export async function getReport(id: string): Promise<AnalyticsReport | null> {
  if (redis) {
    return await redis.get<AnalyticsReport>(`analytics-report:${id}`);
  }
  const list = readJSONFile(REPORTS_PATH, SEED_REPORTS);
  return list.find((r) => r.id === id) || null;
}

export async function saveReport(report: AnalyticsReport): Promise<void> {
  if (redis) {
    await redis.set(`analytics-report:${report.id}`, report);
    if (report.status === "published") {
      await redis.lpush(`analytics-index:${report.persona}`, report.id);
      await redis.set(`analytics-latest:${report.persona}`, report);
    }
    return;
  }
  const list = readJSONFile(REPORTS_PATH, SEED_REPORTS);
  const idx = list.findIndex((r) => r.id === report.id);
  if (idx >= 0) {
    list[idx] = report;
  } else {
    list.push(report);
  }
  writeJSONFile(REPORTS_PATH, list);
}

export async function listReports(source?: AnalyticsSource): Promise<AnalyticsReport[]> {
  if (redis) {
    const keys = await redis.keys("analytics-report:*");
    const reports: AnalyticsReport[] = [];
    for (const key of keys) {
      const r = await redis.get<AnalyticsReport>(key);
      if (r) {
        if (!source || r.persona === source) {
          reports.push(r);
        }
      }
    }
    return reports.sort(
      (a, b) => new Date(b.period.endDate).getTime() - new Date(a.period.endDate).getTime()
    );
  }
  const list = readJSONFile(REPORTS_PATH, SEED_REPORTS);
  const filtered = source ? list.filter((r) => r.persona === source) : list;
  return filtered.sort(
    (a, b) => new Date(b.period.endDate).getTime() - new Date(a.period.endDate).getTime()
  );
}

export async function getLatestReport(source: AnalyticsSource): Promise<AnalyticsReport | null> {
  if (redis) {
    return await redis.get<AnalyticsReport>(`analytics-latest:${source}`);
  }
  const list = await listReports(source);
  const published = list.filter((r) => r.status === "published");
  return published[0] || null;
}
