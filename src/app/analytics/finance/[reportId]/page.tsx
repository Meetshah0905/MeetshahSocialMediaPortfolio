import { getReport } from "@/lib/storage/db";
import { notFound } from "next/navigation";
import { ReportDetailView } from "@/components/analytics/ReportDetailView";

export const metadata = {
  title: "Finance Performance Insights Report — Meet Shah",
  description: "Detailed engagement breakdowns, reach curves, and demographical splits for Meet Shah's Finance channel.",
};

type Params = {
  params: Promise<{
    reportId: string;
  }>;
};

export default async function FinanceReportDetailPage({ params }: Params) {
  const { reportId } = await params;
  const report = await getReport(reportId);

  if (!report || report.persona !== "instagram_finance" || report.status !== "published") {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
