import { SectionTitle } from "@/components/section-title";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/layout";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { serviceOwnerTestimonials } from "@/data/testimonial";

export default function TestimonialsPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        {/* Not SectionTitle's `subtitle` — its text-muted fails AA on bg-warm-bg (measured). */}
        <SectionTitle dmSans title="Testimonials" />
        <p className="text-neutral-600 text-lg max-w-2xl mx-auto text-center -mt-8 mb-12">
          Real voices from the people we support, in their own words.
        </p>
        <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceOwnerTestimonials.map((testimonial) => (
            <div key={testimonial.slug} className="flex flex-col gap-4">
              <TestimonialCard
                testimonial={{
                  name: testimonial.initials,
                  role: testimonial.role,
                  quote: testimonial.quote,
                  initials: testimonial.initials,
                }}
              />
              <a
                href={`/testimonials/${testimonial.slug}`}
                className="block text-center bg-primary-dark text-white py-2.5 rounded-full text-sm font-semibold hover:bg-teal-800 transition-colors focus-ring"
              >
                Read testimonial
              </a>
            </div>
          ))}
        </Reveal>
      </Container>
    </div>
  );
}
