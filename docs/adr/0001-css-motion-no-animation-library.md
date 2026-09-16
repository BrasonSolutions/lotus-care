# Motion is allowed; CSS remains the default

**Status:** accepted — supersedes the original no-library position recorded here.

## What we decided first, and why it changed

This site animates heavily — scroll reveals, staggered grids, blob drift, lotus
bloom, marquees — and originally shipped **zero animation JavaScript**. Motion
was plain CSS transitions and keyframes in `src/app/globals.css`, triggered by
one `IntersectionObserver` hook (`src/hooks/use-in-view.ts`) that toggles an
`.in-view` class. The reasoning was sound: nothing on a marketing site needs
interruptible or physics-driven animation, and a library costs ~35KB gzipped.

We tried exactly that for the homepage "Our Services" cards — a longer rise, a
spring-eased icon pop, an illustration settle, an accent ring. It worked and was
still judged too flat. Cursor-tracked effects are the thing CSS genuinely cannot
express: they need a value updated per pointer event and written to a style
without re-rendering React, which is what `motion`'s `useMotionValue` /
`useMotionTemplate` exist to do. So we installed `motion` (13.3.0) and ported
Magic UI's `magic-card` into `src/components/magic-card/`.

## Consequences

- **CSS stays the default.** Reach for `motion` when the animation is driven by
  a continuously-varying input (pointer position, scroll offset, gesture) or
  needs to be interruptible. Fades, rises, staggers and hovers stay in CSS.
- **Reduced motion is no longer automatic.** The `@media (prefers-reduced-motion:
  reduce)` block in `globals.css` neutralises CSS animation site-wide; it cannot
  see a `motion` component. Every `motion` component must check
  `usePrefersReducedMotion()` itself and render a static branch. `MagicCard`
  does this — copy the pattern.
- **CSS motion is still added as a modifier layered on an existing class**
  (`.reveal-scale` extends `.reveal`), never as a parallel mechanism. Storybook's
  decorator in `.storybook/preview.tsx` force-adds `in-view` to `.reveal`
  elements only, and the reduced-motion block keys off the same base classes. A
  standalone class silently breaks both.
- **Ported components are trimmed, not copied whole.** `magic-card` shipped an
  orb mode whose only purpose was a theme-dependent blend mode; it was the sole
  reason the component depended on `next-themes`, and this site has no dark
  theme. Dropping orb mode dropped that dependency. `cn`/`@/lib/utils` was
  dropped too — this repo composes class names with template literals.
- **No `components.json`.** We deliberately did not run `shadcn init`: it would
  create a `components/ui` directory and a `cn` utility, a second component
  convention alongside the `src/components/<name>/<Name>.tsx` layout used
  everywhere here. Port registry components by hand into that layout.
