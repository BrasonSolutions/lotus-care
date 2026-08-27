import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
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
      <CareersHero
        title="Referrals"
        subtitle="Tell us about the person you'd like to refer and our team will be in touch to talk through the next steps."
        compact
        image="/images/stock/community-friends.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          {/* TODO(#86): HIQA and Tusla logos go here — waiting on the assets
              from the client. */}

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
    </>
  );
}
