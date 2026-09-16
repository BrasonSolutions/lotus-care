import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LegalDocument } from "@/components/legal-document";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar solidWhenTop />
      <main id="main" className="pt-16 nav:pt-26 min-h-screen bg-white">
        <LegalDocument doc={privacyPolicy} />
      </main>
      <Footer />
    </>
  );
}
