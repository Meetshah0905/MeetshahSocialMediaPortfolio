"use client";

import { m } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { MOTION } from "./MotionProvider";

/**
 * Fade-up reveal as an element enters the viewport (§9).
 *
 * `once` + a negative bottom margin means it fires slightly before the element
 * is fully visible and never re-runs — reveals that replay on scroll-back read
 * as a gimmick. Content is never hidden from screen readers or crawlers: the
 * element is in the DOM from first paint, only opacity/transform change.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const MotionTag = m[Tag as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: MOTION.offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ ...MOTION.reveal, delay }}
    >
      {children}
    </MotionTag>
  );
}
