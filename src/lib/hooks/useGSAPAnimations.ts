"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once on load
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook to slide mask-reveal text from bottom (overflow hidden)
 */
export function useMaskedTextReveal(triggerRef: React.RefObject<HTMLElement | null>, targetSelector: string) {
  useGSAP(() => {
    if (!triggerRef.current) return;
    const elements = triggerRef.current.querySelectorAll(targetSelector);
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: triggerRef });
}

/**
 * Hook to fade and drift elements upward when they hit the viewport
 */
export function useFadeUp(triggerRef: React.RefObject<HTMLElement | null>, targetSelector: string, delay: number = 0) {
  useGSAP(() => {
    if (!triggerRef.current) return;
    const elements = triggerRef.current.querySelectorAll(targetSelector);
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: triggerRef });
}

/**
 * Hook to reveal an image with a horizontal sliding mask and scale transition
 */
export function useImageReveal(triggerRef: React.RefObject<HTMLElement | null>, imageSelector: string) {
  useGSAP(() => {
    if (!triggerRef.current) return;
    const img = triggerRef.current.querySelector(imageSelector);
    if (!img) return;

    gsap.fromTo(
      img,
      { clipPath: "inset(0 100% 0 0)", scale: 1.05 },
      {
        clipPath: "inset(0 0% 0 0)",
        scale: 1,
        duration: 1.25,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: triggerRef });
}

/**
 * Hook to apply simple vertical scroll parallax relative speed
 */
export function useParallax(targetRef: React.RefObject<HTMLElement | null>, speedPercent: number = -15) {
  useGSAP(() => {
    if (!targetRef.current) return;

    gsap.to(targetRef.current, {
      yPercent: speedPercent,
      ease: "none",
      scrollTrigger: {
        trigger: targetRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/**
 * Hook to implement the pinned split-screen museum-style story (Animation B)
 */
export function usePinnedStory(
  sectionRef: React.RefObject<HTMLElement | null>,
  leftRef: React.RefObject<HTMLElement | null>,
  rightRef: React.RefObject<HTMLElement | null>,
  storyClass: string = ".story-phase"
) {
  useGSAP(() => {
    if (!sectionRef.current || !leftRef.current || !rightRef.current) return;

    const match = gsap.matchMedia();

    match.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
        },
      });

      // Reduce visual area of right poster from 100% to 56% aligned right
      tl.to(rightRef.current, {
        width: "56%",
        ease: "power2.inOut",
      });

      // Scroll-scrub left narrative phases staggered upward line by line
      const phases = leftRef.current?.querySelectorAll(storyClass);
      phases?.forEach((phase, index) => {
        if (index > 0) {
          tl.fromTo(
            phase,
            { opacity: 0, y: 80 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
            `-=${0.6}`
          );
        }
      });
    });

    return () => {
      match.revert();
    };
  }, { scope: sectionRef });
}

/**
 * Hook to implement the scroll-driven shape morph for CTAs (Animation D)
 */
export function useMorphingPanel(
  triggerRef: React.RefObject<HTMLElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>
) {
  useGSAP(() => {
    if (!triggerRef.current || !containerRef.current || !contentRef.current) return;

    const match = gsap.matchMedia();

    match.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 85%",
          end: "bottom 35%",
          scrub: true,
        },
      });

      tl.fromTo(
        containerRef.current,
        {
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          backgroundColor: "#2e7bff",
        },
        {
          width: "100%",
          height: "460px",
          borderRadius: "24px",
          backgroundColor: "#080b12",
          ease: "power2.inOut",
        }
      );

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: "power3.out" },
        "-=0.4"
      );
    });

    match.add("(max-width: 767px)", () => {
      // Mobile fallback: simple rounded panel, no morph
      gsap.set(containerRef.current, {
        width: "100%",
        height: "auto",
        borderRadius: "16px",
        backgroundColor: "#080b12",
      });
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
    });

    return () => {
      match.revert();
    };
  }, { scope: triggerRef });
}
