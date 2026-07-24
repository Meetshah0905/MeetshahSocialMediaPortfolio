"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import type { AnalyticsReport, ReportStatus } from "@/lib/storage/reportShared";
import { formatReportWindow, formatPdfFileSize } from "@/lib/storage/reportShared";
import { YOUTUBE_CHANNEL } from "@/config/youtube";
import {
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Archive,
  AlertCircle,
  Upload,
} from "lucide-react";

export default function AdminYouTubeReportsPage() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | ReportStatus>("all");

  // Deletion modal state (§8)
  const [deleteModalReport, setDeleteModalReport] = useState<AnalyticsReport | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/admin/reports");
        if (!res.ok) throw new Error("Failed to load reports");
        const data: AnalyticsReport[] = await res.json();
        const ytReports = (Array.isArray(data) ? data : []).filter(
          (r) => r.channel === "youtube-main"
        );
        if (isMounted) setReports(ytReports);
      } catch {
        if (isMounted) setMsg({ type: "error", text: "Could not load YouTube analytics reports." });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchYouTubeReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("Failed to load reports");
      const data: AnalyticsReport[] = await res.json();
      const ytReports = (Array.isArray(data) ? data : []).filter(
        (r) => r.channel === "youtube-main"
      );
      setReports(ytReports);
    } catch {
      setMsg({ type: "error", text: "Could not load YouTube analytics reports." });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "publish" | "unpublish" | "archive") => {
    setBusyId(id);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/reports/${id}/${action}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Failed to ${action} report`);
      }
      setMsg({ type: "success", text: `Report ${action}ed successfully.` });
      await fetchYouTubeReports();
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : `Failed to ${action} report` });
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalReport) return;
    if (confirmInput.trim().toLowerCase() !== "delete") {
      setMsg({ type: "error", text: "Please type DELETE to confirm report deletion." });
      return;
    }

    setDeleting(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/reports/${deleteModalReport.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete report");
      }
      setMsg({ type: "success", text: "YouTube Report and storage PDF permanently deleted." });
      setDeleteModalReport(null);
      setConfirmInput("");
      await fetchYouTubeReports();
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to delete report" });
    } finally {
      setDeleting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const publishedCount = reports.filter((r) => r.status === "published").length;
  const draftCount = reports.filter((r) => r.status === "draft").length;
  const archivedCount = reports.filter((r) => r.status === "archived").length;

  return (
    <div className="min-h-screen bg-surface py-12">
      <Container>
        <div className="mb-6">
          <AdminBackButton label="Back to YouTube Channel Manager" href="/admin/youtube" />
        </div>

        {/* Header Card */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                  YOUTUBE REPORTS CONTROL
                </span>
                <span className="text-xs text-slate-400 font-mono">{YOUTUBE_CHANNEL.handle}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                YouTube Analytics PDF Reports
              </h1>
              <p className="text-xs text-slate-300">
                Upload, review, publish, and manage verified 30, 60, and 90-day PDF reports stored permanently in Supabase Storage.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/admin/reports/new"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-red-700 transition-all"
              >
                <Upload className="size-4" />
                <span>Upload YouTube Report</span>
              </Link>

              <Link
                href="/youtube#reports"
                target="_blank"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all"
              >
                <Eye className="size-3.5" />
                <span>View Public Reports</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Total Reports</span>
              <span className="text-lg font-bold font-heading text-white">{reports.length}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Published</span>
              <span className="text-lg font-bold font-heading text-emerald-400">{publishedCount}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Drafts</span>
              <span className="text-lg font-bold font-heading text-amber-400">{draftCount}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Archived</span>
              <span className="text-lg font-bold font-heading text-slate-400">{archivedCount}</span>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {msg && (
          <div
            className={`p-4 rounded-2xl mb-6 text-xs font-medium border flex items-center justify-between ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="font-bold underline ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 border border-border rounded-full w-fit">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === "all" ? "bg-slate-900 text-white" : "text-body hover:text-ink"
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setFilterStatus("published")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === "published" ? "bg-emerald-600 text-white" : "text-body hover:text-ink"
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setFilterStatus("draft")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === "draft" ? "bg-amber-600 text-white" : "text-body hover:text-ink"
            }`}
          >
            Drafts ({draftCount})
          </button>
          <button
            onClick={() => setFilterStatus("archived")}
            className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
              filterStatus === "archived" ? "bg-slate-600 text-white" : "text-body hover:text-ink"
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>

        {/* Table View */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-xs text-muted">Loading YouTube report catalog...</div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-ink">No YouTube reports found.</p>
              <p className="text-xs text-muted max-w-md mx-auto">
                Upload reviewed 30, 60, or 90-day YouTube analytics PDF reports to store them permanently in Supabase storage and publish them to visitors.
              </p>
              <div className="pt-2">
                <Button href="/admin/reports/new" size="sm" className="rounded-full bg-red-600 text-white">
                  Upload YouTube Report
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-soft border-b border-border text-muted uppercase font-mono tracking-wider text-[10px]">
                    <th className="p-4">Report Title & Window</th>
                    <th className="p-4">Reporting Period</th>
                    <th className="p-4">PDF Storage File</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 max-w-sm">
                        <div className="space-y-1">
                          <span className="font-heading font-bold text-ink block leading-snug">
                            {report.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-mono font-bold text-[10px]">
                              {formatReportWindow(report.reportWindow)}
                            </span>
                            <span className="text-[10px] text-muted">ID: {report.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-700">
                        {report.periodStart} to {report.periodEnd}
                      </td>
                      <td className="p-4 font-mono text-[11px]">
                        <div className="space-y-1">
                          <span className="text-slate-800 font-medium block truncate max-w-[200px]" title={report.originalPdfFilename}>
                            {report.originalPdfFilename || "report.pdf"}
                          </span>
                          <span className="text-[10px] text-muted block">
                            {formatPdfFileSize(report.pdfSizeBytes)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {report.status === "published" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                            <CheckCircle className="size-3.5" /> Published
                          </span>
                        ) : report.status === "draft" ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                            <AlertCircle className="size-3.5" /> Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-bold text-[11px]">
                            <Archive className="size-3.5" /> Archived
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/analytics/reports/${report.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors"
                            title="View Public Detail Page"
                          >
                            <Eye className="size-4" />
                          </Link>

                          <Link
                            href={`/admin/reports/${report.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors"
                            title="Edit Report Metadata / Replace PDF"
                          >
                            <Edit className="size-4" />
                          </Link>

                          {report.status === "published" ? (
                            <button
                              onClick={() => handleAction(report.id, "unpublish")}
                              disabled={busyId === report.id}
                              className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-bold text-[10px] hover:bg-amber-100 transition-colors"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(report.id, "publish")}
                              disabled={busyId === report.id}
                              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] hover:bg-emerald-100 transition-colors"
                            >
                              Publish
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setDeleteModalReport(report);
                              setConfirmInput("");
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors"
                            title="Delete Report & PDF File"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>

      {/* Delete Confirmation Modal (§8) */}
      {deleteModalReport && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200">
            <div className="size-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="size-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-slate-900">Delete YouTube Report?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will permanently delete:
              </p>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pt-1 font-medium">
                <li>Report metadata record (<code>{deleteModalReport.id}</code>)</li>
                <li>The uploaded PDF storage file (<code>{deleteModalReport.originalPdfFilename}</code>)</li>
                <li>Public report page URL (<code>/analytics/reports/{deleteModalReport.slug}</code>)</li>
              </ul>
              <p className="text-xs text-red-600 font-bold pt-2">This action cannot be undone.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block">
                Type <strong className="text-red-600">DELETE</strong> to confirm permanent deletion:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Type DELETE"
                className="w-full p-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-red-600 text-xs font-mono font-bold"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                onClick={() => setDeleteModalReport(null)}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleting || confirmInput.trim().toLowerCase() !== "delete"}
                size="sm"
                className="rounded-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-40"
              >
                {deleting ? "Deleting..." : "Permanently Delete Report"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
