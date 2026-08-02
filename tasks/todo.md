# C5: Training page

Full plan: `C:\Users\andre\.claude\plans\peppy-baking-tome.md`. (C2 marked done, no branch needed — `open-roles/page.tsx` already uses `<Container>`'s default `width="wide"` from F2.)

## Tasks
- [x] `training/page.tsx` — move Career Progression Pathway section above training-programmes-by-type loop
- [x] `training/page.tsx` — replace hardcoded vertical `<ol>` with shared `<Timeline orientation="horizontal">` (C6), mapping `pathway` → `TimelineStep[]`
- [x] `training/page.tsx` — add standout `subtitle` to the Career Progression `SectionTitle`
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — Career Progression leads, horizontal animated timeline on desktop, collapses to vertical on mobile, training programmes section unaffected

## Review

Career Progression now leads the Training page, using the shared `Timeline` component (C6) instead of a hand-rolled list:
- Reordered so "Career Progression Pathway" is the first major section after the intro paragraph, ahead of the training-programmes-by-type groups.
- Replaced the small static vertical `<ol>` (w-8 h-8 bubbles, no animation) with `<Timeline orientation="horizontal">`, mapping the existing `pathway` data (`level`/`title`/`description`) straight into `TimelineStep[]`. No changes needed to `Timeline` itself — it already provides the larger (`w-16 h-16`) bubbles, connecting line, scroll-stagger animation, and automatic mobile collapse-to-vertical fallback, all built in C6.
- Added a `subtitle` to the section's `SectionTitle` for extra presence, per the "standout" ask.
- No content changes to the pathway steps or the training-programmes-by-type section.
- C2 (Open Roles width) marked done with no separate branch: `open-roles/page.tsx` already wraps content in `<Container>`, which defaults to `width="wide"` since F2 shipped — the acceptance criterion was already satisfied incidentally.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually confirmed live via Playwright at desktop (1440px — horizontal 4-step animated timeline, larger bubbles, connecting line) and mobile (390px — clean vertical collapse, correct order, training programmes unaffected).
