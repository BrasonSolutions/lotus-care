import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Testimonials | Lotus Care",
    default: "Testimonials | Lotus Care",
  },
  description:
    "Read testimonials from the people Lotus Care supports, in their own words.",
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar solidWhenTop />
      {/* Same navbar-clearance padding as careers/quality; no subnav here */}
      <main id="main" className="pt-16 nav:pt-28 min-h-screen bg-warm-bg">
        {children}
      </main>
      <Footer />
    </>
  );
}
