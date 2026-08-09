import type { ComponentPropsWithoutRef } from "react";

const GUTTERS = "px-4 sm:px-6 lg:px-8";

const MAX_WIDTH = {
  wide: "max-w-wide",
  // max-w-prose (65ch) measures ~86 real characters at 16px Inter — ch is
  // the "0" glyph's advance, not the average character width, so it never
  // capped anything. max-w-lg (512px) is CR3's measured fix for the same
  // font/size, landing at ~67 real characters.
  reading: "max-w-lg",
} as const;

const DEFAULT_PADDED = {
  wide: true,
  reading: false,
} as const;

interface ContainerProps extends ComponentPropsWithoutRef<"div"> {
  /** Width cap: "wide" (max-w-wide, gutters on by default) for heroes,
   * galleries, infographics, 50/50 media rows — or "reading" (max-w-prose,
   * gutters off by default) for long-form body copy nested inside a wide
   * section. Defaults to "wide". */
  width?: keyof typeof MAX_WIDTH;
  /** Adds the standard page gutters. Defaults per `width` (see above);
   * pass explicitly to override. */
  padded?: boolean;
}

/**
 * Layout width primitive. "wide" caps at 90rem for sections that should use
 * most of the viewport; "reading" caps at 512px (~67 real characters at
 * 16px Inter) for comfortable long-form body copy, typically nested inside
 * a wide section.
 */
export function Container({
  width = "wide",
  padded = DEFAULT_PADDED[width],
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${MAX_WIDTH[width]} ${padded ? GUTTERS : ""} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
