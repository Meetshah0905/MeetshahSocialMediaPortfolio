import { NextRequest, NextResponse } from "next/server";
import { saveReport, listReports, getLatestReport, AnalyticsSource, AnalyticsReport } from "@/lib/storage/db";
import { z } from "zod";

const reportSchema = z.object({
  persona: z.enum(["instagram_fitness", "instagram_finance", "youtube_main"]),
  period: z.object({
    type: z.enum(["30d", "90d", "custom"]),
    startDate: z.string(),
    endDate: z.string(),
    label: z.string(),
    days: z.number(),
  }),
  source: z.object({
    type: z.literal("instagram-insights-screenshots"),
    screenshotCount: z.number(),
    uploadedAt: z.string(),
    screenshotUrls: z.array(z.string()).optional(),
  }),
  metrics: z.object({
    followers: z.number().nullable().optional(),
    followerChange: z.number().nullable().optional(),
    reach: z.number().nullable().optional(),
    impressions: z.number().nullable().optional(),
    profileVisits: z.number().nullable().optional(),
    accountsEngaged: z.number().nullable().optional(),
    contentInteractions: z.number().nullable().optional(),
    reelPlays: z.number().nullable().optional(),
    likes: z.number().nullable().optional(),
    comments: z.number().nullable().optional(),
    shares: z.number().nullable().optional(),
    saves: z.number().nullable().optional(),
    engagementRate: z.number().nullable().optional(),
    storyViews: z.number().nullable().optional(),
    
    // YouTube
    subscribers: z.number().nullable().optional(),
    subscriberChange: z.number().nullable().optional(),
    views: z.number().nullable().optional(),
    uniqueViewers: z.number().nullable().optional(),
    watchTimeHours: z.number().nullable().optional(),
    averageViewDurationSeconds: z.number().nullable().optional(),
    impressionsClickThroughRate: z.number().nullable().optional(),
    returningViewers: z.number().nullable().optional(),
    newViewers: z.number().nullable().optional(),
  }),
  demographics: z.object({
    gender: z.object({
      male: z.number().nullable(),
      female: z.number().nullable(),
      otherOrUnspecified: z.number().nullable(),
    }),
    ageRanges: z.array(
      z.object({
        label: z.string(),
        percentage: z.number(),
      })
    ),
    topCities: z.array(
      z.object({
        name: z.string(),
        percentage: z.number().nullable(),
      })
    ),
    topCountries: z.array(
      z.object({
        name: z.string(),
        percentage: z.number().nullable(),
      })
    ),
  }),
  series: z.array(
    z.object({
      metric: z.enum(["followers", "subscribers", "reach", "impressions", "views", "interactions"]),
      points: z.array(
        z.object({
          date: z.string().nullable(),
          label: z.string(),
          value: z.number(),
        })
      ),
    })
  ),
  topContent: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      mediaType: z.enum(["reel", "post", "story", "video", "unknown"]),
      url: z.string().nullable(),
      thumbnail: z.string().nullable(),
      views: z.number().nullable(),
      reach: z.number().nullable(),
      likes: z.number().nullable(),
      comments: z.number().nullable(),
      shares: z.number().nullable(),
      saves: z.number().nullable(),
    })
  ),
  creatorNotes: z.string(),
  status: z.enum(["draft", "published"]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get("persona") as AnalyticsSource | null;
    const latest = searchParams.get("latest") === "true";

    if (latest && persona) {
      const report = await getLatestReport(persona);
      return NextResponse.json(report);
    }

    const list = await listReports(persona || undefined);
    return NextResponse.json(list);
  } catch (err: any) {
    console.error("GET reports failed", err);
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request schema
    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid report data schema", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const reportId = `${data.persona}-${data.period.type}-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newReport: AnalyticsReport = {
      ...data,
      id: reportId,
      schemaVersion: 1,
      extraction: {
        confidence: "high" as const,
        warnings: [],
        unreadableFields: [],
      },
      createdAt: timestamp,
      updatedAt: timestamp,
      publishedAt: data.status === "published" ? timestamp : null,
    };

    await saveReport(newReport);

    return NextResponse.json(
      { success: true, reportId: newReport.id, report: newReport },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Failed to publish report", err);
    return NextResponse.json({ error: "Failed to publish report" }, { status: 500 });
  }
}
