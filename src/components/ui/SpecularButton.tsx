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

type BaseSpecularProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

type LinkSpecularProps = BaseSpecularProps & {
  href: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

type ButtonSpecularProps = BaseSpecularProps & {
  href?: undefined;
} & Omit<ComponentProps<"button">, "className" | "children" | "disabled">;

export type SpecularButtonProps = LinkSpecularProps | ButtonSpecularProps;

export function SpecularButton(props: SpecularButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
    disabled = false,
    className,
    href,
  } = props;

  const baseClasses = getSharedButtonClasses({
    variant,
    size,
    fullWidth,
    className,
  });

  const specularWrapperClasses = cn(
    "overflow-hidden isolate relative",
    // Top-edge subtle specular reflection highlight line
    "before:absolute before:top-0 before:left-3 before:right-3 before:h-[1.5px]",
    "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
    "before:opacity-30 group-hover/specular:before:opacity-100 before:transition-opacity before:duration-300",
    baseClasses
  );

  const innerContent = (
    <>
      {loading && <Loader2 className="size-4 animate-spin shrink-0" aria-hidden />}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </>
  );

  if (href !== undefined) {
    const { href: linkHref, children: _c, variant: _v, size: _s, fullWidth: _f, loading: _l, className: _cn, disabled: _d, ...linkRest } = props as LinkSpecularProps;
    const isExternal = /^(https?:|mailto:|tel:)/.test(linkHref);

    if (isExternal) {
      const isHttp = linkHref.startsWith("http");
      return (
        <a
          href={linkHref}
          target={isHttp ? "_blank" : undefined}
          rel={isHttp ? "noopener noreferrer" : undefined}
          className={specularWrapperClasses}
          {...linkRest}
        >
          {innerContent}
        </a>
      );
    }
    return (
      <Link href={linkHref} className={specularWrapperClasses} {...linkRest}>
        {innerContent}
      </Link>
    );
  }

  const { children: _c, variant: _v, size: _s, fullWidth: _f, loading: _l, className: _cn, disabled: _d, ...btnRest } = props as ButtonSpecularProps;

  return (
    <button
      className={specularWrapperClasses}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...btnRest}
    >
      {innerContent}
    </button>
  );
}
