# C7: How We Hire

Full plan: `C:\Users\andre\.claude\plans\dynamic-wishing-sunset.md`.

## Tasks
- [x] `src/data/careers.ts` — expand `processSteps` from 4 to 6 entries (Apply Online, Screening Call, Interview, Offer, Pre-Employment Checks, Start)
- [x] `how-we-hire/page.tsx` — replace `<ProcessTimeline>` with shared `<Timeline orientation="horizontal">` (C6), mapping `step` → `number`
- [x] Delete unused `src/components/careers/process-timeline/` directory
- [x] `FaqAccordion.tsx` — add `.faq-panel` transition class to `globals.css` (max-height + opacity fade, eased, ~300-400ms), swap onto the `<dd>`
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — 6-step horizontal animated timeline (desktop) collapses to vertical (mobile), FAQ accordion fades smoothly, reduced-motion respected, `git grep ProcessTimeline` clean

## Review

Both C7 asks are done:
- **Hiring timeline**: `processSteps` in `src/data/careers.ts` now has the full 6 steps (split the old combined "Offer & Start" into Offer / Pre-Employment Checks / Start, keeping the existing Garda Vetting/references/occupational-health detail). `how-we-hire/page.tsx` now renders these through the shared `<Timeline orientation="horizontal">` (C6) instead of the bespoke `<ProcessTimeline>`, mapping `step` → `number` at the call site — same pattern C5 used for the Training page. The now-unused `src/components/careers/process-timeline/` directory was deleted (`git grep ProcessTimeline` is clean). No changes needed to `Timeline` itself — its horizontal grid already sizes columns dynamically (`repeat(steps.length, ...)`), so 6 steps just work, complete with connecting line, scroll-triggered stagger animation, and automatic collapse to a vertical list below `md`.
- **FAQ accordion**: added a `.faq-panel` class in `globals.css` (next to the existing `.card-hover`/`.reveal` convention) that transitions `max-height` (400ms) and `opacity` (300ms) on the site's standard `cubic-bezier(0.25, 0.1, 0.25, 1)` easing, replacing the old `transition-all duration-300` with no fade. `FaqAccordion.tsx`'s `<dd>` now toggles `max-h-96 opacity-100` / `max-h-0 opacity-0` against that class. Reduced motion needed no extra work — `globals.css`'s existing `@media (prefers-reduced-motion: reduce)` block already collapses `transition-duration` to near-zero on `*, *::before, *::after`, which covers this element automatically.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually confirmed via Playwright at desktop (1440px — 6-step horizontal timeline with connecting line and correct copy/order) and mobile (390px — clean vertical collapse, all 6 steps present and readable, no clipping). Confirmed the FAQ panel's computed transition applies `max-height 0.4s, opacity 0.3s` (the `ease` timing-function shown is the literal serialization of `cubic-bezier(0.25, 0.1, 0.25, 1)`, which is mathematically identical to the `ease` keyword) and opens/closes correctly by clicking through several questions.
