"use client";

import { useState } from "react";
import Image from "next/image";
import { imageManifest } from "@/content/imageManifest";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import {
  Video,
  Film,
  Layers,
  Sparkles,
  BookOpen,
  PencilRuler,
  Lightbulb,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

export type ServiceItem = {
  num: string;
  title: string;
  category: string;
  desc: string;
  highlights: string[];
  icon: typeof Video;
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    num: "01",
    title: "Dedicated Instagram Reels",
    category: "Organic Distribution",
    desc: "Niche-targeted short-form video content published directly on Fitness (@meetsofficial) or Finance (@meet.fitfix) channels.",
    highlights: ["27K+ Combined Reach", "9:16 Vertical 4K HD", "Instagram Link & Tagging"],
    icon: Video,
  },
  {
    num: "02",
    title: "UGC Video Production",
    category: "Ad & Brand Deliverables",
    desc: "Custom-formatted vertical video assets delivered directly to brand channels, structured with 3+ hook variations for paid ad testing.",
    highlights: ["3 Hook Variations Included", "Raw & Edited Footage", "Optimized for Meta & TikTok Ads"],
    icon: Film,
  },
  {
    num: "03",
    title: "Story Integrations",
    category: "Interactive Reach",
    desc: "Multi-frame story sequences showing authentic product use cases, live feedback, and interactive link stickers.",
    highlights: ["Interactive Polls & Stickers", "Direct Traffic Routing", "24h Highlight Preservation"],
    icon: Layers,
  },
  {
    num: "04",
    title: "Product Demonstrations",
    category: "Performance UGC",
    desc: "Hands-on walk-throughs showcasing product features, textures, taste-tests, and physical everyday use cases.",
    highlights: ["Macro Close-up Shots", "Unboxing & First Impression", "Authentic Creator Pacing"],
    icon: Sparkles,
  },
  {
    num: "05",
    title: "Educational Explainers",
    category: "High Retention Strategy",
    desc: "Clear and compliant explanations of complex wellness practices, supplements, or financial dashboard utilities.",
    highlights: ["Simplified Complex Topics", "Compliance & Safe-Zone Ready", "Screen-recording Overlays"],
    icon: BookOpen,
  },
  {
    num: "06",
    title: "Script & Hook Development",
    category: "Creative Writing",
    desc: "Creator-led drafts, alternate visual sequences, and call-to-action scripts tailored specifically to brand campaign briefs.",
    highlights: ["Pattern-Interrupt Openers", "Audience Hook Frameworks", "Conversion CTA Scripts"],
    icon: PencilRuler,
  },
  {
    num: "07",
    title: "Creative Strategy",
    category: "Campaign Planning",
    desc: "Audience alignment research, viral trend ideation, competitor analysis, and multi-video narrative mapping.",
    highlights: ["Competitor Gap Analysis", "Retention Curve Mapping", "Multi-Angle Briefing"],
    icon: Lightbulb,
  },
  {
    num: "08",
    title: "Paid Usage Rights",
    category: "Licensing & Ads",
    desc: "Licensing options permitting brands to run paid ad campaigns utilizing created creator assets across platforms.",
    highlights: ["30 / 60 / 90-Day Rights", "Meta & TikTok Ad License", "Worldwide Distribution"],
    icon: KeyRound,
  },
  {
    num: "09",
    title: "Whitelisting & Dark Posts",
    category: "Publisher Rights",
    desc: "Advertiser publishing permissions to distribute paid reels and ads directly under Meet Shah's verified social handles.",
    highlights: ["Direct Partnership Access", "Higher Ad CTR & Social Proof", "Custom Audience Targeting"],
    icon: ShieldCheck,
  },
  {
    num: "10",
    title: "Long-term Partnerships",
    category: "Brand Ambassador",
    desc: "Multi-month brand integrations and recurring content drops across channels to sustain compounding organic visibility.",
    highlights: ["Monthly Video Quotas", "Dedicated Brand Ambassadorship", "Quarterly Strategy Alignment"],
    icon: TrendingUp,
  },
];

