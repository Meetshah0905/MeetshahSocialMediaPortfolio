import HomeClientPage from "./HomeClientPage";
import { listPlatformProfiles } from "@/lib/storage/db";

/**
 * Homepage — server component.
 *
 * Audience counts load server-side from the single metrics store and stream
 * to the client shell as props (§Phase 2 of the reform). Published channels
 * only; nothing is fetched from the browser and nothing is hardcoded.
 */
export default async function HomePage() {
  const profiles = (await listPlatformProfiles())
    .filter((p) => p.published || p.isPublished)
    .map((p) => ({ id: p.id, currentValue: p.currentValue || 0 }));

  return <HomeClientPage profiles={profiles} />;
}
