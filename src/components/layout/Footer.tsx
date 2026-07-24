import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerNavigation } from "@/content/navigation";
import { site, socials } from "@/content/site";
import { footerContent } from "@/content/contact";
import { recruitmentCopy } from "@/config/recruitment";
import { BlurCloud } from "@/components/ui/BlurCloud";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

export function Footer() {
  // §26: the phone stays hidden until a real number is supplied.
  const hasPhone = site.phone.length > 0 && !site.phone.startsWith("[[");

  const renderSocialIcon = (label: string) => {
    if (label.includes("Instagram")) {
      return <InstagramIcon aria-hidden className="size-3.5 shrink-0" />;
    }
    if (label.includes("LinkedIn")) {
      return <LinkedinIcon aria-hidden className="size-3.5 shrink-0" />;
    }
    return <TwitterIcon aria-hidden className="size-3.5 shrink-0" />;
  };

  return (
    <footer className="relative isolate mt-auto w-full h-auto min-h-0 overflow-visible bg-surface-alt">
      <BlurCloud preset="glow" />

      <Container className="pt-8 sm:pt-10 pb-20 sm:pb-16 md:py-10">
        <div className="grid gap-8 md:gap-10 md:grid-cols-[1.4fr_1.5fr_1.1fr]">
          {/* Identity */}
          <div>
            <p className="font-heading text-lg sm:text-xl font-semibold text-foreground">
              {site.name}
            </p>
            <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-body">
              {footerContent.positioning}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-body">
              <MapPin aria-hidden className="size-3.5 text-primary shrink-0" />
              <span>{site.location}</span>
            </p>
          </div>

          {/* Sitemap — 2-column compact grid (§11) */}
          <nav aria-label="Footer" className="w-full">
            <h2 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">Explore</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs sm:text-sm text-body transition-colors hover:text-primary py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">Connect</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-body transition-colors hover:text-primary py-0.5"
                  >
                    {renderSocialIcon(social.label)}
                    <span>{social.handle}</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-body transition-colors hover:text-primary py-0.5 [overflow-wrap:anywhere] [word-break:break-word]"
                >
                  <Mail aria-hidden className="size-3.5 shrink-0" />
                  <span>{site.email}</span>
                </a>
              </li>
              {hasPhone && (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-body transition-colors hover:text-primary py-0.5"
                  >
                    <Phone aria-hidden className="size-3.5 shrink-0" />
                    <span>{site.phone}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2.5 border-t border-border-strong pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-body/70">
            {footerContent.copyright(new Date().getFullYear())}
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <p className="text-xs text-body/70">{site.role}</p>
            <Link
              href={recruitmentCopy.routeHref}
              className="text-xs text-body/70 transition-colors hover:text-primary"
            >
              {recruitmentCopy.footerLinkLabel}
            </Link>
            <Link
              href="/analytics/admin"
              rel="nofollow"
              className="text-xs text-body/40 transition-colors hover:text-primary"
            >
              {footerContent.adminLinkLabel}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
