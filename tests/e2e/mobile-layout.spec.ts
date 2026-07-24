import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = [
  "/",
  "/work-with-me",
  "/fitness",
  "/finance",
  "/ugc",
  "/analytics",
  "/about",
  "/join-creator-team",
  "/contact",
];

const VIEWPORTS = [
  { width: 360, height: 740, name: "360px Small Mobile" },
  { width: 390, height: 844, name: "390px iPhone 14" },
  { width: 430, height: 932, name: "430px iPhone Pro Max" },
  { width: 532, height: 850, name: "532px Custom Viewport" },
  { width: 768, height: 1024, name: "768px iPad Portrait" },
];

for (const viewport of VIEWPORTS) {
  test.describe(`Mobile Layout Verification [${viewport.name}]`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of PUBLIC_ROUTES) {
      test(`Route ${route} has no horizontal overflow & sticky navbar at all scroll positions`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });

        // 1. Check no horizontal overflow at top
        const overflowResult = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          };
        });

        expect(overflowResult.hasHorizontalOverflow).toBe(false);

        // 2. Check header visibility at top
        const header = page.locator("header");
        await expect(header).toBeVisible();

        // 3. Scroll to 50% height
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2);
        });

        // 4. Confirm header is still visible at 50%
        await expect(header).toBeVisible();

        // 5. Scroll to bottom / footer
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        // 6. Confirm header remains visible at footer
        await expect(header).toBeVisible();

        // 7. Confirm footer & copyright visible
        const footer = page.locator("footer");
        await expect(footer).toBeVisible();

        // 8. Confirm single scroll container
        const innerScrollables = await page.evaluate(() => {
          const all = Array.from(document.querySelectorAll("div, section, main"));
          return all.filter((el) => {
            const style = window.getComputedStyle(el);
            const isScrollable =
              (style.overflowY === "auto" || style.overflowY === "scroll") &&
              el.scrollHeight > el.clientHeight &&
              el.clientHeight > 400 &&
              !el.classList.contains("lenis") &&
              el.getAttribute("role") !== "dialog";
            return isScrollable;
          }).length;
        });

        expect(innerScrollables).toBe(0);
      });
    }
  });
}
