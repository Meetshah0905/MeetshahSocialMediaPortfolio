import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { BlurCloud, type BlurCloudPreset } from "./BlurCloud";
import { Container } from "./Container";

/**
 * A page section with the §7.4 vertical rhythm baked in:
 * mobile 64–88px, tablet 80–112px, desktop 112–160px.
 */

type Tone = "default" | "alt" | "soft";

const toneClasses: Record<Tone, string> = {
  default: "bg-background",
  alt: "bg-surface-alt",
  soft: "bg-surface-soft",
};

const spacingClasses = {
  default: "py-16 md:py-24 lg:py-32",
  tight: "py-12 md:py-16 lg:py-20",
  loose: "py-20 md:py-28 lg:py-40",
} as const;

export function Section({
  children,
  tone = "default",
  spacing = "default",
  cloud,
  containerSize = "default",
  className,
  id,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  spacing?: keyof typeof spacingClasses;
  /** Adds a decorative blur backdrop. Use sparingly (§7.6). */
  cloud?: BlurCloudPreset;
  containerSize?: "default" | "narrow";
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "relative isolate overflow-hidden",
        toneClasses[tone],
        spacingClasses[spacing],
        className,
      )}
    >
      {cloud && <BlurCloud preset={cloud} />}
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
