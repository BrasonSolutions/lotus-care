import type { Testimonial } from "@/data/careers";

interface TestimonialCardProps {
  testimonial: Testimonial;
  /** Truncates the quote to 4 lines and fixes the card height, so a row of
   * cards stays uniform regardless of quote length. Off by default — only
   * opt in where cards sit side by side and must align (e.g. the marquee). */
  clampQuote?: boolean;
}

export function TestimonialCard({ testimonial, clampQuote = false }: TestimonialCardProps) {
  return (
    <figure
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col ${clampQuote ? "h-64" : ""}`}
    >
      <blockquote
        className={`text-foreground leading-relaxed italic flex-1 mb-6 ${clampQuote ? "line-clamp-4" : ""}`}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
          {testimonial.initials}
        </div>
        <div>
          <p className="font-semibold text-primary-dark text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted">
            {testimonial.role}
            {testimonial.yearsAtCompany && ` · ${testimonial.yearsAtCompany} year${testimonial.yearsAtCompany > 1 ? "s" : ""} at Lotus Care`}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
