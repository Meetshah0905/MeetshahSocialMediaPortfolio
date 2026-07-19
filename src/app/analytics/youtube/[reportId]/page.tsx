import { getReport } from "@/lib/storage/db";
import { notFound } from "next/navigation";
import { ReportDetailView } from "@/components/analytics/ReportDetailView";

export const metadata = {
  title: "YouTube Performance Insights Report — Meet Shah",
  description: "Detailed subscriber growth analysis, watch time, and demographics for Meet Shah's YouTube channel.",
};

type Params = {
  params: Promise<{
    reportId: string;
  }>;
};

export default async function YouTubeReportDetailPage({ params }: Params) {
  const { reportId } = await params;
  const report = await getReport(reportId);

  if (!report || report.persona !== "youtube_main" || report.status !== "published") {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
