"use client";

import { useState } from "react";
import Link from "next/link";
import { YOUTUBE_CHANNEL } from "@/config/youtube";
import type { YouTubeContent } from "@/lib/storage/db";
import { formatReportWindow, type ReportWindow } from "@/lib/storage/reportShared";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SpecularButton } from "@/components/ui/SpecularButton";
import { ShineButton } from "@/components/ui/ShineButton";
import { YouTubeThumbnail } from "@/components/youtube/YouTubeThumbnail";
import {
  Video,
  Play,
  ArrowUpRight,
  FileText,
  X,
  Layers,
  Sparkles,
} from "lucide-react";

export interface YouTubeMetrics {
  exact: number;
  compact: string;
  source: string;
  updatedAt: string;
}

export interface YouTubeReportItem {
  id: string;
  slug: string;
  title: string;
  reportWindow: string;
  periodStart: string;
  periodEnd: string;
  executiveSummary?: string;
  highlights?: string[];
}

interface YouTubeClientPageProps {
  metrics: YouTubeMetrics;
  reports: YouTubeReportItem[];
  videos: YouTubeContent[];
}

export function YouTubeClientPage({ metrics, reports, videos }: YouTubeClientPageProps) {
  const [selectedFormat, setSelectedFormat] = useState<"all" | "short" | "long-form">("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [activeEmbedVideoId, setActiveEmbedVideoId] = useState<string | null>(null);

  const publishedVideos = videos.filter((v) => v.isPublished);
  const featuredVideo = publishedVideos.find((v) => v.isFeatured) || publishedVideos[0];

  const shortsVideos = publishedVideos.filter((v) => v.format === "short");
  const longFormVideos = publishedVideos.filter((v) => v.format === "long-form");

  // Determine available topics that have at least 1 published video
  const availableTopics = Array.from(
    new Set(publishedVideos.map((v) => v.topic).filter(Boolean))
  );

  const filteredVideos = publishedVideos.filter((v) => {
    if (selectedFormat !== "all" && v.format !== selectedFormat) return false;
    if (selectedTopic !== "all" && v.topic !== selectedTopic) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-ink">
      {/* NO page-local Header here — RootLayout handles global navbar (§1) */}

      <main className="flex-1">
        {/* A. Hero Section (§11) */}
        <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28 border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.25),rgba(255,255,255,0))]" />

          <Container className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
              {/* Left Column: Metadata & CTAs */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="danger" className="inline-flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest font-mono">
                    <Video className="size-3.5" />
                    YOUTUBE CREATOR
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{YOUTUBE_CHANNEL.handle}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest block font-mono">
                    {YOUTUBE_CHANNEL.name}
                  </span>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                    Short-form attention. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600">
                      Long-form depth.
                    </span>
                  </h1>
                </div>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                  Fitness, finance, real estate, and creator-led videos from Meet Shah, across YouTube Shorts and long-form content.
                </p>

                {/* Metric & Format Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white shadow-lift">
                    <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-heading text-lg font-bold">{metrics.compact} Subscribers</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    <Video className="size-3.5 text-red-400" />
                    <span>Shorts</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
                    <Play className="size-3.5 text-blue-400" />
                    <span>Long-form</span>
                  </div>
                </div>

                {/* Primary & Secondary CTAs */}
                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <SpecularButton
                    variant="youtube"
                    size="lg"
                    href={YOUTUBE_CHANNEL.channelUrl}
                  >
                    <span>Visit YouTube Channel</span>
                    <ArrowUpRight className="size-5 ml-1" />
                  </SpecularButton>

                  <ShineButton
                    variant="secondary"
                    size="lg"
                    href="#videos"
                  >
                    <span>View Latest Videos</span>
                  </ShineButton>
                </div>

                {/* Additional Compact Links */}
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <a
                    href={YOUTUBE_CHANNEL.shortsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Shorts</span>
                    <ArrowUpRight className="size-3" />
                  </a>
                  <a
                    href={YOUTUBE_CHANNEL.videosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Long-form</span>
                    <ArrowUpRight className="size-3" />
                  </a>
                  <a
                    href={YOUTUBE_CHANNEL.playlistsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-400 underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Playlists</span>
                    <ArrowUpRight className="size-3" />
                  </a>
                </div>
              </div>

              {/* Right Column: Featured Video Card with YouTubeThumbnail (§9, §11) */}
              <div>
                {featuredVideo ? (
                  <div className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-500 hover:border-red-500/50">
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      <YouTubeThumbnail
                        videoId={featuredVideo.videoId}
                        title={featuredVideo.title}
                        priority
                      />

                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <button
                          onClick={() => setActiveEmbedVideoId(featuredVideo.videoId)}
                          className="size-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/40 group-hover:scale-110 transition-transform"
                          aria-label="Play featured video preview"
                        >
                          <Play className="size-8 ml-1 fill-white" />
                        </button>
                      </div>

                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                          ★ Featured Highlight
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                        <span className="text-red-400 uppercase font-bold">{featuredVideo.topic}</span>
                        <span>{featuredVideo.format === "short" ? "YouTube Short" : "Long-form"}</span>
                      </div>

                      <h3 className="font-heading text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {featuredVideo.title}
                      </h3>

                      <div className="pt-2 flex justify-between items-center">
                        <button
                          onClick={() => setActiveEmbedVideoId(featuredVideo.videoId)}
                          className="text-xs font-bold text-white hover:text-red-400 inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="size-3.5 fill-current" />
                          <span>Watch Preview</span>
                        </button>

                        <a
                          href={featuredVideo.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Watch on YouTube</span>
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Channel Identity Panel (§9) */
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 space-y-6 text-white shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-lg font-heading text-2xl font-black shrink-0">
                        MS
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-white">{YOUTUBE_CHANNEL.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{YOUTUBE_CHANNEL.handle}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Subscribers</span>
                        <span className="font-bold text-white">{metrics.compact}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Supported Formats</span>
                        <span className="font-bold text-red-400">Shorts + Long-form</span>
                      </div>
                    </div>

                    <a
                      href={YOUTUBE_CHANNEL.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition-all"
                    >
                      <span>Open YouTube Channel</span>
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Section 9: Channel Identity Banner */}
        <section className="py-8 bg-slate-900 text-white border-b border-slate-800">
          <Container>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                  <Video className="size-5" />
                </div>
                <div>
                  <span className="font-heading text-sm font-bold text-white block">{YOUTUBE_CHANNEL.name} ({YOUTUBE_CHANNEL.handle})</span>
                  <span className="text-xs text-slate-400">Official Creator Channel • {metrics.compact} Subscribers</span>
                </div>
              </div>

              <a
                href={YOUTUBE_CHANNEL.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all"
              >
                <span>Open Official Channel</span>
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </Container>
        </section>

        {/* C & D. Latest Content Section (§12) */}
        <section id="videos" className="py-20 bg-surface-soft border-b border-border">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <SectionHeading
                eyebrow="CATALOGUE"
                heading="Latest from YouTube"
                supporting="Real Shorts and long-form videos published on the meetsofficial channel."
              />

              {/* Format & Topic Filters */}
              <div className="flex flex-wrap gap-2 shrink-0">
                {/* Format Toggle */}
                <div className="flex gap-1 bg-white border border-border p-1 rounded-full">
                  <button
                    onClick={() => setSelectedFormat("all")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                      selectedFormat === "all" ? "bg-slate-900 text-white" : "text-body hover:text-ink"
                    }`}
                  >
                    All Formats
                  </button>
                  <button
                    onClick={() => setSelectedFormat("short")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                      selectedFormat === "short" ? "bg-red-600 text-white" : "text-body hover:text-ink"
                    }`}
                  >
                    Shorts
                  </button>
                  <button
                    onClick={() => setSelectedFormat("long-form")}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                      selectedFormat === "long-form" ? "bg-blue-600 text-white" : "text-body hover:text-ink"
                    }`}
                  >
                    Long-form
                  </button>
                </div>

                {/* Topic Filters (Only show when >1 dynamic topic exists §12) */}
                {availableTopics.length > 1 && (
                  <div className="flex gap-1 bg-white border border-border p-1 rounded-full">
                    <button
                      onClick={() => setSelectedTopic("all")}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all ${
                        selectedTopic === "all" ? "bg-slate-200 text-slate-900" : "text-body hover:text-ink"
                      }`}
                    >
                      All Topics
                    </button>
                    {availableTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full capitalize transition-all ${
                          selectedTopic === topic ? "bg-slate-900 text-white" : "text-body hover:text-ink"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredVideos.length === 0 ? (
              <div className="p-12 text-center bg-white border border-border rounded-panel space-y-4 max-w-2xl mx-auto shadow-xs">
                <div className="size-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Video className="size-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-ink">YouTube Channel Connected</h3>
                <p className="text-xs text-body leading-relaxed max-w-md mx-auto">
                  The official channel is connected. Videos will appear here after they are published.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center">
                  <a
                    href={YOUTUBE_CHANNEL.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700 transition-all"
                  >
                    <span>Open YouTube Channel</span>
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              /* Real Video Grid (§12: 3-column desktop, 2-column tablet, 1-column mobile) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-border rounded-2xl overflow-hidden shadow-xs hover:border-red-400 hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Region with YouTubeThumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        <YouTubeThumbnail
                          videoId={item.videoId}
                          title={item.title}
                        />

                        {/* Format Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-xs ${
                              item.format === "short" ? "bg-red-600" : "bg-blue-600"
                            }`}
                          >
                            {item.format === "short" ? "YouTube Short" : "Long-form"}
                          </span>
                        </div>

                        {/* Topic Tag */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white capitalize">
                            {item.topic}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-2">
                        <h4 className="font-heading text-base font-bold text-ink group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h4>

                        {item.description && (
                          <p className="text-xs text-body leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 pt-0 border-t border-border/60 mt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => setActiveEmbedVideoId(item.videoId)}
                        className="inline-flex items-center gap-1 font-bold text-slate-800 hover:text-red-600 transition-colors"
                      >
                        <Play className="size-3.5 fill-current" />
                        <span>Watch Preview</span>
                      </button>

                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"
                      >
                        <span>Watch Video</span>
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </section>

        {/* Dedicated Shorts Section (§13: 4 verified Shorts in 4-column desktop grid) */}
        {shortsVideos.length > 0 && (
          <section className="py-20 bg-white border-b border-border">
            <Container>
              <div className="flex justify-between items-end mb-10">
                <SectionHeading
                  eyebrow="SHORT-FORM"
                  heading="YouTube Shorts"
                  supporting="60-second video guides, real estate facts, and quick finance/fitness rules."
                />

                <a
                  href={YOUTUBE_CHANNEL.shortsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline shrink-0"
                >
                  <span>View All Shorts</span>
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {shortsVideos.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-50 border border-border rounded-2xl overflow-hidden shadow-xs hover:border-red-400 hover:shadow-lift transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[9/16] w-full bg-slate-900 overflow-hidden">
                        <YouTubeThumbnail
                          videoId={item.videoId}
                          title={item.title}
                          aspectRatio="9:16"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute bottom-3 left-3 right-3 text-white space-y-1 z-10">
                          <span className="text-[10px] font-mono uppercase font-bold text-red-400 block">
                            Short • {item.topic}
                          </span>
                          <h4 className="font-heading text-xs font-bold line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white flex justify-between items-center text-[11px] border-t border-border/60">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-red-600 hover:underline inline-flex items-center gap-1 w-full justify-center"
                      >
                        <span>Watch Short</span>
                        <ArrowUpRight className="size-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Dedicated Long-form Section (§14: Wide Editorial Layout) */}
        {longFormVideos.length > 0 && (
          <section className="py-20 bg-surface-soft border-b border-border">
            <Container>
              <div className="flex justify-between items-end mb-10">
                <SectionHeading
                  eyebrow="LONG-FORM"
                  heading="Long-form Videos"
                  supporting="In-depth topic breakdowns, structured learning, and complete guides."
                />

                <a
                  href={YOUTUBE_CHANNEL.videosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline shrink-0"
                >
                  <span>View All Videos</span>
                  <ArrowUpRight className="size-4" />
                </a>
              </div>

              <div className="space-y-6">
                {longFormVideos.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-border rounded-3xl overflow-hidden shadow-xs hover:border-red-400 hover:shadow-lift transition-all p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-center"
                  >
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950">
                      <YouTubeThumbnail
                        videoId={item.videoId}
                        title={item.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <button
                          onClick={() => setActiveEmbedVideoId(item.videoId)}
                          className="size-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          aria-label="Play video"
                        >
                          <Play className="size-7 ml-0.5 fill-white" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase">
                        <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">Long-form</span>
                        <span>•</span>
                        <span className="capitalize">{item.topic}</span>
                      </div>

                      <h3 className="font-heading text-2xl font-bold text-ink leading-tight group-hover:text-red-600 transition-colors">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-body leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      <div className="pt-2 flex flex-wrap gap-4 items-center">
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition-all"
                        >
                          <span>Watch on YouTube</span>
                          <ArrowUpRight className="size-4" />
                        </a>

                        <button
                          onClick={() => setActiveEmbedVideoId(item.videoId)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-slate-100 px-5 py-2.5 text-xs font-bold text-ink hover:bg-slate-200 transition-all"
                        >
                          <Play className="size-3.5 fill-current" />
                          <span>Watch Preview</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Playlists Section */}
        <section className="py-16 bg-white border-b border-border">
          <Container>
            <div className="p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <Badge tone="danger" className="text-[10px] font-mono">CHANNEL PLAYLISTS</Badge>
                <h3 className="font-heading text-2xl font-bold text-white">Explore YouTube Playlists</h3>
                <p className="text-xs text-slate-300 max-w-lg">
                  Organized topic playlists across Fitness, Personal Finance, and Creator strategy on the official channel.
                </p>
              </div>

              <a
                href={YOUTUBE_CHANNEL.playlistsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-700 transition-all shrink-0"
              >
                <span>View Channel Playlists</span>
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Container>
        </section>

        {/* Analytics Reports Section */}
        {reports.length > 0 && (
          <section id="reports" className="py-20 bg-surface-soft border-b border-border">
            <Container>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <SectionHeading
                  eyebrow="AUDIENCE INSIGHTS"
                  heading="YouTube Performance Reports"
                  supporting="Reviewed 30, 60 and 90-day reports covering channel growth, audience behaviour, Shorts, long-form videos and performance trends."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-6 bg-white border border-border rounded-panel flex flex-col justify-between shadow-xs hover:border-red-300 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-red-50 text-red-600 font-mono font-bold text-[10px] uppercase border border-red-100">
                          {formatReportWindow(report.reportWindow as ReportWindow)}
                        </span>
                        <span className="text-[10px] text-muted font-mono">{report.periodStart} to {report.periodEnd}</span>
                      </div>

                      <h4 className="font-heading text-lg font-bold text-ink leading-snug">
                        {report.title}
                      </h4>

                      {report.executiveSummary && (
                        <p className="text-xs text-body leading-relaxed line-clamp-3">
                          {report.executiveSummary}
                        </p>
                      )}
                    </div>

                    <div className="pt-6 mt-4 border-t border-border flex items-center justify-between text-xs">
                      <Link
                        href={`/analytics/reports/${report.slug}`}
                        className="inline-flex items-center gap-1 font-bold text-slate-800 hover:text-red-600 transition-colors"
                      >
                        <span>View Report</span>
                        <ArrowUpRight className="size-3.5" />
                      </Link>

                      <a
                        href={`/api/reports/${report.id}/pdf?download=1`}
                        className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:underline"
                      >
                        <FileText className="size-3.5" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Subscribe CTA */}
        <section className="py-20 bg-slate-950 text-white text-center">
          <Container size="narrow">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                Watch. Learn. Go deeper.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                Subscribe to Meet Shah ({YOUTUBE_CHANNEL.handle}) on YouTube for practical fitness form guides, personal finance frameworks, and creator production breakdowns.
              </p>
              <div>
                <Button
                  href={YOUTUBE_CHANNEL.channelUrl}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 text-base shadow-lg shadow-red-600/30"
                >
                  Subscribe on YouTube
                  <ArrowUpRight className="size-5 ml-1" />
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      {/* Video Preview Modal Embed with youtube-nocookie.com (§15) */}
      {activeEmbedVideoId && (
        <div className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-white">
              <span className="text-xs font-mono font-bold text-red-500">Video Preview</span>
              <button
                onClick={() => setActiveEmbedVideoId(null)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Close video preview"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeEmbedVideoId}?autoplay=1&mute=0`}
                title="YouTube Video Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* NO page-local Footer here — RootLayout handles global footer (§1) */}
    </div>
  );
}
