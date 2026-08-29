"use client";

import { useInView } from "@/hooks/use-in-view";
import { ContactForm } from "@/components/contact-form";
import { contactFields } from "@/data/forms";
import { SectionTitle } from "@/components/section-title";
import { Container } from "@/components/layout";

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  contactInfo: { phone: string; email: string; address: string };
}

export function ContactSection({
  title = "Get in Touch",
  subtitle = "We'd love to hear from you. Reach out to learn more about our services.",
  contactInfo,
}: ContactSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1 });
  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />

        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""} grid lg:grid-cols-2 gap-8 lg:gap-12 mt-8`}
        >
          {/* Form */}
          <div>
            <ContactForm kind="contact" fields={contactFields} />
          </div>

          {/* Info card */}
          <div className={`reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
            <div className="bg-warm-bg rounded-2xl p-8 h-full">
              <h3 className="text-xl font-bold text-primary-dark mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-muted hover:text-primary transition-colors focus-ring rounded">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-muted hover:text-primary transition-colors focus-ring rounded">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted">{contactInfo.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-foreground mb-3">
                  Office Hours
                </p>
                <div className="text-sm text-muted space-y-1">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday - Sunday: Closed</p>
                  <p className="text-primary-dark font-medium mt-2">
                    Care services operate 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
