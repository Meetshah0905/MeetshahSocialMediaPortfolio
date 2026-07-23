"use client";

import { useState, useRef } from "react";
import { ugcInstagramReels, UGCInstagramReel } from "@/content/ugcInstagramReels";
import { InstagramReelSelector } from "./InstagramReelSelector";
import { InstagramReelStage } from "./InstagramReelStage";
import { ReelReviewTimeline } from "./ReelReviewTimeline";
import { StoryboardStrip } from "./StoryboardStrip";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import gsap from "gsap";

export function CreativeLab() {
  const [activeId, setActiveId] = useState<string>("ugc-reel-01");
  const workspaceRef = useRef<HTMLDivElement>(null);

  const activeReel =
    ugcInstagramReels.find((r) => r.id === activeId) || ugcInstagramReels[0];

  const handleSelectReel = (id: string) => {
    if (id === activeId) return;

    if (workspaceRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(workspaceRef.current, {
        opacity: 0.5,
        scale: 0.99,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          setActiveId(id);
          gsap.to(workspaceRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            clearProps: "opacity,transform",
          });
        },
      });
    } else {
      setActiveId(id);
    }
  };

  return (
    <section id="creative-lab" className="relative py-20 bg-white border-b border-border text-ink overflow-hidden">
      {/* Subtle pale-blue radial light atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,120,255,0.05)_0%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,16,31,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(9,16,31,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Container className="max-w-[1440px] px-6 sm:px-12 relative z-10">
        {/* Section Introduction */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 border-b border-border/60 pb-8">
          <div className="lg:w-[60%] space-y-3">
            <Badge className="bg-blue-pale text-blue border-transparent uppercase font-bold tracking-widest text-[10px]">
              THE CREATIVE LAB
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-tight">
              From brief <br />
              <span className="text-blue">to scroll-stopping video.</span>
            </h2>
          </div>

          <div className="lg:w-[38%] space-y-4">
            <p className="text-xs sm:text-sm text-body leading-relaxed">
              Explore Meet Shah&apos;s real Instagram UGC Reels, visual structures, creator-led pacing and short-form video execution.
            </p>
            <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-muted uppercase tracking-wider pt-2 border-t border-border/40">
              <span className="text-blue">BRIEF</span>
              <span>→</span>
              <span>SCRIPT</span>
              <span>→</span>
              <span>SHOOT</span>
              <span>→</span>
              <span>EDIT</span>
            </div>
          </div>
        </div>

        {/* Disclosure Notice */}
        <div className="mb-8 p-3 rounded-lg bg-surface-soft border border-border text-[11px] font-mono text-muted flex items-center justify-between">
          <span>
            💡 Official Instagram UGC Reels. Select any entry to load its interactive platform preview and production structure.
          </span>
          <span className="hidden sm:block text-[9px] uppercase font-bold text-blue">
            5 VERIFIED REELS
          </span>
        </div>

        {/* Creative Lab Production Workspace (24% / 36% / 40% Desktop Split) */}
        <div
          ref={workspaceRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[680px] bg-white border border-border rounded-2xl shadow-soft p-6 sm:p-8 relative"
        >
          {/* Left Column: 5-Reel Selector (24% / lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest pb-2 border-b border-border/60">
              01 — SELECT INSTAGRAM REEL
            </div>
            <InstagramReelSelector
              reels={ugcInstagramReels}
              activeId={activeId}
              onSelect={handleSelectReel}
            />
          </div>

          {/* Center Column: Active 9:16 Media Stage (36% / lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-border/60 px-0 lg:px-6">
            <div className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest pb-3 w-full text-center">
              02 — ACTIVE 9:16 MEDIA STAGE
            </div>
            <InstagramReelStage reel={activeReel} />
          </div>

          {/* Right Column: Review Timeline & Storyboard Strip (40% / lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8">
            <ReelReviewTimeline reel={activeReel} />
            <StoryboardStrip reel={activeReel} />
          </div>
        </div>
      </Container>
    </section>
  );
}
