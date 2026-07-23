"use client";

import { ProductionStep } from "@/content/productionSteps";

type ProductionControllerProps = {
  steps: ProductionStep[];
  activeStep: ProductionStep;
  onSelectStep: (step: ProductionStep) => void;
};

export function ProductionController({
  steps,
  activeStep,
  onSelectStep,
}: ProductionControllerProps) {
  const activeIndex = steps.findIndex((s) => s.id === activeStep.id);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % steps.length;
      onSelectStep(steps[nextIndex]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + steps.length) % steps.length;
      onSelectStep(steps[prevIndex]);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="UGC Campaign Production Steps"
      className="w-full pt-8 pb-4 text-left relative"
    >
      {/* Desktop Connected Horizontal Timeline */}
      <div className="relative flex items-center justify-between w-full max-w-[1440px] mx-auto px-2">
        {/* Continuous Horizontal Background Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-border/80 -z-10" />

        {/* Active Animated Progress Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-blue -z-10 transition-all duration-500 ease-out"
          style={{
            width: `${(activeIndex / (steps.length - 1)) * 92}%`,
          }}
        />

        {steps.map((stg, idx) => {
          const isActive = stg.id === activeStep.id;

          return (
            <button
              key={stg.id}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? "step" : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectStep(stg)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-full border transition-all duration-300 bg-white ${
                isActive
                  ? "border-blue text-ink shadow-xs scale-105"
                  : "border-border/80 text-muted hover:border-blue/30 hover:text-ink"
              }`}
            >
              <span
                className={`font-mono text-xs sm:text-sm font-bold transition-colors ${
                  isActive ? "text-blue" : "text-muted"
                }`}
              >
                {stg.index}
              </span>
              <span
                className={`font-heading text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                  isActive ? "text-ink" : "text-body"
                }`}
              >
                {stg.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
