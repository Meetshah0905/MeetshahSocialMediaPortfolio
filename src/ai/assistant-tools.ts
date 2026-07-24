import { searchPublicKnowledge, loadAllPublicKnowledge } from "./public-knowledge-retriever";
import { listPlatformProfiles, listReports, CHANNEL_DISPLAY } from "@/lib/storage/db";
import { recordUnansweredQuestion } from "@/lib/storage/unanswered";
import { site, socialUrls } from "@/content/site";

export interface ToolActionCard {
  type: "video" | "report" | "page" | "meeting" | "campaign" | "creator_team" | "handoff";
  title: string;
  description: string;
  buttonText: string;
  url: string;
}

export interface ToolExecutionResult {
  data: unknown;
  card?: ToolActionCard;
}

/**
 * Server-side controlled tools for Gemini Assistant (§5).
 */
export async function executeAssistantTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolExecutionResult> {
  switch (toolName) {
    case "search_public_knowledge": {
      const query = String(args.query ?? "");
      const results = searchPublicKnowledge(query);
      return { data: results };
    }

    case "get_public_profile": {
      return {
        data: {
          name: site.name,
          role: site.role,
          location: site.location,
          email: site.email,
          channels: [
            { name: "Fitness", handle: "@meetsofficial", platform: "Instagram" },
            { name: "Finance", handle: "@meet.fitfix", platform: "Instagram" },
            { name: "YouTube", handle: "Meet Shah", platform: "YouTube" },
          ],
        },
      };
    }

    case "get_current_channel_metrics": {
      const profiles = await listPlatformProfiles();
      const published = profiles.filter((p) => p.published || p.isPublished);
      return {
        data: published.map((p) => ({
          channel: p.displayName,
          handle: p.handle,
          metric: p.primaryMetric,
          value: p.currentValue,
          updatedAt: p.updatedAt,
        })),
      };
    }

    case "get_combined_community": {
      const profiles = await listPlatformProfiles();
      const published = profiles.filter((p) => p.published || p.isPublished);
      const total = published.reduce((acc, p) => acc + (p.currentValue || 0), 0);
      return {
        data: {
          totalCommunity: total,
          channelsCount: published.length,
          lastUpdated: published[0]?.updatedAt || new Date().toISOString(),
        },
      };
    }

    case "list_published_reports": {
      const reports = await listReports({ publishedOnly: true });
      return {
        data: reports.map((r) => ({
          id: r.id,
          slug: r.slug,
          channel: CHANNEL_DISPLAY[r.channel]?.name ?? r.channel,
          window: r.reportWindow,
          title: r.title,
          summary: r.executiveSummary,
          period: `${r.periodStart} to ${r.periodEnd}`,
          url: `/analytics/reports/${r.slug}`,
        })),
      };
    }

    case "get_published_report": {
      const slug = String(args.slug ?? "");
      const reports = await listReports({ publishedOnly: true });
      const found = reports.find((r) => r.slug === slug || r.id === slug);

      if (!found) {
        return { data: { error: "Report not found or not published." } };
      }

      return {
        data: {
          id: found.id,
          slug: found.slug,
          title: found.title,
          channel: CHANNEL_DISPLAY[found.channel]?.name ?? found.channel,
          period: `${found.periodStart} to ${found.periodEnd}`,
          summary: found.executiveSummary,
          highlights: found.highlights,
          metrics: found.metrics,
        },
        card: {
          type: "report",
          title: found.title,
          description: found.executiveSummary || `Verified insights report for ${found.periodStart} to ${found.periodEnd}`,
          buttonText: "View Published Report",
          url: `/analytics/reports/${found.slug}`,
        },
      };
    }

    case "search_public_content": {
      const query = String(args.query ?? "").toLowerCase();
      const all = loadAllPublicKnowledge();
      const catalogue = all.find((i) => i.file.includes("07-content-catalogue"));

      let items: Array<{ title: string; category: string; platform: string; url: string }> = [];
      if (catalogue) {
        const lines = catalogue.content.split("\n").filter((l) => l.trim().startsWith("{"));
        items = lines
          .map((l) => {
            try {
              return JSON.parse(l);
            } catch {
              return null;
            }
          })
          .filter(Boolean);
      }

      const filtered = query
        ? items.filter((i) => i.title.toLowerCase().includes(query) || i.category.toLowerCase().includes(query))
        : items;

      return { data: filtered.slice(0, 5) };
    }

    case "get_official_links": {
      return {
        data: {
          email: site.email,
          instagramFitness: socialUrls.instagramFitness,
          instagramFinance: socialUrls.instagramFinance,
          linkedin: socialUrls.linkedin,
          twitter: socialUrls.twitter,
        },
      };
    }

    case "get_meeting_booking_link": {
      const bookingUrl = process.env.NEXT_PUBLIC_MEETING_BOOKING_URL;
      if (!bookingUrl || !bookingUrl.trim()) {
        return {
          data: {
            available: false,
            message: "Meeting booking is temporarily unavailable. Please submit a collaboration proposal or email Meet directly.",
          },
          card: {
            type: "campaign",
            title: "Submit Collaboration Inquiry",
            description: "Submit details about your campaign or proposal directly through the website form.",
            buttonText: "Submit Proposal",
            url: "/contact",
          },
        };
      }

      return {
        data: {
          available: true,
          bookingUrl,
        },
        card: {
          type: "meeting",
          title: "Book a Meeting with Meet Shah",
          description: "Choose a currently available time directly from Meet's official booking calendar.",
          buttonText: "View Available Times",
          url: bookingUrl,
        },
      };
    }

    case "get_campaign_inquiry_link": {
      return {
        data: { url: "/contact" },
        card: {
          type: "campaign",
          title: "Campaign Details Proposal",
          description: "Submit details regarding brand integration, sponsored videos, or UGC campaigns.",
          buttonText: "Submit Proposal Inquiry",
          url: "/contact",
        },
      };
    }

    case "get_creator_team_link": {
      return {
        data: { url: "/join-creator-team" },
        card: {
          type: "creator_team",
          title: "Join Meet Shah's Creator Team",
          description: "Apply for open video editing and videographer positions.",
          buttonText: "View Creator Opportunities",
          url: "/join-creator-team",
        },
      };
    }

    case "record_unanswered_question": {
      const question = String(args.question ?? "");
      const classifiedIntent = String(args.classifiedIntent ?? "unknown");
      const reason = String(args.reason ?? "Information not documented");
      const rec = await recordUnansweredQuestion(question, classifiedIntent, reason);

      return {
        data: { recorded: true, id: rec.id },
        card: {
          type: "handoff",
          title: "Contact Meet Shah",
          description: "This question isn't documented in the public knowledge base yet. Reach out directly or schedule a meeting.",
          buttonText: "Choose Contact Option",
          url: "/contact",
        },
      };
    }

    default:
      return { data: { error: `Unknown tool: ${toolName}` } };
  }
}
