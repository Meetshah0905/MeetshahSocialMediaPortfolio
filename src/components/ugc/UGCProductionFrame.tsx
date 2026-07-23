"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { trackMediaUsage } from "@/lib/mediaRegistry";

export function UGCProductionFrame() {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackMediaUsage("meet-studio-poster", "UGCHero");
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!innerRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to(innerRef.current, {
      x: x * 10,
      y: y * 5,
      scale: 1.012,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    gsap.to(innerRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={frameRef}
      className="relative w-full max-w-[820px] mx-auto lg:mx-0 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Offset outline frame depth */}
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[4px_34px_4px_4px] border border-blue/30 bg-surface-soft/40 -z-10 transition-transform duration-300" />

      {/* Main Production Frame with restrained editorial crop */}
      <div
        ref={innerRef}
        className="relative w-full aspect-[2752/1536] rounded-[4px_34px_4px_4px] border border-border/80 shadow-soft bg-ink overflow-hidden"
      >
        {/* Top Production Metadata Rail */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-3.5 flex items-center justify-between text-[9px] font-mono text-white/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-blue">
              <span className="size-2 rounded-full bg-blue animate-pulse" />
              <span>REC</span>
            </div>
            <span className="hidden sm:inline border-l border-white/20 pl-3">
              PROJECT / UGC CAMPAIGN
            </span>
          </div>

          <div className="flex items-center gap-3 font-bold">
            <span className="bg-white/15 px-2 py-0.5 rounded text-[8px]">
              FORMAT / 9:16
            </span>
            <span className="tracking-widest font-mono text-white">
              00:00:03:12
            </span>
          </div>
        </div>

        {/* High-Resolution Studio Poster Image */}
        <Image
          src="/images/meet/meet-studio-poster.jpg"
          alt="Meet Shah creating fitness and finance content in a studio with camera, microphone and editing equipment"
          width={2752}
          height={1536}
          quality={95}
          priority
          sizes="(max-width: 768px) 94vw, (max-width: 1100px) 62vw, 820px"
          className="block h-auto w-full object-cover object-center"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* Bottom Production Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-blue-light">
              STATUS / CREATIVE DEVELOPMENT
            </span>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/80">
            SCRIPTED · SHOT · EDITED BY MEET SHAH
          </span>
        </div>
      </div>
    </div>
  );
}
