import { NextRequest, NextResponse } from "next/server";

const ALLOWED_SHORTCODES = new Set([
  "DaDLVmzCuug",
  "DZ0ReN0Kzid",
  "DZSTFLaiWkv",
  "DYp2RJRRf_R",
  "DV8WtIXgiSf",
]);

type oEmbedCacheEntry = {
  html: string;
  title?: string;
  authorName?: string;
  thumbnailUrl?: string;
  timestamp: number;
};

const cache = new Map<string, oEmbedCacheEntry>();
const CACHE_TTL_MS = 3600 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (hostname !== "instagram.com" && hostname !== "www.instagram.com") {
    return NextResponse.json({ error: "Hostname must be instagram.com" }, { status: 403 });
  }

  // Extract shortcode e.g. /p/DaDLVmzCuug/ -> DaDLVmzCuug
  const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
  const shortcode = pathSegments[1] || pathSegments[0];

  if (!shortcode || !ALLOWED_SHORTCODES.has(shortcode)) {
    return NextResponse.json(
      { error: "Shortcode not in approved five-entry allowlist" },
      { status: 403 }
    );
  }

  // Check memory cache
  const cached = cache.get(shortcode);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      html: cached.html,
      title: cached.title,
      authorName: cached.authorName,
      thumbnailUrl: cached.thumbnailUrl,
      providerName: "Instagram",
    });
  }

  // Try Meta official oEmbed endpoint or construct iframe fallback payload
  const oembedEndpoint = `https://api.instagram.com/oembed/?url=${encodeURIComponent(
    `https://www.instagram.com/p/${shortcode}/`
  )}&omitscript=true`;

  try {
    const res = await fetch(oembedEndpoint, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (res.ok) {
      const data = await res.json();
      const entry: oEmbedCacheEntry = {
        html: data.html || `<iframe src="https://www.instagram.com/p/${shortcode}/embed/" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`,
        title: data.title,
        authorName: data.author_name,
        thumbnailUrl: data.thumbnail_url,
        timestamp: Date.now(),
      };
      cache.set(shortcode, entry);

      return NextResponse.json({
        html: entry.html,
        title: entry.title,
        authorName: entry.authorName,
        thumbnailUrl: entry.thumbnailUrl,
        providerName: "Instagram",
      });
    }
  } catch {
    // Ignore fetch error and fall through to controlled iframe payload
  }

  // Controlled fallback HTML payload
  const fallbackHtml = `<iframe src="https://www.instagram.com/p/${shortcode}/embed/" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" class="w-full h-full rounded-lg"></iframe>`;
  
  cache.set(shortcode, {
    html: fallbackHtml,
    timestamp: Date.now(),
  });

  return NextResponse.json({
    html: fallbackHtml,
    providerName: "Instagram",
  });
}
