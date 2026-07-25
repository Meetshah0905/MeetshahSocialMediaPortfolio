"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Play, ArrowLeft, ArrowRight, ExternalLink, X, Flame, Activity, Zap } from "lucide-react";
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeModalShort, setActiveModalShort] = useState<PortfolioShort | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({});

  // Animation states
  const [hasEntered, setHasEntered] = useState(false);
  const [isFannedOut, setIsFannedOut] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Touch & Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  const filteredShorts = activeCategory === "ALL"
    ? portfolioShorts
    : portfolioShorts.filter((s) => s.category === activeCategory);

  // Responsive & Reduced Motion Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Section Entry Trigger via IntersectionObserver (§15)
  useEffect(() => {
    if (!sectionRef.current || hasEntered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();

          if (prefersReducedMotion) {
            setIsFannedOut(true);
            return;
          }

          // Initial opening stack sequence: hold briefly (300ms) then fan out outward
          const timer = setTimeout(() => {
            setIsFannedOut(true);
          }, 350);

          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasEntered, prefersReducedMotion]);

  // Reset selected index when active category changes (§8)
  const handleCategoryChange = (cat: CategoryFilter) => {
    if (cat === activeCategory) return;
    setIsFiltering(true);
    setActiveCategory(cat);
    setSelectedIndex(0);

    setTimeout(() => {
      setIsFiltering(false);
    }, 280);
  };

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredShorts.length - 1));
  }, [filteredShorts.length]);

  const scrollNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < filteredShorts.length - 1 ? prev + 1 : 0));
  }, [filteredShorts.length]);

  // Touch Swipe Handlers (§9, §10)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only swipe horizontally if X movement exceeds Y movement (allow natural vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        scrollPrev();
      } else {
        scrollNext();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Desktop Mouse Parallax (§7)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setParallaxOffset({ x: x * 6, y: y * 4 });
  };

  const handleMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalShort) return;
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext, activeModalShort]);

  // Register media usage
  useEffect(() => {
    portfolioShorts.forEach((short) => {
      trackMediaUsage(short.id, "PortfolioClips");
    });
  }, []);

  // Modal Handlers
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

  useEffect(() => {
    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeModalShort) closeModal();
    };
    if (activeModalShort) window.addEventListener("keydown", handleModalKeyDown);
    return () => window.removeEventListener("keydown", handleModalKeyDown);
  }, [activeModalShort, closeModal]);

  const activeShort = filteredShorts[selectedIndex] || filteredShorts[0] || portfolioShorts[0];
  const activeMetrics = METRICS_MAP[activeShort.id] || { views: "200K+", retention: "95%", hookScore: "9.7/10" };

  /**
   * Calculates the exact visual state (transform, scale, rotate, opacity, zIndex)
   * for each card based on whether the section is in opening stack mode or active carousel mode (§12).
   */
  const getCardVisualState = (index: number): {
    transform: string;
    opacity: number;
    zIndex: number;
    pointerEvents: React.CSSProperties["pointerEvents"];
  } => {
    const total = filteredShorts.length;
    let relativeIndex = index - selectedIndex;

    // Enable circular looping so left side is always filled with cards (§Infinite Loop)
    if (total > 2) {
      const half = Math.floor(total / 2);
      if (relativeIndex > half) {
        relativeIndex -= total;
      } else if (relativeIndex < -half) {
        relativeIndex += total;
      }
    }

    const absRel = Math.abs(relativeIndex);

    // Initial Stacked Composition (before fanning out) (§2)
    if (!isFannedOut || isFiltering) {
      const stackConfigs: Record<number, { x: number; y: number; rotate: number; scale: number; zIndex: number }> = {
        0: { x: 0, y: 10, rotate: 0, scale: 1, zIndex: 10 },
        1: { x: 100, y: -20, rotate: 4, scale: 0.93, zIndex: 7 },
        "-1": { x: -90, y: -35, rotate: -6, scale: 0.92, zIndex: 8 },
        2: { x: 210, y: 45, rotate: -4, scale: 0.86, zIndex: 4 },
        "-2": { x: -200, y: 35, rotate: 7, scale: 0.85, zIndex: 5 },
      };

      const cfg = stackConfigs[relativeIndex] || {
        x: relativeIndex * 110,
        y: 50,
        rotate: relativeIndex % 2 === 0 ? 5 : -5,
        scale: 0.8,
        zIndex: Math.max(1, 10 - absRel),
      };

      return {
        transform: `translate3d(${cfg.x}px, ${cfg.y}px, 0px) rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
        opacity: absRel > 2 ? 0 : 1 - absRel * 0.15,
        zIndex: cfg.zIndex,
        pointerEvents: relativeIndex === 0 ? "auto" : "none",
      };
    }

    // Settled Active Carousel Stage Composition (§4, §10)
    if (isMobile) {
      // Mobile 3-card deck peek
      if (relativeIndex === 0) {
        return {
          transform: `translate3d(0px, 0px, 0px) scale(1) rotate(0deg)`,
          opacity: 1,
          zIndex: 10,
          pointerEvents: "auto" as const,
        };
      }
      if (relativeIndex === 1) {
        return {
          transform: `translate3d(78%, 10px, 0px) scale(0.92) rotate(2deg)`,
          opacity: 0.75,
          zIndex: 5,
          pointerEvents: "auto" as const,
        };
      }
      if (relativeIndex === -1) {
        return {
          transform: `translate3d(-78%, 10px, 0px) scale(0.92) rotate(-2deg)`,
          opacity: 0.75,
          zIndex: 5,
          pointerEvents: "auto" as const,
        };
      }
      return {
        transform: `translate3d(${relativeIndex * 85}%, 20px, 0px) scale(0.85) rotate(0deg)`,
        opacity: 0,
        zIndex: 1,
        pointerEvents: "none" as const,
      };
    }

    // Desktop 5-card horizontal composition
    if (relativeIndex === 0) {
      return {
        transform: `translate3d(${parallaxOffset.x * 1.5}px, ${parallaxOffset.y * 1.5}px, 0px) scale(1) rotate(0deg)`,
        opacity: 1,
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    }

    if (relativeIndex === 1) {
      return {
        transform: `translate3d(calc(105% + ${parallaxOffset.x * 0.8}px), ${6 + parallaxOffset.y * 0.8}px, 0px) scale(0.94) rotate(1.8deg)`,
        opacity: 0.78,
        zIndex: 6,
        pointerEvents: "auto" as const,
      };
    }

    if (relativeIndex === -1) {
      return {
        transform: `translate3d(calc(-105% + ${parallaxOffset.x * 0.8}px), ${6 + parallaxOffset.y * 0.8}px, 0px) scale(0.94) rotate(-1.8deg)`,
        opacity: 0.78,
        zIndex: 6,
        pointerEvents: "auto" as const,
      };
    }

    if (relativeIndex === 2) {
      return {
        transform: `translate3d(calc(205% + ${parallaxOffset.x * 0.4}px), ${14 + parallaxOffset.y * 0.4}px, 0px) scale(0.88) rotate(3.2deg)`,
        opacity: 0.52,
        zIndex: 3,
        pointerEvents: "auto" as const,
      };
    }

    if (relativeIndex === -2) {
      return {
        transform: `translate3d(calc(-205% + ${parallaxOffset.x * 0.4}px), ${14 + parallaxOffset.y * 0.4}px, 0px) scale(0.88) rotate(-3.2deg)`,
        opacity: 0.52,
        zIndex: 3,
        pointerEvents: "auto" as const,
      };
    }

    return {
      transform: `translate3d(${relativeIndex * 130}%, 30px, 0px) scale(0.8) rotate(0deg)`,
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none" as const,
    };
  };

  return (
    <section
      id="portfolio-clips"
      ref={sectionRef}
      className="relative py-20 bg-white overflow-clip border-b border-border select-none"
    >
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

          {/* Carousel Controls */}
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
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-border/60">
          {CATEGORIES.map((cat) => {
            const count = cat === "ALL"
              ? portfolioShorts.length
              : portfolioShorts.filter((s) => s.category === cat).length;
            const isSelected = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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

        {/* Card Stage Container */}
        <div
          className="relative w-full h-[460px] sm:h-[540px] flex items-center justify-center overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Faded background index counter */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading font-black text-[140px] sm:text-[220px] text-ink/[0.03] select-none pointer-events-none leading-none z-0">
            {String(selectedIndex + 1).padStart(2, "0")}
          </div>

          {/* Render Cards in Choreographed Position Tracks */}
          <div className="relative w-[280px] sm:w-[320px] h-[440px] sm:h-[510px]">
            {filteredShorts.map((short, index) => {
              const isActive = index === selectedIndex;
              const styleState = getCardVisualState(index);
              const src = failedThumbnails[short.id]
                ? getYouTubeFallbackThumbnail(short.id)
                : getYouTubeThumbnail(short.id);
              const metrics = METRICS_MAP[short.id] || { views: "200K+", retention: "95%", hookScore: "9.7/10" };

              return (
                <div
                  key={short.id}
                  onClick={() => {
                    if (!isActive) setSelectedIndex(index);
                  }}
                  className="absolute inset-0 cursor-pointer will-change-transform"
                  style={{
                    transform: styleState.transform,
                    opacity: styleState.opacity,
                    zIndex: styleState.zIndex,
                    pointerEvents: styleState.pointerEvents,
                    transition: prefersReducedMotion
                      ? "opacity 200ms ease"
                      : "transform 750ms cubic-bezier(0.22, 1, 0.36, 1), opacity 750ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div
                    className={`relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl group ${
                      isActive
                        ? "border-blue shadow-[0_20px_50px_rgba(47,120,255,0.28)] ring-4 ring-blue/20 hover:scale-[1.015] hover:-translate-y-1"
                        : "border-border/80 hover:border-blue/40 hover:opacity-90"
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
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 280px, 320px"
                    />

                    {/* Card Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />

                    {/* Top Badges & Soundwave Indicator */}
                    <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between">
                      <Badge className="bg-black/70 backdrop-blur-md text-white border-white/20 text-[9px] uppercase tracking-wider font-bold">
                        {short.category} • REEL
                      </Badge>

                      {isActive && (
                        <div className="flex items-center gap-1.5 bg-blue/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider border border-white/20 shadow-xs">
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
                              ? "bg-blue text-white scale-100 group-hover:scale-110 hover:bg-blue-light"
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

        {/* Studio Video Workspace Details Box */}
        <div className="mt-8 bg-slate-950 border border-border/80 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl text-left">
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
