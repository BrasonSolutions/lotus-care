import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CareersSubnav } from "@/components/careers/careers-subnav";

export const metadata: Metadata = {
  title: {
    template: "%s | Careers at Lotus Care",
    default: "Careers | Lotus Care",
  },
  description:
    "Build a career that matters. Join the Lotus Care team and make a real difference in the lives of people with disabilities.",
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar solidWhenTop />
      {/* Subnav only renders at the lg breakpoint — see CareersSubnav */}
      <CareersSubnav />
      {/* pt-16 = 64px navbar (no subnav below lg); lg:pt-28 = navbar + subnav */}
      <main id="main" className="pt-16 lg:pt-28 min-h-screen bg-warm-bg">
        {children}
      </main>
      <Footer />
    </>
  );
}
