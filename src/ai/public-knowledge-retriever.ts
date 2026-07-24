import fs from "node:fs";
import path from "node:path";

export interface KnowledgeItem {
  file: string;
  title: string;
  content: string;
  source: string;
  visibility: string;
  officialUrl?: string;
}

const PUBLIC_KNOWLEDGE_DIR = path.join(process.cwd(), "knowledge", "public");

export function loadAllPublicKnowledge(): KnowledgeItem[] {
  if (!fs.existsSync(PUBLIC_KNOWLEDGE_DIR)) {
    return [];
  }

  const files = fs.readdirSync(PUBLIC_KNOWLEDGE_DIR);
  const items: KnowledgeItem[] = [];

  for (const file of files) {
    // SECURITY FIREWALL: Only read files inside knowledge/public/
    if (file.endsWith(".md") || file.endsWith(".json") || file.endsWith(".jsonl")) {
      const filePath = path.join(PUBLIC_KNOWLEDGE_DIR, file);
      try {
        const raw = fs.readFileSync(filePath, "utf-8");

        // Validate public classification header
        const isPublicMarkdown = raw.includes('visibility: "PUBLIC"') || raw.includes("visibility: PUBLIC");
        const isPublicJson = raw.includes('"visibility": "PUBLIC"');

        if (!isPublicMarkdown && !isPublicJson) {
          continue; // Skip any unverified file
        }

        // Extract metadata
        const sourceMatch = raw.match(/source:\s*"([^"]+)"/);
        const urlMatch = raw.match(/officialUrl:\s*"([^"]+)"/);

        items.push({
          file,
          title: file.replace(/^\d+-/, "").replace(/\.(md|json|jsonl)$/, "").replace(/-/g, " "),
          content: raw,
          source: sourceMatch ? sourceMatch[1] : "Meet Shah Public Portfolio",
          visibility: "PUBLIC",
          officialUrl: urlMatch ? urlMatch[1] : undefined,
        });
      } catch (err) {
        console.error(`Failed to read public knowledge file ${file}`, err);
      }
    }
  }

  return items;
}

export function searchPublicKnowledge(query: string, maxResults = 4): { snippet: string; source: string; officialUrl?: string }[] {
  const allItems = loadAllPublicKnowledge();
  const normalizedQuery = query.toLowerCase().trim();
  const terms = normalizedQuery.split(/\s+/).filter((t) => t.length > 2);

  const scored = allItems.map((item) => {
    let score = 0;
    const lowerContent = item.content.toLowerCase();
    for (const term of terms) {
      if (lowerContent.includes(term)) {
        score += 1;
      }
    }
    return { item, score };
  });

  const matches = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  if (matches.length === 0) {
    // Return base public profile if no specific match
    const baseProfile = allItems.find((i) => i.file.includes("00-public-profile"));
    if (baseProfile) {
      return [
        {
          snippet: baseProfile.content.slice(0, 500),
          source: baseProfile.source,
          officialUrl: baseProfile.officialUrl,
        },
      ];
    }
    return [];
  }

  return matches.map((m) => {
    // Clean frontmatter from snippet if present
    const cleanText = m.item.content.replace(/^---[\s\S]*?---\n?/, "").trim();
    return {
      snippet: cleanText.slice(0, 700),
      source: m.item.source,
      officialUrl: m.item.officialUrl,
    };
  });
}
