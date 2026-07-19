"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils/cn";

/**
 * User-facing error surface (§34).
 *
 * Takes a `message` that is already safe to display — §33 forbids leaking
 * stack traces or internal detail, so callers pass a curated string rather
 * than an Error object.
 */
export function ErrorState({
  heading = "Something went wrong.",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
}: {
  heading?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-card border border-danger/20 bg-danger/5 px-6 py-10 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-danger/10 text-danger"
      >
        <AlertTriangle className="size-5" />
      </div>

      <h2 className="text-h3">{heading}</h2>
      <p className="mx-auto mt-3 max-w-[52ch] text-body">{message}</p>

      {onRetry && (
        <div className="mt-6 flex justify-center">
          <Button onClick={onRetry} variant="outline">
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
