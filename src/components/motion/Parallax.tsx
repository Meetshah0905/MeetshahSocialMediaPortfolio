"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Gentle scroll parallax (§9).
 *
 * Only `transform` is animated, never layout properties. Reduced-motion users
 * get a plain static wrapper. Keep `distance` small — the clouds and portrait
 * should drift, not fly.
 */
export function Parallax({
  children,
  distance = 60,
  className,
}: {
  children: ReactNode;
  /** Total vertical travel in px across the element's scroll range. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <m.div style={{ y }}>{children}</m.div>
    </div>
  );
}
