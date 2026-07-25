"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { InstagramIcon } from "@/components/ui/icons";
import { CheckCircle2, Dumbbell, Flame, Apple, Sparkles, FileText, Download } from "lucide-react";
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

// Vector Decorations
const WeightPlateDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="45" strokeWidth="0.5" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="35" strokeWidth="1" />
    <circle cx="50" cy="50" r="10" strokeWidth="1" />
    <path d="M 50 15 L 50 35 M 50 65 L 50 85 M 15 50 L 35 50 M 65 50 L 85 50" strokeWidth="0.5" />
    <text x="50" y="53" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="monospace">20KG</text>
  </svg>
);

const GymGridDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <path d="M 10 0 L 10 100 M 30 0 L 30 100 M 50 0 L 50 100 M 70 0 L 70 100 M 90 0 L 90 100" strokeWidth="0.25" strokeDasharray="2 2" />
    <path d="M 0 10 L 100 10 M 0 30 L 100 30 M 0 50 L 100 50 M 0 70 L 100 70 M 0 90 L 100 90" strokeWidth="0.25" strokeDasharray="2 2" />
    <circle cx="50" cy="50" r="0.75" fill="currentColor" />
    <circle cx="10" cy="30" r="0.75" fill="currentColor" />
    <circle cx="90" cy="70" r="0.75" fill="currentColor" />
  </svg>
);

const TrainingArrowsDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <path d="M 15 50 C 30 20, 70 20, 85 50" strokeWidth="0.75" strokeDasharray="2 2" />
    <polygon points="85,50 80,44 88,46" fill="currentColor" />
    <path d="M 85 50 C 70 80, 30 80, 15 50" strokeWidth="0.75" strokeDasharray="2 2" />
    <polygon points="15,50 20,56 12,54" fill="currentColor" />
    <text x="50" y="47" textAnchor="middle" fontSize="5" fontFamily="monospace" fill="currentColor" stroke="none">REPETITION ARC</text>
  </svg>
);

const DumbbellDeco = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <rect x="25" y="46" width="50" height="8" rx="2" strokeWidth="1" />
    <rect x="20" y="25" width="5" height="50" rx="2" strokeWidth="1" />
    <rect x="15" y="30" width="5" height="40" rx="2" strokeWidth="1" />
    <rect x="9" y="35" width="6" height="30" rx="2" strokeWidth="1" />
    <rect x="75" y="25" width="5" height="50" rx="2" strokeWidth="1" />
    <rect x="80" y="30" width="5" height="40" rx="2" strokeWidth="1" />
    <rect x="85" y="35" width="6" height="30" rx="2" strokeWidth="1" />
    <text x="50" y="52" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="monospace">POWER</text>
  </svg>
);

const PROGRAMS = [
  {
    icon: Dumbbell,
    title: "Technique & Form Deep-Dives",
    desc: "Reels breaking down precise movements (squat depths, pull-up mechanics, scapular retraction) with graphical cues for rapid retention.",
  },
  {
    icon: Apple,
    title: "Sustainable Nutrition Plans",
    desc: "Simple vegetarian diet guidelines, macro targets, and protein-packed grocery recommendations that fit modern lifestyles.",
  },
  {
    icon: Flame,
    title: "1:1 Weekend Fitness Sessions",
    desc: "Personalized online sessions reviewing workouts, form adjustments, and setting weekly fitness structures.",
  },
];

interface FitnessClientPageProps {
  initialFollowers: number;
}

