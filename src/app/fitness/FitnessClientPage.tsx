"use client";

import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { InstagramIcon } from "@/components/ui/icons";
import { channels } from "@/content/site";
import { CheckCircle2, Dumbbell, Flame, Apple, Sparkles, FileText, Download } from "lucide-react";
import Image from "next/image";
import { imageManifest } from "@/content/imageManifest";
import { WhiteAtmosphereSection } from "@/components/ui/WhiteAtmosphereSection";

const STATS = [
  { value: "11.9K", label: "Instagram Followers", sub: "Highly engaged niche community" },
  { value: "24.5K+", label: "Monthly Account Reach", sub: "Organic video impressions" },
  { value: "3.2%", label: "Average Engagement Rate", sub: "Niche benchmark 1.8%" },
  { value: "92%", label: "Saves & Shares Growth", sub: "High utility-value content" },
];

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

export default function FitnessClientPage() {
  const channel = channels.fitness;

  return (
    <div className="bg-white text-ink min-h-screen">
      {/* Hero / Overview */}
      <WhiteAtmosphereSection grid={true} halo="both" className="pt-24 lg:pt-32 pb-16 bg-white border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto px-6">
          {/* Left info */}
          <div className="lg:col-span-7 text-left flex flex-col items-start space-y-6">
            <Badge className="bg-blue text-white border-transparent">
              Fitness Vertical
            </Badge>

            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-ink leading-tight">
              Helping you improve your body <br />
              <span className="text-blue">the right way.</span>
            </h1>

            <p className="text-base sm:text-lg text-body max-w-[48ch] leading-relaxed">
              Practical fitness content focused on training, diet, technique and sustainable discipline. Through my handle{" "}
              <a
                href={channel.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue hover:underline font-semibold"
              >
                {channel.handle}
              </a>
              , I simplify bodybuilding and lifestyle modification.
            </p>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <ArrowPillButton href="/contact?vertical=fitness" size="md">
                Book a 1:1 Session
              </ArrowPillButton>
              <a
                href={channel.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 border border-border px-5 rounded-full text-sm font-semibold hover:bg-surface-soft transition-colors"
              >
                <InstagramIcon className="size-4 text-blue" />
                Follow {channel.handle}
              </a>
            </div>
          </div>

          {/* Right Image (Landscape Poster at native aspect ratio, no 3D Dumbbell in hero) */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="relative w-full aspect-video rounded-panel overflow-hidden border border-border bg-white shadow-soft">
              <Image
                src={imageManifest.fitnessHero.src}
                alt={imageManifest.fitnessHero.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-blue px-3 py-1 rounded-full text-white text-xs font-bold shadow-md">
                {channel.followerDisplay} Followers
              </div>
            </div>
          </div>
        </div>
      </WhiteAtmosphereSection>

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

      {/* Fitness Analytics Archive Integration */}
      <WhiteAtmosphereSection halo="right" className="bg-white border-t border-border py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 text-left space-y-4">
              <Badge className="bg-blue/10 text-blue border-transparent">Verified Metrics</Badge>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-ink">
                Fitness Channel Insights
              </h3>
              <p className="text-xs sm:text-sm text-body max-w-[50ch] leading-relaxed">
                Analyze weekly reach growth, engagement metrics, and location demographics extracted directly from creator console screenshots.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <ArrowPillButton href="/analytics/fitness" size="md">
                <FileText className="size-4 mr-2" />
                View Fitness Analytics
              </ArrowPillButton>
              <a
                href="/api/reports/latest-fitness/pdf"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-blue text-blue hover:bg-blue/5 px-5 rounded-full text-xs font-semibold transition-colors"
              >
                <Download className="size-4" />
                Download Latest Fitness PDF
              </a>
            </div>
          </div>
        </Container>
      </WhiteAtmosphereSection>

      {/* CTA Band */}
      <section className="bg-ink text-white py-16 text-center border-t border-border">
        <Container className="flex flex-col items-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to reach your fitness goals?
          </h2>
          <p className="mt-4 text-white/70 max-w-[45ch] text-xs sm:text-sm leading-relaxed">
            Book a 1:1 online strategy session to fix your program, align your diet, and build a workout rhythm.
          </p>
          <div className="mt-8">
            <ArrowPillButton href="/contact?vertical=fitness" size="md">
              Apply for 1:1 Fitness Session
            </ArrowPillButton>
          </div>
        </Container>
      </section>
    </div>
  );
}
