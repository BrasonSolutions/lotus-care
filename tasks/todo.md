# Q2: Quality infographics "more WOW"

Full plan: `C:\Users\andre\.claude\plans\dynamic-wishing-sunset.md`.

## Tasks
- [x] `src/data/quality.ts` — add `qualityFoundationPrinciples` export
- [x] `src/components/quality/quality-pillars/QualityPillars.tsx` + `index.ts` — new component (lotus bloom, pillar rise, foundation fade, single `useInView`)
- [x] `src/app/globals.css` — add `.pillar-rise`, `.lotus-bloom [data-petal]`, `.foundation-fade` rules + reduced-motion overrides
- [x] `src/app/quality/page.tsx` — replace plain hub-card grid section with `<QualityPillars>`
- [x] `stories/quality/QualityPillars.stories.tsx` — new Storybook story
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — pillars clickable, animation sequence (pillars rise → lotus blooms → foundation fades), reduced-motion shows final state immediately, Storybook renders

## Review

Built the Appendix C "three pillars" infographic as a new `QualityPillars` component, replacing the plain `HubNavCard` grid on the Quality Overview page:
- **Lotus bloom**: `<LotusMark tone="color">` (F3) with a new `.lotus-bloom [data-petal]` CSS rule — pure CSS attribute-selector animation, no changes to `LotusMark` itself. All 6 petal groups (`center`, `bottom`, `left`/`right`, `upper-left`/`upper-right`) scale+fade in with staggered delays (300-480ms), bouncy easing matching `.pop-item`.
- **Pillars**: reused `<HubNavCard>` as-is (same chip-only accent alternation from C4/Q1, no top border per earlier feedback) fed directly from `hubCards` data — no new copy invented, existing content/links preserved. Wrapped each in a new `.pillar-rise` class (translateY+opacity, staggered 0/90/180ms).
- **Foundation strip**: new `qualityFoundationPrinciples` export in `src/data/quality.ts`, rendered in a dashed-top-border strip that fades in last (750ms delay) via a new `.foundation-fade` class.
- All three new classes driven by one shared `useInView()` on the component root — a single coordinated cascade (pillars → lotus → foundation) rather than independent reveals, matching the animation order in Appendix C.
- Deliberately left `CircularCycle`/`HubAndSpoke` (on the 3 sub-pages) untouched — different content, already animated by the pre-existing `infographic-animations` PR, not what Appendix C describes.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run build-storybook` (confirmed `quality-qualitypillars--default` story registered) all pass. Manually confirmed via Playwright: pillars link to the correct 3 sub-pages; computed CSS shows the exact intended transition-delay stagger (pillars 0/90/180ms, petals 300-480ms, foundation 750ms); reduced-motion emulation shows all elements at opacity:1 immediately, even without the `in-view` class, confirming the explicit reduced-motion override works; mobile (390px) collapses cleanly to a single column with the lotus still legible at small size.
