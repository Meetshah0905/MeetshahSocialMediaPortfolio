"use client";

import { useEffect, useState, useCallback } from "react";

export function InitialLoader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  const handleExit = useCallback(() => {
    setExiting(true);
    sessionStorage.setItem("meet_loader_shown", "true");
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 550);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    // Check if loader was already shown during this session
    const isShown = sessionStorage.getItem("meet_loader_shown");
    if (isShown) {
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 0);
      return () => clearTimeout(timer);
    }

    // Maximum safety timeout
    const timer = setTimeout(() => {
      handleExit();
    }, 1400);

    const handleLoad = () => {
      handleExit();
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, [handleExit, onComplete]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-busy="true"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#f7f7f4] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        exiting ? "opacity-0 -translate-y-12 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <div className="flex items-end gap-1.5 h-16 sm:h-20">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => (
          <div
            key={bar}
            className="w-1 bg-[#2e7bff] rounded-full origin-center"
            style={{
              height: `${45 + Math.sin(bar * 0.9) * 30}%`,
              animation: "loading-bar 1.1s ease-in-out infinite",
              animationDelay: `${bar * 70}ms`,
            }}
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes loading-bar {
          0%, 100% {
            transform: scaleY(0.35);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
