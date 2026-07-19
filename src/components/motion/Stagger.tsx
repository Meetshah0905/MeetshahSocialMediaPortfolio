"use client";

import { m } from "motion/react";
import type { ElementType, ReactNode } from "react";
import { MOTION } from "./MotionProvider";

/**
 * Staggered reveal for lists and grids (§9).
 *
 * Wrap a group in <Stagger> and each direct child in <StaggerItem>. This is
 * for sets of peers (cards, stats, pillars) — not for animating every
 * paragraph of prose, which §9 explicitly rules out.
 */
export function Stagger({
  children,
  as: Tag = "div",
  className,
  delayChildren = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delayChildren?: number;
}) {
  const MotionTag = m[Tag as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: MOTION.stagger, delayChildren },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  const MotionTag = m[Tag as keyof typeof m] as typeof m.div;

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y: MOTION.offset },
        visible: { opacity: 1, y: 0, transition: MOTION.reveal },
      }}
    >
      {children}
    </MotionTag>
  );
}
