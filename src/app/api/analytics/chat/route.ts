import { NextRequest, NextResponse } from "next/server";
import { listReports, listPlatformProfiles } from "@/lib/storage/db";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Using mock chatbot handler.");
      return NextResponse.json({
        text: handleMockChatResponse(messages[messages.length - 1].content),
      });
    }

    // 1. Load Live Platform Profiles & Published Reports
    const profiles = await listPlatformProfiles();
    const allReports = await listReports();
    const publishedReports = allReports.filter((r) => r.status === "published");

    // 2. Format Context Blocks
    const profilesContext = profiles
      .map(
        (p) =>
          `- ${p.displayName} (${p.handle || "no handle"}): ${p.currentValue.toLocaleString()} ${
            p.primaryMetric
          } (updated ${new Date(p.updatedAt).toLocaleDateString()})`
      )
      .join("\n");

    const reportsContext = publishedReports
      .map((r) => {
        const isYouTube = r.persona === "youtube_main";
        return `
Report ID: ${r.id}
Source Channel: ${r.persona}
Period: ${r.period.label} (${r.period.startDate} to ${r.period.endDate})
Metrics:
${
  isYouTube
    ? `- Subscribers: ${r.metrics.subscribers?.toLocaleString() || "null"}
- Subscriber Change: ${r.metrics.subscriberChange?.toLocaleString() || "null"}
- Views: ${r.metrics.views?.toLocaleString() || "null"}
- Watch Time (Hours): ${r.metrics.watchTimeHours?.toLocaleString() || "null"}
- Avg View Duration (Sec): ${r.metrics.averageViewDurationSeconds || "null"}
- Click-Through Rate %: ${r.metrics.impressionsClickThroughRate || "null"}`
    : `- Followers: ${r.metrics.followers?.toLocaleString() || "null"}
- Follower Change: ${r.metrics.followerChange?.toLocaleString() || "null"}
- Reach: ${r.metrics.reach?.toLocaleString() || "null"}
- Impressions: ${r.metrics.impressions?.toLocaleString() || "null"}
- Engagement Rate %: ${r.metrics.engagementRate || "null"}
- Saves: ${r.metrics.saves?.toLocaleString() || "null"}`
}
Demographics:
- Gender: Male: ${r.demographics.gender.male || "0"}%, Female: ${r.demographics.gender.female || "0"}%
- Age Ranges: ${r.demographics.ageRanges.map((a) => `${a.label}: ${a.percentage}%`).join(", ")}
- Top Cities: ${r.demographics.topCities.map((c) => `${c.name}: ${c.percentage}%`).join(", ")}
- Top Countries: ${r.demographics.topCountries.map((c) => `${c.name}: ${c.percentage}%`).join(", ")}
Top Performing Content:
${r.topContent
  .map(
    (c) =>
      `  * Title: "${c.title}" (${c.mediaType}) - Views: ${c.views?.toLocaleString() || "null"}, Likes: ${
        c.likes?.toLocaleString() || "null"
      }`
  )
  .join("\n")}
`;
      })
      .join("\n---\n");

    const systemPrompt = `
You are Meet Shah's Analytics Assistant. You have access to the following verified platform metrics and published report archives.
All statistics here are verified. If a user asks a question, answer it using ONLY this data. If the answer is not in this data, state that you do not have verified reports for that query.

Do not fabricate metrics, names, dates, or details. Do not use general assumptions.
Every quantitative answer or comparison MUST include a source citation at the end, formatted as:
"Source: [Channel/Platform], [Report Period]"
e.g. "Source: Instagram Fitness, June 2026"

Current Live Platform Profiles:
${profilesContext}

Published Reports Archives:
${reportsContext}
`;

    // 3. Setup Gemini Generative SDK
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Format chat history
    const geminiContents = [
      { role: "system" as const, parts: [{ text: systemPrompt }] },
      ...messages.map((m) => ({
        role: (m.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await ai.models.generateContent({
      model: modelName,
      contents: geminiContents,
    });

    return NextResponse.json({
      text: response.text || "I was unable to retrieve a response from Gemini.",
    });
  } catch (err: any) {
    console.error("Chatbot API failed", err);
    return NextResponse.json({ error: "Chatbot engine failed" }, { status: 500 });
  }
}

// Fallback Mock generator for offline / sandbox execution (§23)
function handleMockChatResponse(query: string): string {
  const q = query.toLowerCase();
  
  if (q.includes("fitness") && q.includes("views")) {
    return "In the latest Instagram Fitness report for June 2026, the channel recorded 18,500 reel plays.\n\nSource: Instagram Fitness, June 2026";
  }
  if (q.includes("finance") && q.includes("followers")) {
    return "The Instagram Finance profile currently has 15,100 published followers.\n\nSource: Instagram Finance Profile, Live Data";
  }
  if (q.includes("compare")) {
    return "Comparing the June 2026 reports:\n- Instagram Fitness: 11,900 followers (+450 change), 24,500 reach.\n- Instagram Finance: 15,100 followers (+680 change), 32,000 reach.\n\nSource: Instagram Fitness & Finance, June 2026";
  }
  if (q.includes("youtube") && q.includes("subscribers")) {
    return "YouTube Main has 19,700 subscribers, with 840 subscriber additions over the June 2026 reporting period.\n\nSource: YouTube Main, June 2026";
  }
  
  return "I have access to Meet Shah's verified Q2 2026 analytics reports for Instagram Fitness, Instagram Finance, and YouTube. Ask me about subscriber counts, engagement metrics, or top content views.\n\nSource: Analytics Archives, Q2 2026";
}
