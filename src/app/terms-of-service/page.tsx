import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LegalDocument } from "@/components/legal-document";
import { termsOfService } from "@/data/legal";

export const metadata: Metadata = {
  title: termsOfService.title,
  description: termsOfService.description,
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar solidWhenTop />
      <main id="main" className="pt-16 nav:pt-26 min-h-screen bg-white">
        <LegalDocument doc={termsOfService} />
      </main>
      <Footer />
    </>
  );
}
