import { getReport } from "@/lib/storage/db";
import { notFound } from "next/navigation";
import { ReportDetailView } from "@/components/analytics/ReportDetailView";

export const metadata = {
  title: "Fitness Performance Insights Report — Meet Shah",
  description: "Detailed engagement breakdowns, reach curves, and demographical splits for Meet Shah's Fitness channel.",
};

type Params = {
  params: Promise<{
    reportId: string;
  }>;
};

export default async function FitnessReportDetailPage({ params }: Params) {
  const { reportId } = await params;
  const report = await getReport(reportId);

  if (!report || report.persona !== "instagram_fitness" || report.status !== "published") {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
