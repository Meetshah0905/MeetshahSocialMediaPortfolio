"use client";

import { useState } from "react";

const WORKFLOW_STEPS = [
  { step: "01", name: "CONCEPT", desc: "campaign angle and audience problem" },
  { step: "02", name: "SCRIPT", desc: "hook, structure and CTA" },
  { step: "03", name: "SHOOT", desc: "creator-led footage and product detail" },
  { step: "04", name: "EDIT", desc: "captions, pacing and visual rhythm" },
  { step: "05", name: "DELIVER", desc: "platform-ready final assets" },
];

type ProductionWorkflowProps = {
  activeStep?: number;
};

export function ProductionWorkflow({ activeStep = 1 }: ProductionWorkflowProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div aria-label="UGC Production Workflow" className="w-full">
      {/* Desktop Vertical Timeline Rail */}
      <div className="hidden lg:flex flex-col space-y-6 relative pl-6">
        {/* Thin vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-border/80" />

        {WORKFLOW_STEPS.map((stg, idx) => {
          const isCurrent = idx === activeStep;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={stg.step}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-current={isCurrent ? "step" : undefined}
              className="relative group text-left cursor-pointer transition-all duration-200"
            >
              {/* Marker Dot */}
              <div
                className={`absolute -left-[27px] top-1 size-3.5 rounded-full border transition-all duration-300 ${
                  isCurrent || isHovered
                    ? "bg-blue border-blue scale-125 shadow-xs"
                    : "bg-white border-border group-hover:border-blue/40"
                }`}
              />

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs font-bold transition-colors ${
                      isCurrent || isHovered ? "text-blue" : "text-muted"
                    }`}
                  >
                    {stg.step}
                  </span>
                  <span
                    className={`font-heading text-xs font-bold uppercase tracking-wider transition-colors ${
                      isCurrent || isHovered ? "text-blue" : "text-ink"
                    }`}
                  >
                    {stg.name}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-snug">
                  {stg.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Horizontal Sequence */}
      <div className="lg:hidden flex overflow-x-auto gap-4 py-2 border-y border-border/60 scrollbar-none">
        {WORKFLOW_STEPS.map((stg, idx) => {
          const isCurrent = idx === activeStep;
          return (
            <div
              key={stg.step}
              aria-current={isCurrent ? "step" : undefined}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 text-xs font-mono"
            >
              <span className={isCurrent ? "text-blue font-bold" : "text-muted"}>
                {stg.step}
              </span>
              <span className={isCurrent ? "text-blue font-bold uppercase" : "text-ink font-semibold uppercase"}>
                {stg.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
