"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { productionSteps, ProductionStep } from "@/content/productionSteps";
import HeroParticles from "@/components/ui/HeroParticles";
import { HeroMaroonAtmosphere } from "@/components/home/HeroMaroonAtmosphere";
import { DirectorStage } from "./DirectorStage";
import { ActiveProductionNote } from "./ActiveProductionNote";
import { ProductionController } from "./ProductionController";
import { UGCTrustRow } from "./UGCTrustRow";

import { useCinematicHeroMotion } from "@/lib/hooks/useCinematicHeroMotion";

export function UGCHero() {
  const [activeStep, setActiveStep] = useState<ProductionStep>(productionSteps[0]);

  const heroRef = useRef<HTMLElement>(null);
  const stageMaskRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useCinematicHeroMotion({
    scopeRef: heroRef,
    heroMaskRef: stageMaskRef,
    heroImageRef: stageRef,
    lightSweepRef,
    pillsRef,
    ctasRef,
  });

  return (
    <section
      ref={heroRef}
      id="ugc-hero"
      className="relative w-full bg-[#050811] overflow-clip flex flex-col items-center select-none pt-0 pb-2 sm:py-4"
    >
      <HeroMaroonAtmosphere theme="blue" />
      <HeroParticles theme="blue" />

      {/* Main Director's Cut Stage in Cinematic Image Panel */}
      <div
        ref={stageMaskRef}
        className="w-full max-w-[1400px] px-0 sm:px-6 relative flex flex-col justify-center items-center z-10 space-y-3 sm:space-y-0"
      >
        <div
          ref={stageRef}
          className="relative w-full overflow-hidden rounded-none sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(220,60,80,0.15)] border-y sm:border border-white/10 p-2 bg-slate-950/40 backdrop-blur-xs"
        >
          <DirectorStage activeStep={activeStep} />
          
          {/* Desktop Floating Note */}
          <div className="hidden sm:block">
            <ActiveProductionNote activeStep={activeStep} />
          </div>

          {/* Light Sweep Highlight Overlay */}
          <div
            ref={lightSweepRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.12) 43%, rgba(80, 145, 255, 0.12) 50%, transparent 70%)`,
              width: "100%",
              height: "100%",
            }}
          />

          {/* Dark gradient backdrop */}
          <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#050811]/95 via-[#050811]/60 to-transparent pointer-events-none z-10" />

          {/* CTAs & Badges row overlayed ON TOP of the stage */}
          <div className="absolute inset-x-0 bottom-2.5 sm:bottom-4 z-20 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-4 max-w-[1400px] mx-auto">
              <div ref={pillsRef} className="hidden sm:flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                <span className="bg-blue text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-blue-light/20 shadow-soft">
                  UGC & CREATIVE DIRECTOR
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-white/20 shadow-xs">
                  High Retention Strategy
                </span>
              </div>

              <div ref={ctasRef} className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                <ArrowPillButton href="/contact?vertical=ugc" size="sm" className="flex-1 sm:flex-initial text-center justify-center">
                  Get Custom UGC Video
                </ArrowPillButton>
                <Button
                  href="#creative-lab"
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white flex-1 sm:flex-initial text-center justify-center"
                  size="sm"
                >
                  View Selected Work
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Production Note below stage */}
        <div className="block sm:hidden w-full px-3">
          <ActiveProductionNote activeStep={activeStep} />
        </div>
      </div>

      {/* Controller & Trust Row section wrapper */}
      <div className="w-full bg-white text-ink mt-8 pt-8 pb-12 sm:pb-16 lg:pb-20 rounded-t-[32px] border-t border-border z-30">
        <Container className="max-w-[1480px] px-6 sm:px-12 space-y-12">
          {/* Horizontal Production Step Controller */}
          <div>
            <ProductionController
              steps={productionSteps}
              activeStep={activeStep}
              onSelectStep={setActiveStep}
            />
          </div>

          {/* Bottom 3-Column Capability Trust Row */}
          <UGCTrustRow />
        </Container>
      </div>
    </section>
  );
}
