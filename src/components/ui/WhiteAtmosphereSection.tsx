import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type WhiteAtmosphereSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  grid?: boolean;
  halo?: "left" | "right" | "both" | "none";
};

export function WhiteAtmosphereSection({
  children,
  className,
  id,
  grid = true,
  halo = "both",
}: WhiteAtmosphereSectionProps) {
  return (
    <section
      id={id}
      className={cn("relative overflow-clip bg-white py-16 sm:py-24", className)}
    >
      {/* Subtle coordinate grid lines overlay */}
      {grid && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03] select-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(9, 16, 31, 0.5) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(9, 16, 31, 0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      )}

      {/* Halo Left */}
      {(halo === "left" || halo === "both") && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-48 top-12 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(47,120,255,0.12),rgba(47,120,255,0.03)_40%,transparent_70%)] blur-3xl select-none"
        />
      )}

      {/* Halo Right */}
      {(halo === "right" || halo === "both") && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-52 bottom-12 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(140,184,255,0.14),rgba(140,184,255,0.03)_45%,transparent_70%)] blur-3xl select-none"
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
