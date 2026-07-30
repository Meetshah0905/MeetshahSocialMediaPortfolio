import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "dark"
  | "light"
  | "youtube"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export const variantBaseClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 border border-blue-500/30",
  secondary:
    "bg-slate-900 text-white border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 shadow-xs",
  dark:
    "bg-[#0a0f1d] text-white border border-white/15 hover:bg-[#111827] hover:border-white/25 shadow-xs",
  light:
    "bg-white text-slate-900 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs",
  youtube:
    "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm hover:shadow-md hover:from-red-700 hover:to-red-800 border border-red-500/30",
  danger:
    "bg-red-700 text-white border border-red-600 hover:bg-red-800 shadow-xs active:bg-red-900",
};

export const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 sm:min-h-10 text-[11px] sm:text-xs px-3.5 sm:px-4 py-1.5 gap-2",
  md: "min-h-10 sm:min-h-12 text-xs sm:text-sm px-4.5 sm:px-5.5 py-2 gap-2.5",
  lg: "min-h-12 sm:min-h-14 text-sm sm:text-base px-6 sm:px-7 py-2.5 sm:py-3 gap-3",
};

export function getSharedButtonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    "group/specular relative inline-flex items-center justify-center font-semibold shrink-0 whitespace-nowrap rounded-full",
    "transition-all duration-200 ease-out select-none cursor-pointer",
    "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none",
    "aria-disabled:pointer-events-none aria-disabled:opacity-55",
    // Base variant classes
    variantBaseClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className
  );
}
