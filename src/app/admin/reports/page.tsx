"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { AnalyticsReport, ReportStatus } from "@/lib/storage/reportShared";
import { CHANNEL_DISPLAY, formatReportWindow, formatPdfFileSize } from "@/lib/storage/reportShared";

type Filter = "all" | ReportStatus;

/**
 * Admin analytics report library.
 *
 * Lists every report (draft / published / archived) with quick actions. Public
 * visibility is derived from `status === "published"` — never colour alone,
 * always paired with a text badge.
 */
export default function AdminReportsPage() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const load = () =>
    fetch("/api/admin/reports")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setReports(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Could not load the report archive."))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "publish" | "unpublish" | "archive" | "delete") => {
    if (action === "delete") {
      if (!window.confirm("Permanently delete this report? The PDF file will also be removed.")) {
        return;
      }
    }
    setBusyId(id);
    try {
      const res = await fetch(
        action === "delete"
          ? `/api/admin/reports/${id}`
          : `/api/admin/reports/${id}/${action}`,
        { method: action === "delete" ? "DELETE" : "POST" },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Failed to ${action}`);
      }
      await load();
    } catch (err) {
      setError((err as Error).message || `Failed to ${action} the report.`);
    } finally {
      setBusyId(null);
    }
  };

  const filtered = reports.filter((r) => (filter === "all" ? true : r.status === filter));

  return (
    <div className="min-h-screen bg-surface-soft py-12 text-ink">
      <Container className="max-w-[1280px] px-6 space-y-8 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest block">
              Analytics reports
            </span>
            <h1 className="font-heading text-3xl font-bold text-ink">Report library</h1>
            <p className="mt-1 text-xs text-muted">
              Upload reviewed PDF reports. Drafts stay private until you publish.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/proposals"
              className="rounded-lg bg-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-deep"
            >
              Inquiries / Proposals
            </Link>
            <Link
              href="/admin/reports/new"
              className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30"
            >
              + Upload PDF Report
            </Link>
            <a
              href="/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30"
            >
              View public analytics ↗
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter reports">
          {(["all", "draft", "published", "archived"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                filter === key
                  ? "border-blue bg-blue text-white"
                  : "border-border bg-white text-ink hover:border-blue/30"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-muted" role="status">
            Loading reports…
          </div>
        ) : filtered.length === 0 ? (
          <div className="space-y-2 rounded-2xl border border-border bg-white p-12 text-center">
            <p className="font-heading text-sm font-bold text-ink">No reports match this filter.</p>
            <p className="text-xs text-muted">
              Upload a reviewed PDF from{" "}
              <Link href="/admin/reports/new" className="text-blue underline">
                New report
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((rpt) => (
              <ReportRow
                key={rpt.id}
                report={rpt}
                busy={busyId === rpt.id}
                onAct={act}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function ReportRow({
  report,
  busy,
  onAct,
}: {
  report: AnalyticsReport;
  busy: boolean;
  onAct: (id: string, action: "publish" | "unpublish" | "archive" | "delete") => void;
}) {
  const channel = CHANNEL_DISPLAY[report.channel];
  const statusStyle: Record<ReportStatus, string> = {
    draft: "bg-amber-50 border-amber-200 text-amber-700",
    published: "bg-emerald-50 border-emerald-200 text-emerald-700",
    archived: "bg-slate-50 border-slate-200 text-slate-700",
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${statusStyle[report.status]}`}
          >
            {report.status}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue">
            {channel.name}
          </span>
          <span className="font-mono text-xs text-muted">
            · {formatReportWindow(report.reportWindow)} · {report.periodStart} → {report.periodEnd}
          </span>
        </div>
        <h3 className="font-heading text-lg font-bold text-ink">{report.title}</h3>
        {report.executiveSummary && (
          <p className="text-xs text-body line-clamp-2">{report.executiveSummary}</p>
        )}
        {report.pdfStorageKey ? (
          <p className="text-[11px] text-muted">
            PDF: {report.originalPdfFilename} · {formatPdfFileSize(report.pdfSizeBytes)}
          </p>
        ) : (
          <p className="text-[11px] text-amber-700">No PDF uploaded yet.</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/admin/reports/${report.id}/edit`}
          className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue/30"
        >
          Edit
        </Link>
        {report.status === "published" ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAct(report.id, "unpublish")}
            className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue/30 disabled:opacity-50"
          >
            {busy ? "…" : "Unpublish"}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy || !report.pdfStorageKey}
            onClick={() => onAct(report.id, "publish")}
            className="rounded-lg bg-blue px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-blue-deep disabled:opacity-50"
            title={!report.pdfStorageKey ? "Upload the PDF before publishing" : ""}
          >
            {busy ? "…" : "Publish"}
          </button>
        )}
        {report.status !== "archived" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onAct(report.id, "archive")}
            className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue/30 disabled:opacity-50"
          >
            Archive
          </button>
        )}
        {report.status === "published" && (
          <a
            href={`/api/reports/${report.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink hover:border-blue/30"
          >
            View PDF
          </a>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => onAct(report.id, "delete")}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
