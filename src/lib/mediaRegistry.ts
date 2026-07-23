/**
 * Media Registry utility to prevent duplicate artwork from appearing across visible homepage sections.
 */

export type PageMediaUsage = {
  sourceId: string;
  section: string;
};

const registeredMedia = new Map<string, string>();

export function trackMediaUsage(sourceId: string, section: string): void {
  if (process.env.NODE_ENV === "production") return;

  if (registeredMedia.has(sourceId)) {
    const existingSection = registeredMedia.get(sourceId);
    if (existingSection !== section) {
      console.warn(
        `[Media Registry Warning] Duplicate media asset "${sourceId}" detected! Already rendered in section "${existingSection}", now requested in "${section}". Ensure unique assets are used across homepage sections.`
      );
    }
  } else {
    registeredMedia.set(sourceId, section);
  }
}

export function clearMediaRegistry(): void {
  registeredMedia.clear();
}
