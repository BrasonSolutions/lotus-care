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

---

# M5: Our Board — match team-card size

Branch: `fix/our-board-card-size`.

## Diagnosis

Three independent, additive causes, all in `BoardSection.tsx`, none in the
reference `TeamCard.tsx`/`TeamSection.tsx` (column count was already
identical — `sm:grid-cols-2 lg:grid-cols-3` on both — so this was never a
grid-density mismatch):

1. **Extra width cap at `lg`.** `BoardSection.tsx:33`'s grid carried
   `max-w-4xl mx-auto` (56rem/896px) on top of the shared `<Container>`
   (`width="wide"` → `max-w-wide` = `--container-wide: 90rem`,
   `globals.css:64`) that `TeamSection.tsx:68`'s grid also sits in but
   without any extra cap. Below ~944px viewport the 896px cap doesn't bind
   (Container's own content width is already narrower), so board and team
   columns were coincidentally close at `sm`; at `lg` it does bind hard —
   computed column width at 1440px: team (1376−64)/3 ≈ 437px vs board
   (896−48)/3 ≈ 283px, ~35% narrower.
2. **Gap mismatch.** `gap-6` (24px, `BoardSection.tsx:33`) vs `gap-8` (32px,
   `TeamSection.tsx:68`) — a secondary few-px drift on top of (1), visible
   even where the 896px cap doesn't bind.
3. **Half-scale, non-responsive photo/padding.** Board's photo wrapper was
   `w-20 h-20` (80px, `BoardSection.tsx:41`) against `TeamCard.tsx:26`'s
   `w-36 h-36` (144px) — 44% of the linear size, ~31% of the area — with a
   proportionally thin `inset-[2px]` mask border (`BoardSection.tsx:47`) vs
   `TeamCard.tsx:32`'s `inset-[3px]`, plus a flat `p-8` card padding
   (`BoardSection.tsx:39`) that doesn't shrink on mobile the way
   `TeamCard.tsx:23`'s `p-6 sm:p-8` does.

Reference card (`TeamCard.tsx`) was correct throughout — nothing about it
was suspected or changed; the fix is confined to `BoardSection.tsx` reusing
its numbers.

## Must not break

- C-1: `TeamCard.tsx` and `TeamSection.tsx` untouched — Board moves to match
  Team, not the other way around (explicit instruction; also protects the
  shared component `TeamModal` depends on per
  `.claude/agent-memory/skill-worker-frontend/team_card_scope_boundaries.md`).
- C-2: `src/data/team.ts` untouched — no new `department`-equivalent field
  added to `BoardMember` to force a fabricated pill (see exception below).
- C-3: Board grid stays `sm:grid-cols-2 lg:grid-cols-3` — column *count*
  unchanged, only column *width*; 5 board members still wrap 3+2 at `lg`.
- C-4: Design tokens only — every changed value (`gap-8`, `p-6 sm:p-8`,
  `w-36 h-36`, `inset-[3px]`, `144`, `sizes="144px"`) is a literal already in
  use by `TeamCard.tsx`, no new CSS variable, no new dependency.
- C-5: No test framework introduced (none exists in this repo, confirmed via
  `.claude/agent-memory/skill-worker-frontend/team_card_scope_boundaries.md`)
  — verification is `tsc`/`lint`/`build` + browser measurement.

## Tasks

- [x] Read `BoardSection.tsx`, `TeamCard.tsx`, `TeamSection.tsx`,
      `Container.tsx`, `globals.css` (`--container-wide`), and
      `src/data/team.ts` (`BoardMember` shape) before editing anything.
- [x] `BoardSection.tsx:33` — grid className: removed `max-w-4xl mx-auto`,
      `gap-6` → `gap-8`.
- [x] `BoardSection.tsx:39` — card className: `p-8` → `p-6 sm:p-8`.
- [x] `BoardSection.tsx:41` — photo wrapper: `w-20 h-20` → `w-36 h-36`.
- [x] `BoardSection.tsx:47` — mask inset: `inset-[2px]` → `inset-[3px]`.
- [x] `BoardSection.tsx:53-55` — `<Image>`: `width={80} height={80}` →
      `width={144} height={144}`, added `sizes="144px"`.
- [x] Ponytail self-review of the diff: pure Tailwind value substitution
      copied from an existing pattern (`TeamCard.tsx`), no new abstraction,
      no new file, no new dependency. `net: 0 lines possible.` "Lean
      already. Ship."

One file changed: `src/components/board-section/BoardSection.tsx`. Six value
substitutions, nothing else.

## Acceptance criteria

- AC-1 (Our Board cards match Meet-the-Team card dimensions): **met.**
  Measured in Chrome on a production build (`next start -p 3100`), team vs
  board:
  - 390px: `358×296` vs `358×262` — width delta 0px.
  - 768px: `344×312` vs `344×278` — width delta 0px.
  - 1440px: `437×312` vs `437×278` — width delta 0px.
  - Photo box 138×138 in both sections; grid gap 32px in both.
  Width matches exactly at all three measured breakpoints — the fix
  eliminated the pre-fix 1440px defect (283px vs 437px, ~35% narrower).
- AC-2 (consistent across breakpoints): **met.** The width delta is 0px at
  390/768/1440 alike (not just at one breakpoint), board still lays out 3+2
  at `lg` (row count unchanged from pre-fix), and
  `document.documentElement.scrollWidth - clientWidth = 0` at all three
  widths — no horizontal-overflow regression introduced.

**Deliberate, documented exception — do not "fix" this later:** a flat
34px height delta remains at every breakpoint (296 vs 262, 312 vs 278, 312
vs 278 — height delta 34px on all three, the signature of one fixed-height
element, not a scaling error). This is `TeamCard.tsx`'s department pill
(`ACCENT` chip, `TeamCard.tsx:52-56`), which `BoardSection.tsx` does not and
should not render: `BoardMember` (`src/data/team.ts`) carries no
`department` field, and inventing a placeholder pill or a spacer/`min-height`
to force pixel-parity would mean fabricating content that doesn't exist —
rejected explicitly during planning (Step 1) and confirmed by the coordinator
during verification. A real content difference is allowed to show. If a
future card gives board members a genuine second data field to display in
that slot, closing the 34px gap is a side effect of that change, not a
reason to add a fake one now.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (Next.js 16.2.6, Turbopack, all 22 routes
      generated).
- [x] Browser verification: production build (`next start -p 3100`), Chrome,
      team vs board measured at 390/768/1440px (see AC-1/AC-2 numbers
      above). `document.documentElement.scrollWidth - clientWidth = 0` at
      all three widths.

## Review

Three additive causes, one file, six literal value substitutions copied from
the already-correct reference card (`TeamCard.tsx`) — no new abstraction, no
shared token file introduced for values that only appear twice. The dominant
defect (896px `max-w-4xl` cap making board columns ~35% narrower than team's
at `lg`) is gone; the secondary `gap-6`/`gap-8` drift is gone; photo and
padding now scale identically to `TeamCard`.

The 34px residual card-height difference was predicted before implementation
(the ~28-36px estimate for the missing department-pill row) and confirmed
flat across all three breakpoints post-fix — consistent with one fixed-height
element, not a leftover scaling defect. Left as-is per explicit instruction:
no spacer, no `min-height`, no fabricated pill.

`tasks/lessons.md` not touched — nothing here contradicted a prior lesson;
lesson 7's "look at the image, don't invent" principle was applied by
analogy (don't invent a pill either) rather than corrected.
