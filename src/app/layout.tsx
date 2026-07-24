import type { Metadata, Viewport } from "next";
import { Inter, Sora, Caveat, Bebas_Neue } from "next/font/google";
import "@/styles/globals.css";
import { seo, site } from "@/content/site";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { RouteScrollManager } from "@/components/navigation/RouteScrollManager";
import { AIAssistantWidget } from "@/components/ui/AIAssistantWidget";

/**
 * Fonts are self-hosted by next/font at build time — no third-party request at
 * runtime, no layout shift, and no dependency on an external CDN staying up.
 */
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/**
 * `viewport-fit=cover` opts iOS Safari into edge-to-edge rendering so the
 * `env(safe-area-inset-*)` values on the header, chatbot, and drawer become
 * non-zero. User zoom is deliberately allowed — never set `user-scalable=no`
 * or `maximum-scale=1`.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.defaultTitle,
    template: `%s — ${site.name}`,
  },
  description: seo.defaultDescription,
  keywords: [...seo.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    url: site.url,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${caveat.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* §29: the first focusable element on every page. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <MotionProvider>
          <SmoothScrollProvider>
            <Suspense fallback={null}>
              <RouteScrollManager />
            </Suspense>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            {/* Mounted once globally (§13); hides itself on admin routes. */}
            <AIAssistantWidget />
            <Footer />
          </SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
