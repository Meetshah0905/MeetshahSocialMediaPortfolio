import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The page gutter (§7.4): max 1280px, minimum 20px of side padding on mobile.
 */
export function Container({
  children,
  as: Tag = "div",
  size = "default",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** `narrow` is for long-form prose, where 1280px is too wide to read. */
  size?: "default" | "narrow";
  className?: string;
}) {
  const Component = Tag as React.ComponentType<{ className?: string; children?: React.ReactNode }>;
  return (
    <Component
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "narrow" ? "max-w-3xl" : "max-w-[1280px]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
