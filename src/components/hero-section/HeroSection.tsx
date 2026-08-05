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
  ctaLabel?: string;
  ctaHref?: string;
}

export function HeroSection({
  title,
  titleHighlight,
  subtitle,
  ctaLabel = "Read More",
  ctaHref = "#about",
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
            <a
              href={ctaHref}
              className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-accent transition-colors focus-ring animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              {ctaLabel}
            </a>
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
