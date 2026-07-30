"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";

export type BrandLogoItem = {
  name: string;
  logo: string;
  category: string;
  highlighted?: boolean;
};

export const BRAND_LOGOS_ROW1: BrandLogoItem[] = [
  { name: "Adroit Extrusion", logo: "/images/brands/adroit-extrusion.png", category: "Industrial Innovation" },
  { name: "Anveshan", logo: "/images/brands/anveshan.png", category: "Organic & Health" },
  { name: "Apollo 24|7", logo: "/images/brands/apollo247.png", category: "Healthcare & Digital", highlighted: true },
  { name: "Crossbox", logo: "/images/brands/crossbox.png", category: "Fitness & Training" },
  { name: "HK Vitals", logo: "/images/brands/hk-vitals.png", category: "Wellness & Nutrition" },
  { name: "Starlight", logo: "/images/brands/starlight.png", category: "Creator Network" },
  { name: "SUP", logo: "/images/brands/sup.png", category: "Lifestyle & Apparel" },
  { name: "Vyapar", logo: "/images/brands/vyapar.png", category: "Fintech & Business" },
];

export const BRAND_LOGOS_ROW2: BrandLogoItem[] = [
  { name: "Vyapar", logo: "/images/brands/vyapar.png", category: "Fintech & Business", highlighted: true },
  { name: "SUP", logo: "/images/brands/sup.png", category: "Lifestyle & Apparel" },
  { name: "Starlight", logo: "/images/brands/starlight.png", category: "Creator Network" },
  { name: "HK Vitals", logo: "/images/brands/hk-vitals.png", category: "Wellness & Nutrition" },
  { name: "Crossbox", logo: "/images/brands/crossbox.png", category: "Fitness & Training" },
  { name: "Apollo 24|7", logo: "/images/brands/apollo247.png", category: "Healthcare & Digital" },
  { name: "Anveshan", logo: "/images/brands/anveshan.png", category: "Organic & Health" },
  { name: "Adroit Extrusion", logo: "/images/brands/adroit-extrusion.png", category: "Industrial Innovation" },
];

export function BrandCarousel() {
  // Quadruple the lists to ensure continuous seamless infinite marquee scrolling
  const marqueeItemsRow1 = [...BRAND_LOGOS_ROW1, ...BRAND_LOGOS_ROW1, ...BRAND_LOGOS_ROW1, ...BRAND_LOGOS_ROW1];
  const marqueeItemsRow2 = [...BRAND_LOGOS_ROW2, ...BRAND_LOGOS_ROW2, ...BRAND_LOGOS_ROW2, ...BRAND_LOGOS_ROW2];

  return (
    <section className="py-16 sm:py-20 bg-[#0a0f1d] border-y border-white/10 relative overflow-hidden backdrop-blur-md select-none">
      {/* Background ambient radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[200px] bg-rose-600/10 blur-[100px] rounded-full pointer-events-none" />

      <Container className="mb-10 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
            Trusted Industry Collaborations
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white !text-white tracking-tight drop-shadow-sm">
          Companies & Brands I&apos;ve Worked With
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
          Delivering high-converting UGC campaigns, creator strategy, and visual assets across top fitness, healthcare, fintech, and lifestyle brands.
        </p>
      </Container>

      {/* 2-Row Infinite Marquee Container (Matching Reference Design) */}
      <div className="relative w-full overflow-hidden flex flex-col gap-3.5 sm:gap-4 group">
        {/* Left & Right gradient fade overlays for smooth scroll fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/85 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[#0a0f1d] via-[#0a0f1d]/85 to-transparent z-20 pointer-events-none" />

        {/* ROW 1: Leftward Scrolling Track */}
        <div className="flex gap-3.5 sm:gap-4 w-max animate-marquee group-hover:[animation-play-state:paused]">
          {marqueeItemsRow1.map((brand, idx) => (
            <div
              key={`row1-${brand.name}-${idx}`}
              className="flex items-center justify-center h-16 sm:h-18 px-5 sm:px-6 bg-white border border-slate-200/90 rounded-lg sm:rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300 min-w-[135px] sm:min-w-[165px] relative group/card cursor-pointer"
            >
              {/* Top Highlight Accent Bar (Reference Microsoft Card Style) */}
              <div
                className={`absolute top-0 left-4 right-4 h-[2.5px] bg-indigo-500 rounded-b-full transition-all duration-300 ${
                  brand.highlighted ? "opacity-100 shadow-[0_2px_6px_rgba(99,102,241,0.5)]" : "opacity-0 group-hover/card:opacity-100"
                }`}
              />

              <div className="relative w-22 sm:w-26 h-7 sm:h-9 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain filter drop-shadow-xs group-hover/card:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ROW 2: Rightward Scrolling Track */}
        <div className="flex gap-3.5 sm:gap-4 w-max animate-marquee-reverse group-hover:[animation-play-state:paused]">
          {marqueeItemsRow2.map((brand, idx) => (
            <div
              key={`row2-${brand.name}-${idx}`}
              className="flex items-center justify-center h-16 sm:h-18 px-5 sm:px-6 bg-white border border-slate-200/90 rounded-lg sm:rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.03] transition-all duration-300 min-w-[135px] sm:min-w-[165px] relative group/card cursor-pointer"
            >
              {/* Top Highlight Accent Bar (Reference Microsoft Card Style) */}
              <div
                className={`absolute top-0 left-4 right-4 h-[2.5px] bg-indigo-500 rounded-b-full transition-all duration-300 ${
                  brand.highlighted ? "opacity-100 shadow-[0_2px_6px_rgba(99,102,241,0.5)]" : "opacity-0 group-hover/card:opacity-100"
                }`}
              />

              <div className="relative w-22 sm:w-26 h-7 sm:h-9 flex items-center justify-center">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain filter drop-shadow-xs group-hover/card:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
