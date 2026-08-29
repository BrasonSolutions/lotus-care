import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout";
import { serviceOwnerTestimonials } from "@/data/testimonial";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return serviceOwnerTestimonials.map((testimonial) => ({ slug: testimonial.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const testimonial = serviceOwnerTestimonials.find((t) => t.slug === slug);
  if (!testimonial) return {};
  const excerpt =
    testimonial.quote.length > 150 ? `${testimonial.quote.slice(0, 150).trim()}…` : testimonial.quote;
  return {
    title: `${testimonial.initials}, ${testimonial.role}`,
    description: excerpt,
  };
}

// Shown when a record carries no long-form piece; JW's is published in full.
const FALLBACK_BODY =
  "The full story behind this quote hasn't been published yet — the testimonial above is shared in full.";

export default async function TestimonialDetailPage({ params }: Params) {
  const { slug } = await params;
  const testimonial = serviceOwnerTestimonials.find((t) => t.slug === slug);
  if (!testimonial) notFound();

  return (
    <div className="py-10 sm:py-14">
      <Container width="reading">
        <Link
          href="/testimonials"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:text-teal-800 transition-colors focus-ring rounded mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All Testimonials
        </Link>

        <p className="font-dm-sans font-bold text-xs uppercase tracking-[0.15em] text-primary-dark">
          Testimonial
        </p>
        {testimonial.title && (
          <h1 className="font-dm-sans font-bold text-2xl sm:text-3xl text-primary-dark mt-2">
            {testimonial.title}
          </h1>
        )}
        <figcaption className="flex items-center gap-3 mt-6">
          <div className="w-11 h-11 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
            {testimonial.initials}
          </div>
          <div>
            <p className="font-semibold text-primary-dark text-sm">
              {testimonial.initials}, {testimonial.role}
            </p>
            {/* text-neutral-600, not text-muted — text-muted fails AA on bg-warm-bg (measured). */}
            <p className="text-xs text-neutral-600">{testimonial.date}</p>
          </div>
        </figcaption>

        <div className="mt-10 pt-10 border-t border-gray-200 space-y-5">
          {testimonial.body?.length ? (
            testimonial.body.map((paragraph) => (
              <p key={paragraph} className="text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-foreground leading-relaxed">{FALLBACK_BODY}</p>
          )}
        </div>
      </Container>
    </div>
  );
}
