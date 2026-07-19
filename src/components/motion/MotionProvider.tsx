"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Motion presets shared by every animated component (§9).
 *
 * Keeping the timings here — rather than scattered per component — is what
 * stops the site drifting into an animation showcase.
 */
export const MOTION = {
  /** Standard section reveal. */
  reveal: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  /** Hero intro — slightly longer, used once per page. */
  intro: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  /** Buttons and small controls. */
  control: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  /** Delay between staggered children. */
  stagger: 0.08,
  /** How far fade-up elements travel. Small: motion shouldn't shout. */
  offset: 24,
} as const;

/**
 * Wraps the app in Motion's reduced-motion handling and lazy feature loading.
 *
 * `LazyMotion` + `domAnimation` ships the animation subset only (~15kb) rather
 * than the full bundle; `reducedMotion="user"` makes every motion component
 * respect the OS setting without each one checking for itself.
 *
 * `strict` means components must use `m` (`<m.div>`), never `motion`
 * (`<motion.div>`) — the latter throws, which is the point: it stops someone
 * silently pulling the full bundle back in.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
