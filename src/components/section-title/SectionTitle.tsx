"use client";

import { useInView } from "@/hooks/use-in-view";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  /** Renders `title` in the brand display font (DM Sans) instead of the
   * default body font. Only changes anything when passed — every existing
   * caller keeps today's font. */
  dmSans?: boolean;
}

export function SectionTitle({
  title,
  subtitle,
  light,
  dmSans,
}: SectionTitleProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`reveal text-center mb-12 ${inView ? "in-view" : ""}`}
    >
      <h2
        className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${dmSans ? "font-dm-sans" : ""} ${light ? "text-white" : "text-primary-dark"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg max-w-2xl mx-auto ${light ? "text-white/80" : "text-muted"}`}>
          {subtitle}
        </p>
      )}
      <div
        className={`w-16 h-1 mx-auto mt-4 rounded-full ${light ? "bg-accent" : "bg-primary"}`}
      />
    </div>
  );
}
