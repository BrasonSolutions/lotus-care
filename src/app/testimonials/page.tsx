import { redirect } from "next/navigation";
import { SectionTitle } from "@/components/section-title";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/layout";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { serviceOwnerTestimonials } from "@/data/testimonial";

export default function TestimonialsPage() {
  // #122 — this hub is no longer linked anywhere; its content now lives as
  // the closing "Testimonials" section on /quality/model-of-care instead.
  // Redirecting rather than deleting: the page/data below stays in the
  // codebase for whenever it's needed again (see careers/page.tsx for the
  // same pattern). /testimonials/[slug] detail pages are unaffected and
  // still resolve directly.
  redirect("/quality/model-of-care#testimonials");

  return (
    <div className="py-10 sm:py-14">
      <Container>
        {/* Not SectionTitle's `subtitle` — its text-muted fails AA on bg-warm-bg (measured). */}
        <SectionTitle dmSans title="Testimonials" />
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto text-center -mt-8 mb-12">
          Real voices from the people we support, in their own words.
        </p>
        <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceOwnerTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.slug}
              size="large"
              testimonial={{
                name: testimonial.initials,
                role: testimonial.role,
                // No excerpt on the card — the story lives on the detail page.
                quote: "",
                initials: testimonial.initials,
              }}
              action={
                <a
                  href={`/testimonials/${testimonial.slug}`}
                  aria-label={`Read the full testimonial from ${testimonial.initials}, ${testimonial.role}`}
                  className="inline-block bg-primary-dark text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-800 transition-colors focus-ring"
                >
                  Read more
                </a>
              }
            />
          ))}
        </Reveal>
      </Container>
    </div>
  );
}
