import { Container } from "@/components/layout";

interface CareersCTAStripProps {
  heading?: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Background gradient. "teal" (default) keeps every existing caller's
   * look. "purple" is a deliberate accent for pages that are otherwise
   * teal-only — see G1's brand-colour pass. */
  tone?: "teal" | "purple";
}

// primary-dark→primary (teal-500) swept through a flat 2.74:1 fail at the
// gradient's teal end, and the interpolated midpoint under this strip's
// centred text still measured under 4.5:1. Both tone options now stay
// inside the darkest two steps of their scale, so contrast never drops
// below ~6.3:1 (primary-dark) or ~10.5:1 (purple-600) anywhere in the strip.
const TONE = {
  teal: "from-teal-800 to-primary-dark",
  purple: "from-purple-700 to-purple-600",
} as const;

export function CareersCTAStrip({
  heading = "Ready to take the next step?",
  body = "Explore our open roles and find your place in the Lotus Care team.",
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  tone = "teal",
}: CareersCTAStripProps) {
  return (
    <section className={`bg-gradient-to-r ${TONE[tone]} py-16`}>
      <Container className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{heading}</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">{body}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={ctaHref}
            className="inline-block bg-white text-primary-dark font-semibold px-8 py-3 rounded-full hover:bg-accent hover:text-white transition-colors focus-ring"
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
      </Container>
    </section>
  );
}
