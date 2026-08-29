import { SectionTitle } from "@/components/section-title";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/layout";
import { TestimonialCard } from "@/components/careers/testimonial-card";
import { serviceOwnerTestimonials } from "@/data/testimonial";
import { truncateWords } from "@/lib/truncate";

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
            <TestimonialCard
              key={testimonial.slug}
              testimonial={{
                name: testimonial.initials,
                role: testimonial.role,
                // Teaser only — the detail page carries the quote in full.
                quote: truncateWords(testimonial.quote),
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
