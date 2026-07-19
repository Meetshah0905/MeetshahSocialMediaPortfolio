import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerNavigation } from "@/content/navigation";
import { site, socials } from "@/content/site";
import { footerContent } from "@/content/contact";
import { BlurCloud } from "@/components/ui/BlurCloud";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";

export function Footer() {
  // §26: the phone stays hidden until a real number is supplied.
  const hasPhone = site.phone.length > 0 && !site.phone.startsWith("[[");

  const renderSocialIcon = (label: string) => {
    if (label.includes("Instagram")) {
      return <InstagramIcon aria-hidden className="size-4" />;
    }
    if (label.includes("LinkedIn")) {
      return <LinkedinIcon aria-hidden className="size-4" />;
    }
    return <TwitterIcon aria-hidden className="size-4" />;
  };

  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-surface-alt">
      <BlurCloud preset="glow" />

      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1.2fr]">
          {/* Identity */}
          <div>
            <p className="font-heading text-xl font-semibold text-foreground">
              {site.name}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-body">
              {footerContent.positioning}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-body">
              <MapPin aria-hidden className="size-4 text-primary" />
              {site.location}
            </p>
          </div>

          {/* Sitemap — every public route, including those the desktop nav omits. */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-medium text-foreground">Explore</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-body transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-medium text-foreground">Connect</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-primary"
                  >
                    {renderSocialIcon(social.label)}
                    {social.handle}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-primary"
                >
                  <Mail aria-hidden className="size-4" />
                  {site.email}
                </a>
              </li>
              {hasPhone && (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-sm text-body transition-colors hover:text-primary"
                  >
                    <Phone aria-hidden className="size-4" />
                    {site.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border-strong pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-body/70">
            {footerContent.copyright(new Date().getFullYear())}
          </p>
          <div className="flex items-center gap-5">
            <p className="text-xs text-body/70">{site.role}</p>
            {/* Subtle by design (§27). */}
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
