interface CareersHeroProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
}

export function CareersHero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  compact = false,
}: CareersHeroProps) {
  return (
    <section
      className={`relative flex items-center bg-gradient-to-br from-primary-dark via-primary to-accent/80 ${
        compact ? "py-16 sm:py-20" : "py-24 sm:py-32"
      }`}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-up">
          {title}
        </h1>
        <p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          {subtitle}
        </p>
        {ctaLabel && ctaHref && (
          <div
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <a
              href={ctaHref}
              className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-accent hover:text-white transition-colors focus-ring"
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
