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

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SERVICES_LIST = [
  {
    num: "01",
    title: "Dedicated Instagram Reels",
    desc: "Niche-targeted short-form video content published directly on Fitness or Finance channels.",
  },
  {
    num: "02",
    title: "UGC Video Production",
    desc: "Custom-formatted vertical video assets delivered directly to brand channels, structured with hook variations.",
  },
  {
    num: "03",
    title: "Story Integrations",
    desc: "Multi-frame story sequences showing product use cases, sharing feedback, and interactive link stickers.",
  },
  {
    num: "04",
    title: "Product Demonstrations",
    desc: "Hands-on walk-throughs showcasing product features, textures, and physical use cases.",
  },
  {
    num: "05",
    title: "Educational Explainers",
    desc: "Clear and compliant explanations of wellness practices or financial dashboard utilities.",
  },
  {
    num: "06",
    title: "Script and Hook Development",
    desc: "Creator-led drafts, alternate visual sequences, and call-to-action scripts based on campaign briefs.",
  },
  {
    num: "07",
    title: "Creative Strategy",
    desc: "Audience alignment research, hook ideation, and video campaign narrative mapping.",
  },
  {
    num: "08",
    title: "Paid Usage Rights",
    desc: "Licensing options to run marketing campaigns utilizing the created assets.",
  },
  {
    num: "09",
    title: "Whitelisting",
    desc: "Advertiser publishing permissions to distribute reels directly under the creator's social handle.",
  },
  {
    num: "10",
    title: "Long-term Campaigns",
    desc: "Multi-month brand integrations across channels to sustain organic visibility.",
  },
];

export type HomeProfile = { id: string; currentValue: number };

/**
 * Client shell of the homepage. Metrics arrive as SERVER-LOADED props from
 * page.tsx — the previous version fetched them client-side (including a
 * pointless /api/reports round-trip whose result was thrown away), which
 * flashed "..." placeholders and made the numbers invisible to crawlers.
 */
export default function HomeClientPage({ profiles }: { profiles: HomeProfile[] }) {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

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
        className="relative w-full bg-[#230d10] overflow-clip flex flex-col items-center select-none pt-2 pb-8 md:pt-4 md:pb-10"
      >
        {/* Ambient Maroon Depth, Interactive Mouse Spotlight & Parallax Particles */}
        <HeroMaroonAtmosphere theme="maroon" />

        {/* Interactive tech geometric particles background overlay */}
        <HeroParticles theme="maroon" />

        <div
          ref={heroMaskRef}
          className="w-full max-w-[1400px] px-3 sm:px-6 relative flex justify-center items-center z-10"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(220,60,80,0.15)] border border-white/10">
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
              className="block w-full h-auto max-h-[78vh] object-contain mx-auto scale-[1.01]"
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
          </div>
        </div>

        {/* CTAs row positioned neatly underneath the poster */}
        <div
          ref={heroOverlayRef}
          className="relative w-full max-w-[1400px] z-20 mt-5 px-6"
        >
          <Container className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <span className="bg-rose-800/90 text-white px-3.5 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest border border-rose-400/30 shadow-soft">
                FITNESS × FINANCE
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest border border-white/20 shadow-xs">
                Creator Portfolio
              </span>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <ArrowPillButton href="/work-with-me" size="md" className="flex-1 sm:flex-initial">
                Work With Me
              </ArrowPillButton>
              <Button
                href="/analytics"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white flex-1 sm:flex-initial"
                size="md"
              >
                View Media Kit
              </Button>
            </div>
          </Container>
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

      {/* 5. PORTFOLIO CLIPS (REBUILT CAROUSEL + MODAL) */}
      <PortfolioClipsSection />

      {/* 6. CREATIVE STRATEGY (4-STAGE PROCESS) */}
      <CreativeStrategySection />

      {/* 7. CAPABILITIES INDEX */}
      <WhiteAtmosphereSection id="services" halo="right" className="bg-white">
        <Container>
          <div className="text-left mb-12">
            <span className="text-blue font-bold text-xs uppercase tracking-widest block mb-2">
              Capabilities
            </span>
            <h2 className="font-heading text-3xl font-bold text-ink">
              Services & Formats
            </h2>
            <p className="mt-2 text-xs text-body">
              Flexible formats engineered for high retention and viewer engagement.
            </p>
          </div>

          {/* Desktop Two-Column Hover Index */}
          <div className="hidden md:grid grid-cols-12 gap-12 items-center">
            {/* Left list index */}
            <div className="col-span-6 space-y-2.5">
              {SERVICES_LIST.map((srv, idx) => {
                const isActive = activeServiceIdx === idx;
                return (
                  <div
                    key={srv.title}
                    onMouseEnter={() => setActiveServiceIdx(idx)}
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-blue/5 border-blue/30 translate-x-1 shadow-xs"
                        : "bg-transparent border-border hover:border-blue/20"
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <span
                        className={`font-mono text-sm font-bold transition-colors ${
                          isActive ? "text-blue" : "text-muted"
                        }`}
                      >
                        {srv.num}
                      </span>
                      <h3 className={`font-heading text-xs font-bold ${isActive ? "text-ink" : "text-body"}`}>
                        {srv.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Visual services poster */}
            <div className="col-span-6 flex flex-col items-center">
              <div className="relative w-full aspect-video rounded-panel overflow-hidden border border-border bg-white shadow-soft">
                <Image
                  src={imageManifest.servicesPoster.src}
                  alt={imageManifest.servicesPoster.alt}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
              {/* Description block placed beneath the Services poster */}
              <div className="mt-6 w-full p-6 bg-surface-soft border border-border rounded-lg text-left">
                <span className="text-[9px] font-heading font-bold text-blue uppercase tracking-widest block mb-1">
                  Capability Detail
                </span>
                <span className="font-heading text-sm font-bold text-ink block">
                  {SERVICES_LIST[activeServiceIdx].title}
                </span>
                <p className="mt-2 text-xs text-body leading-relaxed">
                  {SERVICES_LIST[activeServiceIdx].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Centred scaling carousel */}
          <div className="md:hidden w-full overflow-x-auto flex gap-4 snap-x snap-mandatory py-4 scrollbar-none px-12 -mx-5">
            {SERVICES_LIST.map((srv, idx) => {
              const isActive = activeServiceIdx === idx;
              return (
                <div
                  key={srv.title}
                  className="snap-center shrink-0 w-[240px] p-6 rounded-lg border border-border bg-white transition-all duration-300 scroll-snap-align"
                  style={{
                    transform: isActive ? "scale(1.0)" : "scale(0.88)",
                    opacity: isActive ? 1.0 : 0.55,
                  }}
                  onTouchStart={() => setActiveServiceIdx(idx)}
                >
                  <span className="text-xs font-bold text-blue block mb-2">{srv.num}</span>
                  <h4 className="font-heading text-sm font-bold text-ink">
                    {srv.title}
                  </h4>
                  <p className="mt-2 text-[11px] text-body leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </WhiteAtmosphereSection>

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
