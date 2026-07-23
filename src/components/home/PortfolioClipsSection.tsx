"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Play, ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { portfolioShorts, getYouTubeThumbnail, getYouTubeFallbackThumbnail, type PortfolioShort } from "@/content/portfolioShorts";
import { trackMediaUsage } from "@/lib/mediaRegistry";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

export function PortfolioClipsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeModalShort, setActiveModalShort] = useState<PortfolioShort | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({});
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

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

  // Register media usage for developer warnings
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

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalShort) return; // Modal takes precedence
      if (e.key === "ArrowLeft") {
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        scrollNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollPrev, scrollNext, activeModalShort]);

  // Modal keyboard listener (Escape key)
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

  const activeShort = portfolioShorts[selectedIndex] || portfolioShorts[0];

  return (
    <section id="portfolio-clips" className="relative py-20 bg-white overflow-hidden border-b border-border">
      {/* Subtle radial atmosphere & background grid */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,120,255,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,11,18,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(8,11,18,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-heading font-bold text-blue uppercase tracking-widest block mb-2">
              SELECTED SHORT-FORM WORK
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-ink">
              Real videos. <span className="text-blue">Real formats.</span> <br />
              Built for attention.
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-body max-w-xl leading-relaxed">
              A selection of fitness, finance and creator-led short-form videos published across Meet Shah’s content channels.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              className="size-11 rounded-full border border-border bg-white text-ink flex items-center justify-center hover:border-blue hover:text-blue hover:shadow-soft transition-all duration-200"
              aria-label="Previous video"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={scrollNext}
              className="size-11 rounded-full border border-border bg-white text-ink flex items-center justify-center hover:border-blue hover:text-blue hover:shadow-soft transition-all duration-200"
              aria-label="Next video"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Carousel Stage Container */}
        <div className="relative w-full">
          {/* Faded slide counter index background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading font-black text-[120px] sm:text-[180px] text-ink/[0.03] select-none pointer-events-none leading-none z-0">
            {String(selectedIndex + 1).padStart(2, "0")}
          </div>

          <div className="overflow-hidden cursor-grab active:cursor-grabbing py-6 z-10 relative" ref={emblaRef}>
            <div className="flex -ml-4 items-center">
              {portfolioShorts.map((short, index) => {
                const isActive = index === selectedIndex;
                const src = failedThumbnails[short.id]
                  ? getYouTubeFallbackThumbnail(short.id)
                  : getYouTubeThumbnail(short.id);

                return (
                  <div
                    key={short.id}
                    className="pl-4 flex-[0_0_80%] sm:flex-[0_0_55%] md:flex-[0_0_360px] min-w-0 transition-all duration-500 ease-out"
                    style={{
                      transform: isActive ? "scale(1)" : "scale(0.88)",
                      opacity: isActive ? 1 : 0.55,
                    }}
                  >
                    <div
                      className={`relative aspect-[9/16] rounded-2xl overflow-hidden border transition-all duration-500 shadow-md ${
                        isActive
                          ? "border-blue/40 shadow-xl ring-4 ring-blue/10"
                          : "border-border hover:border-blue/20"
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
                        className="object-cover"
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 360px"
                      />

                      {/* Card Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Shorts Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[9px] uppercase tracking-wider font-bold">
                          {short.category} • SHORTS
                        </Badge>
                      </div>

                      {/* Play Button Trigger */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(short, e.currentTarget);
                          }}
                          className={`size-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                            isActive
                              ? "bg-blue text-white scale-100 hover:scale-110 hover:bg-blue-light"
                              : "bg-white/80 backdrop-blur-sm text-ink scale-90 opacity-80"
                          }`}
                          aria-label={`Play ${short.title}`}
                        >
                          <Play className="size-7 fill-current translate-x-0.5" />
                        </button>
                      </div>

                      {/* Bottom Info inside thumbnail */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                        <p className="font-heading text-sm font-bold line-clamp-2 leading-snug">
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

        {/* Active Video Information Area */}
        <div className="mt-8 bg-surface-soft/60 border border-border rounded-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-pale text-blue border-transparent text-[10px] font-bold uppercase tracking-wider">
                {activeShort.category}
              </Badge>
              <span className="text-xs font-mono font-bold text-muted">
                {String(selectedIndex + 1).padStart(2, "0")} / {String(portfolioShorts.length).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink tracking-tight">
              {activeShort.title}
            </h3>
            {activeShort.description && (
              <p className="text-xs sm:text-sm text-body leading-relaxed">
                {activeShort.description}
              </p>
            )}
          </div>

          <a
            href={`https://www.youtube.com/shorts/${activeShort.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink text-white font-heading text-xs font-bold uppercase tracking-wider hover:bg-blue transition-colors shadow-soft"
          >
            View on YouTube <ExternalLink className="size-3.5" />
          </a>
        </div>
      </Container>

      {/* Accessible Video Modal Overlay */}
      {activeModalShort && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeModalShort.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 size-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-white hover:text-ink transition-colors border border-white/20"
              aria-label="Close video modal"
            >
              <X className="size-5" />
            </button>

            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${activeModalShort.id}?autoplay=1&rel=0`}
              title={activeModalShort.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}
