"use client";

import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/use-in-view";
import { Container } from "@/components/layout";
import { IrelandMap } from "@/components/ireland-map";
import { HIGHLIGHTED_COUNTIES } from "@/data/homes-map";

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

/**
 * Full-width row beneath the homes carousel: a muted autoplay video montage
 * (poster-only until the client supplies the file) on the left, a brand-
 * coloured map of Ireland highlighting the counties with Lotus Care homes
 * on the right. Stacks to video-over-map below `lg`.
 */
export function HomesSplitRow() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[3/2] min-w-0 after:content-[''] after:absolute after:inset-0 after:z-10 after:rounded-2xl after:border-4 after:border-primary after:pointer-events-none before:content-[''] before:absolute before:inset-2 before:z-10 before:rounded-xl before:border before:border-dashed before:border-teal-300 before:pointer-events-none">
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

          <div className="min-w-0">
            <IrelandMap
              highlightedCounties={HIGHLIGHTED_COUNTIES}
              className="w-full h-auto max-h-[28rem] mx-auto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
