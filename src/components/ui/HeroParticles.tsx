"use client";

import { useEffect, useRef } from "react";

type HeroParticlesProps = {
  theme?: "maroon" | "blue";
};

interface MobileParticleConfig {
  relX: number;
  relY: number;
  type: "dot" | "circle" | "plus";
  size: number;
  alpha: number;
  phase: number;
  colorType: "white" | "accent";
}

// 8 Curated mobile particles strictly positioned in safe outer margins (§1, §3)
const MOBILE_PARTICLES: MobileParticleConfig[] = [
  { relX: 0.08, relY: 0.08, type: "dot", size: 4, alpha: 0.18, phase: 0.0, colorType: "accent" },
  { relX: 0.90, relY: 0.09, type: "circle", size: 12, alpha: 0.14, phase: 1.2, colorType: "white" },
  { relX: 0.06, relY: 0.32, type: "circle", size: 16, alpha: 0.11, phase: 2.4, colorType: "white" },
  { relX: 0.93, relY: 0.36, type: "plus", size: 6, alpha: 0.14, phase: 3.6, colorType: "accent" },
  { relX: 0.07, relY: 0.62, type: "dot", size: 3, alpha: 0.20, phase: 4.8, colorType: "white" },
  { relX: 0.94, relY: 0.68, type: "circle", size: 10, alpha: 0.14, phase: 0.8, colorType: "white" },
  { relX: 0.10, relY: 0.88, type: "plus", size: 7, alpha: 0.13, phase: 2.0, colorType: "accent" },
  { relX: 0.91, relY: 0.91, type: "dot", size: 4, alpha: 0.18, phase: 3.2, colorType: "white" },
];

export default function HeroParticles({ theme = "maroon" }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMaroon = theme === "maroon";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip entirely for reduced-motion users (§6)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let visible = true;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
    };

    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      type: "plus" | "dot" | "circle" | "square";
      color: string;
      speedFactor: number;
      phase?: number;
    }

    let particles: Particle[] = [];

    const desktopColors = isMaroon
      ? [
          "rgba(255, 255, 255, 0.30)",
          "rgba(255, 255, 255, 0.45)",
          "rgba(244, 114, 182, 0.35)",
          "rgba(225, 29, 72, 0.35)",
        ]
      : [
          "rgba(255, 255, 255, 0.20)",
          "rgba(255, 255, 255, 0.35)",
          "rgba(56, 189, 248, 0.30)",
          "rgba(47, 120, 255, 0.35)",
        ];

    const types: Particle["type"][] = ["plus", "dot", "circle", "square"];

    const initParticles = () => {
      particles = [];
      const isMobile = width < 768;

      if (isMobile) {
        // Mobile (< 768px): 8 curated particles in safe outer margins (§1, §2)
        const accentColor = isMaroon ? "244, 114, 182" : "56, 189, 248";
        const whiteColor = "255, 255, 255";

        MOBILE_PARTICLES.forEach((cfg) => {
          const colorRgb = cfg.colorType === "accent" ? accentColor : whiteColor;
          const px = width * cfg.relX;
          const py = height * cfg.relY;
          particles.push({
            x: px,
            y: py,
            baseX: px,
            baseY: py,
            vx: 0,
            vy: 0,
            size: cfg.size,
            type: cfg.type,
            color: `rgba(${colorRgb}, ${cfg.alpha})`,
            speedFactor: 0.02,
            phase: cfg.phase,
          });
        });
      } else {
        // Desktop (>= 768px): 18 random particles
        const particleCount = 18;
        for (let i = 0; i < particleCount; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          particles.push({
            x: rx,
            y: ry,
            baseX: rx,
            baseY: ry,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            size: Math.random() * 6 + 3,
            type: types[Math.floor(Math.random() * types.length)],
            color: desktopColors[Math.floor(Math.random() * desktopColors.length)],
            speedFactor: Math.random() * 0.05 + 0.02,
          });
        }
      }
    };

    initParticles();

    // Resize canvas handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    // Mouse move handler on parent section (Desktop pointer devices only)
    const handleMouseMove = (e: MouseEvent) => {
      if (width < 768) return;
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove, { passive: true });
      parent.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // Draw helpers
    const drawPlus = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const len = size / 2;
      c.beginPath();
      c.moveTo(x - len, y);
      c.lineTo(x + len, y);
      c.moveTo(x, y - len);
      c.lineTo(x, y + len);
      c.stroke();
    };

    const drawSquare = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const side = size / 2;
      c.strokeRect(x - side, y - side, size, size);
    };

    const drawCircle = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.arc(x, y, size / 2, 0, Math.PI * 2);
      c.stroke();
    };

    let startTime = performance.now();

    // Animation loop
    const animate = (timestamp: number) => {
      if (!visible) return;

      const isMobile = width < 768;
      const elapsed = (timestamp - startTime) * 0.001;

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        if (isMobile && p.phase !== undefined) {
          // Mobile (< 768px): Controlled slow floating sine drift (max 4px-5px offset §6)
          p.x = p.baseX + Math.cos(elapsed * 0.8 + p.phase) * 3;
          p.y = p.baseY + Math.sin(elapsed * 1.1 + p.phase) * 4.5;
        } else {
          // Desktop (>= 768px): Free drift & mouse repulsion
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          if (mouse.x > -500 && mouse.y > -500) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            const forceRadius = 180;

            if (dist < forceRadius) {
              const force = (forceRadius - dist) / forceRadius;
              const angle = Math.atan2(dy, dx);
              const targetX = p.x - Math.cos(angle) * force * 20;
              const targetY = p.y - Math.sin(angle) * force * 20;
              p.x += (targetX - p.x) * p.speedFactor;
              p.y += (targetY - p.y) * p.speedFactor;
            }
          }
        }

        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.lineWidth = 1;

        if (p.type === "plus") {
          drawPlus(ctx, p.x, p.y, p.size);
        } else if (p.type === "circle") {
          drawCircle(ctx, p.x, p.y, p.size);
        } else if (p.type === "square") {
          drawSquare(ctx, p.x, p.y, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2 || 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const setRunning = (run: boolean) => {
      if (run && !visible) {
        visible = true;
        startTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      } else if (!run) {
        visible = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
      { threshold: 0 },
    );
    observer.observe(canvas);

    const handleVisibility = () => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMaroon]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
