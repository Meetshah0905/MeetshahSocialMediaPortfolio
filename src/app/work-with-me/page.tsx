"use client";

import { useState, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Mail, Layers, Eye, PenTool, Key, Calendar } from "lucide-react";
import Image from "next/image";
import { socialUrls } from "@/content/site";
import { imageManifest } from "@/content/imageManifest";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";

import HeroParticles from "@/components/ui/HeroParticles";
import { HeroMaroonAtmosphere } from "@/components/home/HeroMaroonAtmosphere";
import { useCinematicHeroMotion } from "@/lib/hooks/useCinematicHeroMotion";

const SERVICES_LIST = [
  {
    num: "01",
    title: "Dedicated Instagram Reels",
    desc: "Short-form video content published directly to Meet's channels (@meetsofficial or @meet.fitfix) to highlight your brand context organically.",
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

const SCOPING_FACTORS = [
  {
    icon: Layers,
    title: "Deliverables",
    details: ["Number of videos", "Story frames", "Static assets", "Raw footage options"],
  },
  {
    icon: Eye,
    title: "Distribution",
    details: ["UGC-only delivery", "Fitness-channel publishing", "Finance-channel publishing", "Cross-channel campaigns"],
  },
  {
    icon: PenTool,
    title: "Creative Involvement",
    details: ["Provided script compliance", "Creator-led concepts", "Hook engineering", "Professional post-editing"],
  },
  {
    icon: Key,
    title: "Usage & Licensing",
    details: ["Organic publishing rights", "Paid amplification rights", "Creator whitelisting permissions", "Duration & territories"],
  },
  {
    icon: Calendar,
    title: "Timeline",
    details: ["Standard timelines", "Campaign launch deadlines", "Structured revision rounds", "Priority express delivery"],
  },
];

export default function WorkWithMePage() {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);

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
    <div className="bg-white text-ink w-full">
      {/* 1. CINEMATIC HERO SECTION */}
      <section ref={scopeRef} className="relative w-full bg-[#050811] overflow-clip flex flex-col items-center select-none pt-2 pb-8 md:pt-4 md:pb-10">
        <HeroMaroonAtmosphere theme="blue" />
        <HeroParticles theme="blue" />

        <div
          ref={heroMaskRef}
          className="w-full max-w-[1400px] px-3 sm:px-6 relative flex justify-center items-center z-10"
        >
          <div className="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(220,60,80,0.15)] border border-white/10">
            <Image
              ref={heroImageRef}
              src={imageManifest.collaborateHero.src}
              alt={imageManifest.collaborateHero.alt}
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
                background: `linear-gradient(110deg, transparent 20%, rgba(255, 255, 255, 0.12) 43%, rgba(80, 145, 255, 0.12) 50%, transparent 70%)`,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>

        {/* CTAs & Badges row positioned underneath */}
        <div className="relative w-full max-w-[1400px] z-20 mt-5 px-6">
          <Container className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div ref={pillsRef} className="flex gap-3">
              <span className="bg-blue text-white px-3.5 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest border border-blue-light/20 shadow-soft">
                BRAND COLLABORATIONS
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest border border-white/20 shadow-xs">
                Creator Partnerships
              </span>
            </div>

            <div ref={ctasRef} className="flex gap-3 w-full sm:w-auto">
              <ArrowPillButton href="/contact" size="md" className="flex-1 sm:flex-initial">
                Share Campaign Brief
              </ArrowPillButton>
              <Button
                href="/analytics"
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white flex-1 sm:flex-initial"
                size="md"
              >
                View Audience Insights
              </Button>
            </div>
          </Container>
        </div>
      </section>

      {/* Transition to white section */}
      <div className="relative h-10 bg-white rounded-t-[32px] z-30 border-t border-border" />

      {/* 2. SERVICES SECTION (Desktop index hover / Mobile snapping carousel) */}
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

      {/* 3. CAMPAIGN SCOPING SECTION (Replaces public packages) */}
      <WhiteAtmosphereSection halo="left" className="bg-white border-y border-border">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-blue font-bold text-xs uppercase tracking-widest block mb-2">
              Commercial Framework
            </span>
            <h2 className="font-heading text-3xl font-bold text-ink">
              How campaigns are scoped
            </h2>
            <p className="mt-2 text-xs text-body leading-relaxed">
              Every campaign is scoped after reviewing the brief, deliverables, publishing requirements, timeline and usage rights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {SCOPING_FACTORS.map((factor) => (
              <Card key={factor.title} className="p-6 border border-border bg-surface-soft flex flex-col justify-between h-full shadow-xs">
                <div>
                  <div className="size-9 rounded-full bg-blue/15 text-blue flex items-center justify-center border border-blue/10 mb-4">
                    <factor.icon className="size-4.5" />
                  </div>
                  <h4 className="font-heading text-sm font-bold text-ink">{factor.title}</h4>
                  <div className="mt-4 space-y-2">
                    {factor.details.map((item) => (
                      <div key={item} className="flex gap-2 items-start text-[11px] text-body leading-relaxed">
                        <CheckCircle2 className="size-3.5 text-blue shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 border border-border bg-surface-soft rounded-panel text-center max-w-2xl mx-auto">
            <p className="text-xs text-body leading-relaxed font-semibold">
              “Every campaign is scoped after reviewing the brief, deliverables, publishing requirements, timeline and usage rights.”
            </p>
            <div className="mt-6 flex justify-center">
              <ArrowPillButton href="/contact" size="md">
                Request a Tailored Proposal
              </ArrowPillButton>
            </div>
          </div>
        </Container>
      </WhiteAtmosphereSection>

      {/* 4. CREATOR VALUE ACCORDION */}
      <WhiteAtmosphereSection halo="both" className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <Badge className="bg-blue-pale text-blue border-transparent">
                Creator Value
              </Badge>
              <h2 className="font-heading text-3xl font-bold text-ink mt-4 leading-tight">
                An organized creative partner.
              </h2>
              <p className="mt-5 text-body text-xs sm:text-sm leading-relaxed">
                I manage the entire content production lifecycle, from aligning scripts with compliance requirements to delivery, so you can execute campaigns on time.
              </p>
            </div>

            <div className="lg:col-span-7 bg-white border border-border p-8 rounded-panel grid grid-cols-1 sm:grid-cols-2 gap-6 shadow-soft">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="size-4.5 text-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-ink">
                    Compliance Minded
                  </h4>
                  <p className="mt-1 text-[11px] text-body leading-relaxed">
                    Following disclaimers and guidelines to ensure safe, compliant brand promotions.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2 className="size-4.5 text-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-ink">
                    High-Retention Hook Design
                  </h4>
                  <p className="mt-1 text-[11px] text-body leading-relaxed">
                    Structuring initial hooks specifically formatted for viewer retention.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2 className="size-4.5 text-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-ink">
                    Professional Editing
                  </h4>
                  <p className="mt-1 text-[11px] text-body leading-relaxed">
                    Assets delivered with clean voiceovers, subtitles, and color corrections.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <CheckCircle2 className="size-4.5 text-blue shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading text-xs sm:text-sm font-bold text-ink">
                    Flexible Licensing
                  </h4>
                  <p className="mt-1 text-[11px] text-body leading-relaxed">
                    Clear licensing frameworks covering organic and paid usage rights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </WhiteAtmosphereSection>

      {/* 5. CTA Final */}
      <section className="bg-ink text-white py-16 text-center border-t border-border">
        <Container className="flex flex-col items-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to start a collaboration?
          </h2>
          <p className="mt-4 text-white/70 max-w-[45ch] text-xs sm:text-sm leading-relaxed">
            Fill out the campaign form to specify your budget, timeline, and requirements.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
            <ArrowPillButton href="/contact" size="md">
              Start Campaign Form
            </ArrowPillButton>
            <a
              href={`mailto:${socialUrls.email}`}
              className="inline-flex min-h-12 items-center gap-2 border border-white/20 px-5 rounded-full text-xs font-semibold hover:bg-white/5 transition-colors"
            >
              <Mail className="size-4" />
              {socialUrls.email}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
