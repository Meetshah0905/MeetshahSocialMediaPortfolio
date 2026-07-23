"use client";

export function UGCTrustRow() {
  const BLOCKS = [
    {
      title: "STRATEGY",
      desc: "Concept, hook and script structure",
    },
    {
      title: "PRODUCTION",
      desc: "Creator-led filming and product visuals",
    },
    {
      title: "POST-PRODUCTION",
      desc: "Editing, captions and delivery formats",
    },
  ];

  return (
    <div
      aria-label="Creator UGC Capabilities Summary"
      className="w-full pt-6 border-t border-border/80 text-left"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {BLOCKS.map((blk, idx) => (
          <div
            key={blk.title}
            className={`space-y-1 ${
              idx < BLOCKS.length - 1 ? "md:border-r md:border-border/60 md:pr-6" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-blue" />
              <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                {blk.title}
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed font-mono">
              {blk.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
