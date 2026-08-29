import type { Metadata } from "next";
import Image from "next/image";
import { Blob } from "@/components/blob";
import { LotusMark } from "@/components/lotus-mark";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/layout";
import { referralFields } from "@/data/forms";
import { contactInfo } from "@/data/navigation";

export const metadata: Metadata = {
  title: "Referrals",
  description:
    "Make a referral to Lotus Care's residential and non-residential respite services for people with intellectual and physical additional needs.",
};

export default function ReferralsPage() {
  return (
    <>
      <Navbar solidWhenTop />
      {/* nav:pt-26 = 40px contact strip + 64px navbar; no subnav on this page */}
      {/* overflow-hidden lives here, not on the hero, so blobs bleed past it without a scrollbar */}
      <main id="main" className="relative overflow-hidden pt-16 nav:pt-26 min-h-screen bg-warm-bg">
        <section className="relative py-16 sm:py-20">
          <Blob color="teal" variant={1} opacity={0.18} className="absolute -top-20 -left-16 w-72 h-72" />
          <Blob color="purple" variant={3} opacity={0.18} className="absolute -bottom-24 -left-24 w-64 h-64" />
          <Blob color="teal" variant={2} opacity={0.18} className="absolute -top-16 -right-20 w-72 h-72" />
          <LotusMark className="hidden sm:block absolute right-8 bottom-6 w-40 h-40 text-teal-700 opacity-15 pointer-events-none" />

          <Container className="relative text-center">
            <h1 className="font-dm-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark mb-4 animate-fade-up">
              Referrals
            </h1>
            <p
              className="text-lg sm:text-xl text-muted max-w-2xl mx-auto animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              Tell us about the person you&apos;d like to refer and our team will be in touch to
              talk through the next steps.
            </p>
          </Container>
        </section>

        <div className="relative py-10 sm:py-14">
          <Container>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-8">
              <span className="text-sm font-medium text-muted">Regulated by</span>
              <Image
                src="/images/logos/hiqa.png"
                alt="Health Information and Quality Authority (HIQA)"
                width={426}
                height={300}
                className="h-12 w-auto"
              />
              <Image
                src="/images/logos/tusla.png"
                alt="Tusla — Child and Family Agency"
                width={472}
                height={305}
                className="h-12 w-auto"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <ContactForm
                  kind="referral"
                  fields={referralFields}
                  heading="Make a Referral"
                  submitLabel="Send Referral"
                  successTitle="Referral Received"
                  successMessage="Thank you. Our team will review the referral and come back to you as soon as possible."
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5"
                />
              </div>

              <aside className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-bold text-primary-dark mb-4">Prefer to Talk to Us?</h2>
                  <div className="space-y-3 text-sm">
                    <p>
                      <span className="block font-medium text-foreground">Phone</span>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-muted hover:text-primary transition-colors focus-ring rounded"
                      >
                        {contactInfo.phone}
                      </a>
                    </p>
                    <p>
                      <span className="block font-medium text-foreground">Email</span>
                      <a
                        href="mailto:referals@lotuscare.ie"
                        className="text-muted hover:text-primary transition-colors focus-ring rounded"
                      >
                        referals@lotuscare.ie
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="font-bold text-primary-dark mb-2">What Happens Next</h2>
                  <p className="text-sm text-muted leading-relaxed">
                    Our team reviews every referral and will contact you to discuss the person&apos;s
                    needs and the support we can offer.
                  </p>
                </div>
              </aside>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}