export function ServicesSection() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeService = SERVICES_DATA[activeIdx];
  const IconComponent = activeService.icon;

  return (
    <WhiteAtmosphereSection id="services" halo="right" className="bg-white py-20 border-b border-border">
      <Container className="max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div className="space-y-3 max-w-2xl">
            <Badge className="bg-blue-pale text-blue border-transparent uppercase font-bold tracking-widest text-[10px]">
              CAPABILITIES & FORMATS
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink leading-tight">
              Flexible video formats <br />
              <span className="text-blue">engineered for maximum retention.</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-body max-w-md leading-relaxed">
            Select any capability below to explore video deliverables, strategy specs, and campaign licensing options.
          </p>
        </div>

        {/* Desktop & Mobile Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Capability List (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-2">
            <div className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest pb-2 mb-3 border-b border-border/60 text-left">
              SELECT CAPABILITY TO PREVIEW (01 — 10)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICES_DATA.map((srv, idx) => {
                const isActive = activeIdx === idx;
                const Icon = srv.icon;

                return (
                  <button
                    key={srv.num}
                    onClick={() => setActiveIdx(idx)}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`group relative p-3.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer select-none ${
                      isActive
                        ? "bg-blue/5 border-blue/40 shadow-soft translate-x-1"
                        : "bg-white border-border/80 hover:border-blue/30 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Active Indicator Left Accent Bar */}
                    <div
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-all duration-300 ${
                        isActive ? "bg-blue opacity-100" : "bg-transparent opacity-0"
                      }`}
                    />

                    <div className="flex items-center gap-3 pl-1 min-w-0">
                      <div
                        className={`size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-blue text-white shadow-xs"
                            : "bg-surface-soft text-muted group-hover:text-blue group-hover:bg-blue/10"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-mono text-[10px] font-bold ${
                              isActive ? "text-blue" : "text-muted"
                            }`}
                          >
                            {srv.num}
                          </span>
                          <span className="text-[9px] font-mono text-muted uppercase tracking-wider truncate">
                            · {srv.category}
                          </span>
                        </div>
                        <h3
                          className={`font-heading text-xs font-bold truncate transition-colors ${
                            isActive ? "text-blue" : "text-ink group-hover:text-blue"
                          }`}
                        >
                          {srv.title}
                        </h3>
                      </div>
                    </div>

                    <ChevronRight
                      className={`size-4 shrink-0 transition-transform duration-300 ${
                        isActive
                          ? "text-blue translate-x-0.5 opacity-100"
                          : "text-muted opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dynamic Stage Card Preview (lg:col-span-5) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="relative rounded-2xl overflow-hidden border border-border/90 bg-slate-950 text-white p-6 sm:p-8 shadow-xl text-left space-y-6">
              {/* Studio Poster Image Ambient Background */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <Image
                  src={imageManifest.servicesPoster.src}
                  alt={imageManifest.servicesPoster.alt}
                  fill
                  sizes="40vw"
                  className="object-cover opacity-25 filter blur-[1px] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70" />
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              </div>

              {/* Stage Content */}
              <div className="relative z-10 space-y-5">
                {/* Header Tag Row */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-8 rounded-lg bg-blue/20 border border-blue/40 flex items-center justify-center text-blue-light">
                      <IconComponent className="size-4" />
                    </span>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-blue-light uppercase tracking-widest block">
                        CAPABILITY SPECIFICATION
                      </span>
                      <span className="text-[10px] font-mono text-white/60 font-bold">
                        {activeService.num} / 10 · {activeService.category}
                      </span>
                    </div>
                  </div>

                  <span className="bg-blue/80 backdrop-blur-md text-white text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-blue-light/30">
                    VERIFIED FORMAT
                  </span>
                </div>

                {/* Service Title & Main Description */}
                <div className="space-y-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                    {activeService.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                    {activeService.desc}
                  </p>
                </div>

                {/* Deliverables Highlights List */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[9px] font-mono font-bold text-white/60 uppercase tracking-wider block">
                    DELIVERABLE HIGHLIGHTS
                  </span>
                  <div className="space-y-2">
                    {activeService.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white/90">
                        <CheckCircle2 className="size-3.5 text-blue-light shrink-0" />
                        <span className="font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer CTA Button */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-white/60">
                    Ready to scale your video campaign?
                  </span>
                  <ArrowPillButton
                    href={`/contact?service=${encodeURIComponent(activeService.title)}`}
                    size="sm"
                    className="w-full sm:w-auto text-center justify-center"
                  >
                    Inquire For This Capability
                  </ArrowPillButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </WhiteAtmosphereSection>
  );
}
