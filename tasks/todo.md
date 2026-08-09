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

---

# CR1: "Why work with us" carousel fix

Branch: `fix/careers-why-work-carousel`.

## Diagnosis

Corrected mid-plan, twice, by real-browser measurement — recorded honestly
because both prior rounds of source arithmetic were wrong about where the
defect lived.

**First hypothesis (rejected):** `CultureGallery.tsx`'s `handleScroll` looked
like the pre-fix `HomesCarousel.tsx` — no `scrollWidth - clientWidth` ceiling
guard, so the M3 fix (copy the guard clause in isolation) looked like the
obvious reuse. **This was the wrong root cause and, applied alone, would have
been a regression.** `cultureGalleryImages` has exactly 4 entries at
`sm:w-[300px] md:w-[320px]` inside a 1440px-capped container — at 1440px,
`scrollWidth === clientWidth` (1376 vs 1376, confirmed by the coordinator's
Chrome measurement): the row never overflows, so there is nothing to scroll.
A bare ceiling guard of the form `scrollLeft >= maxScrollLeft - 1` is
unconditionally true when `maxScrollLeft` is `0` (`0 >= -1`), which would
have pinned `activeIndex` to `images.length - 1` **permanently**, at rest,
before any click — turning "the last dot never lights up" into "only the
last dot ever lights up." Caught before implementation, not after.

**Real root cause:** card sizing, not index rounding. Four fixed-width cards
(320px at `md:`) inside a container whose content width is 1376px at 1440px
leaves zero scroll room — `scrollWidth == clientWidth`. Below that, at 768px,
the same fixed 320px card leaves *some* overflow but not enough: the last two
card positions both clamp to the same `maxScrollLeft` (640px pre-fix),
so dots 3 and 4 rested at the identical `scrollLeft` — indistinguishable on
screen even though `activeIndex` correctly advanced. Arrows and dots were
updating their own highlight state while the photos underneath either didn't
move at all (1440) or stopped moving one step early (768). The controls were
lying, not miscounting.

## User's design decision

Coordinator/user chose "one large photo per view at all three breakpoints"
from three options costed during planning (fluid-width overflow vs. a small
multi-card grid vs. hiding arrows/dots when non-scrolling). With exactly 4
photos, this keeps the four dot indicators honest — each dot maps to a
materially different scroll position at every width — and serves Plan 2's
brand-presence intent (larger photos) as a side effect of the correctness
fix rather than a separate change.

## Must not break

- No change to `page.tsx`'s stats block (D1, deferred) or the
  testimonials/video-testimonials sections (D2, deferred).
- No change to `src/data/careers.ts` (`employerStats`, `testimonials`,
  `videoTestimonials`, `cultureGalleryImages` — image count/content
  untouched, this is a sizing fix not a content change).
- No change to `HomesCarousel.tsx` — it carries the identical
  `maxScrollLeft > 0`-less ceiling-guard trap today, dormant only because 8
  homes always overflow at every measured breakpoint. Left alone, out of
  CR1 scope; recorded as a known latent defect, not fixed here.
- 4:3 aspect ratio kept — not changed to buy back card height without first
  looking at the four source images (lesson 7); height was solved entirely
  via the width cap instead.

## Tasks

- [x] Read `CultureGallery.tsx`, its story (none exists), `page.tsx`,
      `src/data/careers.ts`, `Container.tsx`, `HomesCarousel.tsx` (the M3
      reference), and `globals.css` (`--container-wide`) before editing
      anything.
- [x] `CultureGallery.tsx` card `className` (`~L123`): `w-[calc(85vw)]
      sm:w-[300px] md:w-[320px]` → `w-[min(85vw,800px)]`. Single fluid
      expression, no breakpoint variants, reused the file's own existing
      `85vw` mobile value instead of inventing a new one.
- [x] `CultureGallery.tsx` `Image` `sizes` (`~L130`): `"(min-width: 768px)
      320px, 85vw"` → `"(min-width: 941px) 800px, 85vw"` — moved in
      lockstep with the width cap (941px is the exact viewport where `85vw`
      crosses 800px), otherwise Next would serve an under-sized image into
      a much larger box.
- [x] `CultureGallery.tsx` `handleScroll` (`~L70-83`): added
      `const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft > 0 && scrollLeft >= maxScrollLeft - 1) {
      setActiveIndex(images.length - 1); return; }` before the
      `cardWidth`/`gap` division — the `maxScrollLeft > 0` guard is what the
      rejected first hypothesis was missing.
