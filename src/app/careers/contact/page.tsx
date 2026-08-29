import type { Metadata } from "next";
import { CareersHero } from "@/components/careers/careers-hero";
import { ContactForm } from "@/components/contact-form";
import { recruitmentFields } from "@/data/forms";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { contactInfo } from "@/data/navigation";
import { Container } from "@/components/layout";

export const metadata: Metadata = {
  title: "Contact Recruitment",
  description:
    "Talk to the Lotus Care recruitment team about roles, applications, or registering your interest.",
};


export default function CareersContactPage() {
  return (
    <>
      <CareersHero
        title="Talk to Our Recruitment Team"
        subtitle="Have a question, or want to register your interest? We'd love to hear from you."
        compact
        image="/images/stock/dignity-activity.jpg"
      />

      <div className="py-10 sm:py-14">
        <Container>
          <CareersBreadcrumb />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm
                kind="recruitment"
                fields={recruitmentFields}
                heading="Send Us a Message"
                successTitle="Message Sent!"
                successMessage="Thanks for getting in touch. Our recruitment team will respond within 2 business days."
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5"
              />
            </div>

            {/* Contact info */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-dark mb-4">Contact Details</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${contactInfo.phone}`} className="text-foreground hover:text-primary transition-colors focus-ring rounded">
                      {contactInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${contactInfo.email}`} className="text-foreground hover:text-primary transition-colors focus-ring rounded">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-dark mb-2">Response Time</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Our recruitment team aims to respond to all enquiries within{" "}
                  <strong className="text-foreground">2 business days</strong>.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-primary-dark mb-2">Questions about our process?</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  Visit our How We Hire page for step-by-step information and FAQs.
                </p>
                <a
                  href="/careers/how-we-hire"
                  className="text-sm font-medium text-primary-dark hover:text-teal-800 transition-colors focus-ring rounded"
                >
                  Learn about our process →
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </>
  );
}
