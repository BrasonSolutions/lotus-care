"use client";

import { useState, useRef } from "react";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersBreadcrumb } from "@/components/careers/careers-breadcrumb";
import { contactInfo } from "@/data/navigation";

const roleOptions = [
  "Residential Support Worker",
  "Night Support Worker",
  "Social Care Leader",
  "Staff Nurse (RNID/RNMH)",
  "Senior Services Manager",
  "Clinical / Allied Health",
  "Administration",
  "Other",
];

export default function CareersContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    formRef.current?.reset();
  };

  return (
    <>
      <CareersHero
        title="Talk to Our Recruitment Team"
        subtitle="Have a question, or want to register your interest? We'd love to hear from you."
        compact
      />

      <div className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CareersBreadcrumb />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-primary-dark mb-2">Message Sent!</h2>
                  <p className="text-muted">
                    Thanks for getting in touch. Our recruitment team will respond within 2 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-primary hover:text-primary-dark transition-colors focus-ring rounded font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-5"
                  noValidate
                >
                  <h2 className="text-xl font-bold text-primary-dark mb-2">Send Us a Message</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="rec-name" className="block text-sm font-medium text-foreground mb-1.5">
                        Full Name <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="rec-name"
                        type="text"
                        required
                        autoComplete="name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="rec-email" className="block text-sm font-medium text-foreground mb-1.5">
                        Email Address <span className="text-red-500" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="rec-email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="rec-phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="rec-phone"
                      type="tel"
                      autoComplete="tel"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary transition-colors"
                      placeholder="+353 ..."
                    />
                  </div>

                  <div>
                    <label htmlFor="rec-role" className="block text-sm font-medium text-foreground mb-1.5">
                      Role Type of Interest
                    </label>
                    <select
                      id="rec-role"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary transition-colors bg-white"
                    >
                      <option value="">Select a role type…</option>
                      {roleOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="rec-message" className="block text-sm font-medium text-foreground mb-1.5">
                      Message <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="rec-message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us about yourself or your question…"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3.5 rounded-full font-semibold text-base hover:bg-primary-dark transition-colors focus-ring"
                  >
                    Send Message
                  </button>
                </form>
              )}
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
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors focus-ring rounded"
                >
                  Learn about our process →
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
