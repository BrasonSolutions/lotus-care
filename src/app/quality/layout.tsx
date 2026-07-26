import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QualitySubnav } from "@/components/quality/quality-subnav";
import { navItems, contactInfo } from "@/data/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Quality & Governance | Lotus Care",
    default: "Quality & Governance | Lotus Care",
  },
  description:
    "Lotus Care's commitment to safe, rights-based, person-centred care — governance, oversight, and continuous improvement.",
};

const quickLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Our Services", href: "/#services" },
  { label: "Our Homes", href: "/#homes" },
  { label: "Meet the Team", href: "/#team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/#contact" },
];

const serviceNames = [
  "Community Residential Living",
  "Residential Respite Care",
  "MDT Pathways",
  "Model of Care",
  "Person Centred Planning",
  "Community Integration",
];

export default function QualityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={navItems} contactInfo={contactInfo} solidWhenTop />
      {/* Subnav sits immediately below the 64px navbar */}
      <QualitySubnav />
      {/* pt-28 = 64px navbar + 48px subnav */}
      <main id="main" className="pt-28 min-h-screen bg-warm-bg">
        {children}
      </main>
      <Footer
        contactInfo={contactInfo}
        quickLinks={quickLinks}
        serviceNames={serviceNames}
      />
    </>
  );
}
