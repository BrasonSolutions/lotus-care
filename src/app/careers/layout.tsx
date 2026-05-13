import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CareersSubnav } from "@/components/careers/careers-subnav";
import { navItems, contactInfo } from "@/data/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Careers at Lotus Care",
    default: "Careers | Lotus Care",
  },
  description:
    "Build a career that matters. Join the Lotus Care team and make a real difference in the lives of people with disabilities.",
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

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar navItems={navItems} contactInfo={contactInfo} />
      {/* Subnav sits immediately below the 64px navbar */}
      <CareersSubnav />
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
