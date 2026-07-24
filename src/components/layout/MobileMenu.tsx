"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { navigation } from "@/content/navigation";
import { site, socials } from "@/content/site";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { InstagramIcon } from "@/components/ui/icons";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils/cn";

/**
 * Mobile navigation drawer.
 *
 * Two architectural rules that fix the "menu renders inside page flow" bug
 * the previous framer-motion version suffered from:
 *
 * 1. The overlay + drawer are rendered through a **portal into
 *    `document.body`**, not as children of the header. That keeps them out
 *    of every stacking context, transform, and overflow-clip that any page
 *    section could introduce — the drawer positions relative to the
 *    viewport, always.
 *
 * 2. Open state drives a `data-open` attribute; CSS handles opacity and
 *    transform transitions. No JS animation library required, so nothing
 *    can silently freeze the drawer at its initial values (which was
 *    happening under `MotionConfig reducedMotion="user"`).
 *
 * Focus is trapped, Escape closes, and body scroll is pinned via
 * `useBodyScrollLock` so iOS Safari can't lose the scroll position.
 */

const DRAWER_ID = "mobile-navigation-drawer";
const OVERLAY_ID = "mobile-navigation-overlay";

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on route change. Render-time state adjustment — an effect would
  // render the drawer open on the new route for one frame first.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useBodyScrollLock(open);

  // Lenis runs its own scroll loop and needs its own stop/start on top of
  // the body pinning.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  // Escape + Tab focus trap.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus to the close button on open. autoFocus alone won't fire when
  // the element is portalled after mount.
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={DRAWER_ID}
        className="grid size-11 place-items-center rounded-full border border-border-strong text-foreground lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      {mounted &&
        createPortal(
          <>
            <div
              id={OVERLAY_ID}
              data-open={open ? "true" : "false"}
              onClick={close}
              aria-hidden
              className={cn(
                "fixed inset-0 bg-black/40 transition-opacity duration-250 ease-out lg:hidden",
                open ? "z-[1200] opacity-100 pointer-events-auto" : "-z-1 opacity-0 pointer-events-none",
              )}
            />

            <div
              id={DRAWER_ID}
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              data-open={open ? "true" : "false"}
              /*
               * All slide/transition CSS lives in globals.css keyed off
               * `[data-open="true"]`. Inline `translate` updates were
               * silently failing to trigger the transition in Chromium
               * mobile — likely because React changed the inline property
               * in the same frame the scroll lock reflowed the body,
               * canceling the interpolation. CSS rules driven by an
               * attribute mutation happen in a clean compositor step and
               * animate reliably.
               */
              className={cn(
                "mobile-nav-drawer fixed top-0 right-0 bottom-0 flex flex-col bg-background shadow-2xl lg:hidden",
                "w-full sm:w-[420px] max-w-full h-dvh-safe pt-safe pb-safe",
                open
                  ? "z-[1210] pointer-events-auto"
                  : "-z-1 pointer-events-none",
              )}
            >
              <div className="flex h-18 shrink-0 items-center justify-between px-5 sm:px-8">
                <Link
                  href="/"
                  onClick={close}
                  className="font-heading text-lg font-bold tracking-tight text-foreground transition-colors hover:text-blue"
                >
                  {site.name}
                </Link>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="grid size-11 place-items-center rounded-full border border-border-strong text-foreground hover:bg-slate-100 transition-colors"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-10 sm:px-8">
                <ul className="flex flex-col space-y-1 py-4">
                  {navigation.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href || pathname.startsWith(item.href + "/");

                    if (item.href === "/join-creator-team") {
                      return (
                        <li key={item.href} className="pt-4">
                          <Link
                            href={item.href}
                            onClick={close}
                            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
                          >
                            <span>{item.label}</span>
                            <span className="text-xl" aria-hidden>
                              ↗
                            </span>
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-12 items-center rounded-xl px-4 text-lg font-medium transition-all duration-200",
                            active
                              ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200/70"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                          )}
                        >
                          {active && (
                            <span
                              className="mr-2.5 size-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_6px_rgba(37,99,235,0.8)]"
                              aria-hidden
                            />
                          )}
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 border-t border-slate-200/80 pt-6">
                  <ArrowPillButton href="/work-with-me" size="lg" fullWidth onClick={close}>
                    Let&apos;s Collaborate
                  </ArrowPillButton>
                </div>

                <ul className="mt-8 flex flex-col gap-3">
                  {socials.map((social) => (
                    <li key={social.href}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 text-body"
                      >
                        <InstagramIcon aria-hidden className="size-4" />
                        {social.handle}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
