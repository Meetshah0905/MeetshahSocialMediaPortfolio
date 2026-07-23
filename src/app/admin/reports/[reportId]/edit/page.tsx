import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import { ReportForm } from "@/components/admin/ReportForm";
import { getReport } from "@/lib/storage/db";

type Params = { params: Promise<{ reportId: string }> };

export const metadata = { title: "Edit Analytics Report — Admin" };

export default async function EditReportPage({ params }: Params) {
  const { reportId } = await params;
  const report = await getReport(reportId);
  if (!report) notFound();

  return (
    <div className="min-h-screen bg-surface-soft py-12 text-ink">
      <Container className="max-w-[900px] px-6 space-y-6 text-left">
        <div className="space-y-4">
          <AdminBackButton href="/admin/reports" label="Back to Reports" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
              Analytics admin
            </span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-ink">
              Edit report
            </h1>
            <p className="mt-2 text-xs text-muted">
              {report.status === "published"
                ? "This report is live."
                : `Status: ${report.status}`}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-soft">
          <ReportForm mode="edit" initial={report} />
        </div>
      </Container>
    </div>
  );
}
