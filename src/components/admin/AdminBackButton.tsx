"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Consistent admin Back control.
 *
 * Falls back to `href` on direct URL entry so opening `/admin/reports/[id]/edit`
 * in a fresh tab still sends the user back inside the admin, not off-site.
 * `router.back()` is used only when the previous route is an internal admin
 * URL (checked against document.referrer at click time).
 */
export function AdminBackButton({
  href,
  label,
  hasUnsavedChanges,
}: {
  href: string;
  label: string;
  hasUnsavedChanges?: boolean;
}) {
  const router = useRouter();

  const go = () => {
    if (hasUnsavedChanges) {
      const ok = window.confirm(
        "Leave without saving?\n\nYour unsaved report information and selected files may be lost.",
      );
      if (!ok) return;
    }

    let useHistory = false;
    if (typeof document !== "undefined" && document.referrer) {
      try {
        const referrer = new URL(document.referrer);
        useHistory =
          referrer.origin === window.location.origin &&
          referrer.pathname.startsWith("/admin");
      } catch {
        useHistory = false;
      }
    }

    if (useHistory && window.history.length > 1) {
      router.back();
    } else {
      router.push(href);
    }
  };

  return (
    <button
      type="button"
      onClick={go}
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue hover:underline"
    >
      <ArrowLeft className="size-3.5" aria-hidden />
      {label}
    </button>
  );
}
