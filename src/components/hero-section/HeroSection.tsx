import Image from "next/image";
import { Container } from "@/components/layout";

/**
 * Art direction: warm, candid, natural light — real people engaged in an
 * activity together, real homes. Avoid posed hand-holding, wheelchair-
 * from-behind framing, pity framing, or uniformed staff.
 *
 * This is licensed Unsplash stock used as a swap-ready placeholder (see
 * public/images/stock/CREDITS.md). Commissioned photography of real
 * service users requires documented consent under HIQA before use — a
 * client decision, not a build decision. Single edit point below.
 */
const HERO_IMAGE = {
  src: "/images/stock/community-friends.jpg",
  alt: "Friends laughing together while spending time outdoors",
};

interface HeroSectionProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export function HeroSection({
  title,
  titleHighlight,
  subtitle,
  primaryCtaLabel = "Our Services",
  primaryCtaHref = "#services",
  secondaryCtaLabel = "Careers",
  secondaryCtaHref = "/careers",
}: HeroSectionProps) {
  return (
    <section className="relative bg-primary-dark overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Message — owns the hierarchy, sits on solid brand background */}
          <div className="text-center lg:text-left">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              {title}{" "}
              <span className="text-accent">{titleHighlight}</span>
            </h1>
            <p
              className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              {subtitle}
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              {/* Primary — white fill clears 3:1 against bg-primary-dark (6.34:1);
                  teal-700 label clears 4.5:1 against the white fill (6.34:1). */}
              <a
                href={primaryCtaHref}
                className="inline-block bg-white text-primary-dark px-8 py-4 rounded-full text-lg font-semibold hover:bg-teal-100 transition-colors focus-ring text-center"
              >
                {primaryCtaLabel}
              </a>
              {/* Secondary — outline on the dark hero; white border/text clears
                  both the 3:1 boundary and 4.5:1 text ratios (6.34:1) against
                  bg-primary-dark. Matches CareersCTAStrip's dark-bg outline CTA. */}
              <a
                href={secondaryCtaHref}
                className="inline-block border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-colors focus-ring-white text-center"
              >
                {secondaryCtaLabel}
              </a>
            </div>
          </div>

          {/* Image — contained, supporting element, never the background */}
          <div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 animate-fade-in"
            style={{ animationDelay: "150ms" }}
          >
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 80vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
