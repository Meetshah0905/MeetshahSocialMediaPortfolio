import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { MEET_ASSISTANT_SYSTEM_PROMPT } from "@/ai/meet-assistant-system-prompt";
import { classifyIntent } from "@/ai/intent-router";
import { executeAssistantTool, type ToolActionCard } from "@/ai/assistant-tools";
import { getPublishedCreatorMetrics } from "@/lib/storage/db";
import { YOUTUBE_CHANNEL } from "@/config/youtube";

/**
 * Server-side AI Assistant Chat Endpoint (§1).
 *
 * Enforces:
 * 1. Server-side Gemini API key protection.
 * 2. Intent classification and Privacy Firewall.
 * 3. Rate-limiting.
 * 4. Controlled tool execution & structured Action Card responses.
 */

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    if (!(await checkRateLimit("chat", request))) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429 }
      );
    }

    const { messages } = await request.json().catch(() => ({}));
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid or empty messages array" }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1];
    const userText = String(latestMessage.content ?? "").trim();

    if (!userText) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    // 2. Intent Classification & Privacy Firewall (§2, §6)
    const intent = classifyIntent(userText);

    if (intent === "restricted_or_private") {
      return NextResponse.json({
        intent,
        text: "I cannot access or share private personal details, credentials, or internal records. I can help you with Meet Shah's public profile, Fitness and Finance content, published analytics reports, or booking a meeting.",
        card: {
          type: "handoff",
          title: "Public Portfolio Links",
          description: "Explore Meet Shah's public portfolio pages or submit an official collaboration proposal.",
          buttonText: "View Proposal Form",
          url: "/contact",
        },
      });
    }

    // 3. API Key Check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          intent: "error",
          text: "The AI assistant is temporarily unavailable. You can still use the meeting, collaboration and creator-team links.",
          card: {
            type: "handoff",
            title: "Contact & Collaboration Options",
            description: "Direct links to Meet's booking page, proposal form, and email.",
            buttonText: "Submit Proposal",
            url: "/contact",
          },
        },
        { status: 200 }
      );
    }

    // Handle explicit meeting request early if needed
    let defaultCard: ToolActionCard | undefined;
    if (intent === "meeting_request") {
      const meetingResult = await executeAssistantTool("get_meeting_booking_link", {});
      defaultCard = meetingResult.card;
    } else if (intent === "human_handoff") {
      defaultCard = {
        type: "handoff",
        title: "Contact & Handoff Options",
        description: "Reach Meet Shah directly or choose an official collaboration route.",
        buttonText: "View Contact Options",
        url: "/contact",
      };
    } else if (intent === "creator_team") {
      defaultCard = {
        type: "creator_team",
        title: "Join Meet's Creator Team",
        description: "Apply for open video editing and videographer roles.",
        buttonText: "View Creator Opportunities",
        url: "/join-creator-team",
      };
    } else if (intent === "collaboration") {
      defaultCard = {
        type: "campaign",
        title: "Submit Campaign Proposal",
        description: "Fill out the campaign proposal form to discuss brand deals or UGC packages.",
        buttonText: "Submit Proposal Inquiry",
        url: "/contact",
      };
    }

    // 4. Fetch Live Database Channel Metrics (§3, §10, §11, §18)
    const liveMetrics = await getPublishedCreatorMetrics();
    const liveMetricsContext = `
Live Verified Website Channel Metrics (DATABASE SOURCE):
- Instagram Fitness (@meetsofficial): ${liveMetrics.instagramFitness.exact.toLocaleString()} Followers (${liveMetrics.instagramFitness.compact})
- Instagram Finance (@meet.fitfix): ${liveMetrics.instagramFinance.exact.toLocaleString()} Followers (${liveMetrics.instagramFinance.compact})
- YouTube Channel: ${YOUTUBE_CHANNEL.name} (${YOUTUBE_CHANNEL.handle}) — ${liveMetrics.youtubeMain.exact.toLocaleString()} Subscribers (${liveMetrics.youtubeMain.compact})
  Canonical Channel URL: ${YOUTUBE_CHANNEL.channelUrl}
  Shorts URL: ${YOUTUBE_CHANNEL.shortsUrl}
  Videos URL: ${YOUTUBE_CHANNEL.videosUrl}
  Playlists URL: ${YOUTUBE_CHANNEL.playlistsUrl}
- Combined Community: ${liveMetrics.combinedCommunity.exact.toLocaleString()} Total Audience (${liveMetrics.combinedCommunity.compact})
`;

    if (!defaultCard && (userText.toLowerCase().includes("youtube") || userText.toLowerCase().includes("subscriber") || userText.toLowerCase().includes("shorts"))) {
      defaultCard = {
        type: "page",
        title: `${YOUTUBE_CHANNEL.name} (${YOUTUBE_CHANNEL.handle})`,
        description: `${liveMetrics.youtubeMain.compact} Subscribers • Shorts + Long-form videos`,
        buttonText: "Explore YouTube",
        url: "/youtube",
      };
    }

    // 5. Execute Knowledge Search Tool for background context
    const knowledgeSearch = await executeAssistantTool("search_public_knowledge", { query: userText });
    const knowledgeContext = JSON.stringify(knowledgeSearch.data);

    const fullSystemInstruction = `${MEET_ASSISTANT_SYSTEM_PROMPT}

Classified User Intent: ${intent}

${liveMetricsContext}

Relevant Verified Public Knowledge:
${knowledgeContext}
`;

    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Format chat history for Gemini
    const contents = messages.slice(-6).map((m: { role?: string; content?: string }) => ({
      role: (m.role === "user" ? "user" : "model") as "user" | "model",
      parts: [{ text: String(m.content ?? "") }],
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: fullSystemInstruction,
      },
    });

    const replyText = response.text || "I'm sorry, I couldn't process that response.";

    // Log unanswered questions if intent could not be answered from knowledge
    if (replyText.includes("not documented") || replyText.includes("don't have that information")) {
      await executeAssistantTool("record_unanswered_question", {
        question: userText,
        classifiedIntent: intent,
        reason: "Knowledge item not found",
      });
    }

    return NextResponse.json({
      intent,
      text: replyText,
      card: defaultCard,
    });
  } catch (error) {
    console.error("Assistant Chat Error:", error);
    return NextResponse.json(
      {
        intent: "error",
        text: "The AI assistant is temporarily unavailable. You can still use the meeting, collaboration and creator-team links.",
        card: {
          type: "handoff",
          title: "Contact Options",
          description: "Use direct links to submit proposals or book a meeting.",
          buttonText: "Go to Contact Page",
          url: "/contact",
        },
      },
      { status: 200 }
    );
  }
}
