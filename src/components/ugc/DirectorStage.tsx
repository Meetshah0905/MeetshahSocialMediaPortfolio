"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ProductionStep } from "@/content/productionSteps";
import { trackMediaUsage } from "@/lib/mediaRegistry";

type DirectorStageProps = {
  activeStep: ProductionStep;
};

export function DirectorStage({ activeStep }: DirectorStageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackMediaUsage("meet-studio-poster", "DirectorStage");
  }, []);

  useEffect(() => {
    if (!imageRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(imageRef.current, {
      x: activeStep.imageOffset.x,
      y: activeStep.imageOffset.y,
      scale: activeStep.imageOffset.scale,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [activeStep]);

  return (
    <div className="relative w-full max-w-[1440px] mx-auto group">
      {/* Subtle blue offset outline line behind the stage */}
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[6px_28px_6px_6px] border border-blue/25 bg-surface-soft/30 -z-10 transition-transform duration-300" />

      {/* Main Director's Cut Stage Container */}
      <div className="relative w-full aspect-[2752/1536] rounded-[6px_28px_6px_6px] border border-border/80 shadow-soft bg-ink overflow-hidden">
        {/* Top Restrained Metadata Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-3.5 sm:p-4 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-white/90">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="size-2 rounded-full bg-blue animate-pulse" />
            <span className="tracking-wider">MEET SHAH / UGC DIRECTOR</span>
          </div>

          <span className="hidden sm:inline font-bold tracking-widest text-white/70">
            CAMPAIGN WORKFLOW
          </span>

          <span className="bg-white/15 px-2.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white">
            FORMAT / SOCIAL-FIRST VIDEO
          </span>
        </div>

        {/* Studio Image Container with Smooth Pan Offset */}
        <div ref={imageRef} className="w-full h-full relative">
          <Image
            src="/images/meet/meet-studio-poster.jpg"
            alt="Meet Shah creating fitness and finance content in a studio with camera, microphone and editing equipment"
            width={2752}
            height={1536}
            quality={95}
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="block h-auto w-full object-cover object-center"
          />
        </div>

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Single Active Framing Marker */}
        <div className="absolute top-14 right-6 z-20 bg-white/90 backdrop-blur-md border border-border/80 px-3 py-1.5 rounded-lg shadow-soft text-left animate-in fade-in duration-300">
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-blue" />
            <span className="text-[9px] font-mono font-bold text-ink uppercase tracking-wider">
              {activeStep.marker}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
