"use client";

import Image from "next/image";
import type { Home } from "@/data/homes";
import { usePrefersReducedMotion } from "@/hooks/use-in-view";
import { SectionTitle } from "@/components/section-title";
import { Container } from "@/components/layout";
import { HomesCarousel } from "@/components/homes-carousel";

interface HomesMontage {
  /** Absolute path under /public, e.g. "/videos/homes-montage.mp4". Left
   * unset until the client supplies the montage — the component renders
   * the poster alone until then, no other change needed once it lands. */
  src?: string;
  poster: string;
  alt: string;
}

// Client-pending asset. Drop the montage file under public/videos/ and set
// `src` here — the poster-only fallback below swaps out automatically.
const HOMES_MONTAGE: HomesMontage = {
  poster: "/images/houses/apple_hill/Ah-Picture1.jpg",
  alt: "Exterior of one of Lotus Care's eight homes",
};

interface HomesSplitRowProps {
  homes: Home[];
}

/**
 * Full-width "Our Homes" row: a muted autoplay video montage (poster-only
 * until the client supplies the file) on the left, the existing homes
 * carousel — resized to its half, fully interactive — on the right.
 * Stacks to video-over-carousel below `lg`.
 */
export function HomesSplitRow({ homes }: HomesSplitRowProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="homes" className="py-20 lg:py-28 bg-white">
      <Container>
        <SectionTitle
          title="Our Homes"
          subtitle="Eight unique homes across Co. Offaly and the Midlands, each designed to feel like home."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[3/2] min-w-0">
            {HOMES_MONTAGE.src ? (
              <video
                muted
                loop
                playsInline
                poster={HOMES_MONTAGE.poster}
                autoPlay={!prefersReducedMotion}
                controls={prefersReducedMotion}
                className="w-full h-full object-cover"
              >
                <source src={HOMES_MONTAGE.src} />
              </video>
            ) : (
              <Image
                src={HOMES_MONTAGE.poster}
                alt={HOMES_MONTAGE.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>

          {/* min-w-0: without an explicit minimum, this grid item's
              automatic min-width defaults to its content size — the
              carousel's horizontally-scrolling card row would otherwise
              force the grid track (and its sibling) wider instead of
              scrolling within it. */}
          <div className="min-w-0">
            <HomesCarousel homes={homes} embedded />
          </div>
        </div>
      </Container>
    </section>
  );
}
