"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AdminBackButton } from "@/components/admin/AdminBackButton";

type ChannelState = {
  id: string;
  slug: string;
  platform: string;
  displayName: string;
  handle: string;
  primaryMetric: string;
  currentValue: number;
  manualAudienceOverride: number | null;
  lastApiAudienceCount: number | null;
  updatedAt: string;
  published: boolean;
};

export default function AdminChannelsPage() {
  const [channels, setChannels] = useState<ChannelState[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/admin/platforms");
      const data: ChannelState[] = await res.json();
      // Deduplicate array by canonical id
      const uniqueMap = new Map<string, ChannelState>();
      for (const item of data) {
        const key = item.id || item.slug;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      }
      setChannels(Array.from(uniqueMap.values()));
    } catch {
      setMsg({ type: "error", text: "Failed to load channel data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // void-wrapped: every setState inside fetchChannels happens after an
    // await, so nothing runs synchronously within the effect body.
    void Promise.resolve().then(fetchChannels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateCount = async (channel: ChannelState, newCount: number, override: boolean) => {
    const confirmMsg = `This update will change the audience count for ${channel.displayName} everywhere it appears on the public website. Continue?`;
    if (!window.confirm(confirmMsg)) return;

    setSavingId(channel.id);
    setMsg(null);

    try {
      const res = await fetch(`/api/admin/platforms/${channel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentValue: newCount,
          manualAudienceOverride: override ? newCount : null,
          published: true,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setMsg({ type: "success", text: `Updated ${channel.displayName} metrics successfully!` });
      await fetchChannels();
    } catch {
      setMsg({ type: "error", text: "Failed to save channel update" });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface-soft py-12 text-ink">
      <Container className="max-w-[1280px] px-6 space-y-8">
        <AdminBackButton href="/admin" label="Back to Dashboard" />
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest block">
              CENTRAL METRICS CONTROL
            </span>
            <h1 className="font-heading text-3xl font-bold text-ink">
              Channel Audience Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/youtube"
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors inline-flex items-center gap-1.5"
            >
              <span>YouTube Content</span>
            </Link>
            <Link
              href="/admin/proposals"
              className="bg-blue text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-deep transition-colors"
            >
              Inquiries / Proposals
            </Link>
            <Link
              href="/admin/reports/new"
              className="bg-white border border-border text-ink px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-surface-soft"
            >
              + Upload PDF Report
            </Link>
            <Link
              href="/admin/reports"
              className="bg-white border border-border text-ink px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-surface-soft"
            >
              View Reports
            </Link>
          </div>
        </div>

        {msg && (
          <div
            className={`p-4 rounded-xl text-xs font-bold ${
              msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Channel Cards Grid */}
        {loading ? (
          <div className="p-12 text-center text-muted font-mono text-xs">
            Loading channel records...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map((ch, idx) => (
              <ChannelCard
                key={ch.id ? `${ch.id}-${idx}` : `${ch.slug}-${idx}`}
                channel={ch}
                saving={savingId === ch.id}
                onSave={handleUpdateCount}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

function ChannelCard({
  channel,
  saving,
  onSave,
}: {
  channel: ChannelState;
  saving: boolean;
  onSave: (ch: ChannelState, count: number, override: boolean) => void;
}) {
  const [val, setVal] = useState(channel.manualAudienceOverride ?? channel.currentValue);
  const [useOverride, setUseOverride] = useState(channel.manualAudienceOverride != null);

  const effectiveCount = channel.manualAudienceOverride ?? channel.currentValue;

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col justify-between space-y-6 text-left">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest">
            {channel.platform}
          </span>
          <span className="size-2 rounded-full bg-emerald-500" />
        </div>

        <div>
          <h3 className="font-heading text-xl font-bold text-ink">
            {channel.displayName}
          </h3>
          <p className="text-xs font-mono text-muted">{channel.handle}</p>
        </div>

        {/* Metric Display */}
        <div className="p-4 rounded-xl bg-surface-soft border border-border/80 space-y-1">
          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-wider block">
            Public Website Count ({channel.primaryMetric})
          </span>
          <span className="font-heading text-3xl font-bold text-ink block">
            {effectiveCount.toLocaleString()}
          </span>
          <span className="text-[11px] font-mono text-blue font-bold block">
            {(effectiveCount / 1000).toFixed(1)}K compact
          </span>
        </div>

        {/* Input Form */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-ink uppercase tracking-wider mb-1">
              Exact {channel.primaryMetric} Count
            </label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-lg border border-border text-sm font-mono text-ink focus:outline-none focus:border-blue"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-body cursor-pointer">
            <input
              type="checkbox"
              checked={useOverride}
              onChange={(e) => setUseOverride(e.target.checked)}
              className="rounded text-blue focus:ring-blue"
            />
            <span>Enable Manual Override</span>
          </label>
        </div>
      </div>

      <div className="space-y-3 border-t border-border/60 pt-4">
        <div className="text-[10px] font-mono text-muted space-y-0.5">
          <div>Last Synced: {new Date(channel.updatedAt).toLocaleDateString()}</div>
          <div>Mode: {useOverride ? "Manual Override Active" : "Standard Sync"}</div>
        </div>

        <Button
          onClick={() => onSave(channel, val, useOverride)}
          disabled={saving}
          size="md"
          className="w-full justify-center bg-blue text-white"
        >
          {saving ? "Publishing..." : "Update Everywhere"}
        </Button>
      </div>
    </div>
  );
}
