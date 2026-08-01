# F4 — Decorative palette "blobs"

Card source: `docs/build-plan.md` (F4). Full plan: `C:\Users\andre\.claude\plans\enumerated-marinating-gray.md`.

## Tasks
- [x] Generate 3 static organic blob path variants (script-assisted, verified visually) — `src/components/blob/blob-geometry.ts`
- [x] Build `Blob.tsx` (`color`, `variant`, `opacity`, `animate`, `className` props)
- [x] Add `.blob-drift` `@keyframes` to `globals.css` (reduced-motion handled by existing global rule)
- [x] `src/components/blob/index.ts` barrel
- [x] `stories/ui/Blob.stories.tsx` — variants × colors, animated example, "behind text" contrast demo
- [x] Verify: `npm run build` + `npx tsc --noEmit` pass
- [x] Verify: Storybook renders all stories; reduced-motion confirmed via Playwright media emulation (animation-duration collapses to 0.01ms); contrast demo visually confirms AA-safe default opacity
- [x] Verify: `npx storybook build` passes

## Acceptance criteria (from build-plan F4)
- [x] Reusable blob component with position/colour/size props (position/size via `className`, consistent with `WideContainer`/`LotusMark` convention; `color` is a dedicated prop)
- [x] Zero network cost (inline SVG, no raster images)
- [x] Text over/near blobs still passes AA contrast (default opacity 0.12, matches existing safe precedent; demonstrated in Storybook's "Behind text" story)
- [x] Reduced-motion respected if animated (verified — no bespoke JS needed, the existing global `prefers-reduced-motion` rule in `globals.css` already covers any `animation` on any element)

## Explicitly out of scope (confirmed with user)
- Migrating the 3 existing ad hoc decorative circles (CareersHero, HeroSection, AboutSection) to `<Blob>` — new component only, existing usages untouched
- Replacing `<LotusMark tone="mono">`'s decorative use — both primitives remain valid, different purposes

## Review

All acceptance criteria met. Summary:

- `src/components/blob/blob-geometry.ts` (new) — 3 organic blob silhouettes, procedurally generated (Catmull-Rom curves through randomized points around a center, seeded/deterministic) and committed as static path data, not randomized at render time (would break SSR/hydration).
- `src/components/blob/Blob.tsx` (new) — `color` ("teal"|"purple", mapped to real brand tokens via inline `fill: var(--color-*)`, never arbitrary hex), `variant` (1-3), `opacity` (default 0.12), `animate` (drift), `className` for size/position (Tailwind utilities, matching `WideContainer`/`LotusMark` convention rather than bespoke numeric props). Always `aria-hidden` + `pointer-events-none` — baked in since it's never anything but decoration.
- `.blob-drift` keyframes added to `globals.css`, reusing the existing global `prefers-reduced-motion` rule for free — verified via Playwright media emulation that `animation-duration` correctly collapses to 0.01ms under reduced motion.
- `stories/ui/Blob.stories.tsx` (new) — all 6 variant×color combinations, an animated example, and a "Behind text" story demonstrating AA-safe contrast at the default opacity.
- Scope deliberately limited to the new component per user decision: the 3 existing ad hoc decorative circles (CareersHero, HeroSection, AboutSection) and `LotusMark`'s existing watermark use are both left untouched.

Verified: `npm run build`, `npx tsc --noEmit`, and `npx storybook build` all pass; all Storybook stories render correctly with visually distinct, clearly organic (non-circular) shapes in both real brand colors.
