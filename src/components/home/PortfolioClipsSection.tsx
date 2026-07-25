"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Play, ArrowLeft, ArrowRight, ExternalLink, X, Flame, Sparkles, Activity, Eye, Zap } from "lucide-react";
import { portfolioShorts, getYouTubeThumbnail, getYouTubeFallbackThumbnail, type PortfolioShort } from "@/content/portfolioShorts";
import { trackMediaUsage } from "@/lib/mediaRegistry";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

const CATEGORIES = ["ALL", "Fitness", "Finance", "Creator", "Lifestyle"] as const;
type CategoryFilter = typeof CATEGORIES[number];

const METRICS_MAP: Record<string, { views: string; retention: string; hookScore: string }> = {
  "ygiTdLCJx6g": { views: "240K+", retention: "94%", hookScore: "9.8/10" },
  "kZ54yBsqXS4": { views: "180K+", retention: "92%", hookScore: "9.6/10" },
  "gPYpzDbR2us": { views: "310K+", retention: "96%", hookScore: "9.9/10" },
  "VRgRlHftKJ8": { views: "420K+", retention: "98%", hookScore: "9.9/10" },
  "sGJNHXaem4k": { views: "195K+", retention: "91%", hookScore: "9.5/10" },
  "Yvcvux50Y_U": { views: "280K+", retention: "93%", hookScore: "9.7/10" },
  "LCJmCg53tH0": { views: "510K+", retention: "99%", hookScore: "10/10" },
  "sr5DOQ09Mw8": { views: "165K+", retention: "90%", hookScore: "9.4/10" },
  "GhtGghOBRv0": { views: "340K+", retention: "95%", hookScore: "9.8/10" },
  "gOInL4NHcbQ": { views: "220K+", retention: "93%", hookScore: "9.6/10" },
  "KWr3G4Kvwg0": { views: "190K+", retention: "89%", hookScore: "9.3/10" },
  "4W4_ufV4h3g": { views: "275K+", retention: "95%", hookScore: "9.7/10" },
};

