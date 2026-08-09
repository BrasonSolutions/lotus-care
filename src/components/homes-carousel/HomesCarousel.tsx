"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Home } from "@/data/homes";
import { useInView } from "@/hooks/use-in-view";
import { SectionTitle } from "@/components/section-title";
import { HomeModal } from "@/components/home-modal";
import { Container } from "@/components/layout";

interface HomesCarouselProps {
  homes: Home[];
  title?: string;
  subtitle?: string;
  /** Skips the section chrome (SectionTitle + Container) for use inside a
   * parent-owned layout, e.g. the homes split row. Every interactive
   * behaviour — scroll, arrows, dots, auto-scroll, modal — is unchanged.
   * Defaults to false so existing callers keep today's behaviour. */
  embedded?: boolean;
}

export function HomesCarousel({
  homes,
  title = "Our Homes",
  subtitle = "Eight unique homes across Co. Offaly and the Midlands, each designed to feel like home.",
  embedded = false,
}: HomesCarouselProps) {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (!card) return;
    container.scrollTo({
      left: card.offsetLeft - container.offsetLeft - 16,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const next = (activeIndex + direction + homes.length) % homes.length;
      scrollToIndex(next);
    },
    [activeIndex, scrollToIndex, homes.length]
  );

  // Auto-scroll — paused when prefers-reduced-motion is set
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        scrollBy(1);
      }, 5000);
    };

    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [scrollBy]);

  const pauseAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  // Track scroll position for dots
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (scrollLeft >= maxScrollLeft - 1) {
        setActiveIndex(homes.length - 1);
        return;
      }
      const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth ?? 300;
      const gap = 24;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, homes.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [homes.length]);

  const carousel = (
    <>
      <div ref={sectionRef} className={`reveal ${inView ? "in-view" : ""}`}>
        {/* Carousel container */}
        <div className="relative">
            {/* Arrows — visible on all screen sizes */}
            <button
              onClick={() => {
                pauseAutoScroll();
                scrollBy(-1);
              }}
              className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-dark hover:text-primary transition-colors focus-ring"
              aria-label="Previous home"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => {
                pauseAutoScroll();
                scrollBy(1);
              }}
              className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-dark hover:text-primary transition-colors focus-ring"
              aria-label="Next home"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Cards */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-1"
              onMouseEnter={pauseAutoScroll}
            >
              {homes.map((home) => (
                <button
                  key={home.name}
                  onClick={() => setSelectedHome(home)}
                  className="card-hover relative snap-start shrink-0 w-[calc(85vw)] sm:w-[300px] md:w-[320px] bg-warm-bg rounded-2xl overflow-hidden text-left group focus-ring after:content-[''] after:absolute after:inset-0 after:rounded-2xl after:border-4 after:border-primary after:pointer-events-none before:content-[''] before:absolute before:inset-2 before:rounded-xl before:border before:border-dashed before:border-teal-300 before:pointer-events-none"
                >
                  {/* Color header */}
                  <div
                    className="h-36 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${home.color}30, ${home.color}15)`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                      style={{ background: home.color }}
                    >
                      {home.name[0]}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-primary-dark mb-2 group-hover:text-primary transition-colors">
                      {home.name}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {home.shortDescription}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dots — larger tap targets */}
          <div className="flex justify-center gap-2 mt-6">
            {homes.map((home, i) => (
              <button
                key={home.name}
                onClick={() => {
                  pauseAutoScroll();
                  scrollToIndex(i);
                }}
                className="p-1 focus-ring rounded-full"
                aria-label={`Go to ${home.name}`}
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === activeIndex
                      ? "bg-primary w-8 h-4"
                      : "bg-gray-300 hover:bg-gray-400 w-4 h-4"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <a
              href="#contact"
              className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors focus-ring"
            >
              Enquire About Our Homes
            </a>
        </div>
      </div>

      <HomeModal home={selectedHome} onClose={() => setSelectedHome(null)} />
    </>
  );

  if (embedded) return carousel;

  return (
    <section id="homes" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />
        {carousel}
      </Container>
    </section>
  );
}
