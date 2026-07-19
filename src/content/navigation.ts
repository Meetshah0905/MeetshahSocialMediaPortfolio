import type { NavItem } from "@/types/content";

/**
 * Navigation (§11).
 *
 * Desktop deliberately shows a short, conversion-ordered set — Work With Me
 * first, because the brand-manager journey is the priority. Contact is reached
 * through the header CTA rather than adding another crowded item.
 *
 * `inDesktopNav: false` items still appear in the mobile menu and the footer,
 * so every public route stays reachable.
 */
export const navigation: NavItem[] = [
  { label: "Work With Me", href: "/work-with-me", inDesktopNav: true },
  { label: "Fitness", href: "/fitness", inDesktopNav: true },
  { label: "Finance", href: "/finance", inDesktopNav: true },
  { label: "Analytics", href: "/analytics", inDesktopNav: true },
  { label: "About", href: "/about", inDesktopNav: true },
  { label: "UGC & Content", href: "/ugc", inDesktopNav: false },
  { label: "Contact", href: "/contact", inDesktopNav: false },
];

export const desktopNavigation = navigation.filter((item) => item.inDesktopNav);

/** The header/mobile-menu conversion CTA. */
export const primaryCta = {
  label: "Let's Collaborate",
  href: "/work-with-me",
} as const;

/** Footer sitemap — every public route, including the ones desktop nav omits. */
export const footerNavigation: NavItem[] = [
  { label: "Home", href: "/", inDesktopNav: false },
  ...navigation,
];
