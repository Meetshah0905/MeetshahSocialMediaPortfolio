"use client";

import { useState } from "react";
import { Play, ExternalLink, RefreshCw } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { UGCInstagramReel } from "@/content/ugcInstagramReels";
import { InstagramEmbed } from "./InstagramEmbed";
import { Badge } from "@/components/ui/Badge";

type InstagramReelStageProps = {
  reel: UGCInstagramReel;
};

export function InstagramReelStage({ reel }: InstagramReelStageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Reset play/error state when the selected reel changes — done during
  // render (React's documented pattern) rather than in an effect.
  const [lastReelId, setLastReelId] = useState(reel.id);
  if (lastReelId !== reel.id) {
    setLastReelId(reel.id);
    setIsPlaying(false);
    setHasError(false);
  }

  const handlePlayClick = () => {
    setHasError(false);
    setIsPlaying(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setIsPlaying(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[380px] mx-auto">
      {/* Offset outline depth box */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 border border-blue/20 rounded-lg -z-10 bg-surface-soft/40" />

      {/* Production Video Frame with Cut-Corner polygon crop */}
      <div
        className="relative w-full aspect-[9/16] bg-black border border-border overflow-hidden shadow-md transition-all duration-300"
        style={{
          clipPath:
            "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        }}
      >
        {/* Top Production Camera Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-3 flex items-center justify-between text-[9px] font-mono text-white/90">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="size-2 rounded-full bg-blue animate-pulse" />
            <span className="text-blue uppercase tracking-wider">● INSTAGRAM</span>
          </div>
          <span className="font-mono tracking-wider font-bold">
            UGC REEL {reel.index}
          </span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
            9:16 FORMAT
          </span>
        </div>

        {/* Active Embed Player */}
        {isPlaying ? (
          <InstagramEmbed
            url={reel.url}
            shortcode={reel.shortcode}
            onEmbedError={() => setHasError(true)}
          />
        ) : (
          /* Preview Mode Stage — real reel frame with a play affordance */
          <div className="relative w-full h-full bg-ink flex flex-col justify-between text-white text-center">
            {reel.thumbnail ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={reel.thumbnail}
                alt={`Preview frame of ${reel.fallbackTitle}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#0d1527] to-ink" />
            )}
            {/* Legibility scrim over the frame */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/75" />

            {/* Center play affordance */}
            <div className="relative my-auto space-y-4 flex flex-col items-center px-6">
              <div className="space-y-1">
                <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/20 text-[8px] font-mono font-bold uppercase tracking-wider">
                  INSTAGRAM REEL · {reel.shortcode}
                </Badge>
                <h4 className="font-heading text-sm font-bold text-white pt-1 drop-shadow-md">
                  {reel.authoredAnalysis?.headline || reel.fallbackTitle}
                </h4>
              </div>

              <button
                onClick={handlePlayClick}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue text-white font-mono text-xs font-bold hover:bg-blue-light hover:scale-105 transition-all duration-300 shadow-xl group"
                aria-label={`Play ${reel.fallbackTitle}`}
              >
                <Play className="size-4 fill-current translate-x-0.5" />
                <span>View Reel</span>
              </button>
            </div>

            {/* Bottom Platform Status */}
            <div className="relative flex justify-between items-center text-[8px] font-mono text-white/70 p-4 pt-3 border-t border-white/10 uppercase">
              <span>CREATOR ORIGINAL</span>
              <span>NO AUTO-PLAY</span>
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-light hover:underline flex items-center gap-1 font-bold"
              >
                <span>INSTAGRAM.COM</span>
                <ExternalLink className="size-2.5" />
              </a>
            </div>
          </div>
        )}

        {/* Fallback Card Overlay if Embed Fails */}
        {hasError && (
          <div className="absolute inset-0 z-40 bg-ink/95 p-6 flex flex-col items-center justify-center text-center space-y-4 text-white">
            <InstagramIcon className="size-10 text-blue" />
            <div className="space-y-1">
              <p className="font-heading text-sm font-bold">
                This Reel could not be loaded inside the page.
              </p>
              <p className="text-[11px] text-white/70 leading-relaxed font-mono">
                Instagram permissions or browser settings restrict inline playback.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[220px] pt-2 font-mono text-xs">
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue text-white font-bold hover:bg-blue-light transition-colors"
              >
                <ExternalLink className="size-3.5" />
                Open Reel on Instagram
              </a>
              <button
                onClick={handleRetry}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors"
              >
                <RefreshCw className="size-3.5" />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
