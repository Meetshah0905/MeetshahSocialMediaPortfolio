"use client";

import { useEffect, useRef } from "react";

type HeroAtmosphereProps = {
  theme?: "maroon" | "blue";
};

/**
 * HeroMaroonAtmosphere
 * High-performance background atmosphere with smooth, desktop-only cursor spotlight.
 * On Maroon theme (Homepage): Uses a subtle warm maroon-rose-copper haze with 0% blue cast
 * and NO bright white hotspot.
 */
export function HeroMaroonAtmosphere({ theme = "maroon" }: HeroAtmosphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const isMaroon = theme === "maroon";

  useEffect(() => {
    // 1. Accessibility & Device Checks: Skip tracking on touch devices & reduced motion
    if (typeof window === "undefined") return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (isReducedMotion || !isFinePointer) return;

    let animId = 0;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;
    let isInside = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      isInside = true;

      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${normX * 0.4}px, ${normY * 0.4}px, 0)`;
      }
    };

    const handleMouseLeave = () => {
      isInside = false;
      targetX = -1000;
      targetY = -1000;
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = "0";
      }
    };

    const parent = containerRef.current?.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove, { passive: true });
      parent.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    const loop = () => {
      // Soft lerp interpolation (~120-150ms visual lag)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (spotlightRef.current && currentX > -500 && isInside) {
        spotlightRef.current.style.opacity = "1";

        // Multi-stop warm maroon–rose–copper radial glow for maroon theme (NO blue, NO white hotspot)
        const spotBackground = isMaroon
          ? `radial-gradient(460px circle at ${currentX}px ${currentY}px, rgba(154, 90, 75, 0.13) 0%, rgba(112, 48, 48, 0.10) 28%, rgba(74, 24, 31, 0.07) 48%, rgba(33, 7, 12, 0) 72%)`
          : `radial-gradient(460px circle at ${currentX}px ${currentY}px, rgba(47, 120, 255, 0.14) 0%, rgba(21, 93, 225, 0.05) 50%, transparent 75%)`;

        spotlightRef.current.style.background = spotBackground;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isMaroon]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. Deep Radial Canvas Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: isMaroon
            ? `radial-gradient(circle at 50% 42%, #250a0e 0%, #1a0609 60%, #110406 100%)`
            : `radial-gradient(circle at 50% 42%, #0a1224 0%, #050811 60%, #020408 100%)`,
        }}
      />

      {/* 2. Hardware-accelerated Smooth Pointer Glow (Behind artwork layer at z-0) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 ease-out pointer-events-none"
        style={{ mixBlendMode: "normal" }}
      />

      {/* 3. Subtle Geometric Grid Pattern Overlay (Low opacity) */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay will-change-transform"
        style={{
          backgroundImage: isMaroon
            ? `linear-gradient(to right, rgba(255, 255, 255, 0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.10) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(47, 120, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(47, 120, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transition: "transform 0.2s ease-out",
        }}
      />

      {/* 4. Ambient Background Glowing Blobs */}
      <div
        className={
          isMaroon
            ? "absolute left-[-5%] top-[25%] size-80 rounded-full bg-gradient-to-br from-[#5B1D25]/30 to-[#82433F]/10 blur-[90px] opacity-60 animate-pulse pointer-events-none"
            : "absolute left-[-5%] top-[25%] size-80 rounded-full bg-gradient-to-br from-blue-900/30 to-blue-600/10 blur-[80px] opacity-70 animate-pulse pointer-events-none"
        }
      />
      <div
        className={
          isMaroon
            ? "absolute right-[-5%] top-[35%] size-96 rounded-full bg-gradient-to-bl from-[#703030]/20 via-[#4A181F]/20 to-transparent blur-[100px] opacity-55 animate-pulse pointer-events-none"
            : "absolute right-[-5%] top-[35%] size-96 rounded-full bg-gradient-to-bl from-blue-500/20 via-slate-900/20 to-transparent blur-[90px] opacity-60 animate-pulse pointer-events-none"
        }
      />

      {/* 5. Central Hero Card Backlight Glow */}
      <div
        className={
          isMaroon
            ? "absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[1200px] h-[55%] rounded-3xl bg-[#5B1D25]/15 blur-[80px] opacity-70 pointer-events-none"
            : "absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[1200px] h-[55%] rounded-3xl bg-blue-600/15 blur-[70px] opacity-80 pointer-events-none"
        }
      />

      {/* 6. Floating Micro-particles / Ambient Accent Points (Desktop only §1) */}
      <div className="hidden md:block absolute inset-0 z-0 opacity-25 pointer-events-none">
        <div
          className={
            isMaroon
              ? "absolute left-[12%] top-[20%] size-1.5 rounded-full bg-[#9A5A4B]/60 shadow-[0_0_8px_rgba(154,90,75,0.6)]"
              : "absolute left-[12%] top-[20%] size-1.5 rounded-full bg-blue-400/70 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          }
        />
        <div className="absolute right-[15%] top-[18%] size-1.5 rounded-full bg-white/40" />
        <div
          className={
            isMaroon
              ? "absolute left-[8%] top-[65%] size-1 rounded-full bg-[#82433F]/50"
              : "absolute left-[8%] top-[65%] size-1 rounded-full bg-sky-300/60"
          }
        />
        <div
          className={
            isMaroon
              ? "absolute right-[10%] top-[70%] size-1 rounded-full bg-[#9A5A4B]/50 shadow-[0_0_8px_rgba(154,90,75,0.6)]"
              : "absolute right-[10%] top-[70%] size-1 rounded-full bg-blue-300/70 shadow-[0_0_8px_rgba(147,197,253,0.8)]"
          }
        />
      </div>

      {/* 7. Bottom Area Accent: Horizontal Ambient Light Beam & Gradient Fade */}
      <div
        className={
          isMaroon
            ? "absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-[#82433F]/30 to-transparent opacity-60"
            : "absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] max-w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-75"
        }
      />
      <div
        className={
          isMaroon
            ? "absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#110406]/90 to-transparent"
            : "absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#020408]/90 to-transparent"
        }
      />
    </div>
  );
}
