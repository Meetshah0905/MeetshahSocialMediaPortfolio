"use client";

import { useState, useEffect } from "react";
import { ExternalLink, AlertCircle, RefreshCw } from "lucide-react";

type InstagramEmbedProps = {
  url: string;
  shortcode: string;
  onEmbedError: () => void;
};

export function InstagramEmbed({ url, shortcode, onEmbedError }: InstagramEmbedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  // Reset per-URL state during render (React's documented pattern) instead of
  // synchronously inside the effect, which triggers a cascading re-render.
  const [lastUrl, setLastUrl] = useState(url);
  if (lastUrl !== url) {
    setLastUrl(url);
    setLoading(true);
    setError(false);
    setHtmlContent(null);
  }

  useEffect(() => {
    let isMounted = true;

    fetch(`/api/instagram-oembed?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Embed request failed");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data.error || !data.html) {
          setError(true);
          onEmbedError();
        } else {
          setHtmlContent(data.html);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError(true);
        onEmbedError();
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url, onEmbedError]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-surface-soft border border-border rounded-xl space-y-4">
        <AlertCircle className="size-8 text-muted" />
        <div className="space-y-1">
          <p className="font-heading text-xs font-bold text-ink">
            This Reel could not be loaded inside the page.
          </p>
          <p className="text-[11px] text-muted leading-relaxed">
            Content may be restricted or requires viewing on Instagram.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue text-white font-mono text-xs font-bold hover:bg-blue-deep transition-colors"
          >
            <ExternalLink className="size-3.5" />
            Open Reel on Instagram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden flex flex-col items-center justify-center">
      {loading && (
        <div className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center space-y-3 text-white">
          <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-white/80 animate-pulse">Loading Reel…</p>
        </div>
      )}

      {htmlContent && (
        <iframe
          src={`https://www.instagram.com/p/${shortcode}/embed/`}
          title={`Instagram Reel ${shortcode}`}
          allowFullScreen
          onLoad={() => setLoading(false)}
          className="w-full h-full border-none rounded-xl"
        />
      )}
    </div>
  );
}
