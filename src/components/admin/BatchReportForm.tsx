"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import {
  formatPdfFileSize,
  type AnalyticsReportMetrics,
  type ChannelSlug,
  type ReportWindow,
} from "@/lib/storage/reportShared";

/**
 * Multi-window batch upload.
 *
 * Channel is chosen once and shared across every selected report window.
 * Each selected window (30, 60, 90, custom) gets its own panel, its own dates,
 * title, summary, highlights, optional metrics and PDF — and becomes its own
 * AnalyticsReport record. There is no combined "30-and-90" record.
 *
 * The submission loop is sequential and per-panel: a failed 90-day upload
 * cannot silently delete the completed 30-day draft.
 */

const CHANNELS: Array<{ slug: ChannelSlug; label: string; handle: string }> = [
  { slug: "instagram-fitness", label: "Instagram Fitness", handle: "@meetsofficial" },
  { slug: "instagram-finance", label: "Instagram Finance", handle: "@meet.fitfix" },
  { slug: "youtube-main", label: "YouTube Main", handle: "Meet Shah" },
];

const WINDOWS: ReportWindow[] = ["30", "60", "90", "custom"];

const WINDOW_LABEL: Record<ReportWindow, string> = {
  "30": "30 Days",
  "60": "60 Days",
  "90": "90 Days",
  custom: "Custom Period",
};

const WINDOW_PANEL_LABEL: Record<ReportWindow, string> = {
  "30": "30-Day Report",
  "60": "60-Day Report",
  "90": "90-Day Report",
  custom: "Custom Period Report",
};

const WINDOW_DAYS: Record<ReportWindow, number | null> = {
  "30": 30,
  "60": 60,
  "90": 90,
  custom: null,
};

type MetricKey = keyof AnalyticsReportMetrics;

const METRIC_FIELDS: Array<{
  key: MetricKey;
  label: string;
  instagramOnly?: boolean;
  youtubeOnly?: boolean;
}> = [
  { key: "audienceEnd", label: "Audience at end of period" },
  { key: "audienceGrowth", label: "Audience growth" },
  { key: "views", label: "Views" },
  { key: "reach", label: "Reach", instagramOnly: true },
  { key: "impressions", label: "Impressions", instagramOnly: true },
  { key: "interactions", label: "Interactions", instagramOnly: true },
  { key: "engagementRate", label: "Engagement rate (%)" },
  { key: "watchTimeMinutes", label: "Watch time (min)", youtubeOnly: true },
  { key: "averageViewDurationSeconds", label: "Avg view duration (sec)", youtubeOnly: true },
];

type PanelState = {
  window: ReportWindow;
  periodStart: string;
  periodEnd: string;
  title: string;
  titleTouched: boolean;
  executiveSummary: string;
  highlights: string[];
  metrics: Record<string, string>;
  pdfFile: File | null;
  originalFilename: string;
  pdfSizeBytes: number;
  reportId: string | null;
  pdfUploaded: boolean;
  status: "idle" | "saving" | "uploading" | "publishing" | "saved" | "published" | "error";
  message: string | null;
  collapsed: boolean;
  mismatchAck: boolean;
};

function suggestTitle(channel: ChannelSlug, window: ReportWindow): string {
  const c = CHANNELS.find((x) => x.slug === channel)!;
  if (window === "custom") return `${c.label} — Custom Period Insights Report`;
  return `${c.label} — ${window}-Day Insights Report`;
}

