"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import gsap from "gsap";
import { getYouTubeThumbnail, getYouTubeFallbackThumbnail } from "@/content/portfolioShorts";
import { UGCConcept } from "@/content/ugcConcepts";
import { Badge } from "@/components/ui/Badge";

type CreativeVideoStageProps = {
  concept: UGCConcept;
  onPlayClick: (btnElement: HTMLButtonElement | null) => void;
};

export function CreativeVideoStage({ concept, onPlayClick }: CreativeVideoStageProps) {
  const [hasFailedThumb, setHasFailedThumb] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const src = hasFailedThumb
    ? getYouTubeFallbackThumbnail(concept.videoId)
    : getYouTubeThumbnail(concept.videoId);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!frameRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    gsap.to(frameRef.current, {
      x: x * 5,
      y: y * 5,
      scale: 1.008,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!frameRef.current) return;
    gsap.to(frameRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full max-w-[380px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Offset outline depth box */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 border border-blue/20 rounded-lg -z-10 bg-surface-soft/40" />

      {/* Production Video Frame with Cut-Corner polygon crop */}
      <div
        ref={frameRef}
        className="relative w-full aspect-[9/16] bg-black border border-border overflow-hidden shadow-md transition-all duration-300"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        {/* Top Production Camera Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-[9px] font-mono text-white/90">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="size-2 rounded-full bg-blue animate-pulse" />
            <span className="text-blue uppercase">REC</span>
          </div>
          <span className="font-mono tracking-widest">00:00:03</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
            9:16
          </span>
        </div>

        {/* Thumbnail Image */}
        <Image
          src={src}
          alt={`Video thumbnail for ${concept.title}`}
          fill
          priority
          onError={() => setHasFailedThumb(true)}
          sizes="(max-width: 768px) 85vw, 380px"
          className="object-cover rounded-sm"
        />

        {/* Card Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Play Button Trigger */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button
            onClick={(e) => onPlayClick(e.currentTarget)}
            className="size-16 rounded-full bg-blue text-white flex items-center justify-center shadow-xl hover:scale-110 hover:bg-blue-light transition-all duration-300 group"
            aria-label={`Play ${concept.title}`}
          >
            <Play className="size-7 fill-current translate-x-0.5" />
          </button>
        </div>

        {/* Bottom Production Status Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 text-white space-y-2">
          <Badge className="bg-blue/80 text-white border-transparent text-[8px] font-bold uppercase tracking-wider">
            {concept.duration}
          </Badge>

          <p className="font-heading text-xs font-bold line-clamp-2 leading-snug">
            {concept.title}
          </p>

          <div className="flex justify-between items-center text-[8px] font-mono text-white/70 pt-1 border-t border-white/10 uppercase">
            <span>HOOK</span>
            <span>VOICE</span>
            <span>B-ROLL</span>
            <span>CAPTIONS</span>
            <span className="text-blue font-bold">CTA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
