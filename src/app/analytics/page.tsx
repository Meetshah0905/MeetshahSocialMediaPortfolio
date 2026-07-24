import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import { FileText, Download, ArrowRight } from "lucide-react";
import {
  listReports,
  getLatestPublishedReport,
  CHANNEL_DISPLAY,
  formatReportWindow,
  isChannelSlug,
  isReportWindow,
  type AnalyticsReport,
  type ChannelSlug,
  type ReportWindow,
} from "@/lib/storage/db";
import { AnalyticsArchiveFilters } from "@/components/analytics/AnalyticsArchiveFilters";

export const metadata = {
  title: "Analytics — Meet Shah",
  description:
    "Reviewed Instagram and YouTube insights reports for Meet Shah's Fitness, Finance, and YouTube channels.",
};

type SearchParams = { channel?: string; window?: string };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeChannel: ChannelSlug | undefined =
    params.channel && isChannelSlug(params.channel) ? params.channel : undefined;
  const activeWindow: ReportWindow | undefined =
    params.window && isReportWindow(params.window) ? params.window : undefined;

  const [latestOverall, fitnessLatest, financeLatest, youtubeLatest, archive] =
    await Promise.all([
      getLatestPublishedReport(),
      getLatestPublishedReport("instagram-fitness"),
      getLatestPublishedReport("instagram-finance"),
      getLatestPublishedReport("youtube-main"),
      listReports({
        publishedOnly: true,
        channel: activeChannel,
        reportWindow: activeWindow,
      }),
    ]);

  // De-dup: skip the featured report from its per-channel row.
  const perChannel = [
    { slug: "instagram-fitness" as const, report: fitnessLatest },
    { slug: "instagram-finance" as const, report: financeLatest },
    { slug: "youtube-main" as const, report: youtubeLatest },
  ];

  return (
    <div className="min-h-screen bg-white text-ink">
      {/* Hero */}
      <WhiteAtmosphereSection halo="both" className="pt-12 pb-10 border-b border-border">
        <Container className="max-w-4xl text-left space-y-4">
          <Badge className="bg-blue text-white border-transparent">Analytics</Badge>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight text-ink">
            Verified Insights Reports
          </h1>
          <p className="text-sm text-body max-w-[60ch] leading-relaxed">
            Every report is a reviewed PDF prepared from raw Instagram and YouTube insights.
            The latest published report is featured below; older reports remain available in the
            archive.
          </p>
        </Container>
      </WhiteAtmosphereSection>

      {/* Latest featured */}
      {latestOverall ? (
        <section className="border-b border-border bg-surface-soft py-14">
          <Container>
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
                Latest report
              </span>
            </div>
            <LatestReportCard report={latestOverall} featured />
          </Container>
        </section>
      ) : (
        <section className="border-b border-border bg-surface-soft py-14">
          <Container>
            <Card className="mx-auto max-w-2xl border-border bg-white p-12 text-center shadow-sm">
              <FileText className="mx-auto size-8 text-muted" />
              <h2 className="mt-4 font-heading text-lg font-bold text-ink">
                No analytics reports have been published yet.
              </h2>
              <p className="mt-2 text-xs text-body">
                Reviewed insights PDFs will appear here as they're released.
              </p>
            </Card>
          </Container>
        </section>
      )}

      {/* Latest per-channel */}
      <section className="border-b border-border py-14">
        <Container>
          <div className="mb-5 flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
              Latest by channel
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {perChannel.map(({ slug, report }) => (
              <ChannelLatestCard key={slug} slug={slug} report={report} />
            ))}
          </div>
        </Container>
      </section>

      {/* Archive */}
      <section id="archive" className="bg-surface-soft py-14">
        <Container>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
                Report archive
              </span>
              <h2 className="mt-1 font-heading text-2xl font-bold text-ink">All published reports</h2>
            </div>
          </div>

          <AnalyticsArchiveFilters
            activeChannel={activeChannel}
            activeWindow={activeWindow}
          />

          {archive.length === 0 ? (
            <Card className="mt-6 border-border bg-white p-10 text-center shadow-sm">
              <p className="font-heading text-sm font-bold text-ink">
                {activeChannel || activeWindow
                  ? "No published reports match the selected filters."
                  : "No published reports are available yet."}
              </p>
            </Card>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {archive.map((report) => (
                <ArchiveCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

function LatestReportCard({
  report,
  featured,
}: {
  report: AnalyticsReport;
  featured?: boolean;
}) {
  const channel = CHANNEL_DISPLAY[report.channel];
  return (
    <Card
      className={`border-border bg-white p-8 shadow-sm ${
        featured ? "md:p-10" : ""
      }`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-pale text-blue border-transparent">{channel.name}</Badge>
            <span className="rounded-full border border-border bg-surface-soft px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-ink">
              {formatReportWindow(report.reportWindow)}
            </span>
            <span className="font-mono text-[11px] text-muted">
              {report.periodStart} → {report.periodEnd}
            </span>
            {report.publishedAt && (
              <span className="font-mono text-[10px] text-muted">
                · Published {report.publishedAt.slice(0, 10)}
              </span>
            )}
          </div>
          <h3 className="font-heading text-2xl font-bold text-ink">{report.title}</h3>
          {report.executiveSummary && (
            <p className="max-w-[65ch] text-sm text-body leading-relaxed">
              {report.executiveSummary}
            </p>
          )}
          {report.highlights && report.highlights.length > 0 && (
            <ul className="mt-2 space-y-1.5 text-xs text-body">
              {report.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue" aria-hidden>
                    •
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
          <MetricRow report={report} />
        </div>

        <div className="flex shrink-0 flex-col gap-2 md:min-w-[180px]">
          <Link
            href={`/analytics/reports/${report.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-blue-deep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
          >
            <span>View report</span> <ArrowRight className="size-3.5 shrink-0" />
          </Link>
          <a
            href={`/api/reports/${report.id}/pdf?download=1`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
          >
            <Download className="size-3.5 shrink-0 stroke-current" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </Card>
  );
}

function ChannelLatestCard({
  slug,
  report,
}: {
  slug: ChannelSlug;
  report: AnalyticsReport | null;
}) {
  const channel = CHANNEL_DISPLAY[slug];
  if (!report) {
    return (
      <Card className="flex h-full flex-col border-border bg-white p-6 shadow-sm">
        <Badge className="bg-blue-pale text-blue border-transparent">{channel.name}</Badge>
        <div className="mt-6 flex-1">
          <p className="text-xs text-muted">No published reports for this channel yet.</p>
        </div>
        <Link
          href={`/analytics?channel=${slug}#archive`}
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue hover:underline"
        >
          Filter archive <ArrowRight className="size-3.5" />
        </Link>
      </Card>
    );
  }
  return (
    <Card className="flex h-full flex-col border-border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Badge className="bg-blue-pale text-blue border-transparent">{channel.name}</Badge>
        <span className="rounded-full border border-border bg-surface-soft px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-ink">
          {formatReportWindow(report.reportWindow)}
        </span>
      </div>
      <h3 className="mt-4 font-heading text-base font-bold text-ink line-clamp-2">
        {report.title}
      </h3>
      <p className="mt-1 text-[11px] font-mono text-muted">
        {report.periodStart} → {report.periodEnd}
      </p>
      {report.executiveSummary && (
        <p className="mt-3 text-xs text-body line-clamp-3">{report.executiveSummary}</p>
      )}
      <div className="mt-6 flex items-center gap-2">
        <Link
          href={`/analytics/reports/${report.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink hover:border-blue transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
        >
          <span>View</span>
        </Link>
        <a
          href={`/api/reports/${report.id}/pdf?download=1`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-blue-deep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
          aria-label={`Download ${channel.name} PDF`}
        >
          <Download className="size-3 shrink-0 stroke-current" />
          <span>Download PDF</span>
        </a>
      </div>
    </Card>
  );
}

function ArchiveCard({ report }: { report: AnalyticsReport }) {
  const channel = CHANNEL_DISPLAY[report.channel];
  return (
    <Card className="flex flex-col border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-blue-pale text-blue border-transparent">{channel.name}</Badge>
        <span className="rounded-full border border-border bg-surface-soft px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-ink">
          {formatReportWindow(report.reportWindow)}
        </span>
        <span className="font-mono text-[11px] text-muted">
          {report.periodStart} → {report.periodEnd}
        </span>
      </div>
      <h3 className="mt-3 font-heading text-lg font-bold text-ink line-clamp-2">
        {report.title}
      </h3>
      {report.publishedAt && (
        <p className="mt-1 text-[10px] font-mono text-muted">
          Published {report.publishedAt.slice(0, 10)}
        </p>
      )}
      {report.executiveSummary && (
        <p className="mt-3 text-xs text-body line-clamp-3">{report.executiveSummary}</p>
      )}
      <MetricRow report={report} compact />
      <div className="mt-5 flex items-center gap-2">
        <Link
          href={`/analytics/reports/${report.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink hover:border-blue transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
        >
          <span>View report</span>
        </Link>
        <a
          href={`/api/reports/${report.id}/pdf?download=1`}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-blue-deep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
        >
          <Download className="size-3 shrink-0 stroke-current" />
          <span>Download PDF</span>
        </a>
      </div>
    </Card>
  );
}

function MetricRow({ report, compact }: { report: AnalyticsReport; compact?: boolean }) {
  const m = report.metrics ?? {};
  const items: Array<{ label: string; value: number; suffix?: string }> = [];
  if (m.views != null) items.push({ label: "Views", value: m.views });
  if (m.reach != null) items.push({ label: "Reach", value: m.reach });
  if (m.audienceGrowth != null)
    items.push({ label: "Audience growth", value: m.audienceGrowth });
  if (m.engagementRate != null)
    items.push({ label: "Engagement", value: m.engagementRate, suffix: "%" });
  if (m.watchTimeMinutes != null)
    items.push({ label: "Watch time (min)", value: m.watchTimeMinutes });

  const shown = items.slice(0, 3);
  if (shown.length === 0) return null;

  return (
    <dl
      className={`mt-4 grid gap-2 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}
    >
      {shown.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-border bg-surface-soft px-3 py-2"
        >
          <dt className="text-[9px] font-bold uppercase tracking-wider text-muted">
            {it.label}
          </dt>
          <dd className="mt-1 font-heading text-sm font-bold text-ink">
            {new Intl.NumberFormat("en", {
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(it.value)}
            {it.suffix ?? ""}
          </dd>
        </div>
      ))}
    </dl>
  );
}
