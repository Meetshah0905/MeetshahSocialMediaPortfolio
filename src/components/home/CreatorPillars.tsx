"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";
import { creatorPillarsData } from "@/content/creatorPillarsData";
import { trackMediaUsage } from "@/lib/mediaRegistry";

type CreatorPillarsProps = {
  getProfileValue?: (id: string) => string;
};

export function CreatorPillars({ getProfileValue }: CreatorPillarsProps) {
  useEffect(() => {
    creatorPillarsData.forEach((pillar) => {
      trackMediaUsage(pillar.id, `CreatorPillars-${pillar.id}`);
    });
  }, []);

  return (
    <WhiteAtmosphereSection id="pillars" halo="both" className="bg-white border-b border-border py-20 lg:py-28">
      <Container className="max-w-[1440px] px-6 sm:px-12">
        {/* Section Introduction */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 text-left border-b border-border/60 pb-8">
          <div className="lg:w-[58%] space-y-3">
            <Badge className="bg-blue-pale text-blue border-transparent uppercase font-bold tracking-widest text-[10px]">
              CREATOR PILLARS
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-tight">
              Three pillars. <br />
              <span className="text-blue">One creator ecosystem.</span>
            </h2>
          </div>

          <div className="lg:w-[38%] space-y-3">
            <p className="text-xs sm:text-sm text-body leading-relaxed">
              Fitness education, personal-finance insights and creator-led content brought together through one focused personal brand.
            </p>
          </div>
        </div>

        {/* 3-Pillar Editorial Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {creatorPillarsData.map((pillar) => {
            const metricValue =
              pillar.metricKey && getProfileValue
                ? `${getProfileValue(pillar.metricKey)} ${pillar.metricLabel || "followers"}`
                : pillar.metricFallback || "Creator-led brand content";

            return (
              <div
                key={pillar.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white overflow-hidden shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-blue/40 hover:shadow-xl"
              >
                {/* Upper 56% Image Media Region */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-soft">
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 480px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Subtle Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Eyebrow Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white/90 backdrop-blur-md text-ink border-transparent text-[9px] uppercase font-bold tracking-widest font-mono shadow-xs">
                      {pillar.eyebrow}
                    </Badge>
                  </div>
                </div>

                {/* Lower Information & CTA Content Region */}
                <div className="p-6 flex flex-col flex-1 justify-between text-left space-y-6">
                  <div className="space-y-2.5">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-ink leading-snug group-hover:text-blue transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-body leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Metric & CTA Footer */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-wider block">
                        AUDIENCE METRIC
                      </span>
                      <span className="text-xs font-heading font-bold text-ink block">
                        {metricValue}
                      </span>
                    </div>

                    <ArrowPillButton href={pillar.href} size="md">
                      {pillar.cta}
                    </ArrowPillButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </WhiteAtmosphereSection>
  );
}
