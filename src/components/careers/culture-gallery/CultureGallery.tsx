"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/data/careers";
import { SectionTitle } from "@/components/section-title";
import { Container } from "@/components/layout";

interface CultureGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

export function CultureGallery({
  images,
  title = "Life at Lotus Care",
  subtitle = "A glimpse into the day-to-day culture, homes, and people that make up our team.",
}: CultureGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
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
      const next = (activeIndex + direction + images.length) % images.length;
      scrollToIndex(next);
    },
    [activeIndex, scrollToIndex, images.length]
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
      const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth ?? 300;
      const gap = 24;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, images.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [images.length]);

  return (
    <section className="py-16 sm:py-20 bg-white">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="relative">
          {/* Arrows — visible on all screen sizes */}
          <button
            onClick={() => {
              pauseAutoScroll();
              scrollBy(-1);
            }}
            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-primary-dark hover:text-primary transition-colors focus-ring"
            aria-label="Previous photo"
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
            aria-label="Next photo"
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
            {images.map((image) => (
              <figure
                key={image.src}
                className="snap-start shrink-0 w-[calc(85vw)] sm:w-[300px] md:w-[320px] bg-warm-bg rounded-2xl overflow-hidden"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 320px, 85vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-4 text-sm font-medium text-primary-dark">
                  {image.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Dots — larger tap targets */}
        <div className="flex justify-center gap-2 mt-6">
          {images.map((image, i) => (
            <button
              key={image.src}
              onClick={() => {
                pauseAutoScroll();
                scrollToIndex(i);
              }}
              className="p-1 focus-ring rounded-full"
              aria-label={`Go to photo ${i + 1}`}
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
      </Container>
    </section>
  );
}
