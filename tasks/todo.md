# F3 — Lotus mark as reusable SVG (separable petals)

Card source: `docs/build-plan.md` (F3). Full plan: `C:\Users\andre\.claude\plans\enumerated-marinating-gray.md`.

## Tasks
- [x] Extract real path data from `public/images/Logo/Lotus Care Logomark - Colour.svg` (16 facets incl. center, 4 real hex colors)
- [x] Compute mark center + bucket 15 petal facets into 5 petal groups by angle (script-assisted, verified by debug render)
- [x] Rewrite `src/components/lotus-mark/lotus-geometry.ts` (renamed from `lotus-path.ts`) with real `LOTUS_FACETS` data + `LOTUS_MASK_PATH`
- [x] Update `LotusMark.tsx` — add `tone` prop (`mono` default / `color`), render facets grouped in `<g data-petal>`
- [x] Verify `CareersHero.tsx` renders unchanged (default `tone="mono"`, no prop changes needed there)
- [x] Build `LotusPhotoMask.tsx` — children-wrapping primitive, soft arch clipPath normalized to objectBoundingBox, unique id via `useId()`
- [x] Update `src/components/lotus-mark/index.ts` barrel
- [x] Add `stories/ui/LotusMark.stories.tsx` (Mono on dark bg, Color on white bg)
- [x] Add `stories/ui/LotusPhotoMask.stories.tsx` (real staff photo + initials fallback, no face-cropping)
- [x] Verify: `npm run build` + `npx tsc --noEmit` pass
- [x] Verify: real-color render reproduces the source SVG exactly (script-generated, sharp-rasterized, visually compared)
- [x] Verify: 5 `[data-petal]` groups + 1 `center` group exist (browser_evaluate on live Storybook)
- [x] Verify: Storybook renders both new stories, `npx storybook build` passes
- [x] Move `public/images/Logo/` (2.2MB incl. 1.6MB `.ai` source) to `docs/brand-assets/Logo/` — was publicly servable by Next.js for no runtime reason, same issue as F1/F2's `docs/build-plan.md`

## Acceptance criteria (from build-plan F3)
- [x] `<LotusMark>` component renders the mark from separable petal paths
- [x] Each petal is independently targetable for animation (`data-petal` attribute, collision-safe across multiple instances)
- [x] `<LotusPhotoMask>` (soft variant) clips an `<img>`/photo without cropping faces awkwardly
- [x] Storybook stories for both
- [x] Works in light/dark contexts as used on site (mono tone inherits `currentColor`; verified on both light and dark backgrounds)

## Review

All acceptance criteria met, and with less approximation risk than originally planned — mid-cycle the user supplied the real designer-authored vector logo files (`public/images/Logo/`, now `docs/brand-assets/Logo/`), which eliminated the raster-tracing approach originally planned. Summary:

- `src/components/lotus-mark/lotus-geometry.ts` — real path data extracted directly from `Lotus Care Logomark - Colour.svg` (16 paths: 1 shared center highlight + 15 facets across 4 real teal hexes). Facets grouped into 5 semantically-named petals (`right`/`bottom`/`left`/`upper-left`/`upper-right`) by nearest angular position to the 5 true outer-petal reference points — verified correct via a debug render with each group in a distinct flat color (clean, coherent partition, no stray facets) and a real-color render that reproduces the source SVG pixel-for-pixel.
- `LotusMark.tsx` — new `tone` prop (`"mono"` default / `"color"`), petals grouped in `<g data-petal="...">` for independent targeting. `CareersHero.tsx` needed zero changes — its existing usage relies on the unchanged default.
- `LotusPhotoMask.tsx` (new) — soft arch clipPath (from `docs/build-plan.md` Appendix A, normalized to `objectBoundingBox` space), wraps `children` rather than taking `src`/`alt` directly so a future P6 can drop it into `TeamCard`/`BoardSection`/`TeamModal`'s existing fallback logic unchanged. Unique clip id per instance via `useId()` to avoid collisions when multiple masked photos render at once.
- Two new Storybook stories, both verified rendering correctly (including a fix for a pre-existing gap: no `backgrounds` addon is registered in `.storybook/main.ts`, so the dark-background story renders its own wrapper div instead of relying on the no-op `parameters.backgrounds`).
- Moved the 2.2MB logo source-asset folder out of `public/` (would've been publicly servable for no runtime benefit) into `docs/brand-assets/Logo/`.

**Deferred, not part of this PR (per user decision during planning):**
- Regenerating F1's provisional purple scale from the real `#761948` (found in `Alternative Logomark - Purple.svg`) — separate small PR.
- Applying `LotusMark` to the Services animation (P4) or `LotusPhotoMask` to Team/Board (P6) — future cards.
