"use client";

import { UGCInstagramReel } from "@/content/ugcInstagramReels";

type InstagramReelSelectorProps = {
  reels: UGCInstagramReel[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function InstagramReelSelector({
  reels,
  activeId,
  onSelect,
}: InstagramReelSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % reels.length;
      onSelect(reels[nextIndex].id);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + reels.length) % reels.length;
      onSelect(reels[prevIndex].id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="UGC Instagram Reels"
      className="space-y-2.5 w-full text-left"
    >
      {reels.map((reel, idx) => {
        const isActive = reel.id === activeId;
        const displayTitle =
          reel.authoredAnalysis?.headline || reel.fallbackTitle;

        return (
          <button
            key={reel.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(reel.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 relative group flex items-start gap-3.5 ${
              isActive
                ? "bg-surface-soft border-blue/40 shadow-xs translate-x-1"
                : "bg-white border-border/80 hover:border-blue/20 opacity-80 hover:opacity-100"
            }`}
          >
            {/* Active Left Line Indicator */}
            <div
              className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r transition-all duration-300 ${
                isActive ? "bg-blue" : "bg-transparent group-hover:bg-blue/30"
              }`}
            />

            {/* Reel thumbnail — the real frame, so the list reads as videos */}
            {reel.thumbnail ? (
              <span className="relative block w-10 h-[71px] shrink-0 rounded-md overflow-hidden border border-border bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reel.thumbnail}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <span
                  className={`absolute inset-0 transition-opacity ${
                    isActive ? "opacity-0" : "bg-black/25 opacity-100"
                  }`}
                />
              </span>
            ) : (
              <span
                className={`font-mono text-xs font-bold transition-colors ${
                  isActive ? "text-blue" : "text-muted"
                }`}
              >
                {reel.index}
              </span>
            )}

            {/* Reel Title & Metadata */}
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={`font-heading text-xs sm:text-sm font-bold truncate transition-colors ${
                    isActive ? "text-ink" : "text-body"
                  }`}
                >
                  {displayTitle}
                </h3>
                <span className="text-[8px] font-mono font-bold text-muted uppercase tracking-wider shrink-0">
                  INSTAGRAM
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted truncate">
                Instagram · View creative
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
