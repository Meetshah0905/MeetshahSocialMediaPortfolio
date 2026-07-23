"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getYouTubeThumbnail } from "@/content/portfolioShorts";
import { trackMediaUsage } from "@/lib/mediaRegistry";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Sparkles, Layers, Share2, Compass } from "lucide-react";

const STAGES = [
  {
    id: "01",
    label: "01  Find the hook",
    title: "Find the reason to stop.",
    copy: "Identify the audience problem, the immediate tension and the opening line that earns the next few seconds.",
    videoId: "ygiTdLCJx6g",
    videoTitle: "The Ultimate Desk Worker Stretching Routine",
  },
  {
    id: "02",
    label: "02  Clarify the message",
    title: "Make the idea easy to understand.",
    copy: "Reduce the topic to one useful takeaway supported by clear language, examples and visual explanation.",
    videoId: "VRgRlHftKJ8",
    videoTitle: "Why Iran is Targeting Corporate Offices",
  },
  {
    id: "03",
    label: "03  Build the story",
    title: "Give every second a purpose.",
    copy: "Arrange the hook, context, explanation, proof and final action into a compact narrative.",
    videoId: "sGJNHXaem4k",
    videoTitle: "Claude AI Prompt Compression Framework",
  },
  {
    id: "04",
    label: "04  Create the connection",
    title: "End with relevance, not interruption.",
    copy: "Connect the audience’s need with the message, creator voice and campaign objective.",
    videoId: "GhtGghOBRv0",
    videoTitle: "Elon Musk & Optimus Space Mission",
  },
];

