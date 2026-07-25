"use client";

import { ProductionStep } from "@/content/productionSteps";

type ActiveProductionNoteProps = {
  activeStep: ProductionStep;
};

export function ActiveProductionNote({ activeStep }: ActiveProductionNoteProps) {
  return (
    <div
      aria-live="polite"
      className="relative sm:absolute left-0 sm:left-6 bottom-0 sm:bottom-20 lg:left-8 lg:bottom-22 z-30 w-full sm:w-[380px] lg:w-[420px] bg-white/95 backdrop-blur-md border border-border/90 rounded-xl p-3.5 sm:p-4 shadow-xl text-left transition-all duration-300 mt-3 sm:mt-0"
    >
      <div key={activeStep.id} className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue" />
          <span className="font-mono text-xs font-bold text-blue uppercase tracking-wider">
            {activeStep.index} / {activeStep.title}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-body leading-relaxed">
          {activeStep.description}
        </p>
      </div>
    </div>
  );
}
