"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import type { RecruitmentRole } from "@/config/recruitment";
import { tallyHiddenFields } from "@/config/recruitment";

/**
 * Tally embed (§5 of the recruitment prompt).
 *
 * Uses Tally's official widget script — it walks every `data-tally-src`
 * iframe on the page, sets its `src`, and wires the postMessage-based
 * auto-resize. The script is loaded once and re-invoked on role change via
 * `Tally.loadEmbeds()`, so the second form doesn't need a second script tag.
 *
 * Behaviour we lean on:
 *  - dynamicHeight=1  → auto-resize (no fixed height that clips questions)
 *  - alignLeft=1      → questions flush left inside our container
 *  - hideTitle=1      → we render the panel heading ourselves
 *  - transparentBackground=1 → sits on our card background, not Tally's
 */

const TALLY_SCRIPT_SRC = "https://tally.so/widgets/embed.js";

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

/**
 * Ensure the Tally script is present exactly once. If a previous <script>
 * already exists (e.g. React StrictMode dev remount), reuse it — Tally is
 * idempotent, but a duplicate <script> tag can double-fire its init.
 */
function loadTallyScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("no window"));
      return;
    }
    if (window.Tally) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TALLY_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("script failed")), { once: true });
      // Script may already be loaded but Tally not yet global — poll briefly.
      if (window.Tally) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = TALLY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("script failed"));
    document.body.appendChild(script);
  });
}

function buildTallySrc(formId: string, hidden: Record<string, string>): string {
  const params = new URLSearchParams({
    alignLeft: "1",
    hideTitle: "1",
    transparentBackground: "1",
    dynamicHeight: "1",
    ...hidden,
  });
  return `https://tally.so/embed/${formId}?${params.toString()}`;
}

type Status = "idle" | "loading" | "ready" | "error";

export function TallyEmbed({ role }: { role: RecruitmentRole }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);

  const hasFormId = role.formId.length > 0;
  const src = hasFormId ? buildTallySrc(role.formId, tallyHiddenFields(role.slug)) : "";

  // Reset back to "loading" whenever the role or retry attempt changes — done
  // during render (React's documented pattern) instead of inside the effect,
  // so we avoid the cascading re-render that a synchronous effect-setState
  // would trigger.
  const [trackedKey, setTrackedKey] = useState(`${role.slug}:${attempt}`);
  const currentKey = `${role.slug}:${attempt}`;
  if (currentKey !== trackedKey) {
    setTrackedKey(currentKey);
    setStatus(hasFormId ? "loading" : "idle");
  }

  useEffect(() => {
    if (!hasFormId) return;
    let cancelled = false;

    loadTallyScript()
      .then(() => {
        if (cancelled) return;
        // Give the iframe a tick to mount before asking Tally to load embeds.
        setTimeout(() => {
          if (cancelled) return;
          window.Tally?.loadEmbeds();
          setStatus("ready");
        }, 0);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [role.slug, role.formId, hasFormId, attempt]);

  // --- Missing configuration (dev-only detailed hint; prod-safe fallback) ---
  if (!hasFormId) {
    return (
      <div className="rounded-card border border-border bg-surface-soft px-6 py-10 text-center">
        <p className="text-sm text-body">
          {process.env.NODE_ENV === "development"
            ? `Tally form configuration is missing for this role. Add NEXT_PUBLIC_TALLY_${role.slug === "video-editor" ? "VIDEO_EDITOR" : "VIDEOGRAPHER"}_FORM_ID to .env.local.`
            : "Applications for this role are temporarily unavailable. Please return shortly."}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Reserved height avoids layout shift while the iframe boots. */}
      <div className="min-h-[520px]">
        {status === "loading" && <FormSkeleton />}

        {status === "error" ? (
          <FormError src={src} onRetry={() => setAttempt((n) => n + 1)} />
        ) : (
          <iframe
            ref={iframeRef}
            // The single iframe swaps content on role change via `key`, which
            // is cheaper than tearing down and re-adding the script.
            key={role.slug}
            data-tally-src={src}
            loading="lazy"
            width="100%"
            height="520"
            frameBorder={0}
            title={role.iframeTitle}
            className={`w-full transition-opacity duration-300 ${
              status === "ready" ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-pulse space-y-4 rounded-control-lg border border-border bg-surface-soft p-6"
    >
      <span className="sr-only">Loading application form…</span>
      <div className="h-6 w-2/3 rounded bg-border" />
      <div className="h-4 w-full rounded bg-border" />
      <div className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-1/4 rounded bg-border" />
            <div className="h-10 w-full rounded-md bg-border/70" />
          </div>
        ))}
      </div>
      <div className="h-11 w-40 rounded-full bg-border" />
    </div>
  );
}

function FormError({ src, onRetry }: { src: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-card border border-danger/20 bg-danger/5 px-6 py-10 text-center"
    >
      <div
        aria-hidden
        className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-danger/10 text-danger"
      >
        <AlertTriangle className="size-5" />
      </div>
      <h3 className="text-h3">The application form could not be loaded.</h3>
      <p className="mx-auto mt-3 max-w-[52ch] text-sm text-body">
        Check your connection and try again, or open the form in a new tab.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
        >
          <RefreshCw className="size-4" aria-hidden />
          Try Again
        </button>
        {src && (
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:brightness-110"
          >
            Open Form in New Tab
            <ExternalLink className="size-4" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
