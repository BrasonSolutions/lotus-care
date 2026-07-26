import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QualitySubnav } from "@/components/quality/quality-subnav";

export const metadata: Metadata = {
  title: {
    template: "%s | Quality & Governance | Lotus Care",
    default: "Quality & Governance | Lotus Care",
  },
  description:
    "Lotus Care's commitment to safe, rights-based, person-centred care — governance, oversight, and continuous improvement.",
};

export default function QualityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar solidWhenTop />
      {/* Subnav only renders at the lg breakpoint — see QualitySubnav */}
      <QualitySubnav />
      {/* pt-16 = 64px navbar (no subnav below lg); lg:pt-28 = navbar + subnav */}
      <main id="main" className="pt-16 lg:pt-28 min-h-screen bg-warm-bg">
        {children}
      </main>
      <Footer />
    </>
  );
}
