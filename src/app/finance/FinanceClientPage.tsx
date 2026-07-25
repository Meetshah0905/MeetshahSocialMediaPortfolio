"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { InstagramIcon } from "@/components/ui/icons";
import { CheckCircle2, TrendingUp, DollarSign, BookOpen, AlertOctagon, FileText, Download } from "lucide-react";
import Image from "next/image";
import { imageManifest } from "@/content/imageManifest";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import { formatCompact } from "@/lib/utils/numbers";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ChannelPerformanceSnapshot from "@/components/analytics/ChannelPerformanceSnapshot";

import HeroParticles from "@/components/ui/HeroParticles";
import { HeroMaroonAtmosphere } from "@/components/home/HeroMaroonAtmosphere";
import { useCinematicHeroMotion } from "@/lib/hooks/useCinematicHeroMotion";

// Financial Vector Decorations
const RupeeDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <path d="M 30 25 L 70 25 M 30 40 L 70 40 M 30 25 C 62 25, 62 55, 30 55 M 30 55 L 65 90" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CandlestickDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <line x1="20" y1="15" x2="20" y2="85" strokeWidth="0.5" strokeDasharray="1 1" />
    <rect x="16" y="30" width="8" height="40" rx="1" fill="rgba(47, 120, 255, 0.1)" strokeWidth="0.75" />
    <line x1="50" y1="10" x2="50" y2="90" strokeWidth="0.5" strokeDasharray="1 1" />
    <rect x="46" y="20" width="8" height="35" rx="1" fill="currentColor" fillOpacity="0.05" strokeWidth="0.75" />
    <line x1="80" y1="20" x2="80" y2="80" strokeWidth="0.5" strokeDasharray="1 1" />
    <rect x="76" y="45" width="8" height="25" rx="1" fill="rgba(47, 120, 255, 0.1)" strokeWidth="0.75" />
  </svg>
);

const FinanceGridDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <path d="M 0 20 L 100 20 M 0 40 L 100 40 M 0 60 L 100 60 M 0 80 L 100 80" strokeWidth="0.25" strokeDasharray="1 3" />
    <path d="M 20 0 L 20 100 M 40 0 L 40 100 M 60 0 L 60 100 M 80 0 L 80 100" strokeWidth="0.25" strokeDasharray="1 3" />
    <text x="82" y="15" fontSize="4.5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.3">+12.4%</text>
    <text x="82" y="55" fontSize="4.5" fontFamily="monospace" fill="currentColor" stroke="none" opacity="0.3">+3.8%</text>
  </svg>
);

const FinanceArcDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="40" strokeWidth="0.5" strokeDasharray="4 4" />
    <path id="curve-path" d="M 10 50 A 40 40 0 0 1 90 50" strokeWidth="1" strokeLinecap="round" />
    <circle cx="90" cy="50" r="2" fill="currentColor" />
  </svg>
);

const PROGRAMS = [
  {
    icon: TrendingUp,
    title: "Stocks & Investing Simplification",
    desc: "Short-form breakdowns analyzing business models, earnings reports, and structural changes without hype.",
  },
  {
    icon: DollarSign,
    title: "Personal Finance & Budgeting",
    desc: "Step-by-step systems to automate savings, evaluate insurance policies, and optimize taxes.",
  },
  {
    icon: BookOpen,
    title: "1:1 Investment Sessions",
    desc: "Personalized online walkthroughs to build long-term portfolio strategies and understand market fundamentals.",
  },
];

interface FinanceClientPageProps {
  initialFollowers: number;
}

