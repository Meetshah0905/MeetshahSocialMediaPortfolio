import { describe, it, expect } from "vitest";
import { Footer } from "@/components/layout/Footer";

describe("Footer Layout Component", () => {
  it("exports Footer component function", () => {
    expect(typeof Footer).toBe("function");
  });
});
