# M3: Our Homes — carousel sync + column margin

Branch: `fix/our-homes-carousel`.

## Diagnosis

`HomesCarousel.tsx`'s dot *count* was already correct (`homes.map` → 8 dots
for 8 homes, `HomesCarousel.tsx:163`, unsliced `homes` array flows straight
through from `src/data/homes.ts` via `src/app/page.tsx:69`). The desync was
in *reachability*: `handleScroll` derived `activeIndex` from
`Math.round(scrollLeft / (cardWidth + gap))`, which assumes the container
can scroll a full `(homes.length - 1) * (cardWidth + gap)` px. It can't —
the browser's real ceiling is `scrollWidth - clientWidth`, always less than
that once more than one card's width is visible.

At `lg:gap-16` (pre-fix), 1440px viewport: `scrollWidth` 2736, `clientWidth`
656 → `maxScrollLeft` 2080. Slot size (card 320px + gap 24px) = 344.
Index 7's snap-start is `4 + 7×344 = 2412` — unreachable, since 2412 > 2080.
`scrollLeft` therefore rested at index 6's snap-start (2068);
`Math.round(2068 / 344) = 6`. `activeIndex` was structurally capped at 6.

Because `scrollBy`'s modulo (`(activeIndex + direction + homes.length) %
homes.length`) and the dots' `i === activeIndex` check both read from that
same state, the cap corrupted three call sites at once: the last dot never
lit up, clicking "Next" repeatedly cycled 0→6→0 (skipping house 8 /
Heliodor House entirely), and auto-scroll inherited the same skip.

Root-cause fix: one guard clause in `handleScroll`, using the native
`scrollWidth - clientWidth` ceiling instead of the approximate per-card
formula for the boundary case. Fixing the single shared `activeIndex`
source of truth fixes dots, arrow-cycling, and auto-scroll together — no
per-caller patching needed.

Second, independent defect: `HomesSplitRow.tsx`'s two-column gap
(`lg:gap-16`, 64px) was already the largest two-column gap used anywhere in
this codebase (`AboutSection.tsx`, `ContentSection.tsx`, `quality/*/page.tsx`
all cap at `lg:gap-16` too) — client asked for it visibly bigger.

## Must not break

- C-1: `src/data/homes.ts` (the `Home` interface and the 8-entry `homes`
  array) untouched — no data-model changes.
- C-2: `HomesSplitRow.tsx`'s `min-w-0` wrapper (lesson 4 — without it, CSS
  Grid's automatic min-content size lets the horizontally-scrolling card row
  force the whole grid track wider, reopening the 2462px/390px overflow
  regression from card P3).
- C-3: Existing carousel behaviour otherwise unchanged — arrows, snap-scroll,
  auto-scroll pause-on-hover, `HomeModal` on card click, card sizing, arrow
  positioning, `scrollToIndex`'s `-16` alignment offset. Fix is confined to
  the `handleScroll` boundary case only.
- C-4: No new dependencies, no test framework introduced (none exists in
  this repo — verified via `package.json`, no jest/vitest/playwright).
- C-5: Design tokens only — `lg:gap-24` is Tailwind's native default spacing
  scale, no new CSS variable.
- C-6: Do not touch `scroll-snap-type`/`snap-x`/`snap-mandatory` classes —
  the guard clause reads the DOM scroll ceiling directly and must work
  correctly whether or not snap clamps the rest position; no speculative
  tolerance fudge factor.

## Tasks

- [x] Read `HomesSplitRow.tsx`, `HomesCarousel.tsx`, `src/data/homes.ts`,
      `Container.tsx` (for `max-w-wide`/gutter values), and every other
      `grid lg:grid-cols-2 gap-*` usage in the codebase before editing
      anything.
- [x] `HomesCarousel.tsx` `handleScroll` (`~L79-90`) — added a
      `maxScrollLeft = container.scrollWidth - container.clientWidth` guard;
      when `scrollLeft >= maxScrollLeft - 1`, `activeIndex` is set to
      `homes.length - 1` directly, bypassing the `cardWidth`/`gap` division
      for that boundary case. 4 lines added, nothing else touched.
- [x] `HomesSplitRow.tsx:47` — `gap-10 lg:gap-16` → `gap-10 lg:gap-24`. One
      class value changed; `gap-10` (mobile/tablet stacked spacing) left
      alone since there are no side-by-side columns below `lg`.
- [x] Ponytail self-review of the diff: nothing to cut — one guard clause,
      one class value, no abstraction, no new file, no new dependency.
      `net: -0 lines possible.`

## Acceptance criteria

- AC-1 (carousel paging/indicators match the actual number of houses):
  **met.** Measured in a real browser (production build, see Verification):
  at 1024px and 1440px, clicking "Next home" 9× from house 1 gives active-dot
  sequence `[1,2,3,4,5,6,7,0,1]` — all 8 houses reached, including Heliodor
  House (dot 8/index 7), then wraps correctly. The guard fired: it only sets
  `activeIndex = homes.length - 1` when `scrollLeft >= maxScrollLeft - 1`, so
  reaching index 7 proves the scroller rested at its true ceiling (measured
  `maxScrollLeft` 2096 at 1440px post-fix) — `scroll-snap-mandatory` did not
  clamp the rest position back to index 6 as flagged as a risk.
- AC-2 (larger, correct margin between the two columns; no overlap at any
  breakpoint): **met.** Measured column gap 96px at both 1024px and 1440px
  (up from 64px). No overlap: `document.documentElement.scrollWidth -
  clientWidth = 0` at 390px (no page-level regression — lesson 4's
  `min-w-0` still holds, confirmed unchanged).
- AC-3 (existing carousel reused, not rebuilt): **met.** No new component,
  no rewrite — one guard clause inside the existing `handleScroll` effect.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (Next.js 16.2.6, Turbopack, all 22 routes
      generated).
- [x] Browser verification: production build (`next start -p 3100`), not
      the dev server — dev-server HMR was destroying the execution context
      mid-measurement. Driven via Playwright against system Chrome.
      - 1024px: 8 dots; Next-arrow sequence `[1,2,3,4,5,6,7,0,1]` over 9
        clicks; column gap 96px.
      - 1440px: identical sequence; column gap 96px; `scrollLeft` ceiling
        (`scrollWidth - clientWidth`) measured at 2096.
      - 390px: `document.documentElement.scrollWidth - clientWidth = 0` —
        no horizontal overflow regression.

## Review

Two independent, minimal fixes, both confined to the files the card named:

`HomesCarousel.tsx` — `handleScroll` gained a 4-line guard clause that reads
the DOM's actual scroll ceiling (`scrollWidth - clientWidth`) instead of
relying solely on the `cardWidth + gap` approximation, which structurally
undercounted the last index whenever more than one card's width was visible
in the viewport. Because dots, arrow-cycling (`scrollBy`), and auto-scroll
all read from the single `activeIndex` state this effect sets, the one
guard clause fixed all three symptoms at once (last dot never lighting up,
"Next" skipping the 8th house, auto-scroll doing the same) without touching
`scrollToIndex`, arrow positioning, card sizing, or the snap classes.

`HomesSplitRow.tsx` — the two-column gap moved from `lg:gap-16` (64px, was
already the largest two-column gap anywhere in this codebase) to
`lg:gap-24` (96px), Tailwind's native default spacing scale, one class
value, no new token.

Confirmed the one flagged risk did not materialize: `scroll-snap-mandatory`
could in principle clamp the rest position back short of the true
`maxScrollLeft`, which would have kept the guard's `scrollLeft >=
maxScrollLeft - 1` condition from ever firing. Production-build browser
measurement (dev server's HMR was unreliable for this) showed the scroller
does rest at its true ceiling, and dot 8 is reached on both measured
breakpoints.

`tasks/lessons.md` not touched — nothing here contradicted a prior lesson;
lesson 4's `min-w-0` constraint was re-verified intact (0px overflow at
390px), not corrected.
