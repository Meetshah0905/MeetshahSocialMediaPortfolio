import { cn } from "@/lib/utils/cn";

/**
 * Loading surfaces (§34).
 *
 * <Skeleton> is the building block; <LoadingState> is a labelled block-level
 * placeholder. Both announce via aria-live so screen-reader users are told
 * something is loading rather than meeting silence (§29).
 */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-control-lg bg-surface-alt",
        className,
      )}
    />
  );
}

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col gap-4", className)}
    >
      <span className="sr-only">{label}</span>
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