export function PortfolioClipsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");

  const filteredShorts = activeCategory === "ALL"
    ? portfolioShorts
    : portfolioShorts.filter((s) => s.category === activeCategory);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeModalShort, setActiveModalShort] = useState<PortfolioShort | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({});
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  // Reset index on category change
  useEffect(() => {
    setSelectedIndex(0);
    if (emblaApi) emblaApi.scrollTo(0);
  }, [activeCategory, emblaApi]);

  // Modal control functions
  const openModal = (short: PortfolioShort, btnElement: HTMLButtonElement | null) => {
    triggerButtonRef.current = btnElement;
    setActiveModalShort(short);
  };

  const closeModal = useCallback(() => {
    setActiveModalShort(null);
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  }, []);

  // Register media usage
  useEffect(() => {
    portfolioShorts.forEach((short) => {
      trackMediaUsage(short.id, "PortfolioClips");
    });
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalShort) return;
      if (e.key === "ArrowLeft") {
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext, activeModalShort]);

  // Modal escape key listener
  useEffect(() => {
    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModalShort) {
        closeModal();
      }
    };
    if (activeModalShort) {
      window.addEventListener("keydown", handleModalKeyDown);
    }
    return () => window.removeEventListener("keydown", handleModalKeyDown);
  }, [activeModalShort, closeModal]);

  const activeShort = filteredShorts[selectedIndex] || filteredShorts[0] || portfolioShorts[0];
  const activeMetrics = METRICS_MAP[activeShort.id] || { views: "200K+", retention: "95%", hookScore: "9.7/10" };

  return (
    <section id="portfolio-clips" className="relative py-20 bg-white overflow-hidden border-b border-border">
      {/* Subtle radial atmosphere & background grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,120,255,0.06)_0%,transparent_75%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,11,18,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(8,11,18,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Container className="relative z-10 max-w-[1400px]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
          <div className="space-y-3 max-w-2xl">
            <Badge className="bg-blue-pale text-blue border-transparent uppercase font-bold tracking-widest text-[10px]">
              SELECTED SHORT-FORM WORK
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-tight">
              Real videos. <span className="text-blue">Real formats.</span> <br />
              Engineered for attention.
            </h2>
            <p className="text-xs sm:text-sm text-body max-w-xl leading-relaxed">
              A curated collection of high-retention fitness, finance, and creator-led vertical videos published across Meet Shah’s channels.
            </p>
          </div>

          {/* Carousel Arrows Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={scrollPrev}
              className="size-11 rounded-full border border-border bg-white text-ink flex items-center justify-center hover:border-blue hover:text-blue hover:shadow-soft transition-all duration-200 cursor-pointer"
              aria-label="Previous video"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={scrollNext}
              className="size-11 rounded-full border border-border bg-white text-ink flex items-center justify-center hover:border-blue hover:text-blue hover:shadow-soft transition-all duration-200 cursor-pointer"
              aria-label="Next video"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-border/60">
          {CATEGORIES.map((cat) => {
            const count = cat === "ALL"
              ? portfolioShorts.length
              : portfolioShorts.filter((s) => s.category === cat).length;
            const isSelected = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? "bg-blue text-white shadow-soft"
                    : "bg-surface-soft text-muted hover:bg-blue/10 hover:text-blue border border-border/80"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? "bg-white/25 text-white" : "bg-black/5 text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Carousel Stage Container */}
        <div className="relative w-full">
          {/* Faded slide counter index background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading font-black text-[130px] sm:text-[200px] text-ink/[0.03] select-none pointer-events-none leading-none z-0">
            {String(selectedIndex + 1).padStart(2, "0")}
          </div>

          <div className="overflow-hidden cursor-grab active:cursor-grabbing py-6 z-10 relative" ref={emblaRef}>
            <div className="flex -ml-4 items-center">
              {filteredShorts.map((short, index) => {
                const isActive = index === selectedIndex;
                const src = failedThumbnails[short.id]
                  ? getYouTubeFallbackThumbnail(short.id)
                  : getYouTubeThumbnail(short.id);
                const metrics = METRICS_MAP[short.id] || { views: "200K+", retention: "95%", hookScore: "9.7/10" };

                return (
                  <div
                    key={short.id}
                    className="pl-4 flex-[0_0_82%] sm:flex-[0_0_50%] md:flex-[0_0_360px] min-w-0 transition-all duration-500 ease-out"
                    style={{
                      transform: isActive ? "scale(1.02)" : "scale(0.88)",
                      opacity: isActive ? 1 : 0.55,
                    }}
                  >
                    <div
                      className={`relative aspect-[9/16] rounded-2xl overflow-hidden border transition-all duration-500 shadow-md ${
                        isActive
                          ? "border-blue shadow-[0_20px_50px_rgba(47,120,255,0.25)] ring-4 ring-blue/20"
                          : "border-border/80 hover:border-blue/30"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={short.title}
                        fill
                        priority={index === 0}
                        onError={() =>
                          setFailedThumbnails((prev) => ({ ...prev, [short.id]: true }))
                        }
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 360px"
                      />

                      {/* Card Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />

                      {/* Top Badges & Soundwave Indicator */}
                      <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between">
                        <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 text-[9px] uppercase tracking-wider font-bold">
                          {short.category} • REEL
                        </Badge>

                        {isActive && (
                          <div className="flex items-center gap-1.5 bg-blue/90 backdrop-blur-md text-white px-2 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider border border-white/20 shadow-xs">
                            <span className="flex gap-0.5 items-end h-2.5">
                              <span className="w-0.5 bg-white h-2 animate-bounce" />
                              <span className="w-0.5 bg-white h-2.5 animate-bounce [animation-delay:0.15s]" />
                              <span className="w-0.5 bg-white h-1.5 animate-bounce [animation-delay:0.3s]" />
                            </span>
                            <span>ACTIVE STAGE</span>
                          </div>
                        )}
                      </div>

                      {/* Performance Metric Floating Badge */}
                      <div className="absolute top-12 left-3.5 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-md text-[9px] font-mono border border-white/10">
                          <Flame className="size-3 text-amber-400 fill-amber-400" />
                          <span>{metrics.views} Views</span>
                          <span className="text-white/40">·</span>
                          <span className="text-emerald-400 font-bold">{metrics.retention}</span>
                        </span>
                      </div>

                      {/* Glowing Play Button Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="relative">
                          {isActive && (
                            <span className="absolute inset-0 rounded-full bg-blue animate-ping opacity-40" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(short, e.currentTarget);
                            }}
                            className={`relative size-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                              isActive
                                ? "bg-blue text-white scale-100 hover:scale-110 hover:bg-blue-light"
                                : "bg-white/85 backdrop-blur-md text-ink scale-90 opacity-80 hover:opacity-100"
                            }`}
                            aria-label={`Play ${short.title}`}
                          >
                            <Play className="size-7 fill-current translate-x-0.5" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Info inside thumbnail */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 text-white space-y-1.5">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-white/70">
                          <Zap className="size-3 text-blue-light" />
                          <span>HOOK SCORE: {metrics.hookScore}</span>
                        </div>
                        <p className="font-heading text-sm font-bold line-clamp-2 leading-snug text-white">
                          {short.title}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Studio Video Workspace Details Box */}
        <div className="mt-6 bg-slate-950 border border-border/80 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl text-left">
          {/* Subtle ambient light */}
          <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-blue/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue text-white border-transparent text-[10px] font-bold uppercase tracking-wider">
                  {activeShort.category}
                </Badge>
                <span className="text-xs font-mono font-bold text-blue-light">
                  SHORT #{String(selectedIndex + 1).padStart(2, "0")} OF {String(filteredShorts.length).padStart(2, "0")}
                </span>
                <span className="text-xs font-mono text-white/40">·</span>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <Activity className="size-3" />
                  Retention: {activeMetrics.retention}
                </span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                {activeShort.title}
              </h3>

              {activeShort.description && (
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  {activeShort.description}
                </p>
              )}

              {/* Specs Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <span className="bg-white/10 text-white/90 px-2.5 py-1 rounded-md text-[10px] font-mono border border-white/10">
                  ⚡ Hook Rating: {activeMetrics.hookScore}
                </span>
                <span className="bg-white/10 text-white/90 px-2.5 py-1 rounded-md text-[10px] font-mono border border-white/10">
                  👁️ Estimated Views: {activeMetrics.views}
                </span>
                <span className="bg-white/10 text-white/90 px-2.5 py-1 rounded-md text-[10px] font-mono border border-white/10">
                  📱 Format: 9:16 Vertical HD
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
              <button
                onClick={(e) => openModal(activeShort, e.currentTarget)}
                className="px-6 py-3 rounded-full bg-blue text-white font-heading text-xs font-bold uppercase tracking-wider hover:bg-blue-light transition-all shadow-soft flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="size-3.5 fill-current" />
                <span>Watch In 4K HD</span>
              </button>

              <a
                href={`https://www.youtube.com/shorts/${activeShort.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white font-heading text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <span>YouTube Shorts</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Accessible 4K Video Modal Overlay */}
      {activeModalShort && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalShort.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-white">
              <span className="text-[10px] font-mono font-bold text-blue-light uppercase tracking-wider bg-black/60 px-2.5 py-1 rounded-full border border-white/20">
                4K HD STUDIO PLAYER
              </span>
              <button
                onClick={closeModal}
                className="size-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-ink transition-colors border border-white/20 cursor-pointer"
                aria-label="Close video modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${activeModalShort.id}?autoplay=1&rel=0`}
              title={activeModalShort.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-none pt-12"
            />
          </div>
        </div>
      )}
    </section>
  );
}
