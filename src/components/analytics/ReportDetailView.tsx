"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnalyticsReport } from "@/lib/storage/db";
import { InstagramIcon } from "@/components/ui/icons";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import {
  Download,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Play,
  Tv,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export function ReportDetailView({ report }: { report: AnalyticsReport }) {
  const [mounted, setMounted] = useState(false);

  // Prevent Recharts hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const m = report.metrics;
  const d = report.demographics;
  const isYouTube = report.persona === "youtube_main";

  // Chart theme colors
  const primaryColor = isYouTube ? "#ff0000" : "#2f78ff";
  const lightColor = isYouTube ? "#ffcccc" : "#8cb8ff";

  // Channel details
  let handle = "meetsofficial";
  let channelUrl = "https://www.instagram.com/meetsofficial/";
  if (report.persona === "instagram_finance") {
    handle = "meet.fitfix";
    channelUrl = "https://www.instagram.com/meet.fitfix/";
  } else if (report.persona === "youtube_main") {
    handle = "YouTube Main";
    channelUrl = "#";
  }

  return (
    <div className="bg-white text-ink min-h-screen">
      {/* Header Banner */}
      <WhiteAtmosphereSection grid={true} halo="both" className="pt-24 lg:pt-32 pb-12 bg-white border-b border-border">
        <div className="flex flex-col items-start text-left space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-blue text-white border-transparent">
            {report.persona.toUpperCase().replace("_", " ")} VERIFIED REPORT
          </Badge>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-ink leading-tight">
            Performance Insights: {report.period.label}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-body">
            <span className="flex items-center gap-1.5 font-bold text-ink">
              {isYouTube ? (
                <svg className="size-4 text-red-600 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              ) : (
                <InstagramIcon className="size-4 text-blue" />
              )}
              {isYouTube ? handle : `@${handle}`}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-blue" />
              {report.period.startDate} to {report.period.endDate}
            </span>
            <span>•</span>
            <span>Published: {report.publishedAt ? report.publishedAt.split("T")[0] : "Draft"}</span>
          </div>

          <div className="pt-4 flex gap-4">
            <Button
              href={`/analytics/${isYouTube ? "youtube" : report.persona === "instagram_fitness" ? "fitness" : "finance"}`}
              className="bg-transparent border-border text-ink hover:bg-surface-soft"
              size="sm"
            >
              <ArrowLeft className="size-4 mr-1.5" />
              Back to Archive
            </Button>
            <a
              href={`/api/reports/${report.id}/pdf`}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-blue text-blue hover:bg-blue/5 px-4 rounded-full text-xs font-semibold transition-colors"
            >
              <Download className="size-4" />
              Download PDF Report
            </a>
          </div>
        </div>
      </WhiteAtmosphereSection>

      {/* KPI Grid */}
      <section className="bg-surface-soft py-12 border-b border-border">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {isYouTube ? (
              <>
                {/* Views */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Views</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.views?.toLocaleString() ?? "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">Total channel views</span>
                </Card>

                {/* Subscribers */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Subscribers</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.subscribers?.toLocaleString() ?? "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">
                    +{m.subscriberChange?.toLocaleString() ?? "0"} additions
                  </span>
                </Card>

                {/* Watch Time */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Watch Time</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.watchTimeHours?.toLocaleString() ?? "N/A"} hrs
                  </span>
                  <span className="text-[10px] text-body block mt-1">Total view hours</span>
                </Card>

                {/* CTR */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Impressions CTR</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.impressionsClickThroughRate ? m.impressionsClickThroughRate + "%" : "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">Click-through rate</span>
                </Card>
              </>
            ) : (
              <>
                {/* Reach */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Reach</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.reach?.toLocaleString() ?? "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">Unique accounts reached</span>
                </Card>

                {/* Followers */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Followers</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.followers?.toLocaleString() ?? "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">
                    +{m.followerChange?.toLocaleString() ?? "0"} additions
                  </span>
                </Card>

                {/* Engagement */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Engagement</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.engagementRate ? m.engagementRate + "%" : "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">Interaction benchmark</span>
                </Card>

                {/* Plays */}
                <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                  <span className="text-[10px] font-bold text-blue uppercase tracking-wider block">Reel Plays</span>
                  <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block mt-2">
                    {m.reelPlays?.toLocaleString() ?? "N/A"}
                  </span>
                  <span className="text-[10px] text-body block mt-1">Total video plays</span>
                </Card>
              </>
            )}
          </div>

          {/* Demographics split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto mt-8 items-start">
            {/* Left: Demographics */}
            <div className="lg:col-span-6 space-y-6">
              <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                <h3 className="font-heading text-base font-bold text-ink mb-4">Gender split</h3>
                <div className="flex justify-between text-xs font-bold text-ink mb-2">
                  <span>Male ({d.gender.male ?? "N/A"}%)</span>
                  <span>Female ({d.gender.female ?? "N/A"}%)</span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-blue/10 flex overflow-hidden">
                  <div
                    className="h-full bg-blue"
                    style={{ width: `${d.gender.male ?? 50}%` }}
                  />
                  <div
                    className="h-full bg-blue/30"
                    style={{ width: `${d.gender.female ?? 50}%` }}
                  />
                </div>
              </Card>

              <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                <h3 className="font-heading text-base font-bold text-ink mb-4">Age ranges</h3>
                <div className="h-56 w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={d.ageRanges} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} stroke="#717b90" />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="#717b90" />
                        <Tooltip cursor={{ fill: "rgba(47,120,255,0.03)" }} />
                        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                          {d.ageRanges.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={idx === 1 ? primaryColor : lightColor} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full bg-surface-soft animate-pulse rounded-md flex items-center justify-center text-xs">
                      Loading chart...
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Locations & notes */}
            <div className="lg:col-span-6 space-y-6">
              <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                <h3 className="font-heading text-base font-bold text-ink mb-4">Top cities</h3>
                <div className="space-y-3">
                  {d.topCities.map((city) => (
                    <div key={city.name} className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-blue" />
                        <span className="text-body">{city.name}</span>
                      </div>
                      <span className="text-ink">{city.percentage}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Creator notes */}
              <Card className="p-6 border border-border bg-white rounded-lg shadow-xs">
                <h3 className="font-heading text-base font-bold text-ink mb-3">Creator notes</h3>
                <p className="text-xs text-body leading-relaxed">
                  {report.creatorNotes || "No specific comments published for this period."}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-success bg-success/5 border border-success/10 px-4 py-2.5 rounded-lg">
                  <ShieldCheck className="size-4 shrink-0 text-success" />
                  <span>Verified Screenshot Data Extracted</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Top content list */}
          {report.topContent && report.topContent.length > 0 && (
            <div className="max-w-5xl mx-auto mt-8">
              <h3 className="font-heading text-base font-bold text-ink mb-6">
                {isYouTube ? "Top performing videos" : "Top performing reels"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.topContent.map((item) => (
                  <Card key={item.id} className="p-6 border border-border bg-white rounded-lg flex flex-col justify-between shadow-xs">
                    <div>
                      {/* Thumbnail & Title row */}
                      <div className="flex gap-4 items-start mb-2">
                        {/* Video Thumbnail (supports vertical 9:16 for reel/video, horizontal 16:9 for others) */}
                        <div className={`relative ${item.mediaType === "video" || item.mediaType === "reel" ? "aspect-[9/16] w-14" : "aspect-video w-24"} rounded overflow-hidden border border-border bg-surface-soft shrink-0`}>
                          {item.thumbnail ? (
                            <Image
                              src={item.thumbnail}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue/5 text-blue">
                              {item.mediaType === "video" ? <Tv className="size-4" /> : <Play className="size-4" />}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <Badge className="bg-blue-pale text-blue border-transparent capitalize text-[9px]">
                            {item.mediaType}
                          </Badge>
                          <h4 className="font-heading text-xs font-bold text-ink mt-1.5 leading-tight">
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-4 gap-2 text-center border-t border-b border-border py-2.5 my-3">
                        <div>
                          <span className="text-[9px] text-muted uppercase block">Views</span>
                          <span className="text-xs font-bold text-ink">{item.views?.toLocaleString() ?? "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted uppercase block">{isYouTube ? "Likes" : "Reach"}</span>
                          <span className="text-xs font-bold text-ink">
                            {isYouTube ? (item.likes?.toLocaleString() ?? "N/A") : (item.reach?.toLocaleString() ?? "N/A")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted uppercase block">{isYouTube ? "Comments" : "Shares"}</span>
                          <span className="text-xs font-bold text-ink">
                            {isYouTube ? (item.comments?.toLocaleString() ?? "N/A") : (item.shares?.toLocaleString() ?? "N/A")}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-muted uppercase block">{isYouTube ? "Shares" : "Saves"}</span>
                          <span className="text-xs font-bold text-ink">
                            {isYouTube ? (item.shares?.toLocaleString() ?? "N/A") : (item.saves?.toLocaleString() ?? "N/A")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-border hover:border-blue hover:text-blue px-4 rounded-full text-xs font-semibold transition-colors bg-white text-ink"
                      >
                        {isYouTube ? <Tv className="size-3.5 text-red-600" /> : <Play className="size-3.5 fill-current" />}
                        Watch Content
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* Floating chatbot widget */}
      <AIAssistantWidget />
    </div>
  );
}
