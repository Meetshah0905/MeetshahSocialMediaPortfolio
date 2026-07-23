"use client";

import { ArrowUpRight, Video, Camera, CheckCircle2 } from "lucide-react";
import { m } from "motion/react";
import type { RecruitmentRole } from "@/config/recruitment";
import { cn } from "@/lib/utils/cn";

/**
 * Role selection card (§3.B, §13 animations).
 *
 * Renders as an interactive motion button with visual feedback, hover physics,
 * skill chip animations, active state indicator, and icons per role.
 */
export function RoleCard({
  role,
  isSelected = false,
  onSelect,
}: {
  role: RecruitmentRole;
  isSelected?: boolean;
  onSelect: (slug: RecruitmentRole["slug"]) => void;
}) {
  const isEditor = role.slug === "video-editor";
  const Icon = isEditor ? Video : Camera;

  return (
    <m.button
      type="button"
      onClick={() => onSelect(role.slug)}
      aria-label={`${role.cta} — ${role.title}`}
      aria-pressed={isSelected}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: role.open ? -6 : 0 }}
      whileTap={{ scale: role.open ? 0.985 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex h-full w-full flex-col rounded-panel border bg-surface p-8 md:p-10 text-left transition-all duration-300 ease-[var(--ease-out-soft)]",
        isSelected
          ? "border-primary ring-2 ring-primary/30 shadow-blue bg-primary/[0.02]"
          : "border-border shadow-card hover:border-primary/50 hover:shadow-blue/50",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        !role.open && "opacity-70 cursor-not-allowed hover:border-border shadow-none",
      )}
    >
      {/* Top bar: icon, label & status */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid size-10 place-items-center rounded-xl border transition-colors duration-300",
              isSelected
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-surface-soft text-body group-hover:border-primary/30 group-hover:text-primary",
            )}
          >
            <Icon className="size-5" />
          </div>
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            {role.label}
          </span>
        </div>

        {isSelected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary animate-fadeIn">
            <CheckCircle2 className="size-3.5" />
            Selected
          </span>
        ) : !role.open ? (
          <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">
            Paused
          </span>
        ) : null}
      </div>

      {/* Title & description */}
      <h3 className="mt-6 font-heading text-2xl font-semibold text-foreground md:text-3xl transition-colors duration-200 group-hover:text-primary">
        {role.title}
      </h3>

      <p className="mt-4 text-sm leading-relaxed text-body md:text-base">
        {role.description}
      </p>

      {/* Animated skill chips */}
      <ul className="mt-6 flex flex-wrap gap-2">
        {role.skills.map((skill, i) => (
          <m.li
            key={skill}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.2 }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
              isSelected
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-border bg-surface-soft text-body group-hover:border-primary/30 group-hover:bg-primary/[0.03] group-hover:text-foreground",
            )}
          >
            {skill}
          </m.li>
        ))}
      </ul>

      {/* CTA section with animated arrow pill */}
      <div className="mt-auto pt-8 flex items-center justify-between text-sm font-semibold text-foreground">
        <span className="group-hover:text-primary transition-colors duration-200">
          {role.cta}
        </span>
        <span
          aria-hidden
          className={cn(
            "grid size-10 place-items-center rounded-full transition-all duration-300 ease-[var(--ease-out-soft)]",
            isSelected
              ? "bg-primary text-white shadow-md scale-105"
              : "bg-foreground text-white group-hover:bg-primary group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-md",
          )}
        >
          <ArrowUpRight className="size-4" strokeWidth={2.5} />
        </span>
      </div>
    </m.button>
  );
}
