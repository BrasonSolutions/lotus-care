import Image from "next/image";
import { LotusMark } from "@/components/lotus-mark";
import { Container } from "@/components/layout";

interface CareersHeroStat {
  value: string;
  label: string;
}
interface CareersHeroProps {
  title: string;
  /** Renders in accent colour after title; omit to keep plain white text. */
  titleHighlight?: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  compact?: boolean;
  image?: string;
  stat?: CareersHeroStat;
  chips?: string[];
  avatarImages?: string[];
  avatarCaption?: string;
}

function HeroTitle({ title, titleHighlight }: Pick<CareersHeroProps, "title" | "titleHighlight">) {
  return (
    <h1 className="font-dm-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-up">
      {title}
      {titleHighlight && <span className="text-blossom"> {titleHighlight}</span>}
    </h1>
  );
}

type HeroCTAsProps = Pick<
  CareersHeroProps,
  "ctaLabel" | "ctaHref" | "secondaryCtaLabel" | "secondaryCtaHref"
> & { align: "start" | "center" };

function HeroCTAs({ ctaLabel, ctaHref, secondaryCtaLabel, secondaryCtaHref, align }: HeroCTAsProps) {
  if (!ctaLabel || !ctaHref) return null;
  return (
    <div
      className={`mt-8 flex flex-wrap ${align === "center" ? "justify-center " : ""}gap-4 animate-fade-up`}
      style={{ animationDelay: "200ms" }}
    >
      <a
        href={ctaHref}
        className="inline-block bg-white text-primary-dark font-semibold px-8 py-4 rounded-full hover:bg-accent hover:text-white transition-colors focus-ring"
      >
        {ctaLabel}
      </a>
      {secondaryCtaLabel && secondaryCtaHref && (
        <a
          href={secondaryCtaHref}
          className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors focus-ring-white"
        >
          {secondaryCtaLabel}
        </a>
      )}
    </div>
  );
}

type HeroAvatarRowProps = Pick<CareersHeroProps, "compact" | "avatarImages" | "avatarCaption">;

function HeroAvatarRow({ compact, avatarImages, avatarCaption }: HeroAvatarRowProps) {
  if (compact || !avatarImages || avatarImages.length === 0) return null;
  return (
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
      {avatarCaption && <span className="text-white/90 text-sm font-medium">{avatarCaption}</span>}
    </div>
  );
}

type HeroChipsProps = Pick<CareersHeroProps, "compact" | "chips">;

function HeroChips({ compact, chips }: HeroChipsProps) {
  if (compact || !chips || chips.length === 0) return null;
  return (
    <div className="hidden lg:flex flex-col gap-3 absolute right-8 xl:right-16 top-16">
      {chips.map((chip, i) => (
        <span
          key={chip}
          className={`animate-fade-up text-sm font-medium px-5 py-2 rounded-full border ${
            i === 1
              ? "bg-white text-primary-dark border-white self-center"
              : "bg-white/15 text-white border-white/25 backdrop-blur-md self-end"
          }`}
          style={{ animationDelay: `${300 + i * 100}ms` }}
        >
          {chip}
        </span>
      ))}
    </div>
  );
}

type HeroStatBadgeProps = Pick<CareersHeroProps, "compact" | "stat">;

function HeroStatBadge({ compact, stat }: HeroStatBadgeProps) {
  if (compact || !stat) return null;
  return (
    <div
      className="hidden sm:block absolute bottom-8 right-4 sm:right-8 lg:right-16 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-6 py-5 text-white animate-fade-up"
      style={{ animationDelay: "300ms" }}
    >
      <p className="text-xs text-white/70 mb-1">{stat.label}</p>
      <p className="text-3xl font-bold">{stat.value}</p>
    </div>
  );
}

type ImageHeroProps = Omit<CareersHeroProps, "image"> & { image: string };

function ImageHero({
  title,
  titleHighlight,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  compact = false,
  image,
  stat,
  chips,
  avatarImages,
  avatarCaption,
}: ImageHeroProps) {
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

      <Container
        className={`relative ${!compact ? "min-h-[22rem] flex flex-col justify-center" : ""}`}
      >
        <div className="max-w-xl">
          <HeroAvatarRow compact={compact} avatarImages={avatarImages} avatarCaption={avatarCaption} />
          <HeroTitle title={title} titleHighlight={titleHighlight} />
          <p
            className="text-lg sm:text-xl text-white/80 animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {subtitle}
          </p>
          <HeroCTAs
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            secondaryCtaLabel={secondaryCtaLabel}
            secondaryCtaHref={secondaryCtaHref}
            align="start"
          />
        </div>

        <HeroChips compact={compact} chips={chips} />
        <HeroStatBadge compact={compact} stat={stat} />
      </Container>
    </section>
  );
}

function GradientHero({
  title,
  titleHighlight,
  subtitle,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  compact = false,
}: CareersHeroProps) {
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

      <Container className="relative text-center">
        <HeroTitle title={title} titleHighlight={titleHighlight} />
        <p
          className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "100ms" }}
        >
          {subtitle}
        </p>
        <HeroCTAs
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
          align="center"
        />
      </Container>
    </section>
  );
}

export function CareersHero(props: CareersHeroProps) {
  if (props.image) return <ImageHero {...props} image={props.image} />;
  return <GradientHero {...props} />;
}
