"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { ChannelSlug, ReportWindow } from "@/lib/storage/reportShared";

const CHANNEL_OPTIONS: Array<{ value: ChannelSlug | ""; label: string }> = [
  { value: "", label: "All channels" },
  { value: "instagram-fitness", label: "Instagram Fitness" },
  { value: "instagram-finance", label: "Instagram Finance" },
  { value: "youtube-main", label: "YouTube Main" },
];

const WINDOW_OPTIONS: Array<{ value: ReportWindow | ""; label: string }> = [
  { value: "", label: "All durations" },
  { value: "30", label: "30 Days" },
  { value: "60", label: "60 Days" },
  { value: "90", label: "90 Days" },
  { value: "custom", label: "Custom" },
];

/**
 * Client filter pills that push state into the URL, so links to filtered
 * views are shareable (spec §19).
 */
export function AnalyticsArchiveFilters({
  activeChannel,
  activeWindow,
}: {
  activeChannel?: ChannelSlug;
  activeWindow?: ReportWindow;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/analytics${next.toString() ? `?${next}` : ""}#archive`);
  };

  return (
    <div className="space-y-3">
      <FilterRow
        label="Channel"
        options={CHANNEL_OPTIONS}
        active={activeChannel ?? ""}
        onSelect={(v) => setParam("channel", v || undefined)}
      />
      <FilterRow
        label="Duration"
        options={WINDOW_OPTIONS}
        active={activeWindow ?? ""}
        onSelect={(v) => setParam("window", v || undefined)}
      />
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: Array<{ value: T | ""; label: string }>;
  active: T | "";
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[80px] text-[10px] font-bold uppercase tracking-widest text-muted">
        {label}
      </span>
      {options.map((opt) => (
        <button
          key={opt.value || "all"}
          type="button"
          onClick={() => onSelect(opt.value)}
          aria-pressed={active === opt.value}
          className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
            active === opt.value
              ? "border-blue bg-blue text-white"
              : "border-border bg-white text-ink hover:border-blue/30"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

