"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AdminBackButton } from "@/components/admin/AdminBackButton";
import { parseYouTubeVideoId, getYouTubeThumbnailUrl, YOUTUBE_CHANNEL } from "@/config/youtube";
import { ArrowLeft, Check, AlertCircle, Info, ExternalLink } from "lucide-react";

export default function AdminNewYouTubeVideoPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<"short" | "long-form">("long-form");
  const [topic, setTopic] = useState<"fitness" | "finance" | "business" | "ai" | "creator" | "ugc" | "other">("fitness");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [durationSeconds, setDurationSeconds] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedVideoId = parseYouTubeVideoId(urlInput);
  const autoThumbnail = parsedVideoId ? getYouTubeThumbnailUrl(parsedVideoId) : "";
  const previewThumbnail = thumbnailUrl.trim() || autoThumbnail;

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    setError(null);
    const parsed = parseYouTubeVideoId(val);
    if (parsed) {
      if (val.includes("/shorts/")) {
        setFormat("short");
      }
      if (!thumbnailUrl) {
        setThumbnailUrl(getYouTubeThumbnailUrl(parsed));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !title.trim()) {
      setError("YouTube URL and Title are required.");
      return;
    }

    if (!parsedVideoId) {
      setError("Could not parse a valid YouTube video ID from the provided URL.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urlInput,
          title,
          description,
          format,
          topic,
          thumbnailUrl: previewThumbnail,
          publishedAt: new Date(publishedAt).toISOString(),
          durationSeconds: durationSeconds ? Number(durationSeconds) : undefined,
          isFeatured,
          isPublished,
          displayOrder: Number(displayOrder),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/youtube");
      } else {
        setError(data.error || "Failed to save video record.");
      }
    } catch {
      setError("Network error while saving video record.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <Container size="narrow">
        <div className="mb-6">
          <AdminBackButton label="Back to YouTube Catalogue" href="/admin/youtube" />
        </div>

        <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink">Add Verified YouTube Video</h1>
            <p className="text-xs text-body mt-1">
              Add a real video or Short from channel <code>{YOUTUBE_CHANNEL.name}</code> (<code>{YOUTUBE_CHANNEL.id}</code>).
            </p>
          </div>

          {/* Channel ownership notice (§6) */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Channel Verification Notice</span>
              <p>
                Confirm that this video belongs to <strong>meetsofficial</strong> (ID: <code>{YOUTUBE_CHANNEL.id}</code>) before publishing.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="size-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* YouTube URL input */}
            <div className="space-y-2">
              <label className="font-bold text-ink block">
                YouTube Video URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.youtube.com/shorts/..."
                value={urlInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 font-mono text-xs"
                required
              />
              {parsedVideoId ? (
                <div className="flex items-center gap-2 text-emerald-600 font-mono text-[11px] pt-1">
                  <Check className="size-3.5" />
                  <span>Valid Video ID Parsed: <strong>{parsedVideoId}</strong></span>
                </div>
              ) : urlInput ? (
                <span className="text-red-500 text-[11px] block pt-1">
                  Invalid YouTube URL format. Supported formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID
                </span>
              ) : null}
            </div>

            {/* Thumbnail Preview */}
            {previewThumbnail && (
              <div className="space-y-2">
                <label className="font-bold text-ink block">Generated Thumbnail Preview</label>
                <div className="relative max-w-sm aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewThumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="font-bold text-ink block">
                Video Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Official video title"
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
                placeholder="Short summary of what this video explains..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 text-xs"
              />
            </div>

            {/* Custom Thumbnail URL (Optional) */}
            <div className="space-y-2">
              <label className="font-bold text-ink block">Custom High-Res Thumbnail URL (Optional)</label>
              <input
                type="text"
                placeholder="Leave blank to use default YouTube hqdefault thumbnail"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full p-3 rounded-2xl border border-border focus:outline-none focus:border-red-500 font-mono text-xs"
              />
            </div>

            {/* Published Date & Duration */}
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
                disabled={saving || !parsedVideoId}
                size="sm"
                className="rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? "Saving Video..." : "Save Verified Video"}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
