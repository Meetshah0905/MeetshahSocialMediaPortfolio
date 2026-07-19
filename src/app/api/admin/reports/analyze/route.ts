import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Admin Session
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: "Unauthorized admin session" }, { status: 401 });
    }

    const { source, period, startDate, endDate, screenshotUrls } = await request.json();

    if (!screenshotUrls || !Array.isArray(screenshotUrls) || screenshotUrls.length === 0) {
      return NextResponse.json({ error: "No screenshot URLs provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Using mock extraction fallback.");
      return NextResponse.json(
        generateMockExtraction(source, period, startDate, endDate, screenshotUrls)
      );
    }

    // 2. Fetch/Read Images and encode in Base64
    const mediaParts = [];
    for (const url of screenshotUrls) {
      try {
        let buffer: Buffer;
        let mimeType = "image/png";

        if (url.startsWith("/uploads/")) {
          // Local filesystem read
          const localPath = path.join(process.cwd(), "public", url);
          buffer = fs.readFileSync(localPath);
          if (url.endsWith(".jpg") || url.endsWith(".jpeg")) mimeType = "image/jpeg";
          if (url.endsWith(".webp")) mimeType = "image/webp";
        } else {
          // External network fetch
          const res = await fetch(url);
          if (!res.ok) continue;
          buffer = Buffer.from(await res.arrayBuffer());
          const cType = res.headers.get("content-type");
          if (cType) mimeType = cType;
        }

        mediaParts.push({
          inlineData: {
            data: buffer.toString("base64"),
            mimeType,
          },
        });
      } catch (err) {
        console.error(`Failed to load screenshot at ${url}`, err);
      }
    }

    if (mediaParts.length === 0) {
      return NextResponse.json({ error: "Failed to read any of the provided screenshot files" }, { status: 400 });
    }

    // 3. Setup Gemini Client SDK
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const isYouTube = source === "youtube_main";

    const promptText = `
You are an expert data extraction assistant. Analyze these screenshots from a social media analytics dashboard for the source channel: "${source}" over the period: "${period}" (${startDate} to ${endDate}).

Extract the following information and return ONLY a valid JSON object matching the schema below.
IMPORTANT: Set missing or unreadable fields to null. DO NOT guess or fabricate numbers.

JSON Structure:
{
  "metrics": {
    // For Instagram (set to null if YouTube)
    "followers": number | null,
    "followerChange": number | null,
    "reach": number | null,
    "impressions": number | null,
    "profileVisits": number | null,
    "accountsEngaged": number | null,
    "contentInteractions": number | null,
    "reelPlays": number | null,
    "likes": number | null,
    "comments": number | null,
    "shares": number | null,
    "saves": number | null,
    "engagementRate": number | null,
    
    // For YouTube (set to null if Instagram)
    "subscribers": number | null,
    "subscriberChange": number | null,
    "views": number | null,
    "uniqueViewers": number | null,
    "watchTimeHours": number | null,
    "averageViewDurationSeconds": number | null,
    "impressionsClickThroughRate": number | null,
    "returningViewers": number | null,
    "newViewers": number | null
  },
  "demographics": {
    "gender": {
      "male": number | null (percentage e.g. 72.5),
      "female": number | null,
      "otherOrUnspecified": number | null
    },
    "ageRanges": [
      { "label": "18-24", "percentage": number },
      { "label": "25-34", "percentage": number },
      { "label": "35-44", "percentage": number }
    ],
    "topCities": [
      { "name": "string", "percentage": number | null }
    ],
    "topCountries": [
      { "name": "string", "percentage": number | null }
    ]
  },
  "series": [
    {
      "metric": "reach" | "views" | "impressions",
      "points": [
        { "label": "Date or range label", "value": number }
      ]
    }
  ],
  "topContent": [
    {
      "id": "unique-id",
      "title": "video title or content snippet",
      "mediaType": "reel" | "post" | "story" | "video" | "unknown",
      "views": number | null,
      "likes": number | null,
      "comments": number | null,
      "shares": number | null,
      "saves": number | null
    }
  ],
  "confidence": "high" | "medium" | "low",
  "warnings": ["string"],
  "unreadableFields": ["string"]
}

Ensure all percentages sum close to 100 where applicable. Return only the JSON object, with no markdown tags.
`;

    // 4. Invoke model
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [promptText, ...mediaParts],
      config: {
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "{}";
    const cleanedJson = JSON.parse(outputText.trim());

    // Map sourceFileIds evidence indexing (§19)
    const reportData = {
      persona: source,
      period: {
        type: period,
        startDate,
        endDate,
        label: `${startDate} to ${endDate}`,
        days: 30, // Mock duration
      },
      source: {
        type: "instagram-insights-screenshots" as const,
        screenshotCount: screenshotUrls.length,
        uploadedAt: new Date().toISOString(),
        screenshotUrls,
      },
      metrics: cleanedJson.metrics,
      demographics: cleanedJson.demographics,
      series: cleanedJson.series || [],
      topContent: cleanedJson.topContent || [],
      extraction: {
        confidence: cleanedJson.confidence || "high",
        warnings: cleanedJson.warnings || [],
        unreadableFields: cleanedJson.unreadableFields || [],
      },
      creatorNotes: `AI-extracted report from ${screenshotUrls.length} screenshot files.`,
      status: "draft",
    };

    return NextResponse.json(reportData);
  } catch (err: any) {
    console.error("Gemini analyze screenshot API failed", err);
    return NextResponse.json({ error: "Failed to extract screenshot metrics data" }, { status: 500 });
  }
}

