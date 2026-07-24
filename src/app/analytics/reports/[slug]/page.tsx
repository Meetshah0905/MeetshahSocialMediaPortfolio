import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";
import {
  getReport,
  listReports,
  CHANNEL_DISPLAY,
  formatReportWindow,
  type AnalyticsReport,
} from "@/lib/storage/db";

type Params = { params: Promise<{ slug: string }> };

async function findBySlug(slug: string): Promise<AnalyticsReport | null> {
  const direct = await getReport(slug);
  if (direct && direct.status === "published") return direct;

  const list = await listReports({ publishedOnly: true });
  return list.find((r) => r.slug === slug || r.id === slug) ?? null;
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const report = await findBySlug(slug);
  if (!report) return { title: "Report not found — Meet Shah" };
  return {
    title: `${report.title} — Meet Shah`,
    description:
      report.executiveSummary ?? `Reviewed insights report for ${CHANNEL_DISPLAY[report.channel].name}.`,
  };
}

export default async function ReportDetailPage({ params }: Params) {
  const { slug } = await params;
  const report = await findBySlug(slug);
  if (!report || report.status !== "published") notFound();

  const channel = CHANNEL_DISPLAY[report.channel];

  const related = (
    await listReports({
      publishedOnly: true,
      channel: report.channel,
    })
  )
    .filter((r) => r.id !== report.id)
    .slice(0, 3);

  const pdfUrl = `/api/reports/${report.id}/pdf`;

  return (
    <div className="min-h-screen bg-white text-ink">
      <div className="border-b border-border bg-surface-soft py-10">
        <Container className="max-w-5xl space-y-6">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Analytics
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-pale text-blue border-transparent">
              {channel.name}
            </Badge>
            <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-ink">
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

          <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight text-ink">
            {report.title}
          </h1>

          {report.executiveSummary && (
            <p className="max-w-[70ch] text-sm text-body leading-relaxed">
              {report.executiveSummary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`${pdfUrl}?download=1`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-blue-deep transition-colors shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
            >
              <Download className="size-4 shrink-0 stroke-current" />
              <span>Download PDF</span>
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue/50"
            >
              <ExternalLink className="size-4 shrink-0 stroke-current" />
              <span>Open in new tab</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Highlights + metrics */}
      {(report.highlights?.length || report.metrics) && (
        <section className="border-b border-border py-10">
          <Container className="max-w-5xl grid gap-8 md:grid-cols-2">
            {report.highlights && report.highlights.length > 0 && (
              <div>
                <h2 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
                  Key highlights
                </h2>
                <ul className="space-y-2 text-sm text-body">
                  {report.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 text-blue" aria-hidden>
                        •
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <MetricsGrid report={report} />
          </Container>
        </section>
      )}

      {/* PDF viewer */}
      <section className="py-10">
        <Container className="max-w-5xl">
          <h2 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
            Full report
          </h2>
          <PdfViewer url={pdfUrl} title={report.title} />
          <p className="mt-3 text-[11px] text-muted">
            Trouble viewing the PDF?{" "}
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue underline">
              Open it in a new tab
            </a>
            .
          </p>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface-soft py-14">
          <Container className="max-w-5xl">
            <h2 className="mb-6 text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
              Previous {channel.name} reports
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((r) => (
                <Card key={r.id} className="border-border bg-white p-5 shadow-sm">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {formatReportWindow(r.reportWindow)}
                  </span>
                  <h3 className="mt-2 font-heading text-sm font-bold text-ink line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] text-muted">
                    {r.periodStart} → {r.periodEnd}
                  </p>
                  <Link
                    href={`/analytics/reports/${r.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue hover:underline"
                  >
                    View report →
                  </Link>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}

function MetricsGrid({ report }: { report: AnalyticsReport }) {
  const m = report.metrics ?? {};
  const items: Array<{ label: string; value: number; suffix?: string }> = [];
  if (m.audienceEnd != null) items.push({ label: "Audience", value: m.audienceEnd });
  if (m.audienceGrowth != null)
    items.push({ label: "Audience growth", value: m.audienceGrowth });
  if (m.views != null) items.push({ label: "Views", value: m.views });
  if (m.reach != null) items.push({ label: "Reach", value: m.reach });
  if (m.impressions != null) items.push({ label: "Impressions", value: m.impressions });
  if (m.interactions != null) items.push({ label: "Interactions", value: m.interactions });
  if (m.engagementRate != null)
    items.push({ label: "Engagement", value: m.engagementRate, suffix: "%" });
  if (m.watchTimeMinutes != null)
    items.push({ label: "Watch time (min)", value: m.watchTimeMinutes });
  if (m.averageViewDurationSeconds != null)
    items.push({ label: "Avg view duration (s)", value: m.averageViewDurationSeconds });

  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
        Headline metrics
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.label} className="rounded-lg border border-border bg-surface-soft px-3 py-3">
            <dt className="text-[9px] font-bold uppercase tracking-wider text-muted">
              {it.label}
            </dt>
            <dd className="mt-1 font-heading text-base font-bold text-ink">
              {new Intl.NumberFormat("en", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(it.value)}
              {it.suffix ?? ""}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PdfViewer({ url, title }: { url: string; title: string }) {
  return (
    <>
      {/*
       * Desktop / mouse-driven viewers get the inline preview. iOS Safari
       * doesn't render `<object type="application/pdf">` inline at all, and
       * on Android Chrome the inline preview is a poor experience on small
       * screens — a full-height iframe that scrolls independently of the
       * page. `(hover: hover) and (pointer: fine)` reliably distinguishes
       * both cases.
       */}
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface-soft [@media(hover:hover)_and_(pointer:fine)]:block">
        <object
          data={url}
          type="application/pdf"
          aria-label={`PDF viewer for ${title}`}
          className="block h-[80vh] min-h-[560px] w-full"
        >
          <PdfFallbackCard url={url} />
        </object>
      </div>

      {/* Touch devices: prominent open/download card instead of a broken iframe. */}
      <div className="block [@media(hover:hover)_and_(pointer:fine)]:hidden">
        <PdfFallbackCard url={url} />
      </div>
    </>
  );
}

function PdfFallbackCard({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
      <p className="font-heading text-base font-bold text-ink">
        The full report is in the PDF file.
      </p>
      <p className="mx-auto mt-2 max-w-[38ch] text-xs text-body">
        Inline PDF preview isn&apos;t reliable on mobile browsers. Open it in a new
        tab or download for offline reading.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-blue px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-blue-deep"
        >
          <ExternalLink className="size-4" /> Open PDF
        </a>
        <a
          href={`${url}?download=1`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue"
        >
          <Download className="size-4" /> Download
        </a>
      </div>
    </div>
  );
}
