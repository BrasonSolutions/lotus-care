// Teaser length for testimonial cards: enough to hook, short enough to click.
export const TEASER_WORDS = 20;

/** Cuts to `max` words and appends an ellipsis. Shorter text is returned unchanged. */
export function truncateWords(text: string, max: number = TEASER_WORDS): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= max) return text;
  return `${words.slice(0, max).join(" ").replace(/[.,;:!?]$/, "")}…`;
}
