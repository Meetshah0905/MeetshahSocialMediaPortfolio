import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Mail } from "lucide-react";
import { socialUrls } from "@/content/site";
import { UGCHero } from "@/components/ugc/UGCHero";
import { CreativeLab } from "@/components/ugc/CreativeLab";

export const metadata: Metadata = {
  title: "UGC & Content Strategy Portfolio",
  description: "Browse Meet Shah's UGC video examples, hook patterns, high-retention editing styles, and content frameworks for social media campaigns.",
};

export default function UGCPage() {
  return (
    <div className="bg-[#f7f7f4] text-[#080b12] w-full">
      {/* 1. REBUILT ASYMMETRICAL UGC HERO SECTION */}
      <UGCHero />

      {/* 2. UGC CREATIVE FRAMEWORKS */}
      <Section tone="default" spacing="default" className="bg-[#f7f7f4]" id="frameworks">
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

      {/* 3. THE CREATIVE LAB WORKSPACE */}
      <CreativeLab />

      {/* 4. FINAL CTA */}
      <section className="bg-[#080b12] text-white py-16 text-center">
        <Container className="flex flex-col items-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-white">
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
