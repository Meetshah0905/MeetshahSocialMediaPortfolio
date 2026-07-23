import { redirect } from "next/navigation";

/**
 * The old /analytics/admin dashboard was a second, parallel admin system with
 * its own login UI and a mock upload pipeline. One admin lives at /admin now;
 * this route only forwards legacy links (e.g. the footer's creator link).
 */
export default function LegacyAnalyticsAdminRedirect() {
  redirect("/admin");
}