function isoAddDays(iso: string, days: number): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const d = new Date(t + days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number | null {
  const sa = new Date(a).getTime();
  const sb = new Date(b).getTime();
  if (!Number.isFinite(sa) || !Number.isFinite(sb)) return null;
  return Math.round((sb - sa) / (1000 * 60 * 60 * 24));
}

function emptyMetrics(): Record<string, string> {
  return Object.fromEntries(METRIC_FIELDS.map((f) => [f.key, ""]));
}

function makePanel(window: ReportWindow, channel: ChannelSlug): PanelState {
  return {
    window,
    periodStart: "",
    periodEnd: "",
    title: suggestTitle(channel, window),
    titleTouched: false,
    executiveSummary: "",
    highlights: [],
    metrics: emptyMetrics(),
    pdfFile: null,
    originalFilename: "",
    pdfSizeBytes: 0,
    reportId: null,
    pdfUploaded: false,
    status: "idle",
    message: null,
    collapsed: false,
    mismatchAck: false,
  };
}

function panelHasData(p: PanelState): boolean {
  return Boolean(
    p.periodStart ||
      p.periodEnd ||
      p.titleTouched ||
      p.executiveSummary ||
      p.highlights.some((h) => h.trim()) ||
      p.pdfFile ||
      p.pdfUploaded ||
      Object.values(p.metrics).some((v) => v !== ""),
  );
}

export function BatchReportForm() {
  const router = useRouter();
  const [channel, setChannel] = useState<ChannelSlug>("instagram-fitness");
  const [panels, setPanels] = useState<PanelState[]>([makePanel("30", "instagram-fitness")]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState<
    { panel: PanelState; title: string }[] | null
  >(null);

  const selectedWindows = useMemo(() => panels.map((p) => p.window), [panels]);
  const isYouTube = channel === "youtube-main";

  const dirty = useMemo(() => panels.some(panelHasData), [panels]);

  // Warn on tab close / navigation with unsaved data.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Keep un-touched panel titles in sync with the current channel.
  useEffect(() => {
    setPanels((prev) =>
      prev.map((p) =>
        p.titleTouched ? p : { ...p, title: suggestTitle(channel, p.window) },
      ),
    );
  }, [channel]);

  const togglePanel = (window: ReportWindow) => {
    const existing = panels.find((p) => p.window === window);
    if (existing) {
      if (panelHasData(existing)) {
        const ok = window === "custom"
          ? window && confirm("Remove the Custom Period report? Entered data will be discarded.")
          : confirm(`Remove the ${WINDOW_LABEL[window]} report? Entered data will be discarded.`);
        if (!ok) return;
      }
      setPanels((prev) => prev.filter((p) => p.window !== window));
    } else {
      setPanels((prev) => {
        const order = { "30": 0, "60": 1, "90": 2, custom: 3 } as const;
        return [...prev, makePanel(window, channel)].sort(
          (a, b) => order[a.window] - order[b.window],
        );
      });
    }
  };

  const patchPanel = (window: ReportWindow, patch: Partial<PanelState>) => {
    setPanels((prev) => prev.map((p) => (p.window === window ? { ...p, ...patch } : p)));
  };

  const setPanelEndDate = (window: ReportWindow, iso: string) => {
    const days = WINDOW_DAYS[window];
    setPanels((prev) =>
      prev.map((p) => {
        if (p.window !== window) return p;
        // Auto-suggest start date if it's empty and window has a fixed span.
        const shouldSuggestStart = !p.periodStart && days !== null && iso;
        return {
          ...p,
          periodEnd: iso,
          periodStart: shouldSuggestStart ? isoAddDays(iso, -(days - 1)) : p.periodStart,
          mismatchAck: false,
        };
      }),
    );
  };

  const setHighlight = (window: ReportWindow, idx: number, value: string) => {
    setPanels((prev) =>
      prev.map((p) => {
        if (p.window !== window) return p;
        const next = [...p.highlights];
        next[idx] = value;
        return { ...p, highlights: next };
      }),
    );
  };

  const addHighlight = (window: ReportWindow) =>
    setPanels((prev) =>
      prev.map((p) =>
        p.window === window && p.highlights.length < 5
          ? { ...p, highlights: [...p.highlights, ""] }
          : p,
      ),
    );

  const removeHighlight = (window: ReportWindow, idx: number) =>
    setPanels((prev) =>
      prev.map((p) =>
        p.window === window
          ? { ...p, highlights: p.highlights.filter((_, i) => i !== idx) }
          : p,
      ),
    );

  const applyPdf = (window: ReportWindow, file: File | null) => {
    setError(null);
    if (!file) {
      patchPanel(window, { pdfFile: null });
      return;
    }
    if (file.type !== "application/pdf") {
      patchPanel(window, {
        pdfFile: null,
        message: "Only PDF files are accepted.",
        status: "error",
      });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      patchPanel(window, {
        pdfFile: null,
        message: "PDF exceeds 25 MB limit.",
        status: "error",
      });
      return;
    }
    patchPanel(window, { pdfFile: file, message: null, status: "idle" });
  };

  const copySummaryTo = (from: ReportWindow, to: ReportWindow) => {
    const src = panels.find((p) => p.window === from);
    if (!src) return;
    setPanels((prev) =>
      prev.map((p) =>
        p.window === to
          ? {
              ...p,
              executiveSummary: src.executiveSummary,
              // Copy highlight *structure* (empty slots), never numeric values.
              highlights: Array(src.highlights.length).fill(""),
            }
          : p,
      ),
    );
  };

  const validatePanelForSave = (p: PanelState): string | null => {
    if (!p.periodStart || !p.periodEnd) return "Enter start and end dates.";
    if (p.periodEnd < p.periodStart) return "End date must be after start date.";
    const days = WINDOW_DAYS[p.window];
    const actual = daysBetween(p.periodStart, p.periodEnd);
    if (days !== null && actual !== null && Math.abs(actual - days) > 3 && !p.mismatchAck) {
      return `Dates span ${actual + 1} days but this is a ${days}-day report. Tick the confirmation below or fix the dates.`;
    }
    return null;
  };

  const savePanel = async (p: PanelState): Promise<PanelState> => {
    const validationError = validatePanelForSave(p);
    if (validationError) {
      return { ...p, status: "error", message: validationError };
    }

    const metrics = Object.fromEntries(
      Object.entries(p.metrics)
        .filter(([, v]) => v !== "" && !Number.isNaN(Number(v)))
        .map(([k, v]) => [k, Number(v)]),
    );
    const highlights = p.highlights.filter((h) => h.trim());

    const payload = {
      channel,
      reportWindow: p.window,
      periodStart: p.periodStart,
      periodEnd: p.periodEnd,
      title: p.title.trim() || undefined,
      executiveSummary: p.executiveSummary.trim() || undefined,
      highlights,
      metrics,
    };

    let next: PanelState = { ...p, status: "saving", message: null };
    try {
      let reportId = p.reportId;
      if (reportId) {
        const res = await fetch(`/api/admin/reports/${reportId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Save failed");
      } else {
        const res = await fetch("/api/admin/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Save failed");
        reportId = data.reportId ?? data.report?.id ?? null;
      }
      next = { ...next, reportId, status: "saved", message: "Draft saved" };
    } catch (err) {
      return { ...p, status: "error", message: (err as Error).message };
    }

    const stagedPdf = next.pdfFile;
    if (stagedPdf && next.reportId) {
      next = { ...next, status: "uploading", message: "Uploading PDF…" };
      try {
        const form = new FormData();
        form.append("file", stagedPdf);
        const res = await fetch(`/api/admin/reports/${next.reportId}/pdf`, {
          method: "POST",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "PDF upload failed");
        next = {
          ...next,
          pdfFile: null,
          pdfUploaded: true,
          originalFilename: (data.report?.originalPdfFilename as string) ?? "",
          pdfSizeBytes: (data.report?.pdfSizeBytes as number) ?? 0,
          status: "saved",
          message: "Draft saved with PDF",
        };
      } catch (err) {
        // Metadata was saved; only the PDF failed. Preserve the draft.
        return {
          ...next,
          status: "error",
          message: `${(err as Error).message}. Draft was saved without the PDF.`,
        };
      }
    }

    return next;
  };

  const publishPanel = async (p: PanelState): Promise<PanelState> => {
    if (!p.reportId) return { ...p, status: "error", message: "Save the draft first." };
    if (!p.pdfUploaded && !p.pdfFile)
      return { ...p, status: "error", message: "Upload the PDF before publishing." };
    try {
      const res = await fetch(`/api/admin/reports/${p.reportId}/publish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Publish failed");
      return { ...p, status: "published", message: "Published" };
    } catch (err) {
      return { ...p, status: "error", message: (err as Error).message };
    }
  };

  const runSequentially = async (
    op: (p: PanelState) => Promise<PanelState>,
  ): Promise<PanelState[]> => {
    const next: PanelState[] = [];
    for (const p of panels) {
      // eslint-disable-next-line no-await-in-loop
      const updated = await op(p);
      next.push(updated);
      setPanels((prev) => prev.map((x) => (x.window === updated.window ? updated : x)));
    }
    return next;
  };

  const saveAllDrafts = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    const results = await runSequentially(savePanel);
    setBusy(false);
    const ok = results.filter((r) => r.status !== "error").length;
    const fail = results.length - ok;
    setNotice(
      fail === 0
        ? `Saved ${ok} draft${ok === 1 ? "" : "s"}.`
        : `Saved ${ok} of ${results.length}. ${fail} need attention below.`,
    );
  };

  const previewPublishReady = () => {
    // A report is publish-ready when it's already saved AND has a PDF (uploaded
    // or staged for this run). Reports still needing a PDF are flagged in the
    // per-panel status; they will not be included in the confirmation list.
    const savedWithPdf = panels.filter(
      (p) => p.reportId && (p.pdfUploaded || p.pdfFile),
    );
    if (savedWithPdf.length === 0) {
      setError("Save drafts and attach PDFs first. Nothing is ready to publish yet.");
      return;
    }
    setConfirmPublish(savedWithPdf.map((p) => ({ panel: p, title: p.title })));
  };

  const doPublish = async () => {
    if (!confirmPublish) return;
    setConfirmPublish(null);
    setBusy(true);
    setError(null);
    setNotice(null);

    const targetWindows = new Set(confirmPublish.map((c) => c.panel.window));
    const next: PanelState[] = [];
    for (const p of panels) {
      if (!targetWindows.has(p.window)) {
        next.push(p);
        continue;
      }
      // Upload PDF first if it's still staged.
      let current = p;
      if (!p.pdfUploaded && p.pdfFile) {
        // eslint-disable-next-line no-await-in-loop
        current = await savePanel(p);
        setPanels((prev) => prev.map((x) => (x.window === current.window ? current : x)));
      }
      // eslint-disable-next-line no-await-in-loop
      const published = await publishPanel(current);
      next.push(published);
      setPanels((prev) => prev.map((x) => (x.window === published.window ? published : x)));
    }
    setBusy(false);
    const publishedCount = next.filter((n) => n.status === "published").length;
    if (publishedCount > 0) {
      setNotice(`Published ${publishedCount} report${publishedCount === 1 ? "" : "s"}.`);
      // Give the user a moment to read the notice, then jump to the library.
      setTimeout(() => router.push("/admin/reports"), 900);
    } else {
      setError("No reports were published — see per-panel status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Shared channel */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-3">
          Channel (applies to every selected window)
        </label>
        <div className="grid gap-2 sm:grid-cols-3">
          {CHANNELS.map((c) => {
            const active = channel === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setChannel(c.slug)}
                aria-pressed={active}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-blue bg-blue-pale text-ink"
                    : "border-border bg-white text-ink hover:border-blue/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  {active && <Check className="size-3.5 text-blue" aria-hidden />}
                  <span className="font-heading text-sm font-bold">{c.label}</span>
                </div>
                <span className="mt-1 block font-mono text-[10px] text-muted">{c.handle}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Window multi-select */}
      <section className="rounded-2xl border border-border bg-white p-6 shadow-soft">
        <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-3">
          Report windows (choose one or more)
        </label>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Select report windows"
        >
          {WINDOWS.map((w) => {
            const active = selectedWindows.includes(w);
            return (
              <button
                key={w}
                type="button"
                onClick={() => togglePanel(w)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  active
                    ? "border-blue bg-blue-pale text-blue"
                    : "border-border bg-white text-ink hover:border-blue/30"
                }`}
              >
                {active ? <Check className="size-3.5" aria-hidden /> : <span className="size-3.5" aria-hidden />}
                {WINDOW_LABEL[w]}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted">
          Each selected window creates its own report record with its own PDF and dates.
        </p>
      </section>

      {panels.length === 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          Select at least one report window above to start uploading.
        </div>
      )}

      {/* Panels */}
      {panels.map((p) => (
        <PanelCard
          key={p.window}
          panel={p}
          isYouTube={isYouTube}
          otherPanelWindows={panels.filter((x) => x.window !== p.window).map((x) => x.window)}
          onChange={(patch) => patchPanel(p.window, patch)}
          onEndDateChange={(v) => setPanelEndDate(p.window, v)}
          onSetHighlight={(idx, v) => setHighlight(p.window, idx, v)}
          onAddHighlight={() => addHighlight(p.window)}
          onRemoveHighlight={(idx) => removeHighlight(p.window, idx)}
          onFile={(file) => applyPdf(p.window, file)}
          onCopyFrom={(fromWindow) => copySummaryTo(fromWindow, p.window)}
          onRemovePanel={() => togglePanel(p.window)}
        />
      ))}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}
      {notice && !error && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          {notice}
        </div>
      )}

      {/* Batch actions */}
      {panels.length > 0 && (
        <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
          <button
            type="button"
            disabled={busy}
            onClick={saveAllDrafts}
            className="rounded-lg border border-border bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30 disabled:opacity-50"
          >
            {busy ? "Working…" : "Save all as draft"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={previewPublishReady}
            className="rounded-lg bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-deep disabled:opacity-50"
          >
            Publish ready reports
          </button>
          <span className="text-[11px] text-muted">
            {panels.length} report{panels.length === 1 ? "" : "s"} pending
          </span>
        </div>
      )}

      {confirmPublish && (
        <ConfirmPublishDialog
          items={confirmPublish}
          onCancel={() => setConfirmPublish(null)}
          onConfirm={doPublish}
        />
      )}
    </div>
  );
}

function PanelCard({
  panel,
  isYouTube,
  otherPanelWindows,
  onChange,
  onEndDateChange,
  onSetHighlight,
  onAddHighlight,
  onRemoveHighlight,
  onFile,
  onCopyFrom,
  onRemovePanel,
}: {
  panel: PanelState;
  isYouTube: boolean;
  otherPanelWindows: ReportWindow[];
  onChange: (patch: Partial<PanelState>) => void;
  onEndDateChange: (v: string) => void;
  onSetHighlight: (idx: number, v: string) => void;
  onAddHighlight: () => void;
  onRemoveHighlight: (idx: number) => void;
  onFile: (file: File | null) => void;
  onCopyFrom: (fromWindow: ReportWindow) => void;
  onRemovePanel: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const days = WINDOW_DAYS[panel.window];
  const actual =
    panel.periodStart && panel.periodEnd
      ? (daysBetween(panel.periodStart, panel.periodEnd) ?? 0) + 1
      : null;
  const mismatch = days !== null && actual !== null && Math.abs(actual - days) > 3;

  const statusColor: Record<PanelState["status"], string> = {
    idle: "text-muted",
    saving: "text-blue",
    uploading: "text-blue",
    publishing: "text-blue",
    saved: "text-emerald-700",
    published: "text-emerald-700",
    error: "text-red-700",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
      <header className="flex items-center justify-between gap-3 border-b border-border bg-surface-soft px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange({ collapsed: !panel.collapsed })}
            aria-label={panel.collapsed ? "Expand panel" : "Collapse panel"}
            className="rounded-lg border border-border bg-white p-1.5 text-ink hover:border-blue/30"
          >
            {panel.collapsed ? (
              <ChevronDown className="size-3.5" aria-hidden />
            ) : (
              <ChevronUp className="size-3.5" aria-hidden />
            )}
          </button>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue">
              {WINDOW_PANEL_LABEL[panel.window]}
            </span>
            <p className="text-xs text-muted">{panel.title || "Untitled report"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {panel.message && (
            <span className={`text-[11px] font-bold ${statusColor[panel.status]}`}>
              {panel.status === "saved"
                ? "✓ "
                : panel.status === "published"
                  ? "✓ "
                  : panel.status === "error"
                    ? "! "
                    : ""}
              {panel.message}
            </span>
          )}
          <button
            type="button"
            onClick={onRemovePanel}
            className="rounded-full border border-border bg-white p-1.5 text-muted hover:border-red-200 hover:text-red-600"
            aria-label="Remove this report from the batch"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </div>
      </header>

      {!panel.collapsed && (
        <div className="space-y-6 p-6">
          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
                Start date
              </label>
              <input
                type="date"
                value={panel.periodStart}
                onChange={(e) => onChange({ periodStart: e.target.value, mismatchAck: false })}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
                End date
              </label>
              <input
                type="date"
                value={panel.periodEnd}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
              />
              {days !== null && (
                <p className="mt-1 text-[10px] text-muted">
                  Start auto-fills to {days} days before end date.
                </p>
              )}
            </div>
          </div>

          {mismatch && (
            <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <input
                type="checkbox"
                checked={panel.mismatchAck}
                onChange={(e) => onChange({ mismatchAck: e.target.checked })}
                className="mt-0.5"
              />
              <span>
                Dates span {actual} days but this is labelled a {days}-day report.
                Tick to confirm.
              </span>
            </label>
          )}

          {/* Title */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
              Report title
            </label>
            <input
              type="text"
              value={panel.title}
              onChange={(e) => onChange({ title: e.target.value, titleTouched: true })}
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
            />
          </div>

          {/* Summary */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[10px] uppercase font-bold text-muted tracking-widest">
                Executive summary
              </label>
              {otherPanelWindows.length > 0 && (
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-muted">Copy structure from</span>
                  {otherPanelWindows.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => onCopyFrom(w)}
                      className="rounded-full border border-border bg-white px-2 py-0.5 font-bold uppercase tracking-wider text-blue hover:border-blue"
                    >
                      {WINDOW_LABEL[w]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <textarea
              rows={3}
              value={panel.executiveSummary}
              onChange={(e) => onChange({ executiveSummary: e.target.value })}
              maxLength={2000}
              placeholder="Short public summary written for this reporting period."
              className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
            />
          </div>

          {/* Highlights */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-[10px] uppercase font-bold text-muted tracking-widest">
                Key highlights (up to 5)
              </label>
              <button
                type="button"
                onClick={onAddHighlight}
                disabled={panel.highlights.length >= 5}
                className="text-[10px] font-bold uppercase tracking-wider text-blue hover:underline disabled:text-muted"
              >
                + Add highlight
              </button>
            </div>
            <div className="space-y-2">
              {panel.highlights.map((h, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => onSetHighlight(idx, e.target.value)}
                    maxLength={240}
                    className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm text-ink focus:border-blue focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveHighlight(idx)}
                    className="rounded-lg border border-border bg-white px-3 py-2 text-[11px] font-bold text-muted hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
              Optional headline metrics
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {METRIC_FIELDS.filter((f) =>
                isYouTube ? !f.instagramOnly : !f.youtubeOnly,
              ).map((f) => (
                <div key={f.key}>
                  <label className="block text-[10px] font-mono text-muted mb-1">
                    {f.label}
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={panel.metrics[f.key] ?? ""}
                    onChange={(e) =>
                      onChange({ metrics: { ...panel.metrics, [f.key]: e.target.value } })
                    }
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:border-blue focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted">
              Leave a field blank if you don't want it shown. Empty values render as no metric,
              never as zero.
            </p>
          </div>

          {/* PDF */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
              {WINDOW_PANEL_LABEL[panel.window]} PDF
            </label>
            {panel.pdfUploaded && !panel.pdfFile ? (
              <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
                <span>
                  Uploaded: <strong>{panel.originalFilename || "report.pdf"}</strong>
                  {panel.pdfSizeBytes > 0 &&
                    ` · ${formatPdfFileSize(panel.pdfSizeBytes)}`}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-bold uppercase tracking-wider hover:border-emerald-500"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  onFile(file ?? null);
                }}
                className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragOver ? "border-blue bg-blue/5" : "border-border bg-surface-soft"
                }`}
              >
                {panel.pdfFile ? (
                  <div className="text-sm text-ink">
                    <p className="font-bold">{panel.pdfFile.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatPdfFileSize(panel.pdfFile.size)}
                    </p>
                    <button
                      type="button"
                      onClick={() => onFile(null)}
                      className="mt-3 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-ink font-bold">Drop the reviewed PDF here</p>
                    <p className="text-xs text-muted mt-1">or</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 rounded-lg bg-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-deep"
                    >
                      Choose file
                    </button>
                    <p className="mt-3 text-[10px] text-muted">
                      PDF only · max 25 MB · this window only
                    </p>
                  </>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function ConfirmPublishDialog({
  items,
  onCancel,
  onConfirm,
}: {
  items: { panel: PanelState; title: string }[];
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-confirm-title"
    >
      <div className="max-w-md w-full rounded-2xl border border-border bg-white p-6 shadow-2xl">
        <h2 id="publish-confirm-title" className="font-heading text-lg font-bold text-ink">
          Publish {items.length} analytics report{items.length === 1 ? "" : "s"}?
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-body">
          {items.map((it) => (
            <li key={it.panel.window} className="flex gap-2">
              <span className="text-blue" aria-hidden>
                •
              </span>
              <span>{it.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          Each will become publicly visible and downloadable at /analytics.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-deep"
          >
            Publish {items.length} report{items.length === 1 ? "" : "s"}
          </button>
        </div>
      </div>
    </div>
  );
}
