import type { ReactNode } from "react";
import type { Testimonial } from "@/data/careers";

interface TestimonialCardProps {
  testimonial: Testimonial;
  // Clamps to 4 lines and fixes height so side-by-side cards align.
  clampQuote?: boolean;
  // Sits at the foot's right edge, opposite the attribution.
  action?: ReactNode;
}

export function TestimonialCard({ testimonial, clampQuote = false, action }: TestimonialCardProps) {
  return (
    <figure
      className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col ${clampQuote ? "h-64" : ""}`}
    >
      {testimonial.quote && (
        <blockquote
          className={`text-foreground leading-relaxed italic flex-1 mb-6 ${clampQuote ? "line-clamp-4" : ""}`}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      )}
      <figcaption className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-primary-dark text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted">
            {testimonial.role}
            {testimonial.yearsAtCompany && ` · ${testimonial.yearsAtCompany} year${testimonial.yearsAtCompany > 1 ? "s" : ""} at Lotus Care`}
          </p>
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </figcaption>
    </figure>
  );
}