export function CreativeStrategySection() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    STAGES.forEach((stage) => {
      trackMediaUsage(stage.videoId, `CreativeStrategy-Stage-${stage.id}`);
    });
  }, []);

  const currentStage = STAGES[activeStage];

  return (
    <section id="creative-process" className="relative py-20 bg-surface-soft/40 border-t border-border overflow-hidden">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="bg-blue-pale text-blue border-transparent uppercase tracking-widest mb-3">
            CREATIVE PROCESS
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            How a useful idea <br />
            <span className="text-blue">becomes a watchable video.</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-body leading-relaxed">
            From finding the hook to building the final audience connection.
          </p>
        </div>

        {/* Horizontal Process Spine Navigation */}
        <div className="mb-10 w-full max-w-4xl mx-auto">
          <div className="relative flex justify-between items-center">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-border -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-blue -translate-y-1/2 z-0 transition-all duration-500 ease-out"
              style={{ width: `${(activeStage / (STAGES.length - 1)) * 100}%` }}
            />

            {/* Stage Markers */}
            {STAGES.map((stg, idx) => {
              const isActive = idx === activeStage;
              const isPassed = idx <= activeStage;
              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveStage(idx)}
                  className={`relative z-10 flex flex-col items-center gap-2 group transition-all duration-300`}
                  aria-label={`Jump to stage ${stg.label}`}
                >
                  <div
                    className={`size-10 rounded-full border-2 flex items-center justify-center font-heading text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-blue text-white border-blue shadow-md scale-110"
                        : isPassed
                        ? "bg-white text-blue border-blue"
                        : "bg-white text-muted border-border hover:border-blue/40"
                    }`}
                  >
                    {stg.id}
                  </div>
                  <span
                    className={`hidden sm:block text-[11px] font-heading font-bold uppercase tracking-wider transition-colors ${
                      isActive ? "text-blue" : "text-muted group-hover:text-ink"
                    }`}
                  >
                    {stg.label.replace(/^\d+\s+/, "")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Content & Interactive Storyboard Frame (620-720px height stage) */}
        <div className="bg-white border border-border rounded-panel shadow-soft p-6 sm:p-10 min-h-[560px] lg:min-h-[620px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Left Column: Stage Copy & Controls */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-center z-10">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue uppercase tracking-widest block">
                STAGE {currentStage.id} OF 04
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight">
                {currentStage.title}
              </h3>
              <p className="text-xs sm:text-sm text-body leading-relaxed">
                {currentStage.copy}
              </p>
            </div>

            {/* Stage Navigation Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/60">
              <button
                onClick={() => setActiveStage((prev) => Math.max(0, prev - 1))}
                disabled={activeStage === 0}
                className="px-4 py-2 rounded-full border border-border text-xs font-heading font-bold uppercase tracking-wider disabled:opacity-30 hover:border-blue hover:text-blue transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setActiveStage((prev) => Math.min(STAGES.length - 1, prev + 1))}
                disabled={activeStage === STAGES.length - 1}
                className="px-5 py-2 rounded-full bg-blue text-white text-xs font-heading font-bold uppercase tracking-wider disabled:opacity-30 hover:bg-blue-light transition-colors shadow-xs"
              >
                Next Stage
              </button>
            </div>
          </div>

          {/* Right Column: Custom Interactive Storyboard Visual per Stage */}
          <div className="lg:col-span-7 h-full w-full min-h-[380px] bg-surface-soft/60 border border-border rounded-2xl p-6 relative flex items-center justify-center overflow-hidden">
            {/* STAGE 1 VISUAL: FIND THE HOOK */}
            {activeStage === 0 && (
              <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-400">
                <div className="bg-white border border-border rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-muted uppercase">
                    <span>HOOK CONCEPTION</span>
                    <span className="text-blue font-bold">0:00 - 0:03 SECOND TENSION</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-ink italic leading-snug">
                    “If you sit at a desk for 8 hours, your hip flexors are completely dormant.”
                  </h4>
                  <div className="flex gap-2">
                    <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold px-2 py-0.5 rounded">
                      PROBLEM
                    </span>
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded">
                      TENSION
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded">
                      PAYOFF
                    </span>
                  </div>
                </div>

                {/* Timeline bar with 0:03 marker */}
                <div className="bg-white border border-border rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-muted">
                    <span>0:00 (Hook)</span>
                    <span className="text-blue">0:03 (Retention Peak)</span>
                    <span>0:60 (End)</span>
                  </div>
                  <div className="relative h-3 w-full bg-border/50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue w-[25%] rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Small Real Short Reference Frame */}
                <div className="flex items-center gap-4 bg-white border border-border rounded-xl p-3">
                  <div className="relative aspect-[9/16] w-14 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <Image
                      src={getYouTubeThumbnail(currentStage.videoId)}
                      alt={currentStage.videoTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-blue uppercase block">Real Reference Short</span>
                    <p className="text-xs font-bold text-ink line-clamp-1">{currentStage.videoTitle}</p>
                    <span className="text-[10px] text-muted font-mono">ID: {currentStage.videoId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2 VISUAL: CLARIFY THE MESSAGE */}
            {activeStage === 1 && (
              <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-400">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Box */}
                  <div className="bg-white/80 border border-border/80 rounded-xl p-4 space-y-2">
                    <span className="text-[9px] font-mono font-bold text-muted uppercase block">Before (Complex Raw Notes)</span>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      Multiple macroeconomic geopolitical factors impact commercial asset valuations, international shipping routes, corporate treasury management...
                    </p>
                  </div>

                  {/* After Box */}
                  <div className="bg-white border-2 border-blue/30 rounded-xl p-4 space-y-2 shadow-sm">
                    <span className="text-[9px] font-mono font-bold text-blue uppercase block">After (3 Clear Visual Points)</span>
                    <ul className="space-y-1 text-xs font-bold text-ink">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-blue" /> 1. Commercial Vulnerability</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-blue" /> 2. Infrastructure Risk</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-blue" /> 3. Treasury Safeguards</li>
                    </ul>
                  </div>
                </div>

                {/* Line Diagram */}
                <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-blue" />
                    <span className="text-xs font-bold text-ink">Information Simplification Engine</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">100% Clarity</span>
                </div>

                {/* Small Real Short Reference Frame */}
                <div className="flex items-center gap-4 bg-white border border-border rounded-xl p-3">
                  <div className="relative aspect-[9/16] w-14 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <Image
                      src={getYouTubeThumbnail(currentStage.videoId)}
                      alt={currentStage.videoTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-blue uppercase block">Real Reference Short</span>
                    <p className="text-xs font-bold text-ink line-clamp-1">{currentStage.videoTitle}</p>
                    <span className="text-[10px] text-muted font-mono">ID: {currentStage.videoId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3 VISUAL: BUILD THE STORY */}
            {activeStage === 2 && (
              <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-400">
                {/* 5-part Horizontal Story Timeline */}
                <div className="bg-white border border-border rounded-xl p-4 space-y-3">
                  <span className="text-[9px] font-mono font-bold text-blue uppercase block">5-Part Narrative Sequence</span>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                    <div className="bg-blue/10 text-blue p-2 rounded border border-blue/20">Hook</div>
                    <div className="bg-surface-soft text-ink p-2 rounded border border-border">Context</div>
                    <div className="bg-surface-soft text-ink p-2 rounded border border-border">Value</div>
                    <div className="bg-surface-soft text-ink p-2 rounded border border-border">Proof</div>
                    <div className="bg-emerald-50 text-emerald-700 p-2 rounded border border-emerald-200">Action</div>
                  </div>
                </div>

                {/* Thumbnail Strip using 3 Short Frames */}
                <div className="grid grid-cols-3 gap-3">
                  {["sGJNHXaem4k", "LCJmCg53tH0", "gOInL4NHcbQ"].map((vId, idx) => (
                    <div key={vId} className="relative aspect-[9/16] rounded-xl overflow-hidden border border-border shadow-xs">
                      <Image
                        src={getYouTubeThumbnail(vId)}
                        alt={`Story frame ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                        Frame 0{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STAGE 4 VISUAL: CREATE THE CONNECTION */}
            {activeStage === 3 && (
              <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-400">
                {/* Connecting Node Graphic */}
                <div className="bg-white border border-border rounded-xl p-6 relative">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue/10 text-blue rounded-lg border border-blue/20 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Compass className="size-4" /> Audience Need
                    </div>
                    <div className="p-3 bg-blue-deep/10 text-blue-deep rounded-lg border border-blue-deep/20 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Sparkles className="size-4" /> Creator Voice
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Layers className="size-4" /> Message Structure
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Share2 className="size-4" /> Campaign Objective
                    </div>
                  </div>
                </div>

                {/* Final Real Short Preview & Final CTAs */}
                <div className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-[9/16] w-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <Image
                        src={getYouTubeThumbnail(currentStage.videoId)}
                        alt={currentStage.videoTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase block">Connection Verified</span>
                      <p className="text-xs font-bold text-ink">{currentStage.videoTitle}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <ArrowPillButton href="/ugc" size="md">
                      Explore the work
                    </ArrowPillButton>
                    <Button href="/contact" size="sm" variant="outline">
                      Start a collaboration
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
