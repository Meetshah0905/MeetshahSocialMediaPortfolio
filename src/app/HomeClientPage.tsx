"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { InitialLoader } from "@/components/ui/InitialLoader";
import { imageManifest } from "@/content/imageManifest";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import HeroParticles from "@/components/ui/HeroParticles";
import { HeroMaroonAtmosphere } from "@/components/home/HeroMaroonAtmosphere";
import { PortfolioClipsSection } from "@/components/home/PortfolioClipsSection";
import { CreatorIdentitySection } from "@/components/home/CreatorIdentitySection";
import { CreativeStrategySection } from "@/components/home/CreativeStrategySection";
import { CreatorPillars } from "@/components/home/CreatorPillars";
import { ServicesSection } from "@/components/home/ServicesSection";
import { BrandCarousel } from "@/components/home/BrandCarousel";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type HomeProfile = { id: string; currentValue: number };

/**
 * Client shell of the homepage. Metrics arrive as SERVER-LOADED props from
 * page.tsx — the previous version fetched them client-side (including a
 * pointless /api/reports round-trip whose result was thrown away), which
 * flashed "..." placeholders and made the numbers invisible to crawlers.
 */
export default function HomeClientPage({ profiles }: { profiles: HomeProfile[] }) {
  const [loaderComplete, setLoaderComplete] = useState(false);

  const homeScope = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  const getProfileValue = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    // Missing or zero → em dash, never a fabricated stand-in (§2).
    return prof && prof.currentValue > 0 ? prof.currentValue.toLocaleString() : "—";
  };

  const totalCommunity = profiles.reduce((acc, p) => acc + (p.currentValue || 0), 0);

  // 1. Entrance Reveal & Light Sweep animations
  useGSAP(() => {
    if (!loaderComplete) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Step A: Mask reveal
    tl.to(heroMaskRef.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.15,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });

    // Step B: Image Scale settling
    tl.to(
      heroImageRef.current,
      {
        scale: 1,
        duration: 1.4,
        ease: "power3.out",
      },
      "-=1.0"
    );

    // Step C: Light Sweep highlight overlay across image
    tl.fromTo(
      lightSweepRef.current,
      { xPercent: -100 },
      { xPercent: 100, duration: 1.6, ease: "power2.inOut" },
      "-=1.1"
    );

    // Step D: Hero CTAs overlay fade-in
    tl.fromTo(
      heroOverlayRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.9"
    );

    // Step E: Subtle Parallax scroll on hero image
    gsap.to(heroImageRef.current, {
      yPercent: 3,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: homeScope, dependencies: [loaderComplete] });

  return (
    <div ref={homeScope} className="bg-white text-ink relative w-full">
      {/* INITIAL LOADER */}
      <InitialLoader onComplete={() => setLoaderComplete(true)} />

      {/* 1. HERO SECTION (Full-bleed poster with rich ambient maroon atmosphere) */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#230d10] overflow-clip flex flex-col items-center select-none pt-0 pb-2 sm:py-4"
      >
        {/* Ambient Maroon Depth, Interactive Mouse Spotlight & Parallax Particles */}
        <HeroMaroonAtmosphere theme="maroon" />

        {/* Interactive tech geometric particles background overlay */}
        <HeroParticles theme="maroon" />

        <div
          ref={heroMaskRef}
          className="w-full max-w-[1400px] px-0 sm:px-6 relative flex justify-center items-center z-10"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(220,60,80,0.15)] border-y sm:border border-white/10">
            {/* Cover poster image */}
            <Image
              ref={heroImageRef}
              src={imageManifest.homeHero.src}
              alt={imageManifest.homeHero.alt}
              width={2752}
              height={1536}
              priority
              quality={100}
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="block w-full h-auto max-h-[78vh] object-cover sm:object-contain mx-auto scale-[1.01]"
            />
            
            {/* Light Sweep Highlight Overlay */}
            <div
              ref={lightSweepRef}
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: `linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.20) 43%, rgba(255, 200, 210, 0.16) 50%, transparent 70%)`,
                width: "100%",
                height: "100%",
              }}
            />

            {/* Gradient backdrop overlay for sharp contrast on button text */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-36 bg-gradient-to-t from-[#230d10]/95 via-[#230d10]/60 to-transparent pointer-events-none z-10" />

            {/* CTAs row positioned directly ON TOP of the poster image at the bottom */}
            <div
              ref={heroOverlayRef}
              className="absolute inset-x-0 bottom-2.5 sm:bottom-4 z-20 px-3 sm:px-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-4 max-w-[1400px] mx-auto">
                <div className="hidden sm:flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                  <span className="bg-rose-800/90 text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-rose-400/30 shadow-soft">
                    FITNESS × FINANCE
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-white/20 shadow-xs">
                    Creator Portfolio
                  </span>
                </div>

                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                  <ArrowPillButton href="/work-with-me" size="sm" className="flex-1 sm:flex-initial text-center justify-center">
                    Work With Me
                  </ArrowPillButton>
                  <Button
                    href="/analytics"
                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white flex-1 sm:flex-initial text-center justify-center"
                    size="sm"
                  >
                    View Media Kit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rising white top edge overlap */}
      <div className="relative h-10 bg-white rounded-t-[32px] z-30 border-t border-border" />

      {/* 2. PROOF STRIP */}
      <section className="bg-white py-12 border-b border-border relative z-30">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <span className="font-heading text-3xl font-bold text-ink block">
                {totalCommunity > 0 ? totalCommunity.toLocaleString() : "—"}
              </span>
              <span className="mt-1.5 text-[9px] font-bold text-muted uppercase tracking-widest">
                Total platform follows and subscriptions
              </span>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-2 p-2">
              <span className="font-heading text-3xl font-bold text-blue block">
                {getProfileValue("instagram_fitness")}
              </span>
              <span className="mt-1.5 text-[9px] font-bold text-muted uppercase tracking-widest">
                Instagram Fitness (@meetsofficial)
              </span>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-2 p-2">
              <span className="font-heading text-3xl font-bold text-ink block">
                {getProfileValue("instagram_finance")}
              </span>
              <span className="mt-1.5 text-[9px] font-bold text-muted uppercase tracking-widest">
                Instagram Finance (@meet.fitfix)
              </span>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-2 p-2">
              <span className="font-heading text-3xl font-bold text-blue-deep block">
                {getProfileValue("youtube_main")}
              </span>
              <span className="mt-1.5 text-[9px] font-bold text-muted uppercase tracking-widest">
                YouTube Subscribers
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. REBUILT CREATOR PILLARS 3-CARD GRID */}
      <CreatorPillars getProfileValue={getProfileValue} />

      {/* 4. CREATOR IDENTITY SECTION */}
      <CreatorIdentitySection />

      {/* 4.5. BRAND CAROUSEL (TRUSTED CLIENT LOGOS) */}
      <BrandCarousel />

      {/* 5. PORTFOLIO CLIPS (REBUILT CAROUSEL + MODAL) */}
      <PortfolioClipsSection />

      {/* 6. CREATIVE STRATEGY (4-STAGE PROCESS) */}
      <CreativeStrategySection />

      {/* 7. CAPABILITIES INDEX */}
      <ServicesSection />

      {/* 8. CTA BANNER */}
      <section className="bg-ink text-white py-20 relative overflow-hidden">
        <Container className="text-center relative z-10">
          <Badge className="bg-blue text-white border-transparent uppercase tracking-widest mb-4 inline-block">
            Direct Collaboration
          </Badge>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl mx-auto leading-tight text-white">
            Ready to build high-converting video content?
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            Partner with Meet Shah across dedicated fitness reels, finance breakdowns, and UGC creative campaigns.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <ArrowPillButton href="/work-with-me" size="md">
              Start a Project
            </ArrowPillButton>
            <Button
              href="/contact"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              size="md"
            >
              Contact Director
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
