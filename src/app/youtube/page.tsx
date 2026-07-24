import { Metadata } from "next";
import { getPublishedCreatorMetrics, listReports, listYouTubeVideos } from "@/lib/storage/db";
import { YouTubeClientPage } from "./YouTubeClientPage";

export const metadata: Metadata = {
  title: "meetsofficial — YouTube Creator | Meet Shah",
  description:
    "Official YouTube channel showcase for Meet Shah (@im_meetshah). Browse real YouTube Shorts and long-form videos across fitness, finance, AI, and creator education.",
};

export const revalidate = 60; // Revalidate every minute

export default async function YouTubePage() {
  const metrics = await getPublishedCreatorMetrics();
  const reports = await listReports({ channel: "youtube-main", publishedOnly: true });
  const videos = await listYouTubeVideos({ publishedOnly: true });

  const reportsData = reports.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    reportWindow: r.reportWindow,
    periodStart: r.periodStart,
    periodEnd: r.periodEnd,
    executiveSummary: r.executiveSummary,
    highlights: r.highlights,
  }));

  return (
    <YouTubeClientPage
      metrics={metrics.youtubeMain}
      reports={reportsData}
      videos={videos}
    />
  );
}
