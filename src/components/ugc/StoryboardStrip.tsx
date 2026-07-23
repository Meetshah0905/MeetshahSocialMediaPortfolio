"use client";

import { UGCInstagramReel } from "@/content/ugcInstagramReels";

type StoryboardStripProps = {
  reel?: UGCInstagramReel;
};

export function StoryboardStrip({ reel }: StoryboardStripProps) {
  const FRAMES = [
    {
      num: "01",
      label: "Opening",
      note: "Visual hook / first-frame composition",
      tag: "TYPOGRAPHY MARKS",
    },
    {
      num: "02",
      label: "Context",
      note: "Creator introduction or situation",
      tag: "SILHOUETTE GUIDE",
    },
    {
      num: "03",
      label: "Message",
      note: "Product, demonstration or core value",
      tag: "PRODUCT FRAMING",
    },
    {
      num: "04",
      label: "Closing",
      note: "Final statement or CTA",
      tag: "CTA SAFE ZONE",
    },
  ];

  return (
    <div className="space-y-3 pt-6 border-t border-border/80 w-full text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
          STORYBOARD STRIP · PRODUCTION DIAGRAMS
        </span>
        <span className="text-[9px] font-mono text-blue font-bold uppercase">
          CAMERA SAFE ZONES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FRAMES.map((frm) => (
          <div
            key={frm.num}
            className="relative aspect-[9/16] rounded-lg overflow-hidden border border-border/80 bg-surface-soft p-3 flex flex-col justify-between shadow-2xs group hover:border-blue/40 transition-colors"
          >
            {/* Diagrammatic Grid & Camera Target Reticle Background */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#09101f_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute inset-3 border border-dashed border-blue/20 pointer-events-none rounded" />

            {/* Frame Top Header */}
            <div className="relative z-10 flex justify-between items-center text-ink text-[8px] font-mono">
              <span className="bg-blue text-white px-1.5 py-0.5 rounded font-bold">
                FRAME {frm.num}
              </span>
              <span className="font-bold text-muted">9:16</span>
            </div>

            {/* Diagrammatic Target Reticle Center Icon */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-1">
              <div className="size-8 rounded-full border border-blue/30 flex items-center justify-center text-[8px] font-mono text-blue font-bold">
                {frm.num}
              </div>
              <span className="text-[7px] font-mono font-bold text-muted uppercase tracking-wider">
                {frm.tag}
              </span>
            </div>

            {/* Frame Bottom Description */}
            <div className="relative z-10 text-ink space-y-0.5 pt-2 border-t border-border/40">
              <p className="font-heading text-[10px] font-bold leading-tight">
                {frm.label}
              </p>
              <p className="text-[8px] text-muted line-clamp-2 font-mono">
                {frm.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
