"use client";

import { useEffect, useRef } from "react";
import { useInView, usePrefersReducedMotion } from "@/hooks/use-in-view";
import { Container } from "@/components/layout";
import { IrelandMap } from "@/components/ireland-map";
import { HIGHLIGHTED_COUNTIES } from "@/data/homes-map";

const HOMES_MONTAGE = {
  src: "/videos/homes-montage.mp4",
  // First frame of the montage, so the poster-to-playback swap is seamless.
  poster: "/images/houses/homes-montage-poster.jpg",
  label: "Aerial montage of Lotus Care's homes and gardens",
} as const;

/**
 * Full-width row beneath the homes carousel: a muted looping video montage
 * of the homes on the left, a brand-coloured map of Ireland highlighting the
 * counties with Lotus Care homes on the right. Stacks to video-over-map
 * below `lg`.
 *
 * The montage is a ~14 MB file, so it is not autoplayed eagerly: `preload`
 * is off and playback starts only once the row scrolls into view. Under
 * `prefers-reduced-motion` it never plays on its own and exposes controls.
 */
export function HomesSplitRow() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.25 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    // A blocked autoplay is expected on some browsers and needs no handling:
    // the poster stays up and the controls-free montage is decorative.
    videoRef.current?.play().catch(() => {});
  }, [inView, prefersReducedMotion]);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          <div
            ref={ref}
            className="relative rounded-2xl overflow-hidden aspect-[3/2] min-w-0 after:content-[''] after:absolute after:inset-0 after:z-10 after:rounded-2xl after:border-4 after:border-primary after:pointer-events-none before:content-[''] before:absolute before:inset-2 before:z-10 before:rounded-xl before:border before:border-dashed before:border-teal-300 before:pointer-events-none"
          >
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              poster={HOMES_MONTAGE.poster}
              controls={prefersReducedMotion}
              aria-label={HOMES_MONTAGE.label}
              className="w-full h-full object-cover"
            >
              <source src={HOMES_MONTAGE.src} type="video/mp4" />
            </video>
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
