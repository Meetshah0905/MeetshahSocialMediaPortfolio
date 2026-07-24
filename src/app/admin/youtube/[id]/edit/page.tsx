"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import { getYouTubeThumbnailUrl, YOUTUBE_CHANNEL } from "@/config/youtube";
import type { YouTubeContent } from "@/lib/storage/db";
import { Check, AlertCircle, Info, ExternalLink } from "lucide-react";

export default function AdminEditYouTubeVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState<YouTubeContent | null>(null);

  const [urlInput, setUrlInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<"short" | "long-form">("long-form");
  const [topic, setTopic] = useState<"fitness" | "finance" | "business" | "ai" | "creator" | "ugc" | "other">("fitness");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [durationSeconds, setDurationSeconds] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/youtube/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load video");
        return res.json();
      })
      .then((data: YouTubeContent) => {
        setVideo(data);
        setUrlInput(data.videoUrl || `https://www.youtube.com/watch?v=${data.videoId}`);
        setTitle(data.title);
        setDescription(data.description || "");
        setFormat(data.format);
        setTopic(data.topic);
        setThumbnailUrl(data.thumbnailUrl);
        setPublishedAt(data.publishedAt ? data.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
        setDurationSeconds(data.durationSeconds ?? "");
        setIsFeatured(data.isFeatured);
        setIsPublished(data.isPublished);
        setDisplayOrder(data.displayOrder ?? 10);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          urlInput,
          title,
          description,
          format,
          topic,
          thumbnailUrl: thumbnailUrl.trim(),
          publishedAt: new Date(publishedAt).toISOString(),
          durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
          isFeatured,
          isPublished,
          displayOrder: Number(displayOrder),
        }),
      });

      if (res.ok) {
        router.push("/admin/youtube");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update video record.");
      }
    } catch {
      setError("Network error while updating video record.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <Container size="narrow">
          <div className="text-center text-xs text-muted">Loading video details...</div>
        </Container>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <Container size="narrow">
          <div className="bg-white p-8 rounded-3xl border border-border text-center space-y-4">
            <p className="text-sm font-semibold text-ink">Video record not found.</p>
            <Button href="/admin/youtube" size="sm" className="rounded-full">
              Back to YouTube Catalogue
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12">
      <Container size="narrow">
        <div className="mb-6">
          <AdminBackButton label="Back to YouTube Catalogue" href="/admin/youtube" />
        </div>

        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-heading text-2xl font-bold text-ink">Edit Video Record</h1>
              <p className="text-xs text-body mt-1">
                Video ID: <code>{video.videoId}</code>
              </p>
            </div>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
            >
              <span>Watch Video</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="size-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Title */}
            <div className="space-y-2">
              <label className="font-bold text-ink block">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs font-heading font-semibold"
                required
              />
            </div>

            {/* Format & Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-bold text-ink block">Content Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "short" | "long-form")}
                  className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs bg-white"
                >
                  <option value="long-form">Long-form Video (16:9)</option>
                  <option value="short">YouTube Short (9:16)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-ink block">Category Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as typeof topic)}
                  className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs bg-white capitalize"
                >
                  <option value="fitness">Fitness</option>
                  <option value="finance">Finance</option>
                  <option value="business">Business</option>
                  <option value="ai">AI & Tech</option>
                  <option value="creator">Creator Education</option>
                  <option value="ugc">UGC & Ads</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="font-bold text-ink block">Description / Key Highlights</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-2">
              <label className="font-bold text-ink block">Thumbnail Image URL</label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 font-mono text-xs"
              />
              {thumbnailUrl && (
                <div className="relative max-w-xs aspect-video rounded-xl overflow-hidden bg-slate-100 border border-border mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Published Date & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-bold text-ink block">Published Date</label>
                <input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs bg-white"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-ink block">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs bg-white"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-2 flex flex-wrap gap-6 border-t border-border">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="size-4 rounded text-red-600 focus:ring-red-500"
                />
                <span className="font-bold text-ink">Publish to Public Showcase</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="size-4 rounded text-red-600 focus:ring-red-500"
                />
                <span className="font-bold text-ink">Feature in Hero Highlight</span>
              </label>
            </div>

            {/* Submit buttons */}
            <div className="pt-4 flex justify-end gap-3">
              <Button
                href="/admin/youtube"
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                size="sm"
                className="rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Video"}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
