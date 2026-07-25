import { Metadata } from "next";
import { getPublishedCreatorMetrics, listReports } from "@/lib/storage/db";
import { VERIFIED_YOUTUBE_VIDEOS } from "@/content/youtube/verified-videos";
import { YouTubeClientPage } from "./YouTubeClientPage";

export const metadata: Metadata = {
  title: "meetsofficial — YouTube Creator | Meet Shah",
  description:
    "Official YouTube channel showcase for Meet Shah (@im_meetshah). Browse real YouTube Shorts and long-form videos across fitness, finance, AI, and creator education.",
};

export const revalidate = 60; // Revalidate every minute

export default async function YouTubePage() {
  const metrics = await getPublishedCreatorMetrics();

  let reportsData: Array<{
    id: string;
    slug: string;
    title: string;
    reportWindow: string;
    periodStart: string;
    periodEnd: string;
    executiveSummary?: string;
    highlights?: string[];
  }> = [];

  try {
    const reports = await listReports({ channel: "youtube-main", publishedOnly: true });
    reportsData = reports.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      reportWindow: r.reportWindow,
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      executiveSummary: r.executiveSummary,
      highlights: r.highlights,
    }));
  } catch (err) {
    console.warn("YouTube reports loading error:", err);
  }

  // Stable public YouTube videos data source
  const videoList = VERIFIED_YOUTUBE_VIDEOS.map((v) => ({
    id: v.videoId,
    videoId: v.videoId,
    title: v.title,
    format: v.format,
    topic: (v.topic || "creator") as any,
    videoUrl: v.canonicalUrl,
    thumbnailUrl: v.thumbnailUrl,
    isFeatured: !!v.featured,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return (
    <YouTubeClientPage
      metrics={metrics.youtubeMain}
      reports={reportsData}
      videos={videoList}
    />
  );
}
