# P4 — Services section: animated lotus + blobs

Card: `docs/build-plan.md` → **P4** · branch `feat/home-services-lotus-anim` · depends on F1, F3, F4.

## Diagnosis

Services section (`src/components/services-section/ServicesSection.tsx`) is static: a centred
`SectionTitle` followed by a 3-column `ServiceCard` grid (two teal image cards, four white icon
cards, three of which link out to `/quality/*`). Client wants an animated lotus on the side, petals
animating independently.

Card Q2 (`src/components/quality/quality-pillars/QualityPillars.tsx`) already built this exact
animation: `<LotusMark tone="color">` with a `lotus-bloom` class, toggled by `useInView()`, petals
staggered via `.lotus-bloom [data-petal="…"]` attribute-selector delays in `globals.css`
(lines ~198–225). That CSS is already wired into the global `@media (prefers-reduced-motion:
reduce)` block, and `useInView` itself returns `inView: true` immediately when the user prefers
reduced motion — both mechanisms are reused as-is, no new CSS added.

`ServicesSection` was not `relative overflow-hidden`, so it had no positioning ancestor for `<Blob>`
(`src/components/blob/Blob.tsx`, built in F4) — same requirement `TeamSection` already satisfies for
its two corner blobs.

## Must not break

- [ ] **C-1** — `src/data/services.ts` — no data-model change.
- [ ] **C-2** — `src/components/service-card/ServiceCard.tsx` — not touched; the grid, its cards,
      and every `href` (`/quality/mdt`, `/quality/human-rights`, `/quality/safety-improvement`)
      stay exactly as they render today.
- [ ] **C-3** — Animate `transform`/`opacity` only — no width/height/top/left animation, no
      layout-affecting properties.
- [ ] **C-4** — No new dependency, no test framework.
- [ ] **C-5** — Design tokens only — no hardcoded hex.
- [ ] **C-6** — No CLS — the lotus is absolutely positioned (out of flow), so it reserves no box
      and cannot shift `SectionTitle` or the grid.
- [ ] **C-9** — `SectionTitle` stays centred on the page, matching every other section
      (Careers Overview, Quality Overview, Team, Board, Our Homes) — the lotus must never consume
      horizontal layout width next to it.
- [ ] **C-7** — No horizontal overflow from the new blobs — section has `relative overflow-hidden`,
      exactly as `TeamSection` does.
- [ ] **C-8** — `src/components/team-*`, `src/components/board-section/` untouched (out of scope
      for this card).

## Tasks

- [x] Add `relative overflow-hidden` to the `<section>` and `relative` to the `<Container>`, same
      positioning-ancestor pattern as `TeamSection`.
- [x] Add two `<Blob>` instances at opposite corners (teal + purple, default opacity, no drift —
      matches `TeamSection`'s existing non-animated precedent).
- [x] Place `<LotusMark tone="color">` beside the heading. **Revised after IT Engineer verification**
      (see Review): the original flex-row wrapper centred the lotus+title *pair* as a unit, pushing
      the heading ~90px off page-centre versus every other `SectionTitle` on the site. Fixed by
      wrapping `SectionTitle` in a plain `relative` div and giving the lotus
      `absolute left-0 top-1/2 -translate-y-1/2`, `hidden` below `lg` — out of flow entirely, so it
      can't affect `SectionTitle`'s width or centring, and can't overlap the heading/subtitle text.
      `SectionTitle` itself remains untouched — still a self-contained component with its own
      `reveal` animation, still the sole element in normal flow so it centres exactly as before.
- [x] Give the lotus wrapper its own `useInView()` call (separate from the grid's existing one) and
      reuse `.lotus-bloom`/`in-view` verbatim — same pattern as `QualityPillars`, not a new class.
      Kept as its own hook call (rather than sharing the grid's) so the cards' existing
      reveal-on-scroll timing is untouched.
- [x] Leave the `ServiceCard` grid and its `useInView`/`ref` exactly as they were.

## Acceptance criteria

From the card:

- [x] **AC-1** — Petals animate independently on entrance/scroll. *`.lotus-bloom [data-petal]` in
      `globals.css` staggers `center` → `bottom` → `left`/`right` → `upper-left`/`upper-right`,
      toggled by the lotus wrapper's own `useInView()` — unchanged CSS, reused verbatim.*
- [x] **AC-2** — Reduced-motion shows a static bloomed lotus (end state, not hidden/half-open).
      *`useInView` returns `inView: true` immediately under `prefers-reduced-motion: reduce`, and
      the existing global reduced-motion block snaps `.lotus-bloom [data-petal]` to
      `opacity: 1; transform: none`. Both mechanisms pre-existed this card and needed no change.*
- [x] **AC-3** — No CLS / jank; 60fps target. *Only `transform`/`opacity` animated; lotus is
      `absolute`, out of flow, fixed size (`w-32 h-32`, `lg`+ only), no async image load. **Verified
      by the IT Engineer in-browser: CLS 0.0000–0.0017 at 390/768/1440.***
- [x] **AC-4** — Services cross-links to the Quality pages preserved. *`ServiceCard.tsx` and
      `data/services.ts` untouched; confirmed post-build via `curl` against the rendered homepage —
      `/quality/mdt`, `/quality/human-rights`, `/quality/safety-improvement` all present. **Verified
      by the IT Engineer in-browser: all 3 links intact.***
- [x] **AC-5** — (client-requested, verification round) `SectionTitle` stays centred on the page,
      matching the other sections. *Lotus is out of flow (`absolute`), so `SectionTitle` is the sole
      in-flow child of its wrapper and centres exactly as it did before this card. Hidden below `lg`
      so it never risks overlapping the heading/subtitle on narrower viewports.*

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (all 22 routes generated).
- [x] `npm run build-storybook` — exit 0 (only pre-existing bundle-size advisory warnings,
      unrelated to this change).
- [x] `curl` against the running dev server homepage — 200, `lotus-bloom` class present in the
      rendered HTML, all three `/quality/*` cross-links present (checked before and after the
      centring fix).
- [x] Manual, in a real browser (IT Engineer, both rounds): 6 `[data-petal]` elements blooming with
      staggered delays (0.30/0.36/0.42/0.48s) at 390/768/1440, all 3 Quality cross-links intact,
      zero horizontal overflow, CLS 0.0000–0.0017, grid still 1/2/3 columns, reduced-motion snaps
      all 6 petals to bloomed (maxDur 0.00001s). Second round confirmed the centring fix: `h2`
      centre-x now agrees with viewport centre at 1440.
- [ ] Not measured by either agent: contrast of card text against the low-opacity blobs, and
      whether the lotus (hidden below `lg`) reappearing at exactly the `lg` breakpoint ever grazes
      a longer custom `title`/`subtitle` than the defaults used in this build. Both are visual
      calls best made by eye in the actual browser session.

## Review

_(to be filled in after the pipeline completes)_
