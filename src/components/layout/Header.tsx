"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { m } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { desktopNavigation } from "@/content/navigation";
import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils/cn";

/**
 * Modern SaaS-style Navbar (§11).
 *
 * Implements a structured visual hierarchy:
 * 1. Normal links: clean dark gray text, center-expanding blue underline & 1.5px lift on hover
 * 2. Active link: soft light-blue rounded pill with blue text, subtle glow & animated micro-dot
 * 3. Primary CTA: Join Creator Team styled as a prominent blue pill button with arrow icon & elevation
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

  // Filter normal navigation links vs Join Creator Team CTA button
  const normalNavItems = desktopNavigation.filter((item) => item.href !== "/join-creator-team");
  const ctaNavItem = desktopNavigation.find((item) => item.href === "/join-creator-team");

  return (
    <header
      className={cn(
        // Mobile: genuinely fixed so it survives every stacking / overflow
        // ancestor (Lenis + gsap virtualise scroll, and a `sticky` header can
        // drop out of sight inside a wrapper that clips overflow). Desktop
        // keeps the softer sticky behaviour with in-flow height.
        "fixed top-0 left-0 right-0 lg:sticky lg:top-0 z-[1000] w-full transition-all duration-300 ease-out pt-safe",
        scrolled
          ? "border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs"
          : "border-b border-slate-200/50 bg-white/90 backdrop-blur-md",
      )}
    >
      <Container>
        <nav
          aria-label="Primary Navigation"
          className="flex h-18 items-center justify-between gap-4"
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="shrink-0 font-heading text-lg font-bold tracking-tight text-slate-900 transition-colors duration-200 hover:text-blue-600"
          >
            {site.name}
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
            {normalNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative inline-flex min-h-10 items-center justify-center rounded-full px-2.5 xl:px-3.5 py-1.5 text-xs xl:text-sm font-medium transition-all duration-250 ease-out",
                      active
                        ? "text-blue-600 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:-translate-y-[1.5px]",
                    )}
                  >
                    {/* Active state pill background morph animation */}
                    {active && (
                      <m.span
                        aria-hidden
                        layoutId="header-active-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-blue-50/90 border border-blue-200/70 shadow-[0_2px_8px_rgba(37,99,235,0.12)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Active micro-highlight animated dot */}
                    {active && (
                      <span className="mr-1.5 size-1.5 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.8)] animate-pulse" />
                    )}

                    <span>{item.label}</span>

                    {/* Inactive hover state center-expanding animated blue underline */}
                    {!active && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 rounded-full bg-blue-600 opacity-0 transition-all duration-280 ease-out group-hover:w-3/5 group-hover:opacity-100" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Header Action: Join Creator Team CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Link
                href={ctaNavItem?.href || "/join-creator-team"}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs xl:text-sm font-semibold text-white",
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                  "shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/35",
                  "transition-all duration-250 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
                  isActive(ctaNavItem?.href || "/join-creator-team") && "ring-2 ring-blue-400 ring-offset-2"
                )}
              >
                <span>{ctaNavItem?.label || "Join Creator Team"}</span>
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <MobileMenu />
          </div>
        </nav>
      </Container>
    </header>
  );
}

