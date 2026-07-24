"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useLenis } from "lenis/react";
import {
  Clock,
  ArrowLeft,
  MapPin,
  Laptop,
  BadgeCheck,
  ArrowDown,
  Scissors,
  Camera,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { BlurCloud } from "@/components/ui/BlurCloud";
import { RoleCard } from "@/components/recruitment/RoleCard";
import { TallyEmbed } from "@/components/recruitment/TallyEmbed";
import {
  recruitmentCopy,
  roleList,
  roles,
  type RoleSlug,
} from "@/config/recruitment";

/**
 * Recruitment page shell (§2, §3 of the recruitment prompt).
 *
 * Role selection is URL-driven — refresh preserves the choice, the query
 * links (?role=video-editor) work end-to-end, and browser back returns to
 * the picker without a full navigation.
 *
 * The Tally embed only mounts once a role is chosen; the script inside it
 * is only fetched then (§17 lazy-load rule).
 */
export function JoinCreatorTeamClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Mouse parallax state for right visual overlays (desktop only)
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const queryRole = searchParams.get("role");
  const queryRoleValid: RoleSlug | null =
    queryRole === "video-editor" || queryRole === "videographer"
      ? queryRole
      : null;

  // Keep local state in sync with the URL (browser back / forward) — done
  // during render, not in an effect, so we avoid the cascading setState.
  const [selected, setSelected] = useState<RoleSlug | null>(queryRoleValid);
  const [trackedQuery, setTrackedQuery] = useState(queryRole);
  if (queryRole !== trackedQuery) {
    setTrackedQuery(queryRole);
    setSelected(queryRoleValid);
  }

  const changeRole = useCallback(
    (slug: RoleSlug | null) => {
      const url = new URL(window.location.href);
      if (slug) url.searchParams.set("role", slug);
      else url.searchParams.delete("role");
      // `scroll: false` — we handle the scroll ourselves so it doesn't jump.
      router.replace(`${url.pathname}${url.search}`, { scroll: false });
      setSelected(slug);
    },
    [router],
  );

  const scrollToPanel = useCallback(() => {
    // Wait for React DOM update so panelRef is mounted
    setTimeout(() => {
      if (panelRef.current) {
        if (lenis) {
          lenis.scrollTo(panelRef.current, { offset: -80 });
        } else {
          const y =
            panelRef.current.getBoundingClientRect().top +
            window.pageYOffset -
            80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }, 80);
  }, [lenis]);

  useEffect(() => {
    if (selected) {
      scrollToPanel();
    }
  }, [selected, scrollToPanel]);

  const onSelect = useCallback(
    (slug: RoleSlug) => {
      changeRole(slug);
      scrollToPanel();
    },
    [changeRole, scrollToPanel],
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -70 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setParallax({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  const activeRole = selected ? roles[selected] : null;
  const isActiveRoleClosed = activeRole ? !activeRole.open : false;

  return (
    <>
      {/* ---------- Hero: Balanced Two-Column "The Creator Desk" ---------- */}
      <section
        className="relative isolate overflow-hidden border-b border-border/60 bg-white select-none"
        style={{
          background:
            "radial-gradient(circle at 78% 35%, rgba(47, 115, 255, 0.12), transparent 34%), #ffffff",
        }}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <BlurCloud preset="soft" />

        {/* Faint coordinate grid lines overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03] select-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(9, 16, 31, 0.5) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(9, 16, 31, 0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <Container className="pt-8 sm:pt-10 lg:pt-12 pb-12 lg:pb-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] gap-10 lg:gap-12 items-center">
            {/* Left Column: Hero copy, opportunity chips & CTAs */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-start text-left space-y-6"
            >
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-blue uppercase">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-blue shadow-[0_0_6px_rgba(37,99,235,0.8)] animate-pulse"
                />
                {recruitmentCopy.eyebrow}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-ink tracking-tight leading-tight">
                {recruitmentCopy.headline}
              </h1>

              <p className="text-sm sm:text-base text-body leading-relaxed max-w-[52ch]">
                {recruitmentCopy.supporting}
              </p>

              {/* Opportunity Chips (Split into 3 compact chips) */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs">
                  <MapPin className="size-3.5 text-blue" />
                  <span>Ahmedabad Shoots</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs">
                  <Laptop className="size-3.5 text-blue" />
                  <span>Remote Editing</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs">
                  <BadgeCheck className="size-3.5 text-blue" />
                  <span>Paid Trials</span>
                </span>
              </div>

              {/* Three Action Buttons including Cal.com Team Discussion */}
              <div className="flex flex-wrap gap-3.5 items-center pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("roles")}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-blue-deep hover:from-blue-deep hover:to-blue text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>View Open Roles</span>
                  <ArrowDown className="size-4" />
                </button>

                <button
                  type="button"
                  data-cal-link="meet-shah-0905/creator-team-discussing"
                  data-cal-namespace="creator-team-discussing"
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  className="inline-flex items-center gap-2 rounded-full bg-blue/10 text-blue hover:bg-blue/20 border border-blue/30 px-5 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Calendar className="size-4" />
                  <span>Schedule Team Discussion</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("process")}
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-surface-soft text-ink border border-border px-5 py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>How It Works</span>
                </button>
              </div>

              {/* Review Trust Note */}
              <div className="flex items-center gap-2.5 pt-2 text-xs font-medium text-muted">
                <span className="size-1.5 rounded-full bg-blue shadow-[0_0_6px_rgba(37,99,235,0.8)] animate-pulse shrink-0" />
                <span>{recruitmentCopy.reviewNote}</span>
              </div>
            </m.div>

            {/* Right Column: "THE CREATOR DESK" Visual Composition */}
            <m.div
              initial={{ opacity: 0, scale: 0.97, x: 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative w-full"
            >
              <div className="creator-team-visual relative w-full aspect-[4/3] rounded-[28px] border border-slate-900/10 bg-[#f4f7fb] overflow-hidden shadow-[0_30px_80px_rgba(31,70,140,0.12)] group">
                {/* Main Studio Image */}
                <Image
                  src="/images/meet/Meet_Shah_creator_studio_poster_202607190212.jpeg"
                  alt="Creator-production setup representing video editing and videography opportunities with Meet Shah."
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
                  className="object-cover object-center group-hover:scale-[1.015] transition-transform duration-500 ease-out"
                />

                {/* Ambient Soft Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Top Production Status Indicator */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/85 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono font-bold text-white shadow-md">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>4K READY · CREATOR STUDIO</span>
                </div>

                {/* Floating Role Overlay 1: VIDEO EDITOR (Upper-Left) */}
                <m.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  style={{
                    transform: `translate3d(${parallax.x * 0.5}px, ${parallax.y * 0.5}px, 0)`,
                  }}
                  className="absolute top-5 left-5 z-20 rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl p-3.5 shadow-xl text-left max-w-[210px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-blue/15 text-blue flex items-center justify-center border border-blue/10 shrink-0">
                      <Scissors className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-heading text-xs font-bold text-ink">
                        VIDEO EDITOR
                      </h4>
                      <p className="text-[10px] font-medium text-muted">
                        Remote · Project-based
                      </p>
                    </div>
                  </div>

                  {/* Mini Editing Timeline Detail */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1.5">
                    <div className="relative h-2 w-full bg-slate-100 rounded-xs overflow-hidden flex gap-1 p-0.5">
                      <div className="h-full w-2/5 bg-blue/70 rounded-xs" />
                      <div className="h-full w-1/3 bg-blue-deep/60 rounded-xs" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted">
                      <span>Timeline v2.4</span>
                      <span className="text-blue font-semibold">60 FPS</span>
                    </div>
                  </div>
                </m.div>

                {/* Floating Role Overlay 2: VIDEOGRAPHER (Lower-Right) */}
                <m.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  style={{
                    transform: `translate3d(${-parallax.x * 0.5}px, ${-parallax.y * 0.5}px, 0)`,
                  }}
                  className="absolute bottom-5 right-5 z-20 rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl p-3.5 shadow-xl text-left max-w-[220px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-blue/15 text-blue flex items-center justify-center border border-blue/10 shrink-0">
                      <Camera className="size-4" />
                    </div>
                    <div>
                      <h4 className="font-heading text-xs font-bold text-ink">
                        VIDEOGRAPHER
                      </h4>
                      <p className="text-[10px] font-medium text-muted">
                        Ahmedabad · On-location
                      </p>
                    </div>
                  </div>

                  {/* Production Camera Detail */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[9px] font-mono text-body">
                    <span>24–70mm f/2.8</span>
                    <span className="font-bold text-blue">AUDIO IN</span>
                  </div>
                </m.div>
              </div>
            </m.div>
          </div>
        </Container>
      </section>

      {/* ---------- Role selection ----------------------------------------- */}
      <section id="roles" className="relative">
        <Container className="py-16 md:py-24">
          <h2 className="mb-10 font-heading text-h2 max-w-[16ch] font-semibold text-foreground">
            {recruitmentCopy.rolesHeading}
          </h2>

          <m.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
            className="grid gap-6 md:grid-cols-2"
          >
            {roleList.map((role) => (
              <RoleCard
                key={role.slug}
                role={role}
                isSelected={selected === role.slug}
                onSelect={onSelect}
              />
            ))}
          </m.div>
        </Container>
      </section>

      {/* ---------- Application panel (only after role selected) ----------- */}
      <AnimatePresence mode="wait">
        {activeRole && (
          <section
            key={activeRole.slug}
            ref={panelRef}
            id="application"
            aria-labelledby="application-heading"
            className="relative isolate overflow-hidden bg-surface-soft py-16 md:py-24"
          >
            <BlurCloud preset="glow" />
            <Container>
              <m.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-[960px]"
              >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => changeRole(null)}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-body transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-xs"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    {recruitmentCopy.changeRole}
                  </button>
                  <span className="inline-flex items-center gap-2 text-xs text-body/70">
                    <Clock className="size-3.5" aria-hidden />
                    {recruitmentCopy.panelDuration}
                  </span>
                </div>

                <div className="rounded-panel border border-border bg-surface p-6 shadow-soft md:p-10">
                  <div className="mb-6 md:mb-8">
                    <h2
                      id="application-heading"
                      className="font-heading text-2xl font-semibold text-foreground md:text-3xl"
                    >
                      {activeRole.panelHeading}
                    </h2>
                    <p className="mt-3 max-w-[60ch] text-sm text-body">
                      {recruitmentCopy.panelSupporting}
                    </p>
                  </div>

                  {isActiveRoleClosed ? (
                    <ClosedRoleNotice />
                  ) : (
                    <TallyEmbed role={activeRole} />
                  )}
                </div>
              </m.div>
            </Container>
          </section>
        )}
      </AnimatePresence>

      {/* ---------- Process ------------------------------------------------ */}
      <section id="process" className="relative">
        <Container className="pb-16 md:pb-24">
          <h2 className="mb-10 font-heading text-h2 max-w-[16ch] font-semibold text-foreground">
            {recruitmentCopy.processHeading}
          </h2>

          <m.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {recruitmentCopy.processSteps.map((step) => (
              <m.li
                key={step.num}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-card border border-border bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
              >
                <p className="font-mono text-xs font-bold text-primary">
                  {step.num} — {step.label}
                </p>
                <p className="mt-3 text-sm text-body">{step.body}</p>
              </m.li>
            ))}
          </m.ol>

          {/* Privacy note — §3.E */}
          <p className="mt-10 max-w-[68ch] text-xs text-body/70">
            {recruitmentCopy.privacyNote}
          </p>
        </Container>
      </section>
    </>
  );
}

function ClosedRoleNotice() {
  return (
    <div className="rounded-card border border-amber-500/25 bg-amber-500/5 px-6 py-10 text-center">
      <p className="font-heading text-lg font-semibold text-foreground">
        {recruitmentCopy.closedTitle}
      </p>
      <p className="mx-auto mt-3 max-w-[52ch] text-sm text-body">
        {recruitmentCopy.closedBody}
      </p>
    </div>
  );
}

