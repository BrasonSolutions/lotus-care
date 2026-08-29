import type { ReactNode } from "react";
import type { Testimonial } from "@/data/careers";

// Two presets: the default used across careers, and a roomier listing card.
const SIZES = {
  default: { pad: "p-6", avatar: "w-10 h-10 text-sm", name: "text-sm", role: "text-xs" },
  large: { pad: "p-8 sm:p-10", avatar: "w-16 h-16 text-lg", name: "text-lg", role: "text-sm" },
} as const;

interface TestimonialCardProps {
  testimonial: Testimonial;
  // Clamps to 4 lines and fixes height so side-by-side cards align.
  clampQuote?: boolean;
  // Sits at the foot's right edge, opposite the attribution.
  action?: ReactNode;
  size?: keyof typeof SIZES;
}

export function TestimonialCard({
  testimonial,
  clampQuote = false,
  action,
  size = "default",
}: TestimonialCardProps) {
  const s = SIZES[size];

  return (
    <figure
      className={`bg-white rounded-2xl ${s.pad} shadow-sm border border-gray-100 flex flex-col ${clampQuote ? "h-64" : ""}`}
    >
      {testimonial.quote && (
        <blockquote
          className={`text-foreground leading-relaxed italic flex-1 mb-6 ${clampQuote ? "line-clamp-4" : ""}`}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
      )}
      <figcaption className="flex items-center gap-3">
        <div
          className={`${s.avatar} rounded-full bg-primary-dark flex items-center justify-center text-white font-bold shrink-0`}
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className={`font-semibold text-primary-dark ${s.name}`}>{testimonial.name}</p>
          <p className={`${s.role} text-muted`}>
            {testimonial.role}
            {testimonial.yearsAtCompany && ` · ${testimonial.yearsAtCompany} year${testimonial.yearsAtCompany > 1 ? "s" : ""} at Lotus Care`}
          </p>
        </div>
        {action && <div className="ml-auto shrink-0">{action}</div>}
      </figcaption>
    </figure>
  );
}
