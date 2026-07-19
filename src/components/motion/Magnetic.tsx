"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Subtle magnetic pull toward the cursor (§9).
 *
 * Pointer-only by design: it's decorative, and §29 forbids hover-dependent
 * meaning. Disabled for reduced motion and on touch devices, where there is no
 * cursor to attract.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  /** 0–1. How far the element follows the cursor. Keep it low. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Coarse pointers (touch) have no meaningful cursor position to track.
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centreX = rect.left + rect.width / 2;
    const centreY = rect.top + rect.height / 2;
    x.set((event.clientX - centreX) * strength);
    y.set((event.clientY - centreY) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  );
}
