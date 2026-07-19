import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * "There is nothing here yet" — used most importantly by /analytics when no
 * report is published (§23.8).
 *
 * It shows a headline and a way forward, never zeroed-out metrics: §2 forbids
 * presenting an absence of data as though it were data.
 */
export function EmptyState({
  icon,
  heading,
  description,
  actions,
  className,
}: {
  icon?: ReactNode;
  heading: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-panel border border-border bg-surface-soft px-6 py-16 text-center md:px-12 md:py-20",
        className,
      )}
    >
      {icon && (
        <div
          aria-hidden
          className="mx-auto mb-6 grid size-14 place-items-center rounded-full bg-primary-pale text-primary-deep"
        >
          {icon}
        </div>
      )}

      <h2 className="text-h3 mx-auto max-w-[24ch]">{heading}</h2>

      {description && (
        <p className="mx-auto mt-4 max-w-[52ch] text-body">{description}</p>
      )}

      {actions && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
