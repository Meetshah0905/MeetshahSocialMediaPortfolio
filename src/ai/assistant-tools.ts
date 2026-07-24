import { searchPublicKnowledge } from "./public-knowledge-retriever";
import { listPlatformProfiles, listReports, listYouTubeVideos, CHANNEL_DISPLAY } from "@/lib/storage/db";
import type { ChannelSlug, ReportWindow } from "@/lib/storage/reportShared";
import { recordUnansweredQuestion } from "@/lib/storage/unanswered";
import { site, socialUrls } from "@/content/site";
import { YOUTUBE_CHANNEL } from "@/config/youtube";

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
            { name: YOUTUBE_CHANNEL.name, handle: YOUTUBE_CHANNEL.handle, platform: "YouTube", channelUrl: YOUTUBE_CHANNEL.channelUrl },
          ],
        },
      };
    }

    case "get_current_channel_metrics": {
      const profiles = await listPlatformProfiles();
      const published = profiles.filter((p) => p.published || p.isPublished);

      return {
        data: published.map((p) => {
          const isYt = p.platform === "youtube" || p.slug === "youtube-main" || p.id === "youtube_main";
          const count = p.manualAudienceOverride ?? p.manualAudienceCount ?? p.currentValue ?? p.currentAudienceCount ?? 0;
          return {
            channel: p.displayName,
            platform: isYt ? "YouTube" : "Instagram",
            displayName: p.displayName,
            audienceLabel: isYt ? "Subscribers" : "Followers",
            exact: count,
            compact: count === 0 ? "0" : new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count),
            contentFormats: isYt ? ["YouTube Shorts", "Long-form YouTube videos"] : ["Reels", "Posts"],
            updatedAt: p.updatedAt,
            source: "Published website metrics",
          };
        }),
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
      const channel = args.channel ? (String(args.channel) as ChannelSlug) : undefined;
      const reportWindow = args.reportWindow ? (String(args.reportWindow) as ReportWindow) : undefined;

      const reports = await listReports({
        publishedOnly: true,
        channel,
        reportWindow,
      });

      return {
        data: reports.map((r) => ({
          id: r.id,
          slug: r.slug,
          channel: CHANNEL_DISPLAY[r.channel]?.name ?? r.channel,
          channelSlug: r.channel,
          window: r.reportWindow,
          title: r.title,
          summary: r.executiveSummary,
          highlights: r.highlights,
          metrics: r.metrics,
          period: `${r.periodStart} to ${r.periodEnd}`,
          viewUrl: `/analytics/reports/${r.slug}`,
          pdfDownloadUrl: `/api/reports/${r.id}/pdf?download=1`,
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
      const format = String(args.format ?? "").toLowerCase();

      // Query real published YouTube videos from database
      const dbVideos = await listYouTubeVideos({ publishedOnly: true });
      const mappedDbVideos = dbVideos.map((v) => ({
        id: v.id,
        videoId: v.videoId,
        title: v.title,
        category: v.topic,
        platform: "YouTube",
        format: v.format,
        url: v.videoUrl,
        thumbnailUrl: v.thumbnailUrl,
      }));

      const filtered = query
        ? mappedDbVideos.filter((i) => i.title.toLowerCase().includes(query) || i.category.toLowerCase().includes(query))
        : mappedDbVideos;

      if (format) {
        return { data: filtered.filter((i) => i.format === format).slice(0, 6) };
      }

      return { data: filtered.slice(0, 6) };
    }

    case "get_official_links": {
      return {
        data: {
          email: site.email,
          instagramFitness: socialUrls.instagramFitness,
          instagramFinance: socialUrls.instagramFinance,
          youtubeChannel: YOUTUBE_CHANNEL.channelUrl,
          youtubeShorts: YOUTUBE_CHANNEL.shortsUrl,
          youtubeVideos: YOUTUBE_CHANNEL.videosUrl,
          youtubePlaylists: YOUTUBE_CHANNEL.playlistsUrl,
          linkedin: socialUrls.linkedin,
          twitter: socialUrls.twitter,
        },
      };
    }

    case "get_meeting_booking_link": {
      const bookingUrl = process.env.NEXT_PUBLIC_MEETING_BOOKING_URL || "https://cal.com/meet-shah-0905/60min";

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
      const creatorTeamBookingUrl = process.env.NEXT_PUBLIC_CREATOR_TEAM_BOOKING_URL || "https://cal.com/meet-shah-0905/creator-team-discussing";
      return {
        data: {
          url: "/join-creator-team",
          bookingUrl: creatorTeamBookingUrl,
        },
        card: {
          type: "creator_team",
          title: "Join Meet Shah's Creator Team",
          description: "Schedule a discussion call or view open video editing and videographer roles.",
          buttonText: "Schedule Team Discussion",
          url: creatorTeamBookingUrl,
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
