"use client";

const ITEMS = [
  "UGC VIDEOS",
  "SHORT-FORM REELS",
  "CREATIVE STRATEGY",
  "SCRIPTING",
  "VIDEO EDITING",
  "PAID USAGE OPTIONS",
];

export function UGCCapabilityStrip() {
  return (
    <div
      aria-label="UGC Capabilities Overview"
      className="w-full pt-8 border-t border-border/80 text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-6 text-[10px] sm:text-xs font-mono font-bold text-muted uppercase tracking-widest">
        {ITEMS.map((item, idx) => (
          <div key={item} className="flex items-center gap-6">
            <span className="hover:text-blue transition-colors cursor-default">
              {item}
            </span>
            {idx < ITEMS.length - 1 && (
              <span className="text-border font-normal select-none">/</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
