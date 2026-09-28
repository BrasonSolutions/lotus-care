import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Container } from "@/components/layout";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
};

const links = [
  { label: "Our Services", href: "/#services", variant: "onDarkOutline" as const },
  { label: "Referrals", href: "/referrals", variant: "onDark" as const },
  // The homepage ContactSection anchor; the nav has no Contact item.
  { label: "Contact", href: "/#contact", variant: "onDarkOutline" as const },
];

export default function NotFound() {
  return (
    <>
      <Navbar solidWhenTop />
      <main id="main" className="pt-16 min-h-screen bg-warm-bg">
        <section className="bg-primary-dark py-20 lg:py-28">
          <Container className="text-center">
            <h1 className="font-dm-sans text-4xl md:text-5xl font-bold text-white mb-6">
              We can&apos;t find that page
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto">
              The page may have moved or no longer exists, but these links will get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {links.map((link) => (
                <Button key={link.href} href={link.href} variant={link.variant} size="lg">
                  {link.label}
                </Button>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
