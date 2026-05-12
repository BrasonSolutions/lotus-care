interface CareersCTAStripProps {
  heading?: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CareersCTAStrip({
  heading = "Ready to take the next step?",
  body = "Explore our open roles and find your place in the Lotus Care team.",
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
}: CareersCTAStripProps) {
  return (
    <section className="bg-gradient-to-r from-primary-dark to-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{heading}</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaHref}
            className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-accent hover:text-white transition-colors focus-ring"
          >
            {ctaLabel}
          </a>
          {secondaryLabel && secondaryHref && (
            <a
              href={secondaryHref}
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors focus-ring-white"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