- [x] Ponytail self-review of the diff: `net: 0 lines possible`, "Lean
      already. Ship." — one file, three value/logic edits, no new
      abstraction, no new file, no new dependency.

**Why the ceiling guard is load-bearing at an 800px cap (not dead code):**
for `n = 4`, `gap = 24px`, `padding ≈ 8px`, container `clientWidth = 1376`
at 1440px: `scrollWidth = 4×800 + 3×24 + 8 = 3280`, `maxScrollLeft = 3280 -
1376 = 1904`, `slot = 800 + 24 = 824`, `r = maxScrollLeft / slot = 1904 /
824 ≈ 2.31`. Index 3's naive `Math.round(scrollLeft / slot)` at the clamped
`scrollLeft` rounds `2.31` down to `2` — one dot short — because `r < 2.5`.
`k = cardWidth / clientWidth = 800 / 1376 ≈ 0.58`, below the `≈0.667` floor
under which the plain rounding logic (relied on at the first, rejected
1200px-cap proposal, where `k ≈ 0.87` and rounding alone was sufficient)
stops resolving correctly on its own. The guard replaces that rounding for
the boundary case with the DOM's actual ceiling, and `maxScrollLeft > 0`
stops it from ever firing when there's nothing to scroll — the exact failure
mode of the first, rejected hypothesis.

## Acceptance criteria

- AC-1 (carousel works correctly across breakpoints): **met.** Verified by
  the coordinator in Chrome on a fresh production build:
  - 390: card 332×301, client/scroll/max 358/1406/1048, Next×4 →
    `[1,360] [2,715] [3,1048] [0,4]`.
  - 768: card 653×542, 720/2691/1971, Next×4 →
    `[1,681] [2,1358] [3,1971] [0,4]`.
  - 1440: card 800×652, 1376/3280/1904, Next×4 →
    `[1,828] [2,1652] [3,1904] [0,4]`.
  - Page overflow 0 at all three widths. Reduced motion: `scrollLeft` 4→4
    over 7s, active index stable (auto-scroll correctly does not start).
  - Keyboard: 6 controls, all `tabIndex >= 0`; focusing "Next photo" and
    pressing Enter moved `scrollLeft` 4→828; dot buttons carry
    `focus-ring`.
  - The 1440 defect is gone by construction: `scrollWidth` 3280 vs
    `clientWidth` 1376, where it was 1376/1376 (zero overflow) before. All
    four dots rest on distinct positions; closest consecutive pair is
    1652→1904 = 252px, clear of the 150px floor set during planning. The
    guard fires correctly at the true ceiling (index 3 lands exactly at
    1904 = max) and cannot misfire, since `maxScrollLeft > 0` holds at
    every measured breakpoint.
- AC-2 (no change to deferred copy, D1/D2): **met.** `page.tsx`'s stats
  block and testimonials/video-testimonials sections, and every field in
  `src/data/careers.ts` other than the fix being purely CSS/logic on
  `CultureGallery.tsx`, are untouched.

**Deliberate, recorded deviation — accepted, not a miss:** card height at
1440 measured **652px** against the coordinator's own **≤620px** planning
bound. The photo itself is 600px (4:3 at 800px wide, exactly as predicted);
the extra 52px is the `figcaption` caption row, which the 620px bound didn't
account for. The coordinator reviewed the real number and accepted it —
recorded here as the actual measurement, not adjusted to fit the original
bound.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (Next.js 16.2.6, Turbopack, all 22 routes
      generated, `/careers/why-us` included).
- [x] Browser verification: production build, Chrome, by the coordinator —
      see the measured table under AC-1.

## Review

One file changed: `src/components/careers/culture-gallery/CultureGallery.tsx`
— a width-cap class, a matching `Image` `sizes` value, and a 4-line
conditional guard in `handleScroll`. No new file, no new dependency, no
shared hook extracted despite real duplication with `HomesCarousel.tsx`'s
scroll logic (out of this card's scope, which named only the culture
gallery).

The plan went through two real-browser corrections before this diff was
approved: source arithmetic first misidentified the defect as index-rounding
(the M3 pattern, applied in isolation it would have been a regression at
`maxScrollLeft === 0`), then under-shot the height cost of a fluid width fix
by not accounting for the caption row. Both were caught by measurement, not
by re-reading the source harder — see the new lesson in `tasks/lessons.md`.

`HomesCarousel.tsx` is not touched. It carries the same
`maxScrollLeft > 0`-less trap in its own ceiling guard today; it is dormant
there only because 8 homes always overflow at every breakpoint the M3 card
measured. Recorded as a known, deliberate non-fix — in scope for a future
card if that assumption ever stops holding, not for CR1.
