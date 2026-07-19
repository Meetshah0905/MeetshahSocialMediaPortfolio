import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SafeImage } from "@/components/ui/SafeImage";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { site } from "@/content/site";
import { Heart, Compass, Target, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About Meet Shah — Creator Story & Vision",
  description: "Learn about Meet Shah's background, journey combining technical analysis with fitness & finance creation, and creative philosophy.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#f7f7f4] text-[#080b12] min-h-screen">
      {/* Hero / Lakeside Story */}
      <Section tone="soft" spacing="default" className="pt-24 lg:pt-32 pb-16 bg-white border-b border-[#0a0a0a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left panel: Lakeside Portrait */}
          <div className="lg:col-span-5 relative flex justify-center py-6 order-last lg:order-first">
            <div className="relative w-full max-w-[360px] aspect-[3/4] rounded-lg overflow-hidden border border-[#0a0a0a]/10 shadow-2xl bg-white">
              <SafeImage
                src="/images/meet/about-lake.png"
                alt="Meet Shah portrait at the lake"
                label="About portrait"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-[#080b12]/95 backdrop-blur-md px-3.5 py-1.5 rounded-md text-white text-[10px] font-semibold uppercase tracking-wider">
                Ahmedabad, India
              </div>
            </div>
          </div>

          {/* Right panel: Intro Copy */}
          <div className="lg:col-span-7 text-left flex flex-col items-start space-y-6">
            <Badge className="bg-[#2e7bff] text-white border-transparent">
              My Journey
            </Badge>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#080b12] leading-tight">
              Combining logic, fitness, <br />
              <span className="text-[#2e7bff]">and finance strategy.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#3f4651] max-w-[48ch] leading-relaxed">
              I&apos;m Meet Shah, a creator based in Ahmedabad, India. My journey combines technical discipline with creative storytelling. By focusing on two high-intent niches—fitness and finance—I help people make practical body and money decisions.
            </p>
            <div className="flex gap-4">
              <ArrowPillButton href="/work-with-me" size="md">
                View My Work
              </ArrowPillButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Editorial Content with Red Editorial Poster */}
      <Section tone="default" spacing="default" className="bg-[#f7f7f4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left panel: Poster display */}
          <div className="lg:col-span-4 flex justify-center lg:sticky lg:top-24">
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-lg overflow-hidden border border-[#0a0a0a]/10 shadow-lg bg-white">
              <SafeImage
                src="/images/meet/meet-about-poster.jpg"
                alt="Meet Shah Red Editorial Poster"
                label="Editorial poster"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right panel: Biography & Core Principles */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-[#080b12]">
                How It Began
              </h2>
              <p className="text-xs sm:text-sm text-[#3f4651] leading-relaxed">
                Many creators focus on a single vertical. Early on, I realized my passions lay in two very different but equally critical domains: physical fitness and personal finance. I wanted to help my peers train correctly to improve their health, and invest logically to build wealth.
              </p>
              <p className="text-xs sm:text-sm text-[#3f4651] leading-relaxed">
                In my fitness work via <strong>@meetsofficial</strong>, I break down workouts, correct technique mistakes, and simplify diet plans. In my finance work via <strong>@meet.fitfix</strong>, I translate complex stocks and investing trends into bite-sized, structured videos that are easy to understand.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-[#080b12]">
                The Creative Philosophy
              </h2>
              <p className="text-xs sm:text-sm text-[#3f4651] leading-relaxed">
                I believe that online content must provide immediate, high-retention value. If a viewer leaves a video feeling confused, the content has failed. I focus heavily on structured scripting, graphical overlays, and transparent disclaimers so that brands and viewers alike can trust the insights I share.
              </p>
            </div>

            <div className="pt-6 border-t border-[#0a0a0a]/10 space-y-6">
              <h3 className="font-heading text-base font-bold text-[#080b12]">
                Core Principles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-5 border border-[#0a0a0a]/10 bg-white">
                  <div className="size-8 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center mb-3">
                    <Target className="size-4" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[#080b12]">Educational Focus</h4>
                  <p className="mt-1 text-[10px] text-[#3f4651] leading-relaxed">
                    Every asset is built to explain a concept or correct a common mistake, maximizing utility.
                  </p>
                </Card>

                <Card className="p-5 border border-[#0a0a0a]/10 bg-white">
                  <div className="size-8 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center mb-3">
                    <Compass className="size-4" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[#080b12]">Transparency First</h4>
                  <p className="mt-1 text-[10px] text-[#3f4651] leading-relaxed">
                    Clear disclaimers in finance and realistic expectations in fitness build trust.
                  </p>
                </Card>

                <Card className="p-5 border border-[#0a0a0a]/10 bg-white">
                  <div className="size-8 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center mb-3">
                    <Heart className="size-4" />
                  </div>
                  <h4 className="font-heading text-xs font-bold text-[#080b12]">Professional Delivery</h4>
                  <p className="mt-1 text-[10px] text-[#3f4651] leading-relaxed">
                    Meeting deadlines, providing clear scripts, and maintaining brand standards at every step.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Quick stats band */}
      <section className="border-t border-[#0a0a0a]/10 py-16 bg-white">
        <Container className="text-center max-w-2xl flex flex-col items-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-[#080b12] tracking-tight">
            Let&apos;s start a project together.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#3f4651] leading-relaxed">
            Reach out to discuss campaign integration options, request custom UGC assets, or review direct Instagram analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
            <ArrowPillButton href="/contact" size="md">
              Start Collaboration
            </ArrowPillButton>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-12 items-center gap-2 border border-[#0a0a0a]/15 px-5 rounded-full text-xs font-semibold hover:bg-[#f7f7f4] transition-colors"
            >
              <Mail className="size-4" />
              {site.email}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
