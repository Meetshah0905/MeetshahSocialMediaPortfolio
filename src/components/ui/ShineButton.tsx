"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import {
  ButtonSize,
  ButtonVariant,
  getSharedButtonClasses,
} from "./button-variants";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
};

type LinkProps = BaseProps & {
  href: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

type ButtonProps = BaseProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, "className" | "children" | "disabled">;

export type ShineButtonProps = LinkProps | ButtonProps;

export function ShineButton(props: ShineButtonProps) {
  const {
    children,
    variant = "secondary",
    size = "md",
    fullWidth = false,
    loading = false,
    className,
    disabled = false,
    href,
  } = props;

  const baseClasses = getSharedButtonClasses({
    variant,
    size,
    fullWidth,
    className,
  });

  const shineWrapperClasses = cn(
    "overflow-hidden isolate relative",
    "before:absolute before:top-0 before:left-2 before:right-2 before:h-[1px]",
    "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
    "before:opacity-0 group-hover/specular:before:opacity-100 before:transition-opacity before:duration-300",
    baseClasses
  );

  const innerContent = (
    <>
      {loading && <Loader2 className="size-4 animate-spin shrink-0" aria-hidden />}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </>
  );

  if (href !== undefined) {
    const { href: linkHref, children: _c, variant: _v, size: _s, fullWidth: _f, loading: _l, className: _cn, disabled: _d, ...linkRest } = props as LinkProps;
    const isExternal = /^(https?:|mailto:|tel:)/.test(linkHref);

    if (isExternal) {
      const isHttp = linkHref.startsWith("http");
      return (
        <a
          href={linkHref}
          target={isHttp ? "_blank" : undefined}
          rel={isHttp ? "noopener noreferrer" : undefined}
          className={shineWrapperClasses}
          {...linkRest}
        >
          {innerContent}
        </a>
      );
    }
    return (
      <Link href={linkHref} className={shineWrapperClasses} {...linkRest}>
        {innerContent}
      </Link>
    );
  }

  const { children: _c, variant: _v, size: _s, fullWidth: _f, loading: _l, className: _cn, disabled: _d, ...btnRest } = props as ButtonProps;

  return (
    <button
      className={shineWrapperClasses}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...btnRest}
    >
      {innerContent}
    </button>
  );
}
