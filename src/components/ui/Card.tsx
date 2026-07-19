import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Rounded card surface (§7.5): 24px standard, 32px for large editorial panels.
 *
 * `interactive` adds the lift-on-hover treatment. Use it only when the whole
 * card is a link or button — a lift that doesn't respond to a click is a lie
 * about affordance.
 */
export function Card({
  children,
  as: Tag = "div",
  tone = "default",
  size = "default",
  interactive = false,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  tone?: "default" | "soft" | "ink";
  size?: "default" | "panel";
  interactive?: boolean;
  className?: string;
}) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: React.ReactNode }>;
  return (
    <Component
      className={cn(
        "relative border shadow-card",
        size === "panel"
          ? "rounded-panel p-8 md:p-12"
          : "rounded-card p-6 md:p-8",
        tone === "default" && "border-border bg-surface",
        tone === "soft" && "border-border bg-surface-soft",
        tone === "ink" && "border-transparent bg-foreground text-white/80",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-primary-light hover:shadow-blue",
        className,
      )}
    >
      {children}
    </Component>
  );
}
