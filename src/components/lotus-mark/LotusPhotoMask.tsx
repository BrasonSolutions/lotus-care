"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import { LOTUS_MASK_PATH } from "./lotus-geometry";

interface LotusPhotoMaskProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

/**
 * Soft lotus-inspired clip mask for photos. Wraps children (an `<Image
 * fill>` or an initials-fallback div) rather than taking `src`/`alt`
 * directly, so it can drop into existing photo-wrapper patterns without
 * restructuring their fallback logic. No longer used by the team cards
 * (issue #94 moved those to a rounded square); kept as a brand primitive,
 * see its Storybook entry. Each instance gets a unique clipPath id via `useId()` — a shared
 * static id would break when multiple masked photos render at once (e.g.
 * a grid of team members).
 *
 * Note: Tailwind's `ring-*` utilities are box-shadow-based and won't
 * conform to this custom shape — a decorative ring around a masked photo
 * needs a different technique.
 */
export function LotusPhotoMask({ children, className = "", ...rest }: LotusPhotoMaskProps) {
  const clipId = `lotus-mask-${useId().replace(/:/g, "")}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`.trim()}
      style={{ clipPath: `url(#${clipId})` }}
      {...rest}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={LOTUS_MASK_PATH} />
        </clipPath>
      </svg>
      {children}
    </div>
  );
}
