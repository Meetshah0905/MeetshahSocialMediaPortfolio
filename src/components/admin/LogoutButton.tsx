"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Ignore network failures on logout
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ||
        "bg-white border border-border text-ink hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
      }
    >
      <LogOut className="size-3.5 shrink-0" aria-hidden />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}
