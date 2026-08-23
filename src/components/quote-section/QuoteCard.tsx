const TONE = {
  teal: {
    text: "text-blossom",
    avatarGradient:
      "linear-gradient(135deg, var(--color-purple-600) 48%, var(--color-blossom) 49%)",
  },
  purple: {
    text: "text-teal-50",
    avatarGradient:
      "linear-gradient(135deg, var(--color-teal-400) 48%, #ffffff 49%)",
  },
} as const;

interface QuoteCardProps {
  quote: string;
  name: string;
  date: string;
  /** Which band this card sits on — picks the quote-text colour and avatar
   * gradient that pass AA on that background (name/date stay teal-50/100
   * either way, already verified safe on both `teal-700` and `purple-600`). */
  tone: keyof typeof TONE;
  className?: string;
}

/** Quote mark + blockquote + figcaption. Shared by `QuoteSection` (single,
 * intro column alongside it) and `TestimonialPair` (two side by side). */
export function QuoteCard({ quote, name, date, tone, className = "" }: QuoteCardProps) {
  const { text, avatarGradient } = TONE[tone];

  return (
    <figure className={className}>
      <span
        aria-hidden="true"
        className={`block ${text} text-7xl md:text-8xl leading-none`}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        &ldquo;
      </span>
      <blockquote className={`${text} text-lg leading-relaxed mt-2`}>{quote}</blockquote>
      <figcaption className="flex items-center gap-3 mt-6">
        <div
          aria-hidden="true"
          className="w-11 h-11 rounded-full shrink-0"
          style={{ background: avatarGradient }}
        />
        <div>
          <p className="font-dm-sans font-bold text-sm text-teal-50">{name}</p>
          <p className="text-xs text-teal-100">{date}</p>
        </div>
      </figcaption>
    </figure>
  );
}
