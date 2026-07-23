"use client";

import { UGCInstagramReel } from "@/content/ugcInstagramReels";

type ReelReviewTimelineProps = {
  reel: UGCInstagramReel;
};

export function ReelReviewTimeline({ reel }: ReelReviewTimelineProps) {
  const analysis = reel.authoredAnalysis;

  const STEPS = [
    {
      step: "01",
      label: "OPENING",
      text: analysis?.hook || "Review the Reel’s opening visual and first spoken line.",
    },
    {
      step: "02",
      label: "CONTEXT",
      text: analysis?.context || "Observe how the product, problem or situation is introduced.",
    },
    {
      step: "03",
      label: "CORE MESSAGE",
      text: analysis?.value || "Review the principal information or demonstration.",
    },
    {
      step: "04",
      label: "CREATOR DELIVERY",
      text: analysis?.proof || "Observe pacing, visual presentation and creator-led communication.",
    },
    {
      step: "05",
      label: "ACTION",
      text: analysis?.action || "Review the final audience instruction or closing frame.",
    },
  ];

  return (
    <div className="space-y-6 text-left w-full">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest">
          PRODUCTION REVIEW TIMELINE
        </span>
        <span className="text-[10px] font-mono text-muted uppercase font-bold">
          5-STAGE STRUCTURE
        </span>
      </div>

      {/* Connected Vertical Timeline */}
      <div className="relative pl-6 space-y-5">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border/80" />

        {STEPS.map((stg, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === STEPS.length - 1;

          return (
            <div key={stg.step} className="relative group">
              {/* Timeline Marker Dot */}
              <div
                className={`absolute -left-[27px] top-1 size-5 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold transition-all duration-300 ${
                  isFirst
                    ? "bg-blue text-white border-blue shadow-xs"
                    : isLast
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-muted border-border group-hover:border-blue/40"
                }`}
              >
                {stg.step}
              </div>

              {/* Stage Content */}
              <div className="space-y-1">
                <span
                  className={`font-heading text-xs font-bold uppercase tracking-wider block ${
                    isFirst ? "text-blue" : isLast ? "text-emerald-600" : "text-ink"
                  }`}
                >
                  {stg.step} — {stg.label}
                </span>

                <p className="text-xs text-body leading-relaxed">
                  {stg.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Neutral Review Disclosure Note */}
      <div className="p-3 rounded-lg bg-surface-soft border border-border/80 text-[10px] font-mono text-muted">
        ℹ️ Detailed breakdown will be added only after the Reel has been reviewed.
      </div>
    </div>
  );
}
