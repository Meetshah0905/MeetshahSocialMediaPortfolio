"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import { YOUTUBE_CHANNEL } from "@/config/youtube";
import type { YouTubeContent } from "@/lib/storage/db";
import { Plus, ExternalLink, RefreshCw, Trash2, Edit, CheckCircle, Eye } from "lucide-react";

export default function AdminYouTubePage() {
  const [videos, setVideos] = useState<YouTubeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/admin/youtube");
      const data: YouTubeContent[] = await res.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch {
      setMsg({ type: "error", text: "Failed to load YouTube videos catalog." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchVideos);
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/youtube/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg({
          type: "success",
          text: `Sync completed! Imported ${data.importedCount} new video(s). ${data.skippedCount} video(s) already in catalog.`,
        });
        await fetchVideos();
      } else {
        setMsg({
          type: "error",
          text: data.error || "Sync failed or YOUTUBE_DATA_API_KEY is not configured.",
        });
      }
    } catch {
      setMsg({ type: "error", text: "Network error during YouTube sync." });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the catalog?`)) return;
    try {
      const res = await fetch(`/api/admin/youtube/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        setMsg({ type: "success", text: "Video deleted successfully." });
      }
    } catch {
      setMsg({ type: "error", text: "Failed to delete video record." });
    }
  };

  const shortsCount = videos.filter((v) => v.format === "short").length;
  const longFormCount = videos.filter((v) => v.format === "long-form").length;
  const publishedCount = videos.filter((v) => v.isPublished).length;

  return (
    <div className="min-h-screen bg-surface py-12">
      <Container>
        <div className="mb-6">
          <AdminBackButton label="Back to Channel Settings" href="/admin/channels" />
        </div>

        {/* Channel Identity Header Card */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-wider">
                  OFFICIAL YOUTUBE CHANNEL
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {YOUTUBE_CHANNEL.id}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {YOUTUBE_CHANNEL.name}
              </h1>
              <p className="text-sm text-slate-300 flex items-center gap-2 font-medium">
                <span>{YOUTUBE_CHANNEL.handle}</span>
                <span>•</span>
                <span className="text-red-400 font-bold">19.7K Subscribers</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href="/admin/youtube/new"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-red-700 transition-all"
              >
                <Plus className="size-4" />
                <span>Add Video</span>
              </Link>

              <button
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-50"
              >
                <RefreshCw className={`size-3.5 ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing..." : "Sync from YouTube"}</span>
              </button>

              <Link
                href="/youtube"
                target="_blank"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-xs font-bold text-white transition-all"
              >
                <Eye className="size-3.5" />
                <span>View Public Page</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Total Catalogue</span>
              <span className="text-lg font-bold font-heading text-white">{videos.length}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Published</span>
              <span className="text-lg font-bold font-heading text-emerald-400">{publishedCount}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Shorts</span>
              <span className="text-lg font-bold font-heading text-red-400">{shortsCount}</span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="text-slate-400 block font-medium">Long-form</span>
              <span className="text-lg font-bold font-heading text-blue-400">{longFormCount}</span>
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

        {/* Video Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h2 className="font-heading text-lg font-bold text-ink">YouTube Video Catalogue</h2>
            <span className="text-xs text-muted">Canonical Channel ID: {YOUTUBE_CHANNEL.id}</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-muted">Loading video catalog...</div>
          ) : videos.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-ink">No videos in catalogue yet.</p>
              <p className="text-xs text-muted max-w-md mx-auto">
                Paste YouTube video links from channel <code>UCrsC6r5AQ9AvWvKTgexD54w</code> to publish them on the official <code>/youtube</code> showcase page.
              </p>
              <div className="pt-2">
                <Button href="/admin/youtube/new" size="sm" className="rounded-full bg-red-600 text-white">
                  Add First Video
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-soft border-b border-border text-muted uppercase font-mono tracking-wider text-[10px]">
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Title & Video ID</th>
                    <th className="p-4">Format</th>
                    <th className="p-4">Topic</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {videos.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 w-28">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4 max-w-md">
                        <div className="space-y-1">
                          <span className="font-heading font-bold text-ink block leading-snug line-clamp-2">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
                            <span>ID: {item.videoId}</span>
                            <a
                              href={item.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Watch</span>
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            item.format === "short"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {item.format === "short" ? "Short" : "Long-form"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium capitalize">
                          {item.topic}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {item.isPublished ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle className="size-3.5" /> Published
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium text-[11px]">Draft</span>
                          )}
                          {item.isFeatured && (
                            <span className="block text-[10px] text-amber-600 font-bold">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/youtube/${item.id}/edit`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors"
                            title="Edit Video Record"
                          >
                            <Edit className="size-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors"
                            title="Delete Video Record"
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
    </div>
  );
}
