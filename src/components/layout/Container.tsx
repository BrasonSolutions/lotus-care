import type { ComponentPropsWithoutRef } from "react";

const GUTTERS = "px-4 sm:px-6 lg:px-8";

interface WideContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Adds the standard page gutters. Defaults to true — this is normally
   * the outermost width constraint on a section. */
  padded?: boolean;
}

/**
 * Wide layout primitive for heroes, galleries, infographics, 50/50 media
 * rows, and any section that should use most of the viewport.
 */
export function WideContainer({
  padded = true,
  className = "",
  children,
  ...rest
}: WideContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-wide ${padded ? GUTTERS : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

interface ReadingContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Adds the standard page gutters. Defaults to false — ReadingContainer
   * is normally nested inside a WideContainer (or another element) that
   * already provides gutters. Set true when used as a standalone,
   * top-level text section. */
  padded?: boolean;
}

/**
 * Reading-measure layout primitive for long-form body copy. Caps line
 * length at ~65ch (Tailwind's `max-w-prose`) for comfortable reading,
 * regardless of how wide its parent section is.
 */
export function ReadingContainer({
  padded = false,
  className = "",
  children,
  ...rest
}: ReadingContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-prose ${padded ? GUTTERS : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
