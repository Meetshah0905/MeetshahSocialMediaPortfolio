import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Standard section header: eyebrow, heading, optional supporting line.
 *
 * `as` and `id` exist so pages keep a logical heading order (§29) and can wire
 * a section's aria-labelledby to its own heading.
 */
export function SectionHeading({
  eyebrow,
  heading,
  supporting,
  id,
  as: Tag = "h2",
  align = "start",
  className,
}: {
  eyebrow?: string;
  heading: ReactNode;
  supporting?: ReactNode;
  id?: string;
  as?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  className?: string;
}) {
  const headingSize = Tag === "h1" ? "text-h1" : "text-h2";

  return (
    <Reveal
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-primary uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </p>
      )}

      <Tag id={id} className={cn(headingSize, "max-w-[18ch]")}>
        {heading}
      </Tag>

      {supporting && (
        <p
          className={cn(
            "text-body-lg mt-5 max-w-[58ch] text-body",
            align === "center" && "mx-auto",
          )}
        >
          {supporting}
        </p>
      )}
    </Reveal>
  );
}
