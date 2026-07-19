import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Small pill label — channel tags, categories, status chips.
 *
 * Status tones carry a text label as well as colour, per §23.5's "do not rely
 * on colour alone".
 */

type Tone = "neutral" | "primary" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "border-border-strong bg-surface-soft text-body",
  primary: "border-primary-light bg-primary-pale text-primary-deep",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  danger: "border-danger/25 bg-danger/10 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
