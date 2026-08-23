import Image from "next/image";
import type { VideoTestimonial } from "@/data/careers";

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonial;
  accent?: "teal" | "purple";
  /** Defaults to the 3-column grid's own breakpoints. Pass an override
   * when the card renders at a different width (e.g. a single large
   * featured card) so Next doesn't serve an under-resolved image. */
  sizes?: string;
}

const BADGE = {
  teal: "bg-primary-dark",
  purple: "bg-purple-600",
} as const;

const DEFAULT_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function VideoTestimonialCard({
  testimonial,
  accent = "teal",
  sizes = DEFAULT_SIZES,
}: VideoTestimonialCardProps) {
  const { name, role, poster, videoSrc, captionsSrc } = testimonial;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="relative aspect-video bg-gray-100">
        {videoSrc ? (
          <video controls poster={poster} preload="none" className="w-full h-full object-cover">
            <source src={videoSrc} />
            {captionsSrc && (
              <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
            )}
          </video>
        ) : (
          <>
            <Image
              src={poster}
              alt={`${name}, ${role} at Lotus Care`}
              fill
              sizes={sizes}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div
                className="w-14 h-14 rounded-full bg-white/85 flex items-center justify-center"
                aria-hidden="true"
              >
                <svg className="w-5 h-5 text-primary translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <span className={`absolute top-3 right-3 ${BADGE[accent]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
              Coming soon
            </span>
          </>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-primary-dark">{name}</h3>
        <p className="text-sm text-muted">{role}</p>
      </div>
    </div>
  );
}
