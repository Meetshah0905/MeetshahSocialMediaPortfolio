import { cn } from "@/lib/utils/cn";

/**
 * The signature gaussian-blur cloud backdrop (§7.6).
 *
 * Decorative only: aria-hidden, pointer-events none, always behind content.
 * The parent must be `relative` (and usually `overflow-hidden`).
 *
 * Deliberately a server component — no motion here. Wrap it in <Parallax> at
 * the call site if a section wants drift.
 *
 * §7.6: use on the hero, About opening, channel CTAs, analytics header and the
 * final contact CTA — not behind every card.
 */

type Cloud = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  /** Diameter, e.g. "620px". */
  size: string;
  color: string;
  opacity?: number;
  blur?: string;
};

// Each array is annotated `Cloud[]` rather than the object using `satisfies`:
// `satisfies` would keep each entry's literal shape, so a preset that happens
// to use only `top`/`left` would type-error when read for `right`/`bottom`.
const presets = {
  /** Full atmospheric wash — home hero only. */
  hero: [
    { top: "-18%", left: "-8%", size: "620px", color: "#8FB8FF", opacity: 0.5, blur: "110px" },
    { top: "4%", right: "-10%", size: "560px", color: "#2E7BFF", opacity: 0.24, blur: "120px" },
    { bottom: "-26%", left: "34%", size: "520px", color: "#DCE9FF", opacity: 0.75, blur: "100px" },
  ] as Cloud[],
  /** One-sided and restrained — interior page headers. */
  soft: [
    { top: "-12%", right: "-6%", size: "440px", color: "#8FB8FF", opacity: 0.3, blur: "100px" },
    { bottom: "-22%", left: "-6%", size: "380px", color: "#DCE9FF", opacity: 0.6, blur: "90px" },
  ] as Cloud[],
  /** A single centred glow — CTA bands. */
  glow: [
    { top: "6%", left: "28%", size: "540px", color: "#2E7BFF", opacity: 0.18, blur: "130px" },
  ] as Cloud[],
};

export type BlurCloudPreset = keyof typeof presets;

export function BlurCloud({
  preset = "soft",
  clouds,
  className,
}: {
  preset?: BlurCloudPreset;
  /** Replace the preset with bespoke blobs. */
  clouds?: Cloud[];
  className?: string;
}) {
  const items = clouds ?? presets[preset];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        // §13: mobile reduces the cloud effect — blur is expensive to composite
        // and the payoff is small on a 375px canvas.
        "opacity-60 sm:opacity-100",
        className,
      )}
    >
      {items.map((cloud, index) => (
        <div
          key={index}
          className="cloud-blob"
          style={{
            top: cloud.top,
            left: cloud.left,
            right: cloud.right,
            bottom: cloud.bottom,
            width: cloud.size,
            height: cloud.size,
            opacity: cloud.opacity ?? 0.5,
            filter: `blur(${cloud.blur ?? "90px"})`,
            background: `radial-gradient(circle at 50% 50%, ${cloud.color} 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
