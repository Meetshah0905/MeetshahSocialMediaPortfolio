import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SafeImage } from "@/components/ui/SafeImage";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { MessageCircle, FileText, Mail } from "lucide-react";
import { socialUrls } from "@/content/site";

export const metadata: Metadata = {
  title: "UGC & Content Strategy Portfolio",
  description: "Browse Meet Shah's UGC video examples, hook patterns, high-retention editing styles, and content frameworks for social media campaigns.",
};

const VIDEOS = [
  {
    title: "Supplement Brand Explainer",
    category: "Fitness UGC",
    duration: "45s",
    hook: "The mistake 90% of gym-goers make with protein timing.",
    angle: "Educational / Problem-solving",
    cta: "Shop now with 15% discount code",
  },
  {
    title: "Personal Budgeting App Walkthrough",
    category: "Finance UGC",
    duration: "52s",
    hook: "I tracked my expenses for 30 days. Here is what I discovered.",
    angle: "App screen demo / Social proof",
    cta: "Sign up for free via link in bio",
  },
  {
    title: "Healthy Snack Product Review",
    category: "Lifestyle UGC",
    duration: "30s",
    hook: "Stop eating boring diet food. Try this high-protein snack instead.",
    angle: "Product taste test / Lifestyle integration",
    cta: "Available at local stores",
  },
];

export default function UGCPage() {
  return (
    <div className="bg-[#f7f7f4] text-[#080b12] min-h-screen">
      {/* Hero / Overview with Studio Poster */}
      <Section tone="soft" spacing="default" className="pt-24 lg:pt-32 pb-16 bg-white border-b border-[#0a0a0a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <Badge className="bg-[#2e7bff] text-white border-transparent">
              UGC & Creative Director
            </Badge>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#080b12] leading-tight">
              High-retention UGC <br />
              <span className="text-[#2e7bff]">built for conversions.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#3f4651] max-w-[48ch] leading-relaxed">
              I script, shoot, and edit custom vertical videos designed to blend seamlessly into organic social feeds. I build concepts based on proven high-retention frameworks to drive engagement and clicks.
            </p>
            <div className="flex gap-4">
              <ArrowPillButton href="/contact?vertical=ugc" size="md">
                Get Custom UGC Video
              </ArrowPillButton>
            </div>
          </div>

          {/* Right: Creator Studio Poster */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[2752/1536] rounded-panel overflow-hidden border border-[#0a0a0a]/10 shadow-2xl bg-white">
              <SafeImage
                src="/images/meet/meet-studio-poster.jpg"
                alt="Meet Shah Creator Studio Poster"
                label="Studio poster"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-[#080b12]/95 backdrop-blur-md px-3.5 py-1.5 rounded-md text-white text-[10px] font-semibold uppercase tracking-wider">
                Behind the scenes
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* UGC Creative Frameworks */}
      <Section tone="default" spacing="default" className="bg-[#f7f7f4]">
        <SectionHeading
          eyebrow="Retention Design"
          heading="Structure of a High-Performing UGC Video"
          supporting="Every video follows a calculated layout that retains attention and funnels viewers toward action."
          align="start"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 border border-[#0a0a0a]/10 bg-white shadow-xs">
            <div className="size-10 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center mb-5 font-heading text-sm font-bold">
              1
            </div>
            <h4 className="font-heading text-base font-bold text-[#080b12]">
              0-3s: The Visual & Verbal Hook
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#3f4651]">
              Capturing immediate interest using text overlays, physical action, or unexpected statements. We prevent the viewer from scrolling past the video in their feed.
            </p>
          </Card>

          <Card className="p-6 border border-[#0a0a0a]/10 bg-white shadow-xs">
            <div className="size-10 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center mb-5 font-heading text-sm font-bold">
              2
            </div>
            <h4 className="font-heading text-base font-bold text-[#080b12]">
              3-30s: Pain-Point & Value Demo
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#3f4651]">
              Establishing context. We introduce a common problem in fitness or finance and demonstrate how the product resolves it through real use cases.
            </p>
          </Card>

          <Card className="p-6 border border-[#0a0a0a]/10 bg-white shadow-xs">
            <div className="size-10 rounded-full bg-[#dce9ff] text-[#155de1] flex items-center justify-center mb-5 font-heading text-sm font-bold">
              3
            </div>
            <h4 className="font-heading text-base font-bold text-[#080b12]">
              30-60s: Trust Row & Clear CTA
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#3f4651]">
              Highlighting features, showing results, and providing a single call to action (coupon code, sign-up link) to direct the user&apos;s next action.
            </p>
          </Card>
        </div>
      </Section>

      {/* Video Concepts Portfolio with Content Poster */}
      <Section tone="soft" spacing="default" className="bg-white border-y border-[#0a0a0a]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Content Poster */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-[2752/1536] rounded-panel overflow-hidden border border-[#0a0a0a]/10 shadow-lg bg-white">
              <SafeImage
                src="/images/meet/meet-content-poster.jpg"
                alt="Meet Shah Editorial Content Poster"
                label="Content poster"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Side: Concepts list */}
          <div className="lg:col-span-8 space-y-6">
            <SectionHeading
              eyebrow="Creative Concepts"
              heading="Video Concepts Breakdown"
              supporting="A structured view of how video briefs are translated into actual screen concepts."
              align="start"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {VIDEOS.map((video) => (
                <Card key={video.title} className="p-6 border border-[#0a0a0a]/10 bg-[#f7f7f4] flex flex-col justify-between hover:border-[#2e7bff]/20 transition-colors h-full">
                  <div>
                    <span className="text-[10px] font-bold text-[#2e7bff] uppercase tracking-widest block">
                      {video.category} • {video.duration}
                    </span>
                    <h3 className="font-heading text-sm font-bold text-[#080b12] mt-2">
                      {video.title}
                    </h3>

                    <div className="mt-4 space-y-3">
                      <div className="flex gap-2.5 items-start">
                        <MessageCircle className="size-4 text-[#2e7bff] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] font-bold text-[#080b12] block uppercase tracking-wider">Hook</span>
                          <p className="text-xs text-[#3f4651] leading-relaxed mt-0.5">“{video.hook}”</p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <FileText className="size-4 text-[#2e7bff] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] font-bold text-[#080b12] block uppercase tracking-wider">Angle</span>
                          <p className="text-xs text-[#3f4651] leading-relaxed mt-0.5">{video.angle}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#0a0a0a]/10 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#3f4651] uppercase tracking-wider">
                      CTA target
                    </span>
                    <span className="text-xs text-[#155de1] font-semibold">
                      {video.cta}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-[#080b12] text-white py-16 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight">
            Need high-converting UGC assets?
          </h2>
          <p className="mt-4 text-white/70 max-w-[45ch] text-xs sm:text-sm leading-relaxed">
            Let&apos;s discuss concepts, hooks, and script angles that align with your product messaging and target metrics.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
            <ArrowPillButton href="/contact?vertical=ugc" size="md">
              Start UGC Campaign Proposal
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
