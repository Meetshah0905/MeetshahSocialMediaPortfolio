"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeThumbnailProps {
  videoId: string;
  title: string;
  className?: string;
  aspectRatio?: "16:9" | "9:16";
  priority?: boolean;
}

export function YouTubeThumbnail({
  videoId,
  title,
  className = "",
  aspectRatio = "16:9",
  priority = false,
}: YouTubeThumbnailProps) {
  const [state, setState] = useState<{ id: string; index: number; error: boolean }>({
    id: videoId,
    index: 0,
    error: false,
  });

  const srcIndex = state.id === videoId ? state.index : 0;
  const hasError = state.id === videoId ? state.error : false;

  const sources = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
  ];

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setState({ id: videoId, index: srcIndex + 1, error: false });
    } else {
      setState({ id: videoId, index: srcIndex, error: true });
    }
  };

  const currentSrc = sources[srcIndex];

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-900 ${
        aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
      } ${className}`}
    >
      {!hasError ? (
        <Image
          src={currentSrc}
          alt={title || "YouTube video thumbnail"}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
        />
      ) : (
        /* Branded Fallback Visual (§8) */
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-red-950/80 p-6 flex flex-col justify-between text-white border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest text-red-500">
            <span>YOUTUBE SHOWCASE</span>
            <span>meetsofficial</span>
          </div>

          <div className="space-y-1">
            <h4 className="font-heading text-xs font-bold line-clamp-2 text-slate-100">
              {title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">ID: {videoId}</span>
          </div>
        </div>
      )}
    </div>
  );
}
