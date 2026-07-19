"use client";

import { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { InitialLoader } from "@/components/ui/InitialLoader";
import { Play, ArrowRight, ArrowLeft } from "lucide-react";
import { imageManifest } from "@/content/imageManifest";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import SketchfabViewer from "@/components/three/SketchfabViewer";
import { sketchfabModels } from "@/content/sketchfabModels";
import HeroParticles from "@/components/ui/HeroParticles";

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
    desc: "High-retention product review videos, script hook frameworks, and direct-response creatives.",
  },
  {
    num: "03",
    title: "Story Integrations",
    desc: "Interactive Q&A features, live product demonstrations, and structured link sharing.",
  },
  {
    num: "04",
    title: "Product Demonstrations",
    desc: "Detailed hands-on walk-throughs showcasing product features and real-life outcomes.",
  },
  {
    num: "05",
    title: "Educational Explainers",
    desc: "Compliant and concise breakdowns of complex wellness or fintech concepts.",
  },
  {
    num: "06",
    title: "Script and Hook Development",
    desc: "Creator-led visual scripts, multiple hook alternates, and strong call-to-action sequencing.",
  },
  {
    num: "07",
    title: "Creative Strategy",
    desc: "Collaborative script development, hook creation, and visual narrative storyboards.",
  },
  {
    num: "08",
    title: "Paid Usage Rights",
    desc: "License high-performing organic creatives for paid advertising campaigns.",
  },
  {
    num: "09",
    title: "Whitelisting",
    desc: "Creator-profile advertising permissions to amplify conversion reels.",
  },
  {
    num: "10",
    title: "Long-term Campaigns",
    desc: "Integrated, multi-month creator collaborations for sustained brand alignment.",
  },
];

