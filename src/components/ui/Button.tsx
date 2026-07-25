"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The supporting button set (§8). The blue hero CTA lives in
 * <ArrowPillButton>; everything else uses this.
 *
 * - `outline`     secondary action beside a primary CTA
 * - `text`        inline text link with a sliding arrow
 * - `neutral`     admin interface buttons
 * - `destructive` report deletion and other irreversible admin actions
 */

type Variant = "outline" | "text" | "neutral" | "destructive";
type Size = "sm" | "md" | "lg";

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  outline:
    "rounded-full border border-border-strong bg-surface text-foreground hover:border-primary hover:text-primary",
  text: "group/text rounded-none px-0 text-primary hover:text-primary-deep",
  neutral:
    "rounded-control-lg border border-border-strong bg-surface-soft text-foreground hover:bg-surface-alt",
  destructive:
    "rounded-control-lg bg-danger text-white hover:brightness-110",
};

// All sizes clear the 44px touch-target minimum (§29) except `text`,
// which is an inline link rather than a control.
const sizeClasses: Record<Size, string> = {
  sm: "min-h-9 sm:min-h-10 text-xs px-3 sm:px-4 py-1.5 gap-1.5 whitespace-nowrap",
  md: "min-h-10 sm:min-h-12 text-xs sm:text-sm px-3.5 sm:px-5 py-1.5 sm:py-2.5 gap-2 whitespace-nowrap",
  lg: "min-h-12 sm:min-h-14 text-sm sm:text-base px-6 sm:px-7 py-2 sm:py-3 gap-2.5 whitespace-nowrap",
};

function buttonClasses({
  variant = "outline",
  size = "md",
  fullWidth = false,
  className,
}: Omit<SharedProps, "children">) {
  return cn(
    "inline-flex items-center justify-center font-medium shrink-0 whitespace-nowrap",
    "transition-[color,background-color,border-color,transform,filter] duration-250 ease-[var(--ease-out-soft)]",
    "disabled:pointer-events-none disabled:opacity-55",
    "aria-disabled:pointer-events-none aria-disabled:opacity-55",
    variantClasses[variant],
    variant === "text" ? "min-h-0 gap-1.5 text-xs sm:text-[15px]" : sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  );
}

function TextArrow() {
  return (
    <ArrowRight
      aria-hidden
      className="size-4 transition-transform duration-250 ease-[var(--ease-out-soft)] group-hover/text:translate-x-1"
      strokeWidth={2.5}
    />
  );
}

type LinkProps = SharedProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

type ButtonProps = SharedProps & {
  href?: undefined;
  loading?: boolean;
} & Omit<ComponentProps<"button">, "className" | "children">;

export function Button(props: LinkProps | ButtonProps) {
  if (props.href !== undefined) {
    const {
      href,
      variant = "outline",
      size = "md",
      fullWidth = false,
      className,
      children,
      ...rest
    } = props;

    const classes = buttonClasses({ variant, size, fullWidth, className });
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    const inner = (
      <>
        {children}
        {variant === "text" && <TextArrow />}
      </>
    );

    if (isExternal) {
      const isHttp = href.startsWith("http");
      return (
        <a
          href={href}
          target={isHttp ? "_blank" : undefined}
          rel={isHttp ? "noopener noreferrer" : undefined}
          className={classes}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  const {
    loading = false,
    disabled,
    variant = "outline",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <button
      className={buttonClasses({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {children}
      {variant === "text" && !loading && <TextArrow />}
    </button>
  );
}
