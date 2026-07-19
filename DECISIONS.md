# Decisions

Implementation decisions that aren't obvious from the code, and why. Newest phase last.

---

## Phase 0 — Audit

### The repository had no version control

`git status` reported "not a repository". The Phase 1 work is therefore unversioned.

**Recommendation:** run `git init` and commit before Phase 2. Without it there's no way to review a diff, revert a bad phase, or deploy to Vercel via Git.

**Status:** awaiting Meet's decision.

### Package manager: npm

`package-lock.json` is the only lockfile present. Kept npm; did not switch.

### Removed create-next-app default assets

Deleted `public/{file,globe,next,vercel,window}.svg` and the boilerplate homepage. These were unreferenced scaffold defaults, not project content.

---

## Phase 1 — Foundation

### Framer Motion is installed as `motion`, not `framer-motion`

The library was renamed: `framer-motion` v11 → `motion` v12, same maintainers, same API, imports move from `framer-motion` to `motion/react`. The spec says "Framer Motion", which is this — only the package name differs.

### `LazyMotion` + `m` instead of `motion`

`MotionProvider` uses `<LazyMotion features={domAnimation} strict>`. This ships ~15kb of animation features instead of the full ~34kb bundle.

**Consequence:** components must import `m` and write `<m.div>`, never `<motion.div>`. `strict` makes the wrong one throw at runtime rather than silently shipping the full bundle. Every animated component in this project follows that rule.

### Tailwind v4 — there is no `tailwind.config.ts`

Tailwind v4 is CSS-first. Design tokens live in `@theme` inside `src/styles/globals.css`, and each token generates its utilities automatically (`--color-primary` → `bg-primary`, `text-primary`, `border-primary`).

The spec's §7.2 token list is implemented there verbatim. There is no JS config file to look for.

### Fonts: Sora + Inter via `next/font/google`

Per the revised spec. `next/font` self-hosts both at build time: no runtime request to a third party, no layout shift, no external CDN dependency.

The earlier General Sans/Fontshare approach was dropped — it depended on a third-party `<link>` at runtime, which the revised §6 rules out. Reinstating General Sans requires legally-supplied font files self-hosted via `next/font/local`.

### Missing images are `null`, not a path

`AssetPath = string | null`. Content files use `null` for assets Meet hasn't supplied.

The alternative — pointing at `/images/meet/hero-portrait.webp` before the file exists — produces a 404 and a broken `next/image` request on every render. `<SafeImage>` renders a neutral aspect-ratio-preserving placeholder for `null`, labelled in development and silent in production.

**Rule:** never point an `AssetPath` at a file that isn't on disk.

### Lucide v1 dropped brand icons

`lucide-react` v1 removed social/brand marks (including Instagram) for trademark reasons. `src/components/ui/icons.tsx` holds a local, stroke-matched Instagram SVG. Lucide remains the icon library for everything else, per spec.

### Desktop nav omits UGC and Contact

§11 specifies the desktop set: Work With Me, Fitness, Finance, Analytics, About, plus the CTA. That leaves `/ugc` and `/contact` out of the desktop header.

Both remain reachable: full list in the mobile menu and the footer, Contact via the header CTA, UGC via the homepage process teaser (§13.7).

**Flagged for Meet:** `/ugc` is a real portfolio page with no desktop nav entry. Worth confirming — see the Phase 1 report.

### Reduced motion disables Lenis entirely

`SmoothScrollProvider` returns children unwrapped when `prefers-reduced-motion: reduce` is set, rather than configuring Lenis more gently. Scroll hijacking is precisely what that preference asks us not to do.

### `npm audit` reports 2 moderate vulnerabilities — not actionable

A transitive `postcss` inside `next@16.2.10`. `npm audit fix --force` "resolves" it by installing `next@9.3.3` — a six-year downgrade. Left as-is; revisit when Next ships a patched dependency.

### Motion animations cannot be verified in the agent's preview browser

The preview tab reports `document.visibilityState === "hidden"`, so Chrome throttles `requestAnimationFrame` to **zero frames per second**. Motion is rAF-driven, so no animation runs there at all: every `initial` state sticks (elements sit at `opacity: 0`), `AnimatePresence` exit never completes, and screenshot capture times out for want of a painted frame.

**This is an artifact of the headless preview, not of the site.** It cost a long false diagnosis — "AnimatePresence doesn't unmount its child" — before the rAF check exposed the real cause.

**Consequences for anyone working on this repo:**

1. Verify animation and reveal behaviour in a **real browser**, never in the agent preview. DOM/computed-style assertions there are still trustworthy; anything time-based is not.
2. Do not schedule focus or other correctness-critical work inside `requestAnimationFrame` — a backgrounded tab freezes it indefinitely. `MobileMenu` uses `autoFocus` and a direct `.focus()` call for exactly this reason.
3. If a future Playwright test asserts on a reveal, it must run headed or force visibility, otherwise it will fail for this reason and not a real one.

### `sumOrNull` returns null for an all-null input

In `src/lib/utils/numbers.ts`. A plain `reduce` would return `0`, and §2 forbids showing a zero that reads like a real measurement. This is the foundation for the §24 combined-analytics rules.
