import { LotusMark } from "@/components/lotus-mark";

type LotusDividerTone = "light" | "dark";

// rgb() triples (not hex) so they can feed the rgba() fade gradients below.
// Light = teal-500 (#1badb2, real brand token — see globals.css); dark =
// white, for use inside a teal-700 band.
const RULE_RGB: Record<LotusDividerTone, string> = {
  light: "27, 173, 178",
  dark: "255, 255, 255",
};

const RULE_OPACITY: Record<LotusDividerTone, number> = {
  light: 0.55,
  dark: 0.35,
};

const MARK_CLASS: Record<LotusDividerTone, string> = {
  light: "text-teal-500",
  dark: "text-white",
};

export interface LotusDividerProps {
  /** Default "light" — teal-500 mark/rules for use on white or warm-bg.
   * "dark" is for use inside a teal-700 band: white mark/rules. */
  tone?: LotusDividerTone;
  /** Merged onto the root so pages can adjust vertical rhythm. */
  className?: string;
}

/**
 * Quiet section separator (replaces the repeating `LotusBand` pattern): a
 * single lotus mark centred on a hairline rule that fades out at both ends.
 * Purely decorative — no content, no motion.
 */
export function LotusDivider({ tone = "light", className = "" }: LotusDividerProps) {
  const rgb = RULE_RGB[tone];
  const opacity = RULE_OPACITY[tone];

  return (
    <div role="presentation" aria-hidden="true" className={`w-full py-12 ${className}`.trim()}>
      <div className="mx-auto flex max-w-[760px] items-center gap-5 px-6">
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, rgba(${rgb}, 0) 0%, rgba(${rgb}, ${opacity}) 85%)`,
          }}
        />
        <LotusMark className={`h-[26px] w-[26px] shrink-0 ${MARK_CLASS[tone]}`} />
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to left, rgba(${rgb}, 0) 0%, rgba(${rgb}, ${opacity}) 85%)`,
          }}
        />
      </div>
    </div>
  );
}
