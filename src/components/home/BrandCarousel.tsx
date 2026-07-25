"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";

export type BrandLogoItem = {
  name: string;
  logo: string;
  category: string;
};

export const BRAND_LOGOS: BrandLogoItem[] = [
  { name: "Adroit Extrusion", logo: "/images/brands/adroit-extrusion.png", category: "Industrial Innovation" },
  { name: "Anveshan", logo: "/images/brands/anveshan.png", category: "Organic & Health" },
  { name: "Apollo 24|7", logo: "/images/brands/apollo247.png", category: "Healthcare & Digital" },
  { name: "Crossbox", logo: "/images/brands/crossbox.png", category: "Fitness & Training" },
  { name: "HK Vitals", logo: "/images/brands/hk-vitals.png", category: "Wellness & Nutrition" },
  { name: "Starlight", logo: "/images/brands/starlight.png", category: "Creator Network" },
  { name: "SUP", logo: "/images/brands/sup.png", category: "Lifestyle & Apparel" },
  { name: "Vyapar", logo: "/images/brands/vyapar.png", category: "Fintech & Business" },
];

export function BrandCarousel() {
  // Quadruple the list to ensure smooth infinite seamless marquee scrolling
  const marqueeItems = [...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <section className="py-16 bg-slate-950/80 border-y border-white/10 relative overflow-hidden backdrop-blur-md">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[180px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      <Container className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
            Trusted Industry Collaborations
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Companies & Brands I&apos;ve Worked With
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2">
          Delivering high-converting UGC campaigns, creator strategy, and visual assets across top fitness, healthcare, fintech, and lifestyle brands.
        </p>
      </Container>

      {/* Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* Left & Right gradient fade overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex gap-6 sm:gap-10 w-max animate-marquee group-hover:[animation-play-state:paused]">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="flex items-center justify-center h-24 sm:h-28 px-8 sm:px-12 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl hover:border-red-500/40 hover:bg-slate-800/80 transition-all duration-300 min-w-[170px] sm:min-w-[210px] group/card"
            >
              <div className="relative w-32 sm:w-40 h-12 sm:h-16 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain filter brightness-100 group-hover/card:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
