"use client";

import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The signature CTA (§8): blue gradient pill, white label, black circular
 * badge with a white ↗ on the right.
 *
 * Renders a <Link>/<a> when `href` is set and a <button> otherwise — §29
 * requires links to be links and buttons to be buttons.
 */

type Size = "sm" | "md" | "lg";

type SharedProps = {
  children: ReactNode;
  size?: Size;
  /** Stretch to the container — the mobile default in most layouts. */
  fullWidth?: boolean;
  className?: string;
};

// §8: minimum touch sizes with responsive scaling on mobile.
const sizeClasses: Record<Size, string> = {
  sm: "min-h-9 sm:min-h-10 text-[11px] sm:text-xs ps-3.5 sm:ps-4 pe-1.5 py-1.5 gap-2 whitespace-nowrap",
  md: "min-h-10 sm:min-h-12 text-xs sm:text-sm ps-4 sm:ps-6 pe-1.5 sm:pe-2 py-1.5 sm:py-2 gap-2 sm:gap-3 whitespace-nowrap",
  lg: "min-h-12 sm:min-h-14 text-sm sm:text-base ps-6 sm:ps-8 pe-2 sm:pe-2.5 py-2 sm:py-2.5 gap-3 sm:gap-4 whitespace-nowrap",
};

const badgeClasses: Record<Size, string> = {
  sm: "size-6 sm:size-7",
  md: "size-7 sm:size-8",
  lg: "size-8 sm:size-9",
};

function pillClasses(size: Size, fullWidth: boolean, className?: string) {
  return cn(
    "group/pill relative inline-flex items-center justify-center rounded-full font-medium shrink-0 whitespace-nowrap",
    "bg-linear-to-r from-primary to-primary-deep text-white shadow-blue",
    "transition-[transform,box-shadow] duration-250 ease-[var(--ease-out-soft)]",
    "hover:-translate-y-0.5 hover:shadow-blue-lift active:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none",
    "aria-disabled:pointer-events-none aria-disabled:opacity-55",
    sizeClasses[size],
    fullWidth ? "w-full justify-between" : "",
    className,
  );
}

function ArrowBadge({ size, loading }: { size: Size; loading?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-foreground text-white",
        "transition-transform duration-250 ease-[var(--ease-out-soft)]",
        // The badge nudges up-and-right on hover — no scaling (§8).
        "group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5",
        badgeClasses[size],
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
      ) : (
        <ArrowUpRight className="size-4" strokeWidth={2.5} />
      )}
    </span>
  );
}

type LinkProps = SharedProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

type ButtonProps = SharedProps & {
  href?: undefined;
  loading?: boolean;
} & Omit<ComponentProps<"button">, "className" | "children">;

export function ArrowPillButton(props: LinkProps | ButtonProps) {
  if (props.href !== undefined) {
    const {
      href,
      size = "md",
      fullWidth = false,
      className,
      children,
      ...rest
    } = props;

    const isExternal = /^(https?:|mailto:|tel:)/.test(href);
    const classes = pillClasses(size, fullWidth, className);
    const inner = (
      <>
        <span>{children}</span>
        <ArrowBadge size={size} />
      </>
    );

    if (isExternal) {
      const isHttp = href.startsWith("http");
      return (
        <a
          href={href}
          // §33: never open a new tab without noopener.
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
    size = "md",
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  return (
    <button
      className={pillClasses(size, fullWidth, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span>{children}</span>
      <ArrowBadge size={size} loading={loading} />
    </button>
  );
}
