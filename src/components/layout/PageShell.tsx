import type { ReactNode } from "react";
import { BlurCloud } from "@/components/ui/BlurCloud";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

/**
 * Standard interior-page header (About, Fitness, Finance, Work With Me, UGC,
 * Analytics, Contact).
 *
 * Gives every non-home page one consistent opening: eyebrow, h1, intro. The
 * home hero is bespoke and does not use this.
 */
export function PageShell({
  eyebrow,
  heading,
  intro,
  actions,
  children,
  cloud = true,
  className,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  actions?: ReactNode;
  children?: ReactNode;
  cloud?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      {cloud && <BlurCloud preset="soft" />}

      <Container className="pt-16 pb-12 md:pt-24 md:pb-16">
        <Reveal className="flex flex-col items-start">
          {eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-primary uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              {eyebrow}
            </p>
          )}

          <h1 className="text-h1 max-w-[16ch]">{heading}</h1>

          {intro && (
            <p className="text-body-lg mt-6 max-w-[58ch] text-body">{intro}</p>
          )}

          {actions && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
        </Reveal>

        {children}
      </Container>
    </div>
  );
}
