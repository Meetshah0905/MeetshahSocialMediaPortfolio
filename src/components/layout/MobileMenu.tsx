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

  // Scroll lock. Lenis runs its own loop, so locking the body alone isn't enough.
  useEffect(() => {
    if (!open) return;

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-60 flex flex-col bg-background lg:hidden"
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
              <ul className="flex flex-col">
                {navigation.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-14 items-center border-b border-border text-xl",
                          active ? "text-primary" : "text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8">
                <ArrowPillButton href={primaryCta.href} size="lg" fullWidth>
                  {primaryCta.label}
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
