import Link from "next/link";
import { LogoWhite } from "@/components/logo-white";
import { SocialLinks } from "@/components/social-links";
import { Container } from "@/components/layout";
import { contactInfo as defaultContactInfo } from "@/data/navigation";
import { quickLinks as defaultQuickLinks, serviceNames as defaultServiceNames } from "@/data/footer";

interface FooterProps {
  contactInfo?: { phone: string; email: string; address: string };
  quickLinks?: Array<{ label: string; href: string }>;
  serviceNames?: string[];
}

export function Footer({
  contactInfo = defaultContactInfo,
  quickLinks = defaultQuickLinks,
  serviceNames = defaultServiceNames,
}: FooterProps) {
  return (
    <footer className="bg-primary-dark text-white">
      <Container className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <LogoWhite className="h-12 w-auto mb-4" />
            <p className="text-white/70 text-base leading-relaxed">
              As an award-winning care provider, Lotus Care is committed to the
              highest standards of care excellence, delivered with pride,
              compassion, and support to enhance the quality of lives of people
              with additional needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-base text-white/70 hover:text-accent transition-colors focus-ring-white rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2.5">
              {serviceNames.map((service) => (
                <li key={service}>
                  <span className="text-base text-white/70">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-base text-white/70">
              <a
                href={`tel:${contactInfo.phone}`}
                className="block hover:text-accent transition-colors focus-ring-white rounded"
              >
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block hover:text-accent transition-colors focus-ring-white rounded"
              >
                {contactInfo.email}
              </a>
              <p>{contactInfo.address}</p>
            </div>

            <SocialLinks
              className="gap-3 mt-6"
              linkClassName="w-10 h-10 p-2 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/20 transition-colors focus-ring-white"
              iconClassName="w-5 h-5 text-white/80"
            />
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Lotus Care. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors focus-ring-white rounded">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-accent transition-colors focus-ring-white rounded">Terms of Service</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
