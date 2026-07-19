import { listReports } from "@/lib/storage/db";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { FileText, Download, Calendar, BarChart2 } from "lucide-react";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";

export const metadata = {
  title: "Fitness Insights Archive — Meet Shah",
  description: "Browse historical audience reach, follower trends, and verified demographics for Meet Shah's Fitness channel (@meetsofficial).",
};

export default async function FitnessArchivePage() {
  // Query correct persona source
  const reports = await listReports("instagram_fitness");
  const publishedReports = reports.filter((r) => r.status === "published");

  return (
    <div className="bg-white text-ink min-h-screen">
      {/* Overview Header */}
      <WhiteAtmosphereSection grid={true} halo="both" className="pt-24 lg:pt-32 pb-12 bg-white border-b border-border">
        <div className="max-w-3xl flex flex-col items-start text-left space-y-4">
          <Badge className="bg-blue text-white border-transparent">
            Fitness Analytics
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-ink leading-tight">
            Verified Fitness Insights
          </h1>
          <p className="text-xs sm:text-sm text-body max-w-[55ch] leading-relaxed">
            Historical reports documenting organic reach, engagement rates, and follower growth for handle <span className="font-bold text-blue">@meetsofficial</span>.
          </p>
        </div>
      </WhiteAtmosphereSection>

      {/* Archives listings */}
      <section className="bg-surface-soft min-h-[400px] py-16">
        <Container>
          {publishedReports.length === 0 ? (
            <Card className="p-12 text-center border border-border bg-white rounded-panel max-w-xl mx-auto flex flex-col items-center shadow-xs">
              <BarChart2 className="size-10 text-muted mb-4" />
              <h3 className="font-heading text-lg font-bold text-ink">No Reports Published</h3>
              <p className="text-xs text-body mt-2 max-w-[32ch] leading-relaxed">
                Insights reports are updated periodically. Check back soon for the latest campaign performance statistics.
              </p>
            </Card>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="font-heading text-lg font-bold text-ink mb-6">Published Reports History</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {publishedReports.map((report) => (
                  <Card key={report.id} className="p-6 border border-border bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-blue/30 transition-colors shadow-xs">
                    <div className="flex gap-4 items-start">
                      <div className="size-11 rounded-full bg-blue/10 text-blue flex items-center justify-center border border-blue-pale shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-ink">
                          Fitness Performance Report
                        </h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 text-xs text-body">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            {report.period.label} ({report.period.startDate} to {report.period.endDate})
                          </span>
                          <span>•</span>
                          <span>Followers: {report.metrics.followers?.toLocaleString() ?? "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                      <ArrowPillButton href={`/analytics/fitness/${report.id}`} size="md">
                        View Details
                      </ArrowPillButton>
                      <a
                        href={`/api/reports/${report.id}/pdf`}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-blue text-blue hover:bg-blue/5 px-4 rounded-full text-xs font-semibold transition-colors"
                      >
                        <Download className="size-3.5" />
                        PDF
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
