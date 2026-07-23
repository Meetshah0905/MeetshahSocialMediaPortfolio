import { NextRequest, NextResponse } from "next/server";
import {
  listReports,
  listPlatformProfiles,
  CHANNEL_DISPLAY,
  formatReportWindow,
} from "@/lib/storage/db";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { GoogleGenAI } from "@google/genai";

/**
 * Public analytics chatbot.
 *
 * With the reviewed-PDF workflow the site no longer holds the extracted
 * metrics that used to power this bot. The assistant now points visitors at
 * the published PDFs and answers only from the metadata that survives in
 * storage (channel, dates, summary, highlights, optional headline metrics).
 * If a question can't be answered from that metadata it directs the user to
 * open the relevant PDF — it must never invent numbers.
 */

export async function POST(request: NextRequest) {
  try {
    if (!(await checkRateLimit("chat", request))) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429 },
      );
    }

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "The analytics assistant is temporarily unavailable. Published reports remain accessible.",
        },
        { status: 503 },
      );
    }

    const profiles = (await listPlatformProfiles()).filter(
      (p) => p.published || p.isPublished,
    );
    const publishedReports = await listReports({ publishedOnly: true });

    const profilesContext = profiles
      .map(
        (p) =>
          `- ${p.displayName} (${p.handle || "no handle"}): ${p.currentValue.toLocaleString()} ${
            p.primaryMetric
          } (updated ${new Date(p.updatedAt).toLocaleDateString()})`,
      )
      .join("\n");

    const reportsContext = publishedReports
      .map((r) => {
        const metrics = r.metrics ?? {};
        const metricLines = Object.entries(metrics)
          .filter(([, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `  - ${k}: ${typeof v === "number" ? v.toLocaleString() : v}`)
          .join("\n");
        const highlights = (r.highlights ?? []).map((h) => `  * ${h}`).join("\n");
        return `Report ID: ${r.id}
Channel: ${CHANNEL_DISPLAY[r.channel].name} (${CHANNEL_DISPLAY[r.channel].handle})
Window: ${formatReportWindow(r.reportWindow)}
Period: ${r.periodStart} to ${r.periodEnd}
Title: ${r.title}
Summary: ${r.executiveSummary ?? "(none provided)"}
Highlights:
${highlights || "  (none provided)"}
Headline metrics:
${metricLines || "  (none provided)"}
Detailed report: /analytics/reports/${r.slug}`;
      })
      .join("\n---\n");

    const systemPrompt = `You are Meet Shah's Analytics Assistant. Answer questions using ONLY the metadata below, which comes from published PDF reports on this site. The full analysis lives inside the PDFs; you do not have access to their contents.

Rules:
- Never fabricate a number, date, or highlight that isn't in the metadata.
- If a question needs data that isn't listed, say so and direct the visitor to the linked PDF (e.g. "Open the PDF for details: /analytics/reports/<slug>").
- Cite the channel and reporting period after any quantitative answer, e.g. "Source: Instagram Fitness, 1 Jul – 30 Jul 2026".
- Keep replies short, plain, and friendly.

Current live platform profiles:
${profilesContext || "(none published)"}

Published reports:
${reportsContext || "(no reports published yet)"}
`;

    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const geminiContents = messages.map((m: { role?: string; content?: string }) => ({
      role: (m.role === "user" ? "user" : "model") as "user" | "model",
      parts: [{ text: String(m.content ?? "") }],
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents: geminiContents,
      config: { systemInstruction: systemPrompt },
    });

    return NextResponse.json({
      text: response.text || "I was unable to retrieve a response from Gemini.",
    });
  } catch (err) {
    console.error("Chatbot API failed", err);
    return NextResponse.json({ error: "Chatbot engine failed" }, { status: 500 });
  }
}
