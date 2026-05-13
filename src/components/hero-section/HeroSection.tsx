import Image from "next/image";
import { LogoWhite } from "@/components/logo-white";

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
    <section className="relative min-h-screen flex items-center justify-center bg-primary-dark overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/home-bg.jpg"
        alt=""
        fill
        className="object-cover opacity-100"
        priority
      />
      {/* Teal colour overlay — keeps brand colour while letting image show through */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/75 via-primary-dark/65 to-primary-dark/80" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <LogoWhite className="mx-auto mb-8 h-16 md:h-20 w-auto animate-fade-in" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
          {title}{" "}
          <span className="text-accent">{titleHighlight}</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "200ms" }}>
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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 motion-safe:animate-bounce" aria-hidden="true">
        <svg
          className="w-6 h-6 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
