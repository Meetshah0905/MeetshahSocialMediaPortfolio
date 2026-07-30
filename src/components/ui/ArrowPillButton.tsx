"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { SpecularButton } from "./SpecularButton";
import { ButtonVariant } from "./button-variants";

type Size = "sm" | "md" | "lg";

type SharedProps = {
  children: ReactNode;
  size?: Size;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
};

function ArrowBadge({ loading }: { loading?: boolean }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center transition-transform duration-200 ease-out group-hover/specular:translate-x-0.5 group-hover/specular:-translate-y-0.5"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" strokeWidth={2.5} />
      ) : (
        <ArrowUpRight className="size-4 sm:size-4.5" strokeWidth={2.5} />
      )}
    </span>
  );
}

type LinkProps = SharedProps & {
  href: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">;

type ButtonProps = SharedProps & {
  href?: undefined;
  loading?: boolean;
} & Omit<ComponentProps<"button">, "className" | "children">;

export function ArrowPillButton(props: LinkProps | ButtonProps) {
  const {
    children,
    size = "md",
    variant = "primary",
    fullWidth = false,
    className,
    href,
  } = props;

  const loading = "loading" in props ? props.loading : false;

  const innerContent = (
    <>
      <span>{children}</span>
      <ArrowBadge loading={loading} />
    </>
  );

  if (href !== undefined) {
    const { href: linkHref, children: _c, size: _s, variant: _v, fullWidth: _fw, className: _cn, ...linkRest } = props as LinkProps;
    return (
      <SpecularButton
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        href={linkHref}
        loading={loading}
        className={cn("group/pill", className)}
        {...linkRest}
      >
        {innerContent}
      </SpecularButton>
    );
  }

  const { children: _c, size: _s, variant: _v, fullWidth: _fw, className: _cn, loading: _l, ...btnRest } = props as ButtonProps;
  return (
    <SpecularButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      className={cn("group/pill", className)}
      {...btnRest}
    >
      {innerContent}
    </SpecularButton>
  );
}
