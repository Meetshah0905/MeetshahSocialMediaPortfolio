"use client";

import { useEffect, useRef } from "react";

type HeroParticlesProps = {
  theme?: "maroon" | "blue";
};

export default function HeroParticles({ theme = "maroon" }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isMaroon = theme === "maroon";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Decorative only — skip entirely for reduced-motion users.
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
    }

    const particles: Particle[] = [];
    const particleCount = 18;

    const colors = isMaroon
      ? [
          "rgba(255, 255, 255, 0.30)",
          "rgba(255, 255, 255, 0.50)",
          "rgba(244, 114, 182, 0.45)",
          "rgba(225, 29, 72, 0.45)",
        ]
      : [
          "rgba(255, 255, 255, 0.20)",
          "rgba(255, 255, 255, 0.35)",
          "rgba(56, 189, 248, 0.35)",
          "rgba(47, 120, 255, 0.45)",
        ];

    const types: Particle["type"][] = ["plus", "dot", "circle", "square"];

    // Initialize particles
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
        color: colors[Math.floor(Math.random() * colors.length)],
        speedFactor: Math.random() * 0.05 + 0.02,
      });
    }

    // Resize canvas handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse move handler on parent section
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    // Attach event listeners to the parent section
    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    // Draw helper functions
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

    // Animation loop
    const animate = () => {
      if (!visible) return; // parked — restarted by the observer

      // Lerp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Drift position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Repel from mouse pointer
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

        // Render particle shape
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
          ctx.arc(p.x, p.y, p.size / 4 || 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Park the loop whenever the hero leaves the viewport or the tab hides.
    const setRunning = (run: boolean) => {
      if (run && !visible) {
        visible = true;
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

    animate();

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
