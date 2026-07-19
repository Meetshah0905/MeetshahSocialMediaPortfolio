import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-[#080b12] text-white min-h-[70vh] flex flex-col justify-center items-center">
      <Section tone="default" spacing="default" className="text-center">
        <Container className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <h1 className="font-display text-[120px] sm:text-[180px] leading-none text-white tracking-tight select-none">
              404
            </h1>
            <span className="absolute -bottom-2 right-4 font-handwritten text-xl sm:text-2xl text-[#2e7bff] rotate-[-6deg]">
              Out of bounds
            </span>
          </div>

          <h2 className="font-heading text-lg sm:text-2xl font-bold text-white max-w-[20ch]">
            This page stepped out of frame.
          </h2>

          <p className="text-xs sm:text-sm text-white/60 max-w-[36ch] leading-relaxed">
            The link you followed may be broken or the vertical path has been restructured. Use the options below to return.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
            <ArrowPillButton href="/" size="md">
              Return Home
            </ArrowPillButton>
            <Button
              href="/work-with-me"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              size="md"
            >
              Work With Me
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  );
}
