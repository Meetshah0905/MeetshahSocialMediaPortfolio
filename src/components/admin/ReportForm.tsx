"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatPdfFileSize,
  type AnalyticsReport,
  type ChannelSlug,
  type ReportWindow,
} from "@/lib/storage/reportShared";

const CHANNELS: Array<{ slug: ChannelSlug; label: string; handle: string }> = [
  { slug: "instagram-fitness", label: "Instagram Fitness", handle: "@meetsofficial" },
  { slug: "instagram-finance", label: "Instagram Finance", handle: "@meet.fitfix" },
  { slug: "youtube-main", label: "YouTube Main", handle: "Meet Shah" },
];

const WINDOWS: Array<{ value: ReportWindow; label: string; days: number | null }> = [
  { value: "30", label: "30 Days", days: 30 },
  { value: "60", label: "60 Days", days: 60 },
  { value: "90", label: "90 Days", days: 90 },
  { value: "custom", label: "Custom Period", days: null },
];

type MetricKey = keyof NonNullable<AnalyticsReport["metrics"]>;

const METRIC_FIELDS: Array<{ key: MetricKey; label: string; instagramOnly?: boolean; youtubeOnly?: boolean }> = [
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

function daysBetween(start: string, end: string): number | null {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (!Number.isFinite(s) || !Number.isFinite(e)) return null;
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

function suggestTitle(channel: ChannelSlug, window: ReportWindow): string {
  const c = CHANNELS.find((x) => x.slug === channel)!;
  if (window === "custom") return `${c.label} — Custom Period Insights Report`;
  return `${c.label} — ${window}-Day Insights Report`;
}

export type ReportFormMode = "create" | "edit";

export function ReportForm({
  mode,
  initial,
}: {
  mode: ReportFormMode;
  initial?: AnalyticsReport;
}) {
  const router = useRouter();

  const [channel, setChannel] = useState<ChannelSlug>(initial?.channel ?? "instagram-fitness");
  const [reportWindow, setReportWindow] = useState<ReportWindow>(initial?.reportWindow ?? "30");
  const [periodStart, setPeriodStart] = useState(initial?.periodStart ?? "");
  const [periodEnd, setPeriodEnd] = useState(initial?.periodEnd ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [executiveSummary, setExecutiveSummary] = useState(initial?.executiveSummary ?? "");
  const [highlights, setHighlights] = useState<string[]>(initial?.highlights ?? []);
  const [metrics, setMetrics] = useState<Record<string, string>>(
    Object.fromEntries(
      METRIC_FIELDS.map((f) => [
        f.key,
        initial?.metrics?.[f.key] !== undefined && initial?.metrics?.[f.key] !== null
          ? String(initial!.metrics![f.key])
          : "",
      ]),
    ),
  );

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDragOver, setPdfDragOver] = useState(false);
  const [busy, setBusy] = useState<null | "save" | "upload" | "publish">(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [mismatchAck, setMismatchAck] = useState(false);
  const [reportId, setReportId] = useState<string | null>(initial?.id ?? null);
  const [pdfUploaded, setPdfUploaded] = useState(!!initial?.pdfStorageKey);
  const [originalFilename, setOriginalFilename] = useState<string>(initial?.originalPdfFilename ?? "");
  const [pdfSize, setPdfSize] = useState<number>(initial?.pdfSizeBytes ?? 0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const suggestedTitle = useMemo(() => suggestTitle(channel, reportWindow), [channel, reportWindow]);

  // Warn (don't block) when the picked dates don't match the window.
  const dayCount = periodStart && periodEnd ? daysBetween(periodStart, periodEnd) : null;
  const expectedDays = WINDOWS.find((w) => w.value === reportWindow)?.days ?? null;
  const dateMismatch =
    dayCount !== null && expectedDays !== null && Math.abs(dayCount - expectedDays) > 3;

  const isPeriodValid = !!periodStart && !!periodEnd && periodStart <= periodEnd;

  const applyPdf = (file: File | null) => {
    setError(null);
    if (!file) {
      setPdfFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("PDF exceeds 25 MB limit.");
      return;
    }
    setPdfFile(file);
  };

  const submitMetadata = async (): Promise<string | null> => {
    if (!isPeriodValid) {
      setError("Enter valid start and end dates.");
      return null;
    }
    if (dateMismatch && !mismatchAck) {
      setError("Dates do not match the selected window. Confirm below to continue.");
      return null;
    }

    setBusy("save");
    setError(null);
    try {
      const payload = {
        channel,
        reportWindow,
        periodStart,
        periodEnd,
        title: title.trim() || undefined,
        executiveSummary: executiveSummary.trim() || undefined,
        highlights: highlights.filter((h) => h.trim().length > 0),
        metrics: Object.fromEntries(
          Object.entries(metrics)
            .filter(([, v]) => v !== "" && !Number.isNaN(Number(v)))
            .map(([k, v]) => [k, Number(v)]),
        ),
      };

      const url = reportId
        ? `/api/admin/reports/${reportId}`
        : "/api/admin/reports";
      const method = reportId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not save the report.");
        return null;
      }
      const newId = data.report?.id ?? reportId;
      if (newId && newId !== reportId) setReportId(newId);
      return newId;
    } catch {
      setError("Network error while saving.");
      return null;
    } finally {
      setBusy(null);
    }
  };

  const uploadPdf = async (id: string): Promise<boolean> => {
    if (!pdfFile) return true;
    setBusy("upload");
    setError(null);
    try {
      const form = new FormData();
      form.append("file", pdfFile);
      const res = await fetch(`/api/admin/reports/${id}/pdf`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "PDF upload failed.");
        return false;
      }
      setPdfUploaded(true);
      setOriginalFilename(pdfFile.name);
      setPdfSize(pdfFile.size);
      setPdfFile(null);
      return true;
    } catch {
      setError("Network error while uploading the PDF.");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const saveDraft = async () => {
    const id = await submitMetadata();
    if (!id) return;
    if (pdfFile) {
      const ok = await uploadPdf(id);
      if (!ok) return;
    }
    setWarning("Draft saved.");
    router.refresh();
  };

  const publish = async () => {
    const id = await submitMetadata();
    if (!id) return;
    if (pdfFile) {
      const ok = await uploadPdf(id);
      if (!ok) return;
    }
    if (!pdfUploaded && !pdfFile) {
      setError("Upload a PDF before publishing.");
      return;
    }
    setBusy("publish");
    setError(null);
    try {
      const res = await fetch(`/api/admin/reports/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Publish failed.");
        return;
      }
      setWarning("Published.");
      router.push("/admin/reports");
    } catch {
      setError("Network error while publishing.");
    } finally {
      setBusy(null);
    }
  };

  const setHighlight = (idx: number, value: string) => {
    setHighlights((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next.slice(0, 5);
    });
  };

  const addHighlight = () => setHighlights((prev) => (prev.length >= 5 ? prev : [...prev, ""]));
  const removeHighlight = (idx: number) =>
    setHighlights((prev) => prev.filter((_, i) => i !== idx));

  const isYouTube = channel === "youtube-main";

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        saveDraft();
      }}
    >
      {/* Channel + window */}
      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
            Channel
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as ChannelSlug)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
          >
            {CHANNELS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label} · {c.handle}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
            Report window
          </label>
          <select
            value={reportWindow}
            onChange={(e) => setReportWindow(e.target.value as ReportWindow)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
          >
            {WINDOWS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
            Start date
          </label>
          <input
            type="date"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
            End date
          </label>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
            required
          />
        </div>
      </section>

      {dateMismatch && (
        <label className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <input
            type="checkbox"
            checked={mismatchAck}
            onChange={(e) => setMismatchAck(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            The selected window is {expectedDays} days but the dates span {dayCount} days.
            Tick to confirm you meant this.
          </span>
        </label>
      )}

      {/* Title */}
      <section>
        <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
          Report title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={suggestedTitle}
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
        />
        <p className="mt-2 text-[11px] text-muted">
          Suggested: {suggestedTitle}
        </p>
      </section>

      {/* Executive summary */}
      <section>
        <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
          Executive summary
        </label>
        <textarea
          value={executiveSummary}
          onChange={(e) => setExecutiveSummary(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Paste the short public summary you wrote for this report."
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink focus:border-blue focus:outline-none"
        />
      </section>

      {/* Highlights */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[10px] uppercase font-bold text-muted tracking-widest">
            Key highlights (up to 5)
          </label>
          <button
            type="button"
            onClick={addHighlight}
            disabled={highlights.length >= 5}
            className="text-[10px] font-bold uppercase tracking-wider text-blue hover:underline disabled:text-muted"
          >
            + Add highlight
          </button>
        </div>
        <div className="space-y-2">
          {highlights.map((h, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={h}
                onChange={(e) => setHighlight(idx, e.target.value)}
                maxLength={240}
                className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm text-ink focus:border-blue focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeHighlight(idx)}
                className="rounded-lg border border-border bg-white px-3 py-2 text-[11px] font-bold text-muted hover:text-ink"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Optional metrics */}
      <section>
        <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
          Optional headline metrics (public card preview)
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {METRIC_FIELDS.filter(
            (f) => (isYouTube ? !f.instagramOnly : !f.youtubeOnly),
          ).map((f) => (
            <div key={f.key}>
              <label className="block text-[10px] font-mono text-muted mb-1">{f.label}</label>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={metrics[f.key] ?? ""}
                onChange={(e) =>
                  setMetrics((m) => ({ ...m, [f.key]: e.target.value }))
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
      </section>

      {/* PDF upload */}
      <section>
        <label className="block text-[10px] uppercase font-bold text-muted tracking-widest mb-2">
          Reviewed PDF report {mode === "create" && <span className="text-red-600">*</span>}
        </label>
        {pdfUploaded && !pdfFile ? (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <span>
              Uploaded: <strong>{originalFilename || "report.pdf"}</strong>
              {pdfSize > 0 && ` · ${formatPdfFileSize(pdfSize)}`}
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
              setPdfDragOver(true);
            }}
            onDragLeave={() => setPdfDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setPdfDragOver(false);
              const file = e.dataTransfer.files?.[0];
              applyPdf(file ?? null);
            }}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              pdfDragOver ? "border-blue bg-blue/5" : "border-border bg-surface-soft"
            }`}
          >
            {pdfFile ? (
              <div className="text-sm text-ink">
                <p className="font-bold">{pdfFile.name}</p>
                <p className="text-xs text-muted mt-1">
                  {formatPdfFileSize(pdfFile.size)}
                </p>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="mt-3 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-ink font-bold">Drop a PDF here</p>
                <p className="text-xs text-muted mt-1">or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 rounded-lg bg-blue px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-deep"
                >
                  Choose file
                </button>
                <p className="mt-3 text-[10px] text-muted">
                  PDF only · max 25 MB · will be published exactly as uploaded
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
          onChange={(e) => applyPdf(e.target.files?.[0] ?? null)}
        />
      </section>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}
      {warning && !error && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          {warning}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={busy !== null}
          className="rounded-lg border border-border bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-ink hover:border-blue/30 disabled:opacity-50"
        >
          {busy === "save" ? "Saving…" : "Save draft"}
        </button>
        <button
          type="button"
          onClick={publish}
          disabled={busy !== null || (!pdfFile && !pdfUploaded)}
          className="rounded-lg bg-blue px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-deep disabled:opacity-50"
        >
          {busy === "publish" ? "Publishing…" : "Publish report"}
        </button>
        {reportId && (
          <a
            href={`/api/reports/${reportId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-blue hover:underline"
          >
            Preview PDF ↗
          </a>
        )}
      </div>
    </form>
  );
}