// Fallback Mock generator for offline / sandbox execution
function generateMockExtraction(
  source: string,
  period: string,
  startDate: string,
  endDate: string,
  screenshotUrls: string[]
) {
  const isYouTube = source === "youtube_main";

  return {
    persona: source,
    period: {
      type: period,
      startDate,
      endDate,
      label: `${startDate} to ${endDate}`,
      days: 30,
    },
    source: {
      type: "instagram-insights-screenshots" as const,
      screenshotCount: screenshotUrls.length,
      uploadedAt: new Date().toISOString(),
      screenshotUrls,
    },
    metrics: isYouTube
      ? {
          subscribers: 19800,
          subscriberChange: 100,
          views: 48000,
          uniqueViewers: 34000,
          watchTimeHours: 1300,
          averageViewDurationSeconds: 98,
          impressionsClickThroughRate: 5.1,
          returningViewers: 15000,
          newViewers: 19000,
          likes: 3300,
          comments: 480,
          shares: 1300,
        }
      : {
          followers: source === "instagram_fitness" ? 12000 : 15200,
          followerChange: 100,
          reach: 25000,
          impressions: 49000,
          profileVisits: 1300,
          accountsEngaged: 1900,
          contentInteractions: 3200,
          reelPlays: 19000,
          likes: 1300,
          comments: 220,
          shares: 700,
          saves: 1050,
          engagementRate: 3.3,
        },
    demographics: {
      gender: {
        male: 73,
        female: 24,
        otherOrUnspecified: 3,
      },
      ageRanges: [
        { label: "18-24", percentage: 39 },
        { label: "25-34", percentage: 47 },
        { label: "35-44", percentage: 10 },
        { label: "45+", percentage: 4 },
      ],
      topCities: [
        { name: "Ahmedabad", percentage: 30 },
        { name: "Mumbai", percentage: 24 },
        { name: "Delhi NCR", percentage: 18 },
      ],
      topCountries: [
        { name: "India", percentage: 95 },
        { name: "United States", percentage: 3 },
      ],
    },
    series: [
      {
        metric: isYouTube ? "views" : "reach",
        points: [
          { date: null, label: "Week 1", value: 10000 },
          { date: null, label: "Week 2", value: 12000 },
          { date: null, label: "Week 3", value: 15000 },
          { date: null, label: "Week 4", value: 11000 },
        ],
      },
    ],
    topContent: [
      {
        id: "mock-clip-top",
        title: "Mock Top Performing Video Post",
        mediaType: isYouTube ? "video" : "reel",
        views: 15000,
        likes: 1100,
        comments: 130,
        shares: 340,
        saves: 450,
      },
    ],
    extraction: {
      confidence: "high" as const,
      warnings: ["Simulated local mock analysis because GEMINI_API_KEY is not configured"],
      unreadableFields: [],
    },
    creatorNotes: "Simulated extraction preview.",
    status: "draft",
  };
}
