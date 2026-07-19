/**
 * Content models (§12).
 *
 * `isPlaceholder: true` marks an item Meet still has to supply. Placeholder
 * items render in development so layout can be judged, and are filtered out in
 * production so the site never shows invented proof (§2).
 */

export type PersonaId = "fitness" | "finance";

export type SocialLink = {
  label: string;
  handle?: string;
  href: string;
};

/**
 * A path under /public, or null when Meet hasn't supplied the file yet.
 *
 * null is load-bearing: <SafeImage> draws a neutral placeholder for it instead
 * of requesting an image that would 404 (§31). Never point an AssetPath at a
 * file that doesn't exist.
 */
export type AssetPath = string | null;

export type NavItem = {
  label: string;
  href: string;
  /** Shown in the desktop header. All items appear in the mobile menu. */
  inDesktopNav: boolean;
};

export type CreatorChannel = {
  id: PersonaId;
  name: string;
  handle: string;
  profileUrl: string;
  /** Display string, e.g. "11.9k" — deliberately not a number, it's copy. */
  followerDisplay: string;
  positioning: string;
  description: string;
  contentPillars: string[];
  heroImage: AssetPath;
  accent: "blue" | "ink";
};

export type ReelItem = {
  id: string;
  title: string;
  caption?: string;
  thumbnail: AssetPath;
  href: string;
  channel: PersonaId;
  category?: string;
  performanceLabel?: string;
  isPlaceholder?: boolean;
};

export type BrandCollaboration = {
  id: string;
  name: string;
  logo: AssetPath;
  href?: string;
  description?: string;
  isPlaceholder?: boolean;
};

export type ServicePackage = {
  id: string;
  name: string;
  summary: string;
  deliverables: string[];
  idealFor: string;
  /** Omitted -> the UI shows "Custom quote". Never render a fake price (§17.3). */
  priceLabel?: string;
  featured?: boolean;
  isPlaceholder?: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  isPlaceholder?: boolean;
};

/** Anything that can be withheld from production until real content lands. */
type Placeholdable = { isPlaceholder?: boolean };

/**
 * Filter placeholder entries out of a content list for production.
 *
 * Keeping this in one place is what makes §2's "never invent proof" rule
 * enforceable — components call this instead of each deciding for themselves.
 */
export function publishedOnly<T extends Placeholdable>(items: T[]): T[] {
  if (process.env.NODE_ENV === "development") return items;
  return items.filter((item) => !item.isPlaceholder);
}

/** True when a section has no real content and should hide entirely (§2). */
export function hasPublishedContent<T extends Placeholdable>(
  items: T[],
): boolean {
  return items.some((item) => !item.isPlaceholder);
}
