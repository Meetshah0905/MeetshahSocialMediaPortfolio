"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { navigation, primaryCta } from "@/content/navigation";
import { socials } from "@/content/site";
import { ArrowPillButton } from "@/components/ui/ArrowPillButton";
import { InstagramIcon } from "@/components/ui/icons";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";
import { cn } from "@/lib/utils/cn";

/**
 * Full-screen mobile menu (§11).
 *
 * Meets the §29 dialog contract: focus moves in on open, is trapped while
 * open, Escape closes, and focus returns to the trigger on close. Body scroll
 * locks — including Lenis, which would otherwise keep scrolling underneath.
 *
 * Focus handling is deliberately explicit rather than effect-driven:
 * - in  — `autoFocus` on the close button, so React owns the timing
 * - out — `close()` restores the trigger itself
 *
 * Both are kept free of requestAnimationFrame on purpose: rAF is frozen in a
 * backgrounded tab, so focus scheduled inside it can silently never run.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on route change. Adjusting state during render (React's documented
  // pattern) rather than in an effect — an effect here would render the menu
  // open on the new route for a frame, then close it.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Body pinning via useBodyScrollLock — iOS Safari otherwise loses scroll
  // position when the drawer closes. Lenis is stopped separately because it
  // runs its own scroll loop on top of the native one.
  useBodyScrollLock(open);
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [open, lenis]);

  // Escape to close + Tab focus trap.
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
      ).filter((element) => element.offsetParent !== null);

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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="grid size-11 place-items-center rounded-full border border-border-strong text-foreground lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            // AnimatePresence tracks children by key.
            key="mobile-menu"
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0, pointerEvents: "none" }}
            animate={{ opacity: 1, pointerEvents: "auto" }}
            /*
             * pointerEvents flips to "none" the moment exit starts, so the
             * fading-out drawer stops intercepting taps even before framer
             * finishes removing it from the DOM. Without this, taps land on a
             * transparent full-viewport overlay for the exit duration and
             * users appear to lose the ability to click anything.
             */
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-60 flex h-dvh-safe flex-col bg-background pt-safe pb-safe lg:hidden"
          >
            <div className="flex h-18 shrink-0 items-center justify-between px-5 sm:px-8">
              <span className="font-heading text-lg font-semibold text-foreground">
                Menu
              </span>
              <button
                type="button"
                onClick={close}
                autoFocus
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full border border-border-strong text-foreground"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-10 sm:px-8">
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
                          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
                        >
                          <span>{item.label}</span>
                          <span className="text-xl">↗</span>
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center rounded-xl px-4 text-lg font-medium transition-all duration-200",
                          active
                            ? "bg-blue-50 text-blue-600 font-semibold border border-blue-200/70"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                        )}
                      >
                        {active && (
                          <span className="mr-2.5 size-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_6px_rgba(37,99,235,0.8)]" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t border-slate-200/80 pt-6">
                <ArrowPillButton href="/work-with-me" size="lg" fullWidth>
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
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
