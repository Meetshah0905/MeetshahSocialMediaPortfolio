"use client";

import { UGCConcept } from "@/content/ugcConcepts";

type CreativeLabSelectorProps = {
  concepts: UGCConcept[];
  activeId: string;
  onSelect: (id: UGCConcept["id"]) => void;
};

export function CreativeLabSelector({ concepts, activeId, onSelect }: CreativeLabSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % concepts.length;
      onSelect(concepts[nextIndex].id);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + concepts.length) % concepts.length;
      onSelect(concepts[prevIndex].id);
    }
  };

  return (
    <div role="tablist" aria-label="UGC Concept Modes" className="space-y-3 w-full">
      {concepts.map((concept, idx) => {
        const isActive = concept.id === activeId;
        return (
          <button
            key={concept.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(concept.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 relative group flex items-start gap-4 ${
              isActive
                ? "bg-surface-soft border-blue/40 shadow-xs translate-x-1"
                : "bg-white border-border/80 hover:border-blue/20 opacity-75 hover:opacity-100"
            }`}
          >
            {/* Active Indicator Line */}
            <div
              className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r transition-all duration-300 ${
                isActive ? "bg-blue" : "bg-transparent group-hover:bg-blue/30"
              }`}
            />

            {/* Index Number */}
            <span
              className={`font-mono text-xs sm:text-sm font-bold transition-colors ${
                isActive ? "text-blue" : "text-muted"
              }`}
            >
              {concept.index}
            </span>

            {/* Mode Title & Meta */}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={`font-heading text-sm sm:text-base font-bold transition-colors ${
                    isActive ? "text-ink" : "text-body"
                  }`}
                >
                  {concept.id === "product-education"
                    ? "Product Education"
                    : concept.id === "app-walkthrough"
                    ? "App Walkthrough"
                    : "Creator Testimonial"}
                </h3>
                <span className="text-[9px] font-mono font-bold text-muted uppercase tracking-wider">
                  {concept.duration}
                </span>
              </div>
              <p className="text-xs text-body leading-relaxed line-clamp-2">
                {concept.objective}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
