"use client";

import { UGCConcept } from "@/content/ugcConcepts";

type ProductionTimelineProps = {
  concept: UGCConcept;
};

export function ProductionTimeline({ concept }: ProductionTimelineProps) {
  return (
    <div className="space-y-6 text-left w-full">
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <span className="text-[10px] font-mono font-bold text-blue uppercase tracking-widest">
          PRODUCTION SCRIPT & TIMELINE
        </span>
        <span className="text-[10px] font-mono text-muted uppercase font-bold">
          5-STAGE STRUCTURE
        </span>
      </div>

      {/* Connected Vertical Script Timeline */}
      <div className="relative pl-6 space-y-6">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-border/80" />

        {concept.structure.map((item, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === concept.structure.length - 1;

          return (
            <div key={item.step} className="relative group">
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
                {item.step}
              </div>

              {/* Stage Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-heading text-xs font-bold uppercase tracking-wider ${
                      isFirst ? "text-blue" : isLast ? "text-emerald-600" : "text-ink"
                    }`}
                  >
                    {item.step} — {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-muted font-bold">
                    {item.time}
                  </span>
                </div>

                {isFirst ? (
                  <p className="text-xs font-heading font-bold text-ink italic bg-blue/5 border-l-2 border-blue p-2.5 rounded-r">
                    {concept.hook}
                  </p>
                ) : isLast ? (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 p-2.5 rounded text-xs text-emerald-800 font-semibold">
                    {concept.cta}
                  </div>
                ) : (
                  <p className="text-xs text-body leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
