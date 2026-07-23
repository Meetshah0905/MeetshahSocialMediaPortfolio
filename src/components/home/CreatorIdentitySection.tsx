"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trackMediaUsage } from "@/lib/mediaRegistry";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";
import { MapPin } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CreatorIdentitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const portraitInnerRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackMediaUsage("hero-bw", "CreatorIdentity");
  }, []);

  // Entrance reveal
  useGSAP(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      onComplete: () => {
        gsap.set([portraitWrapperRef.current, contentRef.current], { clearProps: "opacity,transform" });
      },
    });

    // Reveal portrait & info panel
    tl.fromTo(
      portraitWrapperRef.current,
      { opacity: 0, scale: 1.02, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "power3.out" }
    );

    // Stagger content items
    if (contentRef.current) {
      const children = contentRef.current.children;
      tl.fromTo(
        children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "-=0.7"
      );
    }
  }, { scope: sectionRef });

  // Subtle pointer tracking effect (Desktop only, max 5px movement)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!portraitInnerRef.current || !infoPanelRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to(portraitInnerRef.current, {
      scale: 1.015,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(infoPanelRef.current, {
      y: -3,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!portraitInnerRef.current || !infoPanelRef.current) return;
    gsap.to(portraitInnerRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(infoPanelRef.current, {
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="creator-identity"
      className="relative py-20 lg:py-28 bg-white text-ink overflow-hidden border-b border-border"
    >
      <Container className="max-w-[1380px] px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Creator Identity Portrait Card (46-50% width on Desktop) */}
          <div
            className="lg:col-span-6 relative flex flex-col justify-center lg:justify-start"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Small Eyebrow Label Above Image */}
            <Badge className="bg-blue-pale text-blue border-transparent uppercase font-bold tracking-widest text-[10px] self-start mb-3">
              MEET THE CREATOR
            </Badge>

            <div
              ref={portraitWrapperRef}
              className="relative w-full max-w-[540px] rounded-[28px_28px_20px_20px] border border-border bg-white shadow-soft overflow-hidden group transition-all duration-300 hover:border-blue/40"
            >
              {/* Subtle offset border depth behind portrait wrapper */}
              <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[28px_28px_20px_20px] border border-blue/20 bg-surface-soft/40 -z-10" />

              {/* Clean Portrait Image Frame (No typography inside image) */}
              <div
                ref={portraitInnerRef}
                className="relative w-full aspect-square overflow-hidden rounded-[28px_28px_8px_8px] bg-surface-soft transition-transform duration-500 ease-out"
              >
                <Image
                  src="/images/meet/hero-bw.png"
                  alt="Black-and-white studio portrait of Meet Shah smiling with his arms crossed"
                  width={921}
                  height={921}
                  quality={100}
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 48vw, 540px"
                  style={{ objectPosition: "center 28%" }}
                  className="block h-full w-full object-cover"
                />

                {/* Subtle blue corner accent tag */}
                <div className="absolute top-0 right-0 size-3.5 bg-blue z-20" />
              </div>

              {/* Separate Creator Information Panel Below Image */}
              <div
                ref={infoPanelRef}
                className="p-4 sm:p-5 bg-white text-left border-t border-border/80 space-y-2.5 transition-transform duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-ink">
                      Meet Shah
                    </h3>
                    <span className="size-2 rounded-full bg-blue animate-pulse" />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted uppercase tracking-wider">
                    Creator · Educator
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono border-t border-border/40 pt-2 text-muted">
                  <div className="flex items-center gap-2 font-bold text-blue">
                    <span>Fitness</span>
                    <span className="text-muted font-normal">/</span>
                    <span>Finance</span>
                    <span className="text-muted font-normal">/</span>
                    <span>UGC</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <MapPin className="size-3 text-blue" />
                    <span>Ahmedabad, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Identity Copy & CTAs (50-54% width on Desktop) */}
          <div ref={contentRef} className="lg:col-span-6 space-y-6 text-left z-10">
            {/* Eyebrow */}
            <div>
              <Badge className="bg-blue-pale text-blue border-transparent uppercase font-bold tracking-widest text-[10px] mb-3">
                CREATOR IDENTITY
              </Badge>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-tight">
                Fitness. Finance. <br />
                <span className="text-blue">Content with clarity.</span>
              </h2>
            </div>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-sm text-body leading-relaxed max-w-xl">
              Meet Shah creates practical fitness, personal-finance and creator-led content designed to educate, simplify and build audience trust.
            </p>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {["FITNESS", "FINANCE", "UGC", "SHORT-FORM VIDEO"].map((cat) => (
                <span
                  key={cat}
                  className="px-3.5 py-1.5 rounded-full bg-surface-soft border border-border text-ink font-heading text-[10px] font-bold uppercase tracking-wider shadow-2xs"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Location & Supporting Identity */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-soft/60 border border-border text-xs text-body">
              <MapPin className="size-4 text-blue shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-ink block mb-0.5">Based in Ahmedabad, India.</span>
                <span>Creating useful content for audiences and thoughtful visual campaigns for brands.</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <ArrowPillButton href="/work-with-me" size="md">
                Explore my work
              </ArrowPillButton>
              <Button href="/contact" size="md" variant="outline">
                Work with me
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