export default function FinanceClientPage({ initialFollowers }: FinanceClientPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const followerDisplay =
    initialFollowers > 0 ? formatCompact(initialFollowers) : "—"; // never a fake stand-in (§2)

  const STATS = [
    { value: followerDisplay, label: "Instagram Followers", sub: "Highly engaged niche community" },
    { value: "32.0K+", label: "Monthly Account Reach", sub: "Organic video impressions" },
    { value: "2.9%", label: "Average Engagement Rate", sub: "Niche benchmark 1.5%" },
    { value: "88%", label: "Saves & Shares Growth", sub: "High utility-value content" },
  ];

  useGSAP(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Instantly make elements fully visible
      gsap.set(".hero-eyebrow, .hero-heading-line, .hero-body, .hero-disclaimer, .hero-buttons, .hero-badge", { opacity: 1, scale: 1, y: 0 });
      gsap.set(".hero-image-wrap", { clipPath: "inset(0 0 0 0)" });
      return;
    }

    const tl = gsap.timeline();

    // 1. Eyebrow reveal
    tl.fromTo(
      ".hero-eyebrow",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    // 2. Heading line mask
    tl.fromTo(
      ".hero-heading-line",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    // 3. Body copy
    tl.fromTo(
      ".hero-body",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    // 4. Disclaimer
    tl.fromTo(
      ".hero-disclaimer",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4"
    );

    // 5. Buttons
    tl.fromTo(
      ".hero-buttons",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // 6. Finance visual mask reveal
    tl.fromTo(
      ".hero-image-wrap",
      { clipPath: "inset(0 0 0 100%)" },
      { clipPath: "inset(0 0 0 0%)", duration: 1.2, ease: "power3.inOut" },
      "-=0.8"
    );

    // 7. Rupee symbols move gently
    tl.fromTo(
      ".finance-deco-rupee",
      { opacity: 0, y: -20 },
      { opacity: 0.15, y: 0, duration: 1.2, ease: "power2.out" },
      "-=0.5"
    );

    // 8. Follower badge appears
    tl.fromTo(
      ".hero-badge",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.2"
    );

    // 9. Floating animations for outlines
    gsap.to(".finance-deco-candle", {
      y: "random(-6, 6)",
      x: "random(-6, 6)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".finance-deco-arc", {
      rotation: 360,
      duration: 40,
      repeat: -1,
      ease: "none"
    });
  }, { scope: containerRef });

  // Mouse Parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.012;
    const y = (clientY - window.innerHeight / 2) * 0.012;

    gsap.to(".parallax-finance", {
      x: x,
      y: y,
      duration: 1,
      ease: "power2.out"
    });
  };

  const scopeRef = useRef<HTMLElement>(null);
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useCinematicHeroMotion({
    scopeRef,
    heroMaskRef,
    heroImageRef,
    lightSweepRef,
    pillsRef,
    ctasRef,
  });

  return (
    <div ref={containerRef} className="bg-white text-ink relative w-full" onMouseMove={handleMouseMove}>
      
      {/* 2. CINEMATIC HERO SECTION */}
      <section ref={scopeRef} className="relative w-full bg-[#050811] overflow-clip flex flex-col items-center select-none pt-0 pb-2 sm:py-4">
        <HeroMaroonAtmosphere theme="blue" />
        <HeroParticles theme="blue" />

        <div
          ref={heroMaskRef}
          className="w-full max-w-[1400px] px-0 sm:px-6 relative flex justify-center items-center z-10"
        >
          <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(220,60,80,0.15)] border-y sm:border border-white/10">
            <Image
              ref={heroImageRef}
              src={imageManifest.financeHero.src}
              alt={imageManifest.financeHero.alt}
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
                background: `linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.12) 43%, rgba(80, 145, 255, 0.12) 50%, transparent 70%)`,
                width: "100%",
                height: "100%",
              }}
            />

            {/* Follower badge */}
            <div className="hero-badge absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-white text-[10px] sm:text-[11px] font-bold shadow-md z-20 flex items-center gap-1.5">
              <InstagramIcon className="size-3 sm:size-3.5 fill-white stroke-none" />
              <span>{followerDisplay} Followers</span>
            </div>

            {/* Dark gradient backdrop */}
            <div className="absolute inset-x-0 bottom-0 h-32 sm:h-36 bg-gradient-to-t from-[#050811]/95 via-[#050811]/60 to-transparent pointer-events-none z-10" />

            {/* CTAs & Badges row overlayed ON TOP of the image */}
            <div className="absolute inset-x-0 bottom-2.5 sm:bottom-4 z-20 px-3 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-4 max-w-[1400px] mx-auto">
                <div ref={pillsRef} className="hidden sm:flex gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
                  <span className="bg-blue text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-blue-light/20 shadow-soft">
                    PERSONAL FINANCE CREATOR
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-white/20 shadow-xs">
                    @meet.fitfix
                  </span>
                </div>

                <div ref={ctasRef} className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                  <ArrowPillButton href="/contact?vertical=finance" size="sm" className="flex-1 sm:flex-initial text-center justify-center">
                    Explore Finance Content
                  </ArrowPillButton>
                  <a
                    href="https://www.instagram.com/meet.fitfix/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 sm:min-h-10 items-center justify-center gap-1.5 sm:gap-2 border border-white/20 bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors flex-1 sm:flex-initial"
                  >
                    <InstagramIcon className="size-3.5 sm:size-4 text-white" />
                    <span>@meet.fitfix</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition to white section */}
      <div className="relative h-10 bg-white rounded-t-[32px] z-30 border-t border-border" />

      {/* Stats Grid */}
      <section className="border-b border-border py-12 bg-white">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <Card key={stat.label} className="p-6 text-center border border-border bg-surface-soft shadow-xs">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-ink block">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-blue block mt-2 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-[10px] text-body block mt-0.5">
                  {stat.sub}
                </span>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Core Themes and Pillars */}
      <WhiteAtmosphereSection halo="left" className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto px-6">
          {/* Left panel: Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-blue font-bold text-xs uppercase tracking-widest block mb-2">
                Content Pillars
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
                What we focus on.
              </h2>
              <p className="mt-4 text-xs text-body max-w-[40ch]">
                Clean, compliant, facts-driven finance copy that builds user confidence.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              {PROGRAMS.map((program) => (
                <div key={program.title} className="flex gap-4 p-5 bg-white border border-border rounded-lg shadow-xs">
                  <div className="size-10 shrink-0 bg-blue/15 text-blue rounded-full flex items-center justify-center border border-blue/10">
                    <program.icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-ink">
                      {program.title}
                    </h4>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-body">
                      {program.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Content focus card */}
          <div className="lg:col-span-6 bg-white border border-border p-8 rounded-panel shadow-soft">
            <h3 className="font-heading text-lg font-bold text-blue mb-4">
              Why Brands Partner in Finance
            </h3>
            <p className="text-xs text-body leading-relaxed">
              Financial decisions require trust. Brand campaigns in the finance vertical succeed when concepts are broken down with clarity and honesty, without false promises. Meet Shah&apos;s finance channel focuses on:
            </p>

            <ul className="mt-6 flex flex-col gap-3.5">
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>Beginner-centric walkthroughs of financial applications</span>
              </li>
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>No complex industry jargon — plain language breakdowns</span>
              </li>
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>Thorough compliance and education disclaimers</span>
              </li>
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>High conversion rates on fintech, savings, and trading tools</span>
              </li>
            </ul>
          </div>
        </div>
      </WhiteAtmosphereSection>

      {/* Finance Analytics Performance Snapshot */}
      <WhiteAtmosphereSection halo="right" className="bg-white border-t border-border py-16 text-center">
        <Container className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-6">
            <Badge className="bg-blue/10 text-blue border-transparent">Analytics Snapshot</Badge>
            <h3 className="font-heading text-3xl font-bold text-ink">Latest Channel Performance</h3>
            <p className="text-xs text-body leading-relaxed">
              Reach, engagement and content metrics from the latest creator-published finance insights report.
            </p>
          </div>
          <ChannelPerformanceSnapshot source="instagram_finance" />
        </Container>
      </WhiteAtmosphereSection>

      {/* Light Editorial CTA Band */}
      <section 
        className="relative py-20 text-center border-t border-border overflow-hidden bg-white select-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(47, 120, 255, 0.05), transparent 60%), #ffffff"
        }}
      >
        <FinanceGridDeco className="absolute inset-0 w-full h-full text-blue/3 opacity-30 pointer-events-none" />
        <RupeeDeco className="absolute top-[10%] left-[8%] size-20 text-blue/8 pointer-events-none" />
        <CandlestickDeco className="absolute bottom-[10%] right-[8%] size-28 text-blue/6 pointer-events-none" />
        
        <Container className="flex flex-col items-center max-w-2xl relative z-10 space-y-6">
          <Badge className="bg-blue text-white border-transparent">1:1 Strategy</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Ready to reach your financial goals?
          </h2>
          <p className="text-xs sm:text-sm text-body leading-relaxed">
            Book a 1:1 online strategy session to fix your money framework, align your asset allocation, and build an investment rhythm.
          </p>
          <div className="font-mono text-[9px] tracking-widest text-blue/40">
            [ COMPLIANT // NO INDIVIDUAL TRANSACTION RECOMMENDATIONS ]
          </div>
          <div>
            <ArrowPillButton href="/contact?vertical=finance" size="md">
              Apply for 1:1 Finance Session
            </ArrowPillButton>
          </div>
        </Container>
      </section>
    </div>
  );
}
