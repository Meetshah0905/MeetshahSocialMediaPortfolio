"use client";

export function StoryboardAnnotations() {
  const ANNOTATIONS = [
    {
      id: "hook",
      label: "HOOK / FIRST 3 SEC",
      desc: "High-retention text & verbal hook",
      position: "top-[-16px] left-[-20px] lg:top-[-20px] lg:left-[-30px]",
    },
    {
      id: "broll",
      label: "B-ROLL / PRODUCT DETAIL",
      desc: "Close-up physical demonstration",
      position: "top-[25%] right-[-20px] lg:right-[-35px]",
    },
    {
      id: "captions",
      label: "CAPTIONS / SAFE ZONE",
      desc: "Platform-optimized typography",
      position: "bottom-[28%] left-[-20px] lg:left-[-35px]",
    },
    {
      id: "cta",
      label: "CTA / FINAL FRAME",
      desc: "Campaign brief action target",
      position: "bottom-[-16px] right-[-20px] lg:bottom-[-20px] lg:right-[-20px]",
    },
  ];

  return (
    <>
      {/* Desktop Floating Annotations */}
      <div className="hidden lg:block pointer-events-none">
        {ANNOTATIONS.map((ann) => (
          <div
            key={ann.id}
            className={`absolute z-30 ${ann.position} bg-white/95 backdrop-blur-md border border-border/80 px-3 py-1.5 rounded-lg shadow-soft text-left animate-in fade-in duration-500`}
          >
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-blue" />
              <span className="text-[9px] font-mono font-bold text-ink uppercase tracking-wider">
                {ann.label}
              </span>
            </div>
            <p className="text-[9px] text-muted font-mono leading-none mt-0.5">
              {ann.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Inline Annotation Bar */}
      <div className="lg:hidden flex flex-wrap gap-2 pt-3 justify-center text-[9px] font-mono">
        <span className="px-2.5 py-1 rounded bg-surface-soft border border-border text-ink font-bold">
          • HOOK / FIRST 3 SEC
        </span>
        <span className="px-2.5 py-1 rounded bg-surface-soft border border-border text-ink font-bold">
          • B-ROLL / PRODUCT DETAIL
        </span>
      </div>
    </>
  );
}
