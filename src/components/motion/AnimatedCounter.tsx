"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NO_VALUE, formatCompact, formatNumber } from "@/lib/utils/numbers";

/**
 * Count-up number for stat bands (§9, §13.2).
 *
 * Renders the final value as real text immediately for screen readers and
 * reduced-motion users — the animation is decoration layered on top, never the
 * only way to read the number. A null value renders an em dash: §2 forbids
 * animating a fabricated figure up from zero.
 */
export function AnimatedCounter({
  value,
  compact = false,
  suffix = "",
  className,
  durationSeconds = 1.6,
}: {
  value: number | null | undefined;
  /** 11900 -> "11.9K" instead of "11,900". */
  compact?: boolean;
  suffix?: string;
  className?: string;
  durationSeconds?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  const hasValue =
    value !== null && value !== undefined && Number.isFinite(value);

  useEffect(() => {
    if (!hasValue || !inView || reduced) return;

    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [hasValue, inView, reduced, value, durationSeconds]);

  if (!hasValue) {
    return <span className={className}>{NO_VALUE}</span>;
  }

  const settled = reduced || !inView;
  const current = settled ? value : display;
  const format = compact ? formatCompact : formatNumber;

  return (
    <span ref={ref} className={className}>
      {/* The live region is the real value; the animated text is aria-hidden
          so assistive tech announces "11,900" once, not every frame. */}
      <span className="sr-only">
        {format(value)}
        {suffix}
      </span>
      <span aria-hidden>
        {format(Math.round(current))}
        {suffix}
      </span>
    </span>
  );
}
