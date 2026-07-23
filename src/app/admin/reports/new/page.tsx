import { Container } from "@/components/ui/Container";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import { BatchReportForm } from "@/components/admin/BatchReportForm";

export const metadata = { title: "Upload PDF Reports — Admin" };

export default function NewReportPage() {
  return (
    <div className="min-h-screen bg-surface-soft py-12 text-ink">
      <Container className="max-w-[960px] px-6 space-y-6 text-left">
        <div className="space-y-4">
          <AdminBackButton href="/admin/reports" label="Back to Reports" />
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
              Analytics admin
            </span>
            <h1 className="mt-1 font-heading text-3xl font-bold text-ink">
              Publish Analytics Reports
            </h1>
            <p className="mt-2 text-sm text-body">
              Upload one or more reviewed PDF reports for the selected channel. Each
              selected window is saved and published as its own report.
            </p>
          </div>
        </div>

        <BatchReportForm />
      </Container>
    </div>
  );
}
