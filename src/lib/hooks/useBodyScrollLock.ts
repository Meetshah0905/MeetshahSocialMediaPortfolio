"use client";

import { useEffect } from "react";

/**
 * iOS-safe body scroll lock.
 *
 * `overflow: hidden` alone loses the scroll position on iOS Safari — the page
 * jumps back to the top when the drawer closes. This snapshots `scrollY`,
 * pins `<body>` at `position: fixed; top: -<scrollY>px`, and restores the
 * exact scroll position on cleanup.
 *
 * Multiple lockers (menu open on top of chatbot open, etc.) coordinate through
 * a shared counter so the last one to close is the one that unlocks.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedOverflow = "";
let savedPosition = "";
let savedTop = "";
let savedWidth = "";

function lock() {
  lockCount += 1;
  if (lockCount > 1) return;

  savedScrollY = window.scrollY;
  savedOverflow = document.body.style.overflow;
  savedPosition = document.body.style.position;
  savedTop = document.body.style.top;
  savedWidth = document.body.style.width;

  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${savedScrollY}px`;
  document.body.style.width = "100%";
}

function unlock() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  document.body.style.overflow = savedOverflow;
  document.body.style.position = savedPosition;
  document.body.style.top = savedTop;
  document.body.style.width = savedWidth;

  window.scrollTo(0, savedScrollY);
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return () => unlock();
  }, [active]);
}