export default function HomePage() {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [activeWorld, setActiveWorld] = useState<"fitness" | "finance" | "ugc">("fitness");
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeClipPlaying, setActiveClipPlaying] = useState<string | null>(null);

  const homeScope = useRef<HTMLDivElement>(null);
  
  // Hero refs
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  // Creativity Story Refs
  const pinnedSectionRef = useRef<HTMLDivElement>(null);

  // Clips Slider Refs
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch metrics dynamically
  useEffect(() => {
    fetch("/api/reports?type=latest")
      .then(() => fetch("/api/admin/platforms"))
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error("Failed to load platform counts", err));
  }, []);

  const getProfileValue = (id: string) => {
    const prof = profiles.find((p) => p.id === id);
    return prof ? prof.currentValue.toLocaleString() : "...";
  };

  const totalCommunity = profiles.reduce((acc, p) => acc + p.currentValue, 0);

  // Portfolio clips
  const portfolioClips = [
    {
      id: "clip-fitness",
      category: "FITNESS",
      title: "Squat Form Breakdowns & Technique Cues",
      desc: "An educational form fix guide designed to build user trust and organic reach.",
      handle: "@meetsofficial",
      aspectRatio: "9:16" as const,
      image: "/images/meet/meet-fitness-poster.jpg",
      videoUrl: "https://www.youtube.com/embed/fD5C1k3U95Y",
    },
    {
      id: "clip-finance",
      category: "FINANCE",
      title: "Stocks vs Mutual Funds: A Beginner's Choice",
      desc: "Simplifying personal investing structures with compliant and clear visual guides.",
      handle: "@meet.fitfix",
      aspectRatio: "9:16" as const,
      image: "/images/meet/meet-finance-poster.jpg",
      videoUrl: "https://www.youtube.com/embed/7S8P5oKz9kY",
    },
    {
      id: "clip-ugc",
      category: "UGC CREATIVE",
      title: "UGC Video Brief & Organic Hook Development",
      desc: "High-retention product demo asset built for social whitelisting and conversion campaigns.",
      handle: "UGC Studio",
      aspectRatio: "9:16" as const,
      image: "/images/meet/meet-content-poster.jpg",
      videoUrl: "https://www.youtube.com/embed/lR0hHwB1P6w",
    },
  ];

  // 1. Entrance Reveal & Light Sweep animations
  useGSAP(() => {
    if (!loaderComplete) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // ClipPath reveal and scale down
    tl.fromTo(
      heroMaskRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.15 }
    )
    .fromTo(
      heroImageRef.current,
      { scale: 1.012 },
      { scale: 1, duration: 1.3 },
      "<"
    );

    // Controlled light sweep
    tl.fromTo(
      lightSweepRef.current,
      { xPercent: -100 },
      { xPercent: 200, duration: 1.6, ease: "power2.inOut" },
      "-=0.5"
    );

    // Stagger in CTAs overlay
    tl.fromTo(
      heroOverlayRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.7"
    );
  }, { scope: homeScope, dependencies: [loaderComplete] });

  // 2. Scroll Parallax and Pinned Split Story (Style 3 Rebuilt)
  useGSAP(() => {
    if (!loaderComplete) return;

    // Hero parallax rising white top edge
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

    // Pinned scroll split story - white design museum pin with fading images
    if (window.innerWidth >= 1024 && pinnedSectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedSectionRef.current,
          start: "top top",
          end: "+=2400", // Pinned for a premium slower scroll experience
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      const steps = gsap.utils.toArray<HTMLElement>(".story-step");
      const images = gsap.utils.toArray<HTMLElement>(".story-image-layer");

      steps.forEach((step, idx) => {
        // Activate current step text
        tl.to(step, {
          opacity: 1,
          color: "#080b12", // dark ink
          borderColor: "#2f78ff", // blue active indicator
          duration: 1,
        }, idx === 0 ? "0" : `+=${idx * 2}`);

        // Fade in active image and scale to normal
        tl.to(images[idx], {
          opacity: 1,
          scale: 1,
          duration: 1,
        }, idx === 0 ? "0" : `<`);

        // If there is a previous step, dim it and fade out its image
        if (idx > 0) {
          tl.to(steps[idx - 1], {
            opacity: 0.20, // high inactive contrast
            borderColor: "rgba(8,11,18,0.06)",
            duration: 0.8,
          }, `<`);
          tl.to(images[idx - 1], {
            opacity: 0,
            scale: 1.05, // subtle scaling zoom out
            duration: 0.8,
          }, `<`);
        }
      });
    }
  }, { scope: homeScope, dependencies: [loaderComplete] });

  // 3. Clips Slider transition animations (Style 2 Rebuilt)
  const prevSlide = () => {
    if (currentSlide > 0) {
      const nextIdx = currentSlide - 1;
      setCurrentSlide(nextIdx);
      animateSlider(nextIdx);
      setActiveClipPlaying(null);
    }
  };

  const nextSlide = () => {
    if (currentSlide < portfolioClips.length - 1) {
      const nextIdx = currentSlide + 1;
      setCurrentSlide(nextIdx);
      animateSlider(nextIdx);
      setActiveClipPlaying(null);
    }
  };

  const animateSlider = (idx: number) => {
    if (!sliderTrackRef.current) return;
    gsap.to(sliderTrackRef.current, {
      xPercent: -100 * idx,
      duration: 0.8,
      ease: "power3.inOut",
    });
  };

  // Find preferred Sketchfab models
  const fitnessModel = sketchfabModels.find((m) => m.category === "fitness" && m.preferred);
  const financeModel = sketchfabModels.find((m) => m.category === "finance" && m.preferred);

  return (
    <div ref={homeScope} className="bg-white text-ink overflow-hidden relative">
      {/* INITIAL LOADER */}
      <InitialLoader onComplete={() => setLoaderComplete(true)} />

      {/* 1. HERO SECTION (Full-bleed, touch viewport edges, no gutters) */}
      <section
        ref={heroRef}
        className="relative w-full bg-black overflow-clip flex flex-col select-none"
      >
        {/* Interactive tech geometric particles background overlay */}
        <HeroParticles />

        <div ref={heroMaskRef} className="w-full relative h-auto" style={{ clipPath: "inset(0 100% 0 0)" }}>
          {/* Cover image at native 1.79 aspect ratio */}
          <Image
            ref={heroImageRef}
            src={imageManifest.homeHero.src}
            alt={imageManifest.homeHero.alt}
            width={2752}
            height={1536}
            priority
            quality={100}
            sizes="100vw"
            className="block w-full h-auto max-w-none scale-[1.012]"
          />
          
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
        </div>

        {/* CTAs row aligned underneath on mobile, overlaid cleanly at bottom margin on desktop */}
        <div
          ref={heroOverlayRef}
          className="relative md:absolute md:bottom-12 md:left-0 md:right-0 z-20 py-8 px-6 md:py-0"
        >
          <Container className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <span className="bg-blue text-white px-3.5 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest border border-blue-light/20 shadow-soft">
                FITNESS × FINANCE
              </span>
              <span className="bg-surface text-ink px-3.5 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest border border-border shadow-xs">
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
      <div className="relative h-10 -mt-10 bg-white rounded-t-[32px] z-30 border-t border-border" />

      {/* 2. PROOF STRIP */}
      <section className="bg-white py-12 border-b border-border relative z-30">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <span className="font-heading text-3xl font-bold text-ink block">
                {totalCommunity ? totalCommunity.toLocaleString() : "..."}
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

      {/* 3. CREATOR WORLDS SWITCHER (Clean White SaaS Design, Sketchfab Embeds) */}
      <WhiteAtmosphereSection id="pillars" halo="both">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 min-h-[380px] relative z-10 flex flex-col justify-center">
              <Badge className="mb-4 self-start bg-blue-pale text-blue border-transparent">
                Creator Pillars
              </Badge>

              {/* State-driven layout blocks */}
              <div className="relative w-full">
                {/* Fitness State */}
                {activeWorld === "fitness" && (
                  <div className="space-y-4">
                    <h2 className="font-heading text-4xl font-bold text-ink leading-tight">
                      Fitness Channel
                    </h2>
                    <p className="text-body text-xs leading-relaxed max-w-[40ch]">
                      Practical bodybuilding form, diet guides, and workout structures tailored for long-term health.
                    </p>
                    <div className="flex gap-2 text-xs font-semibold text-ink">
                      <span>• Training</span>
                      <span>• Diet</span>
                      <span>• Technique Fixes</span>
                    </div>
                    <div className="pt-4">
                      <span className="font-heading text-3xl font-bold text-blue block">
                        {getProfileValue("instagram_fitness")}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-muted block">Followers</span>
                    </div>
                    <div className="pt-6">
                      <ArrowPillButton href="/fitness" size="md">
                        Explore Fitness
                      </ArrowPillButton>
                    </div>
                  </div>
                )}

                {/* Finance State */}
                {activeWorld === "finance" && (
                  <div className="space-y-4">
                    <h2 className="font-heading text-4xl font-bold text-ink leading-tight">
                      Finance Insights
                    </h2>
                    <p className="text-body text-xs leading-relaxed max-w-[40ch]">
                      Relatable personal finance concepts, stock evaluation rules, and general market analysis.
                    </p>
                    <div className="flex gap-2 text-xs font-semibold text-ink">
                      <span>• Personal Finance</span>
                      <span>• Investing</span>
                      <span>• Market Awareness</span>
                    </div>
                    <div className="pt-4">
                      <span className="font-heading text-3xl font-bold text-blue block">
                        {getProfileValue("instagram_finance")}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-muted block">Followers</span>
                    </div>
                    <div className="pt-6">
                      <ArrowPillButton href="/finance" size="md">
                        Explore Finance
                      </ArrowPillButton>
                    </div>
                  </div>
                )}

                {/* UGC State */}
                {activeWorld === "ugc" && (
                  <div className="space-y-4">
                    <h2 className="font-heading text-4xl font-bold text-ink leading-tight">
                      UGC Studio & Strategy
                    </h2>
                    <p className="text-body text-xs leading-relaxed max-w-[40ch]">
                      Custom high-retention video production, script hook sequencing, and Whitelisting usage rights.
                    </p>
                    <div className="flex gap-2 text-xs font-semibold text-ink">
                      <span>• Video Production</span>
                      <span>• Scriptwriting</span>
                      <span>• Hook Auditing</span>
                    </div>
                    <div className="pt-4">
                      <span className="font-heading text-3xl font-bold text-blue block">
                        UGC Director
                      </span>
                      <span className="text-[9px] uppercase font-bold text-muted block">Direct asset delivery</span>
                    </div>
                    <div className="pt-6">
                      <ArrowPillButton href="/ugc" size="md">
                        Explore UGC
                      </ArrowPillButton>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center 3D Sketchfab Viewer Embed / Fallback */}
            <div className="lg:col-span-5 h-[340px] relative flex justify-center items-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center w-full">
                {activeWorld === "fitness" && fitnessModel && (
                  <SketchfabViewer model={fitnessModel} className="w-full" />
                )}
                {activeWorld === "finance" && financeModel && (
                  <SketchfabViewer model={financeModel} className="w-full" />
                )}
                {activeWorld === "ugc" && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-white shadow-soft">
                    <Image
                      src={imageManifest.studioHero.src}
                      alt={imageManifest.studioHero.alt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-ink/90 px-3 py-1 rounded text-white text-[9px] font-bold uppercase tracking-wider">
                      UGC Studio Fallback
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls Selector Controls */}
            <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3 justify-center items-center lg:items-end w-full">
              {(["fitness", "finance", "ugc"] as const).map((world) => (
                <button
                  key={world}
                  onClick={() => setActiveWorld(world)}
                  className={`px-5 py-3.5 rounded-full font-heading text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full max-w-[140px] text-center border ${
                    activeWorld === world
                      ? "bg-blue text-white border-blue shadow-md"
                      : "bg-surface-soft text-body border-border hover:border-blue/30"
                  }`}
                >
                  {world}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </WhiteAtmosphereSection>

      {/* 4. PORTFOLIO CLIPS (Complete Light Redesign, Native 16:9 Ratios) */}
      <WhiteAtmosphereSection id="portfolio" halo="left">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
            <div>
              <span className="text-blue font-bold text-xs uppercase tracking-widest block mb-2">
                Portfolio Clips
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-ink">
                Content built to stop the scroll.
              </h2>
            </div>
            <div className="flex gap-3">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="size-11 rounded-full border border-border flex items-center justify-center text-ink disabled:opacity-30 disabled:pointer-events-none hover:border-blue transition-colors"
                aria-label="Previous slide"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === portfolioClips.length - 1}
                className="size-11 rounded-full border border-border flex items-center justify-center text-ink disabled:opacity-30 disabled:pointer-events-none hover:border-blue transition-colors"
                aria-label="Next slide"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Slider Window Container (White SaaS composition) */}
          <div className="relative w-full overflow-hidden rounded-panel border border-border bg-white shadow-soft">
            <div
              ref={sliderTrackRef}
              className="flex w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ width: `${portfolioClips.length * 100}%` }}
            >
              {portfolioClips.map((clip) => (
                <div
                  key={clip.id}
                  className="w-full flex-shrink-0 p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  style={{ width: `${100 / portfolioClips.length}%` }}
                >
                  <div className="lg:col-span-8 space-y-4 text-left">
                    <Badge className="bg-blue-pale text-blue border-transparent uppercase tracking-widest">
                      {clip.category}
                    </Badge>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-tight">
                      {clip.title}
                    </h3>
                    <p className="text-xs text-body leading-relaxed">
                      {clip.desc}
                    </p>
                    <p className="text-[10px] text-muted font-mono">{clip.handle}</p>
                  </div>

                  {/* Native 9:16 Portrait YouTube Shorts / Reels */}
                  <div className="lg:col-span-4 flex justify-center w-full">
                    <div className="relative aspect-[9/16] w-full max-w-[270px] max-h-[480px] rounded-lg overflow-hidden border border-border shadow-md bg-surface-soft flex items-center justify-center">
                      {activeClipPlaying === clip.id ? (
                        <iframe
                          src={`${clip.videoUrl}?autoplay=1&mute=0`}
                          title={clip.title}
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-none"
                        />
                      ) : (
                        <div
                          onClick={() => setActiveClipPlaying(clip.id)}
                          className="relative w-full h-full cursor-pointer group"
                        >
                          <Image
                            src={clip.image}
                            alt={clip.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-ink/10 flex items-center justify-center group-hover:bg-ink/20 transition-colors">
                            <div className="size-12 rounded-full bg-white/90 text-ink flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                              <Play className="size-5 fill-current translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </WhiteAtmosphereSection>

      {/* 5. CREATE / EDUCATE / INFLUENCE (Museum Split Pinned Scroll Section) */}
      <div
        ref={pinnedSectionRef}
        className="relative bg-white py-20 lg:py-0 min-h-fit lg:min-h-screen flex flex-col justify-center items-center border-t border-border"
      >
        {/* Desktop View (Pinned Museum Split, shown only on >= lg screens) */}
        <div className="hidden lg:grid grid-cols-12 gap-16 w-full max-w-7xl mx-auto px-8 items-center min-h-[700px]">
          {/* Left scroll timeline */}
          <div className="col-span-5 flex flex-col justify-center py-20 z-10">
            <div className="space-y-4 mb-10">
              <Badge className="bg-blue-pale text-blue border-transparent uppercase tracking-wider mb-2 self-start">
                Philosophy
              </Badge>
              <h2 className="font-heading text-4xl font-bold text-ink leading-tight">
                Creative Strategy
              </h2>
            </div>
            
            <div className="space-y-16">
              {[
                { num: "01", phase: "Create", title: "Conceive", desc: "“Start with an idea worth paying attention to.” We construct video hooks designed to win user attention organically." },
                { num: "02", phase: "Educate", title: "De-complexify", desc: "“Turn fitness and finance into content people can understand and use” in their daily routines." },
                { num: "03", phase: "Influence", title: "Communicate", desc: "“Build trust before asking an audience to act” by integrating compliance and transparency." },
                { num: "04", phase: "Connect", title: "Integrate", desc: "“Help brands become part of a useful and memorable story” that drives authentic campaign results." },
              ].map((step, idx) => (
                <div
                  key={step.num}
                  className={`story-step border-l-2 pl-6 py-2 transition-all duration-500 text-left`}
                  style={{
                    borderColor: idx === 0 ? "#2f78ff" : "rgba(8,11,18,0.06)",
                    opacity: idx === 0 ? 1 : 0.20
                  }}
                >
                  <span className="text-[10px] font-bold text-blue uppercase tracking-widest block">{step.num} — {step.phase}</span>
                  <h3 className="font-heading text-2xl font-bold text-ink mt-1.5">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-body max-w-[34ch]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right pinned graphics showcase */}
          <div className="col-span-7 flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full max-w-lg rounded-panel overflow-hidden border border-border bg-white shadow-soft p-4 flex items-center justify-center">
              {[
                { img: "/images/meet/meet-content-poster.jpg", alt: "Conceive Hook" },
                { img: "/images/meet/meet-creativity-poster.jpg", alt: "De-complexify copy" },
                { img: "/images/meet/meet-studio-poster.jpg", alt: "Communicate Trust" },
                { img: "/images/meet/meet-services-poster.jpg", alt: "Integrate Campaigns" },
              ].map((layer, idx) => (
                <div
                  key={idx}
                  className="story-image-layer absolute inset-0 transition-all duration-500"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? "scale(1)" : "scale(1.05)"
                  }}
                >
                  <Image
                    src={layer.img}
                    alt={layer.alt}
                    fill
                    className="object-cover p-2"
                    sizes="600px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View (Stacked Timeline, shown only on < lg screens) */}
        <div className="lg:hidden w-full space-y-12 px-6">
          <div className="text-center mb-8">
            <Badge className="bg-blue-pale text-blue border-transparent uppercase tracking-wider mb-2 animate-pulse">
              Philosophy
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-ink">Creative Strategy</h2>
          </div>

          {[
            {
              num: "01",
              phase: "Create",
              title: "Conceive",
              desc: "“Start with an idea worth paying attention to.” We construct video hooks designed to win user attention organically.",
              img: "/images/meet/meet-content-poster.jpg",
            },
            {
              num: "02",
              phase: "Educate",
              title: "De-complexify",
              desc: "“Turn fitness and finance into content people can understand and use” in their daily routines.",
              img: "/images/meet/meet-creativity-poster.jpg",
            },
            {
              num: "03",
              phase: "Influence",
              title: "Communicate",
              desc: "“Build trust before asking an audience to act” by integrating compliance and transparency.",
              img: "/images/meet/meet-studio-poster.jpg",
            },
            {
              num: "04",
              phase: "Connect",
              title: "Integrate",
              desc: "“Help brands become part of a useful and memorable story” that drives authentic campaign results.",
              img: "/images/meet/meet-services-poster.jpg",
            },
          ].map((step) => (
            <div key={step.num} className="border-l-2 border-blue pl-4 space-y-4 text-left">
              <div>
                <span className="text-[10px] font-bold text-blue uppercase tracking-widest block">{step.num} — {step.phase}</span>
                <h3 className="font-heading text-xl font-bold text-ink mt-1">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-body">{step.desc}</p>
              </div>
              <div className="relative aspect-[4/3] w-full rounded-panel overflow-hidden border border-border bg-white shadow-soft p-2 flex items-center justify-center">
                <Image
                  src={step.img}
                  alt={step.title}
                  fill
                  className="object-cover p-1"
                  sizes="100vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CAPABILITIES (Complete Light Redesign, Service poster spotlight) */}
      <WhiteAtmosphereSection id="capabilities" halo="both" className="border-t border-border">
        <Container>
          <div className="text-left mb-12">
            <span className="text-blue font-bold text-xs uppercase tracking-widest block mb-2">
              Capabilities
            </span>
            <h2 className="font-heading text-3xl font-bold text-ink">
              Creator Services
            </h2>
            <p className="mt-2 text-xs text-body">
              Scoped deliverables designed to support brand campaign objectives.
            </p>
          </div>

          {/* Desktop Two-Column Hover Index */}
          <div className="hidden md:grid grid-cols-12 gap-12 items-center">
            {/* Left list index */}
            <div className="col-span-6 space-y-3">
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
                        className={`font-display text-sm font-bold transition-colors ${
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
              <div className="mt-6 w-full p-6 bg-surface-soft border border-border rounded-lg text-left">
                <span className="text-[9px] font-heading font-bold text-blue uppercase tracking-widest block mb-1">
                  Service Scope
                </span>
                <p className="font-heading text-sm font-bold text-ink block">
                  {SERVICES_LIST[activeServiceIdx].title}
                </p>
                <p className="text-[11px] text-body mt-1 leading-relaxed">
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
                  className="snap-center shrink-0 w-[240px] p-5 rounded-lg border border-border bg-white transition-all duration-300 scroll-snap-align"
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
    </div>
  );
}