export default function FitnessClientPage({ initialFollowers }: FitnessClientPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const followerDisplay =
    initialFollowers > 0 ? formatCompact(initialFollowers) : "—"; // never a fake stand-in (§2)

  const STATS = [
    { value: followerDisplay, label: "Instagram Followers", sub: "Highly engaged niche community" },
    { value: "24.5K+", label: "Monthly Account Reach", sub: "Organic video impressions" },
    { value: "3.2%", label: "Average Engagement Rate", sub: "Niche benchmark 1.8%" },
    { value: "92%", label: "Saves & Shares Growth", sub: "High utility-value content" },
  ];

  useGSAP(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Instantly make elements fully visible
      gsap.set(".hero-eyebrow, .hero-heading-line, .hero-body, .hero-buttons, .hero-badge", { opacity: 1, scale: 1, y: 0 });
      gsap.set(".hero-image-wrap", { clipPath: "inset(0 0 0 0)" });
      return;
    }

    const tl = gsap.timeline();

    // 1. Eyebrow reveals
    tl.fromTo(
      ".hero-eyebrow",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    // 2. Heading reveals line by line
    tl.fromTo(
      ".hero-heading-line",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );

    // 3. Body copy fades upward
    tl.fromTo(
      ".hero-body",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    // 4. Buttons appear
    tl.fromTo(
      ".hero-buttons",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );

    // 5. Large Fitness artwork reveals through a right-to-left mask
    tl.fromTo(
      ".hero-image-wrap",
      { clipPath: "inset(0 0 0 100%)" },
      { clipPath: "inset(0 0 0 0%)", duration: 1.2, ease: "power3.inOut" },
      "-=0.8"
    );

    // 6. Follower badge appears last
    tl.fromTo(
      ".hero-badge",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.2"
    );

    // 7. Decorative outlines drift slowly
    gsap.to(".gym-deco-plate", {
      x: "random(-8, 8)",
      y: "random(-8, 8)",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".gym-deco-dumbbell", {
      x: "random(-6, 6)",
      y: "random(-6, 6)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".gym-deco-arrows", {
      x: "random(-10, 10)",
      y: "random(-10, 10)",
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });

  // Mouse Parallax Effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * 0.012;
    const y = (clientY - window.innerHeight / 2) * 0.012;

    gsap.to(".parallax-layer", {
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
      
      {/* 1. CINEMATIC HERO SECTION */}
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
              src={imageManifest.fitnessHero.src}
              alt={imageManifest.fitnessHero.alt}
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
                    FITNESS CREATOR
                  </span>
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-heading font-bold uppercase tracking-widest border border-white/20 shadow-xs">
                    @meetsofficial
                  </span>
                </div>

                <div ref={ctasRef} className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
                  <ArrowPillButton href="/contact?vertical=fitness" size="sm" className="flex-1 sm:flex-initial text-center justify-center">
                    Explore Fitness Content
                  </ArrowPillButton>
                  <a
                    href="https://www.instagram.com/meetsofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 sm:min-h-10 items-center justify-center gap-1.5 sm:gap-2 border border-white/20 bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-colors flex-1 sm:flex-initial"
                  >
                    <InstagramIcon className="size-3.5 sm:size-4 text-white" />
                    <span>@meetsofficial</span>
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
                Structured, educational fitness copy that drives organic reach, saves, and conversions. No shortcuts, just results.
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
              Why Brands Partner in Fitness
            </h3>
            <p className="text-xs text-body leading-relaxed">
              Modern fitness audiences are skeptical of extreme transformations or quick fixes. They value authenticity and technical correctness. By partnering with Meet Shah, your brand gains access to an audience that prioritizes:
            </p>

            <ul className="mt-6 flex flex-col gap-3.5">
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>Fact-based training programs & form correction guides</span>
              </li>
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>Vegetarian diet structures that are simple to prepare</span>
              </li>
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>Lifestyle advice that fits normal working schedules</span>
              </li>
              <li className="flex gap-3 items-start text-xs font-semibold text-ink">
                <CheckCircle2 className="size-4 text-blue shrink-0 mt-0.5" />
                <span>High conversion rates on direct-response supplement links</span>
              </li>
            </ul>

            <div className="mt-8 p-4 bg-blue/5 border border-blue/10 rounded-lg">
              <p className="text-[11px] text-blue font-semibold leading-relaxed flex gap-2">
                <Sparkles className="size-4 shrink-0 text-blue" />
                Available Session: Weekends 10:00 AM - 4:00 PM IST (Limited Slots)
              </p>
            </div>
          </div>
        </div>
      </WhiteAtmosphereSection>

      {/* Fitness Analytics Performance Snapshot */}
      <WhiteAtmosphereSection halo="right" className="bg-white border-t border-border py-16 text-center">
        <Container className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-6">
            <Badge className="bg-blue/10 text-blue border-transparent">Analytics Snapshot</Badge>
            <h3 className="font-heading text-3xl font-bold text-ink">Latest Channel Performance</h3>
            <p className="text-xs text-body leading-relaxed">
              Reach, engagement and content metrics from the latest creator-published fitness insights report.
            </p>
          </div>
          <ChannelPerformanceSnapshot source="instagram_fitness" />
        </Container>
      </WhiteAtmosphereSection>

      {/* Light Editorial CTA Band */}
      <section 
        className="relative py-20 text-center border-t border-border overflow-hidden bg-white select-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(47, 120, 255, 0.05), transparent 60%), #ffffff"
        }}
      >
        <GymGridDeco className="absolute inset-0 w-full h-full text-blue/3 opacity-30 pointer-events-none" />
        <WeightPlateDeco className="absolute top-[10%] left-[8%] size-24 text-blue/8 pointer-events-none" />
        <DumbbellDeco className="absolute bottom-[10%] right-[8%] size-28 text-blue/6 pointer-events-none" />
        
        <Container className="flex flex-col items-center max-w-2xl relative z-10 space-y-6">
          <Badge className="bg-blue text-white border-transparent">1:1 Coaching</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Ready to reach your fitness goals?
          </h2>
          <p className="text-xs sm:text-sm text-body leading-relaxed">
            Book a 1:1 online strategy session to fix your workout rhythm, align your macro targets, and establish correct technique habits.
          </p>
          <div className="font-mono text-[9px] tracking-widest text-blue/40">
            [ TRAINING NOTE: WEEKEND SLOTS ONLY // Ahmedabad & Online ]
          </div>
          <div>
            <ArrowPillButton href="/contact?vertical=fitness" size="md">
              Apply for 1:1 Fitness Session
            </ArrowPillButton>
          </div>
        </Container>
      </section>
    </div>
  );
}
