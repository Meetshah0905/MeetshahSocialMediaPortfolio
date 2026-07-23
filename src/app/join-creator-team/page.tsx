import type { Metadata } from "next";
import { Suspense } from "react";
import { JoinCreatorTeamClient } from "./JoinCreatorTeamClient";
import { recruitmentCopy } from "@/config/recruitment";

export const metadata: Metadata = {
  title: recruitmentCopy.metaTitle,
  description: recruitmentCopy.metaDescription,
  // Recruitment is public — no reason to hide from search — but the query
  // variants are duplicates of the canonical page. Let crawlers see the
  // clean URL only.
  alternates: { canonical: recruitmentCopy.routeHref },
};

/**
 * /join-creator-team — server shell.
 *
 * The client component reads `?role=` via useSearchParams, which forces its
 * subtree into a Suspense boundary in Next 16. Wrapping it here keeps the
 * page statically prerendered up to the query-driven part.
 */
export default function JoinCreatorTeamPage() {
  return (
    <Suspense fallback={null}>
      <JoinCreatorTeamClient />
    </Suspense>
  );
}
