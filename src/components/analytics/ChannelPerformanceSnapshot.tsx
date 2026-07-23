"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils/numbers";
import type { AnalyticsReport } from "@/lib/storage/reportShared";
import { FileText, Download, Loader2 } from "lucide-react";

/**
 * Compact "latest report" tile used on the /fitness and /finance portfolio
 * pages. Shows metadata for the most recent published PDF report and links
 * out to the report detail page + PDF download.
 */

type LegacySource = "instagram_fitness" | "instagram_finance";
type ChannelSlug = "instagram-fitness" | "instagram-finance";

const LEGACY_TO_SLUG: Record<LegacySource, ChannelSlug> = {
  instagram_fitness: "instagram-fitness",
  instagram_finance: "instagram-finance",
};

const CHANNEL_LABEL: Record<ChannelSlug, string> = {
  "instagram-fitness": "Instagram Fitness",
  "instagram-finance": "Instagram Finance",
};

export default function ChannelPerformanceSnapshot({
  source,
}: {
  source: LegacySource;
}) {
  const channel = LEGACY_TO_SLUG[source];
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/reports?channel=${channel}&latest=true`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setReport(data ?? null))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, [channel]);

  if (loading) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center border border-border bg-white shadow-sm text-center">
        <Loader2 className="size-8 text-blue animate-spin" />
        <p className="mt-4 text-xs font-semibold text-body">
          Loading latest {CHANNEL_LABEL[channel]} report…
        </p>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center border border-border bg-white shadow-sm text-center">
        <FileText className="size-8 text-muted" />
        <h3 className="mt-4 font-heading text-base font-bold text-ink">
          No published reports yet
        </h3>
        <p className="mt-2 text-xs text-body max-w-[36ch] leading-relaxed">
          Reviewed insights reports for {CHANNEL_LABEL[channel]} will appear here once published.
        </p>
      </Card>
    );
  }

  const metrics = report.metrics ?? {};
  const headline = [
    { label: "Views", value: metrics.views },
    { label: "Reach", value: metrics.reach },
    { label: "Engagement", value: metrics.engagementRate, suffix: "%" },
  ].filter((m) => m.value !== null && m.value !== undefined);

  return (
    <Card className="p-8 border border-border bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <Badge className="bg-blue-pale text-blue border-transparent">
          Latest report
        </Badge>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {report.reportWindow === "custom" ? "Custom Period" : `${report.reportWindow} Days`}
        </span>
      </div>
      <h3 className="mt-4 font-heading text-lg font-bold text-ink">{report.title}</h3>
      <p className="mt-1 text-[11px] text-muted">
        {report.periodStart} → {report.periodEnd}
      </p>

      {report.executiveSummary && (
        <p className="mt-3 text-xs text-body line-clamp-3">{report.executiveSummary}</p>
      )}

      {headline.length > 0 && (
        <dl className="mt-5 grid grid-cols-3 gap-3">
          {headline.map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-surface-soft px-3 py-2">
              <dt className="text-[9px] font-bold uppercase tracking-wider text-muted">
                {m.label}
              </dt>
              <dd className="mt-1 font-heading text-base font-bold text-ink">
                {typeof m.value === "number" ? formatNumber(m.value) : m.value}
                {m.suffix ?? ""}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/analytics/reports/${report.slug}`}
          className="rounded-full border border-border bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue"
        >
          View report
        </Link>
        <a
          href={`/api/reports/${report.id}/pdf?download=1`}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue"
        >
          <Download className="size-3.5" /> Download PDF
        </a>
      </div>
    </Card>
  );
}
