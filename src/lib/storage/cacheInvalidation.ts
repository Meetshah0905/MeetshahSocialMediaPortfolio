import { revalidatePath } from "next/cache";

/**
 * Revalidates public and admin page paths whenever a report is created,
 * updated, published, unpublished, archived, replaced, or deleted (§11).
 */
export function invalidateReportCaches(channel?: string, slug?: string) {
  try {
    revalidatePath("/analytics");
    revalidatePath("/admin/reports");
    revalidatePath("/fitness");
    revalidatePath("/finance");
    revalidatePath("/youtube");

    if (slug) {
      revalidatePath(`/analytics/reports/${slug}`);
    }
  } catch (err) {
    // Graceful handling if called outside a Next.js server route context
    console.warn("Cache revalidation skipped:", err);
  }
}
