import type { Testimonial } from "@/data/careers";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
      <blockquote className="text-foreground leading-relaxed italic flex-1 mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
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
