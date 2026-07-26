import { LotusMark } from "@/components/lotus-mark";

interface CareersHeroProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
  image?: string;
  stat?: CareersHeroStat;
  chips?: string[];
  avatarImages?: string[];
  avatarCaption?: string;
}

export function CareersHero({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  compact = false,
  image,
  stat,
  chips,
  avatarImages,
  avatarCaption,
}: CareersHeroProps) {
  if (image) {
    return (
      <section
        className={`relative flex items-center overflow-hidden ${
          compact ? "py-16 sm:py-20 min-h-[22rem]" : "py-24 sm:py-32 min-h-[34rem] sm:min-h-[38rem]"
        }`}
      >
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/70 to-primary-dark/25"
          aria-hidden="true"
        />

        <div
          className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
            !compact ? "min-h-[22rem] flex flex-col justify-center" : ""
          }`}
        >
          <div className="max-w-xl">
            {!compact && avatarImages && avatarImages.length > 0 && (
              <div className="flex items-center gap-3 mb-6 animate-fade-up">
                <div className="flex -space-x-3">
                  {avatarImages.slice(0, 4).map((src, i) => (
                    <div
                      key={src}
                      className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden"
                      style={{ zIndex: 10 - i }}
                    >
                      <Image src={src} alt="" fill className="object-cover object-top" />
                    </div>
                  ))}
                </div>
                {avatarCaption && (
                  <span className="text-white/90 text-sm font-medium">{avatarCaption}</span>
                )}
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-up">
              {title}
            </h1>
            <p
              className="text-lg sm:text-xl text-white/80 animate-fade-up"
              style={{ animationDelay: "100ms" }}
            >
              {subtitle}
            </p>
            {ctaLabel && ctaHref && (
              <div className="mt-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <a
                  href={ctaHref}
                  className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-accent hover:text-white transition-colors focus-ring"
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>

          {!compact && chips && chips.length > 0 && (
            <div className="hidden lg:flex flex-col gap-3 absolute right-8 xl:right-16 top-16">
              {chips.map((chip, i) => (
                <span
                  key={chip}
                  className={`animate-fade-up text-sm font-medium px-5 py-2 rounded-full border ${
                    i === 1
                      ? "bg-white text-primary border-white self-center"
                      : "bg-white/15 text-white border-white/25 backdrop-blur-md self-end"
                  }`}
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}

          {!compact && stat && (
            <div
              className="hidden sm:block absolute bottom-8 right-4 sm:right-8 lg:right-16 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-6 py-5 text-white animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <p className="text-xs text-white/70 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative flex items-center bg-gradient-to-br from-primary-dark via-primary to-accent/80 ${
        compact ? "py-16 sm:py-20" : "py-24 sm:py-32"
      }`}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none"
        aria-hidden="true"
      />
      <LotusMark className="absolute -right-12 -bottom-16 w-80 h-80 text-white opacity-[0.06] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-up">
          {title}
        </h1>
        <p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          {subtitle}
        </p>
        {ctaLabel && ctaHref && (
          <div
            className="mt-8 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <a
              href={ctaHref}
              className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-full hover:bg-accent hover:text-white transition-colors focus-ring"
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
