"use client";

import { ProductionStep } from "@/content/productionSteps";

type ActiveProductionNoteProps = {
  activeStep: ProductionStep;
};

export function ActiveProductionNote({ activeStep }: ActiveProductionNoteProps) {
  return (
    <div
      aria-live="polite"
      className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 lg:left-8 lg:bottom-8 z-30 max-w-[calc(100%-2rem)] w-full sm:w-[380px] lg:w-[420px] bg-white/95 backdrop-blur-md border border-border/90 rounded-xl p-3.5 sm:p-4 shadow-xl text-left transition-all duration-300"
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
