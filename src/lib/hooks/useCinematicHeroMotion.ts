"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type CinematicHeroMotionRefs = {
  scopeRef: React.RefObject<HTMLElement | null>;
  heroMaskRef: React.RefObject<HTMLElement | null>;
  heroImageRef?: React.RefObject<HTMLElement | null>;
  lightSweepRef?: React.RefObject<HTMLElement | null>;
  pillsRef?: React.RefObject<HTMLElement | null>;
  ctasRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Shared Cinematic Hero Entrance Animation Sequence
 * Hardware-accelerated (GPU compositor) entrance animation.
 * Uses 60fps opacity, transform, and light sweep without expensive clip-path re-rasterization lag.
 */
export function useCinematicHeroMotion({
  scopeRef,
  heroMaskRef,
  heroImageRef,
  lightSweepRef,
  pillsRef,
  ctasRef,
}: CinematicHeroMotionRefs) {
  useGSAP(
    () => {
      if (!scopeRef.current) return;

      // Reduced motion check
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (heroMaskRef.current) gsap.set(heroMaskRef.current, { opacity: 1, y: 0 });
        if (heroImageRef?.current) gsap.set(heroImageRef.current, { scale: 1, opacity: 1 });
        if (lightSweepRef?.current) gsap.set(lightSweepRef.current, { opacity: 0 });
        if (pillsRef?.current) gsap.set(pillsRef.current, { opacity: 1, y: 0 });
        if (ctasRef?.current) gsap.set(ctasRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Stage 1 & 2: Ultra-smooth Hardware-Accelerated Container & Image Scale/Opacity Reveal
      if (heroMaskRef.current) {
        tl.fromTo(
          heroMaskRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" }
        );
      }

      // Stage 2B: Main Image Scale Settling
      if (heroImageRef?.current) {
        tl.fromTo(
          heroImageRef.current,
          { scale: 1.018, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 0.85, ease: "power2.out" },
          "-=0.65"
        );
      }

      // Stage 3: Fast Light Sweep Highlight Overlay
      if (lightSweepRef?.current) {
        tl.fromTo(
          lightSweepRef.current,
          { xPercent: -100, opacity: 0.2 },
          { xPercent: 100, opacity: 0, duration: 0.9, ease: "power2.inOut" },
          "-=0.5"
        );
      }

      // Stage 4: Category Pills Entrance
      if (pillsRef?.current) {
        tl.fromTo(
          pillsRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          "-=0.45"
        );
      }

      // Stage 5: CTAs Entrance
      if (ctasRef?.current) {
        tl.fromTo(
          ctasRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.35"
        );
      }
    },
    { scope: scopeRef }
  );
}
