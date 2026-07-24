"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import { LogoutButton } from "@/components/admin/LogoutButton";
import type { AnalyticsReport, ReportStatus, ReportWindow } from "@/lib/storage/reportShared";
import { formatReportWindow, formatPdfFileSize, CHANNEL_DISPLAY } from "@/lib/storage/reportShared";
import {
  FileText,
  Plus,
  ExternalLink,
  Trash2,
  Edit,
  Eye,
  Archive,
  CheckCircle,
  AlertCircle,
  FileCheck,
  BarChart3,
  Calendar,
} from "lucide-react";

type StatusFilter = "all" | ReportStatus;
type WindowFilter = "all" | ReportWindow;

export default function AdminYouTubeReportsPage() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("all");

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<AnalyticsReport | null>(null);

  const channelInfo = CHANNEL_DISPLAY["youtube-main"];

  const reloadReports = () => {
    fetch("/api/admin/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics reports");
        return res.json();
      })
      .then((data: AnalyticsReport[]) => {
        if (Array.isArray(data)) {
          setReports(data.filter((r) => r.channel === "youtube-main"));
        } else {
          setReports([]);
        }
        setError(null);
      })
      .catch((err) => {
        setError((err as Error).message || "Could not load YouTube reports.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let active = true;
    fetch("/api/admin/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load analytics reports");
        return res.json();
      })
      .then((data: AnalyticsReport[]) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setReports(data.filter((r) => r.channel === "youtube-main"));
        } else {
          setReports([]);
        }
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError((err as Error).message || "Could not load YouTube reports.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAction = async (
    id: string,
    action: "publish" | "unpublish" | "archive" | "delete"
  ) => {
    setBusyId(id);
    try {
      const res = await fetch(
        action === "delete"
          ? `/api/admin/reports/${id}`
          : `/api/admin/reports/${id}/${action}`,
        { method: action === "delete" ? "DELETE" : "POST" }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Failed to ${action} report`);
      }

      reloadReports();
    } catch (err) {
      setError((err as Error).message || `Failed to ${action} report.`);
    } finally {
      setBusyId(null);
      if (action === "delete") setDeleteTarget(null);
    }
  };

  // Metrics summary calculations
  const stats = useMemo(() => {
    const total = reports.length;
    const published = reports.filter((r) => r.status === "published").length;
    const drafts = reports.filter((r) => r.status === "draft").length;
    const archived = reports.filter((r) => r.status === "archived").length;

    const publishedReports = reports
      .filter((r) => r.status === "published")
      .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt));

    const latestPublished = publishedReports[0] || null;

    return { total, published, drafts, archived, latestPublished };
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        if (windowFilter !== "all" && r.reportWindow !== windowFilter) return false;
        return true;
      })
      .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt));
  }, [reports, statusFilter, windowFilter]);

  return (
    <div className="min-h-screen bg-surface-soft py-12 text-ink">
      <Container className="max-w-[1280px] px-6 space-y-8 text-left">
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between gap-4">
          <AdminBackButton href="/admin/channels" label="Back to Channel Settings" />
          <LogoutButton />
        </div>

        {/* Channel Identity Header & Actions */}
        <div className="rounded-2xl border border-border bg-white p-8 shadow-soft space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                  OFFICIAL YOUTUBE CHANNEL
                </span>
                <span className="text-xs font-mono text-muted">
                  {channelInfo.handle} · 19.7K Subscribers
                </span>
              </div>
              <h1 className="font-heading text-3xl font-bold text-ink">
                YouTube Analytics Reports
              </h1>
              <p className="text-sm text-body max-w-2xl">
                Upload and manage reviewed 30, 60 and 90-day PDF reports for the{" "}
                <span className="font-semibold text-ink">meetsofficial</span> YouTube channel.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin/reports/new?channel=youtube-main"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Upload YouTube Report
              </Link>
              <Link
                href="/admin/reports?channel=youtube-main"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition"
              >
                <FileText className="w-4 h-4 text-muted" />
                View All Reports
              </Link>
              <a
                href="/youtube"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition"
              >
                <ExternalLink className="w-4 h-4 text-muted" />
                View Public Page
              </a>
              <a
                href="/analytics?channel=youtube-main"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition"
              >
                <BarChart3 className="w-4 h-4 text-muted" />
                View Public Analytics
              </a>
            </div>
          </div>
        </div>

        {/* Real Report Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-border bg-white p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted block">
              Total Reports
            </span>
            <span className="font-heading text-2xl font-bold text-ink">
              {stats.total}
            </span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 block">
              Published
            </span>
            <span className="font-heading text-2xl font-bold text-emerald-800">
              {stats.published}
            </span>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 block">
              Drafts
            </span>
            <span className="font-heading text-2xl font-bold text-amber-800">
              {stats.drafts}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-700 block">
              Archived
            </span>
            <span className="font-heading text-2xl font-bold text-slate-800">
              {stats.archived}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-border bg-white p-5 space-y-1 shadow-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted block">
              Latest Published
            </span>
            <p className="font-semibold text-xs text-ink truncate">
              {stats.latestPublished ? stats.latestPublished.title : "None published yet"}
            </p>
            {stats.latestPublished && (
              <span className="text-[10px] text-muted font-mono block">
                {formatReportWindow(stats.latestPublished.reportWindow)}
              </span>
            )}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block">
              Filter Duration
            </span>
            <div className="flex flex-wrap gap-2">
              {(["all", "30", "60", "90", "custom"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWindowFilter(w)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    windowFilter === w
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-border bg-white text-ink hover:border-red-300"
                  }`}
                >
                  {w === "all" ? "All Durations" : w === "custom" ? "Custom Period" : `${w} Days`}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-ink uppercase tracking-wider block">
              Filter Status
            </span>
            <div className="flex flex-wrap gap-2">
              {(["all", "published", "draft", "archived"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    statusFilter === s
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-white text-ink hover:border-ink/30"
                  }`}
                >
                  {s === "all" ? "All Statuses" : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Error Notice */}
        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Report List & Rows */}
        {loading ? (
          <div className="p-16 text-center font-mono text-xs text-muted" role="status">
            Loading YouTube reports…
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white p-12 text-center space-y-4 shadow-soft">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-ink">
                No YouTube analytics reports yet.
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                Upload your first reviewed 30, 60 or 90-day PDF report for the meetsofficial YouTube channel.
              </p>
            </div>
            <Link
              href="/admin/reports/new?channel=youtube-main"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition"
            >
              <Plus className="w-4 h-4" />
              Upload First YouTube Report
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const isBusy = busyId === report.id;
              const statusStyle: Record<ReportStatus, string> = {
                draft: "bg-amber-50 border-amber-200 text-amber-800",
                published: "bg-emerald-50 border-emerald-200 text-emerald-800",
                archived: "bg-slate-50 border-slate-200 text-slate-700",
              };

              return (
                <div
                  key={report.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-border bg-white p-6 shadow-soft hover:border-red-200 transition"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${statusStyle[report.status]}`}
                      >
                        {report.status}
                      </span>
                      <span className="font-mono text-xs font-bold text-red-600 uppercase tracking-wider">
                        YouTube Main
                      </span>
                      <span className="font-mono text-xs text-muted">
                        · {formatReportWindow(report.reportWindow)} · {report.periodStart} → {report.periodEnd}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-ink">
                      {report.title}
                    </h3>

                    {report.executiveSummary && (
                      <p className="text-xs text-body line-clamp-2">
                        {report.executiveSummary}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted font-mono pt-1">
                      {report.pdfStorageKey ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <FileCheck className="w-3.5 h-3.5" />
                          {report.originalPdfFilename} ({formatPdfFileSize(report.pdfSizeBytes)})
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold">
                          ⚠️ No PDF file attached
                        </span>
                      )}
                      {report.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Published: {new Date(report.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Report Row Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/reports/${report.id}/edit`}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>

                    {report.status === "published" ? (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAction(report.id, "unpublish")}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition disabled:opacity-50"
                      >
                        {isBusy ? "…" : "Unpublish"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isBusy || !report.pdfStorageKey}
                        onClick={() => handleAction(report.id, "publish")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {isBusy ? "…" : "Publish"}
                      </button>
                    )}

                    {report.status !== "archived" && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleAction(report.id, "archive")}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition disabled:opacity-50"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archive
                      </button>
                    )}

                    {report.pdfStorageKey && (
                      <a
                        href={`/api/reports/${report.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink hover:border-red-300 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View PDF
                      </a>
                    )}

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setDeleteTarget(report)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-700 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>

      {/* Explicit Permanent Deletion Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-red-600">
              <div className="rounded-full bg-red-50 p-2 border border-red-100">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">
                Permanently delete this YouTube report?
              </h3>
            </div>

            <p className="text-xs text-body leading-relaxed">
              This will permanently delete the report record{" "}
              <strong className="text-ink font-semibold">&quot;{deleteTarget.title}&quot;</strong> and
              its uploaded PDF file from storage. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-ink hover:bg-surface-soft transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busyId === deleteTarget.id}
                onClick={() => handleAction(deleteTarget.id, "delete")}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {busyId === deleteTarget.id ? "Deleting…" : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
