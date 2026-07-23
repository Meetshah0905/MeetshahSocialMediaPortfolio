"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { globalLenis } from "@/components/motion/SmoothScrollProvider";

export function RouteScrollManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset scroll to top on path changes
  useEffect(() => {
    // If the URL has a hash link (e.g. /analytics#reports), let the anchor work
    if (window.location.hash) {
      return;
    }

    const frameOne = window.requestAnimationFrame(() => {
      const frameTwo = window.requestAnimationFrame(() => {
        // Reset window scroll
        window.scrollTo(0, 0);

        // Reset Lenis scroll instance if active
        if (globalLenis) {
          globalLenis.scrollTo(0, {
            immediate: true,
            force: true,
          });
        }
      });

      return () => window.cancelAnimationFrame(frameTwo);
    });

    return () => window.cancelAnimationFrame(frameOne);
  }, [pathname, searchParams]);

  // Set browser scroll restoration to manual to avoid page flash resets
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return null;
}
