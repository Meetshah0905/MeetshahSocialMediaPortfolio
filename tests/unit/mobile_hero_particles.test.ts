import { describe, it, expect } from "vitest";
import HeroParticles from "@/components/ui/HeroParticles";
import { HeroMaroonAtmosphere } from "@/components/home/HeroMaroonAtmosphere";

describe("Mobile Hero Particle System Component Exports", () => {
  it("exports HeroParticles component function", () => {
    expect(typeof HeroParticles).toBe("function");
  });

  it("exports HeroMaroonAtmosphere component function", () => {
    expect(typeof HeroMaroonAtmosphere).toBe("function");
  });
});
