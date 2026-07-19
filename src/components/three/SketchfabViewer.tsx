"use client";

import { useState, useEffect, useRef } from "react";
import { SketchfabModelConfig } from "@/content/sketchfabModels";
import { Loader2 } from "lucide-react";

type SketchfabViewerProps = {
  model: SketchfabModelConfig;
  className?: string;
};

export default function SketchfabViewer({ model, className }: SketchfabViewerProps) {
  const [isInViewport, setIsInViewport] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const initialMatch = mediaQuery.matches;
      
      requestAnimationFrame(() => {
        setReducedMotion(initialMatch);
      });

      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const embedUrl = `${model.embedUrl}?autostart=1&autospin=${
    reducedMotion ? "0" : "0.15"
  }&preload=1&transparent=1&ui_hint=0&ui_infos=0&ui_controls=0&ui_watermark=0&ui_stop=0`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-white shadow-soft flex items-center justify-center ${className}`}
    >
      {/* Intersection Trigger or Skeleton */}
      {!isInViewport && (
        <div className="absolute inset-0 flex items-center justify-center text-muted">
          <Loader2 className="size-6 animate-spin text-blue" />
        </div>
      )}

      {/* Real iframe once in viewport */}
      {isInViewport && (
        <>
          {/* Loading placeholder spinner until iframe triggers load */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <Loader2 className="size-6 animate-spin text-blue" />
            </div>
          )}

          <iframe
            title={`Sketchfab 3D Model: ${model.label}`}
            src={embedUrl}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="false"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full border-none transition-opacity duration-500 pointer-events-auto ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      )}
    </div>
  );
}
