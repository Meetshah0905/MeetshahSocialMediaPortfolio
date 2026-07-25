"use client";

import Image from "next/image";
import { UGCInstagramReel } from "@/content/ugcInstagramReels";

type StoryboardStripProps = {
  reel?: UGCInstagramReel;
};

export function StoryboardStrip({ reel }: StoryboardStripProps) {
  const analysis = reel?.authoredAnalysis;

  const FRAMES = [
    {
      num: "01",
      timing: "0-3s",
      label: "Opening Hook",
      note: analysis?.hook || "Visual & verbal hook composition",
      tag: "TYPOGRAPHY SAFE ZONE",
      objectPos: "object-top",
    },
    {
      num: "02",
      timing: "3-12s",
      label: "Audience Context",
      note: analysis?.context || "Creator introduction & situation",
      tag: "SILHOUETTE GUIDE",
      objectPos: "object-center",
    },
    {
      num: "03",
      timing: "12-30s",
      label: "Core Value & Demo",
      note: analysis?.value || "Product demonstration & value prop",
      tag: "PRODUCT FRAMING",
      objectPos: "object-center",
    },
    {
      num: "04",
      timing: "30-45s",
      label: "Closing & CTA",
      note: analysis?.action || "Call-to-Action & discount sticker",
      tag: "CTA SAFE ZONE",
      objectPos: "object-bottom",
    },
  ];

  return (
    <div className="space-y-3 pt-6 border-t border-border/80 w-full text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-blue animate-pulse" />
          STORYBOARD STRIP · 4-FRAME PRODUCTION DIAGRAM
        </span>
        <span className="text-[9px] font-mono text-blue font-bold uppercase">
          CAMERA SAFE ZONES
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FRAMES.map((frm) => (
          <div
            key={frm.num}
            className="relative aspect-[9/16] rounded-xl overflow-hidden border border-border/80 bg-slate-950 flex flex-col justify-between shadow-xs group hover:border-blue/50 hover:shadow-soft transition-all duration-300 select-none"
          >
            {/* Reel Frame Thumbnail Background */}
            {reel?.thumbnail ? (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={reel.thumbnail}
                  alt={`Frame ${frm.num} ${frm.label}`}
                  fill
                  sizes="200px"
                  className={`object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 ${frm.objectPos}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 opacity-90" />
            )}

            {/* Diagrammatic Grid & Camera Target Reticle Background */}
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:10px_10px] z-1" />
            <div className="absolute inset-2 border border-dashed border-white/20 pointer-events-none rounded-lg z-1 group-hover:border-blue/40 transition-colors" />

            {/* Frame Top Header */}
            <div className="relative z-10 p-2.5 flex justify-between items-center text-white text-[8px] font-mono">
              <span className="bg-blue/90 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                FRAME {frm.num} · {frm.timing}
              </span>
              <span className="font-mono text-white/60 font-bold">9:16</span>
            </div>

            {/* Diagrammatic Target Reticle Center Icon */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center space-y-1 px-2">
              <div className="size-7 rounded-full border border-white/30 bg-black/40 backdrop-blur-xs flex items-center justify-center text-[9px] font-mono text-blue-light font-bold group-hover:border-blue group-hover:scale-110 transition-all">
                {frm.num}
              </div>
              <span className="text-[7px] font-mono font-bold text-white/80 uppercase tracking-wider bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-xs">
                {frm.tag}
              </span>
            </div>

            {/* Frame Bottom Description */}
            <div className="relative z-10 p-2.5 bg-slate-950/90 backdrop-blur-xs text-white space-y-1 border-t border-white/10">
              <p className="font-heading text-[10px] font-bold leading-tight text-white group-hover:text-blue-light transition-colors">
                {frm.label}
              </p>
              <p className="text-[8px] text-white/70 line-clamp-2 font-mono leading-tight">
                {frm.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
