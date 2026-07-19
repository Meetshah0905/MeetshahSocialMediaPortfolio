"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { m } from "motion/react";
import { desktopNavigation, primaryCta } from "@/content/navigation";
import { site } from "@/content/site";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils/cn";

/**
 * Sticky header (§11).
 *
 * Transparent over the hero, then gains a white blur, border and shadow once
 * scrolled. Desktop shows a short conversion-ordered nav; every other public
 * route lives in the mobile menu and the footer.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-[var(--ease-out-soft)]",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <nav
          aria-label="Primary"
          className="flex h-18 items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="shrink-0 font-heading text-lg font-semibold tracking-tight text-foreground"
          >
            {site.name}
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {desktopNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-sm transition-colors",
                      active ? "text-foreground" : "text-body hover:text-foreground",
                    )}
                  >
                    {item.label}
                    {active && (
                      <m.span
                        aria-hidden
                        layoutId="header-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-surface-alt"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ArrowPillButton href={primaryCta.href}>
                {primaryCta.label}
              </ArrowPillButton>
            </div>
            <MobileMenu />
          </div>
        </nav>
      </Container>
    </header>
  );
}
