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

---

# NB1: Navbar logo + typography

Branch: `fix/navbar-logo-typography`.

## Diagnosis

Two independent defects, both confined to `LogoDark.tsx` and
`LogoWhite.tsx` — `Navbar.tsx` itself was already correct.

**Mark was raster, not SVG.** `LogoDark.tsx`/`LogoWhite.tsx` rendered
`next/image` against `/images/logo-icon-color.png` (intrinsic 90×94) and
`/images/logo-white-notext.png` (intrinsic 80×80) respectively, scaled into
a 42×40 CSS box (`h-10 w-auto` on the wrapper). Coordinator's independent
measurement of the pre-fix white PNG: intrinsic 85×81 rendered into a
42×40 box — at `devicePixelRatio` 2 that box needs 84×80 device pixels
against 85×81 available, i.e. **zero headroom**, soft on any retina
display. This is the literal thing card NB1's "use SVG!!" problem
statement was naming.

**Typography had two scale violations, one of them an AA failure.** The
"ENHANCED LIVING" caption (`LogoDark.tsx:16`, `LogoWhite.tsx:16`) was set
at `text-[9px]` — a repo-wide grep for `text-\[[0-9]*px\]` across `src/`
returned only these two lines; it is the only raw-pixel font size
anywhere in the codebase, below Tailwind's own floor (`text-xs` = 12px).
On `LogoWhite.tsx:16` specifically, that same caption was also
`text-white/70`. Computed via the WCAG relative-luminance formula: white
at 70% opacity over `bg-primary-dark` (`#0d6a70`) blends to an effective
contrast ratio of **3.98:1** — fails AA (needs 4.5:1) for normal text.
This is not a hypothetical: `LogoWhite` sits directly on solid
`bg-primary-dark` whenever `Navbar`'s `solidWhenTop` prop is set and the
page is unscrolled (`Navbar.tsx:59`), which is live on `/careers` and
`/quality` (`src/app/careers/layout.tsx:22`,
`src/app/quality/layout.tsx:22`), and in the footer, which shares the
same `LogoWhite` component (`Footer.tsx:23`). `LogoDark.tsx:16`'s caption
(`text-muted` on white, no opacity applied) computed to 4.83:1 — already
passing, so only its raw-pixel size needed correcting, not its color.

## User's design decision

Swap the mark to a real SVG and keep the wordmark ("LOTUS CARE" /
"ENHANCED LIVING") as live HTML text, rather than adopting the full
designer lockup file (`docs/brand-assets/Logo/Lotus Care Logo -
*.svg`/`Stacked *.svg`, which bakes mark + "Lotus Care" wordmark into one
outlined-path SVG). Two reasons: the text stays selectable and
screen-reader friendly as real DOM text instead of opaque vector paths;
and no lockup file contains the "ENHANCED LIVING" tagline anyway — both
the horizontal and stacked lockups measured exactly 36 `<path>` elements
(16 mark facets + 20 wordmark-letter paths for "Lotus Care" only), too
few to also encode a second word, confirming the tagline has always been
site-authored text, not brand artwork being reproduced badly.

## Must not break

- No change to `Navbar.tsx` — already correct: right components, right
  wrapper sizing (`h-10 w-auto`), right scrolled/unscrolled branch logic.
  Confirmed by reading in full before editing anything.
- No change to `MobileMenu.tsx` — read in full; it renders no logo at
  all (hamburger + drawer with a text-only "Menu" header). Not affected
  by this card.
- No change to `Footer.tsx` — it consumes the shared `LogoWhite`
  component but was not itself edited; see shared-surface note below.
- No change to `LotusMark.tsx`, `LotusMarkAlt.tsx`, or
  `lotus-geometry.ts` — reused as-is (F7 work), zero edits.
- No new dependency, no new CSS variable — the mark reuses the existing
  `LotusMark` component's `tone` prop; the caption fix uses Tailwind's
  own scale steps (`text-xs`, `text-white/80`).
- `tracking-[0.14em]` / `tracking-[0.2em]` on both wordmark lines left
  unchanged — deliberate brand letter-spacing, not a scale bug (see
  Review).

## Shared-component disclosure

`LogoWhite` is consumed by **both** `Navbar.tsx:71` (unscrolled state)
and `Footer.tsx:23`. Fixing `LogoWhite.tsx` therefore fixes the footer's
logo (raster→SVG, and the same AA-failing caption) as a direct
consequence — `Footer.tsx` itself carries no edit. Flagged up front
during planning, not discovered after the fact.

## Tasks

- [x] Read `Navbar.tsx`, `LogoDark.tsx`, `LogoWhite.tsx`,
      `LotusMark.tsx`/`LotusMarkAlt.tsx`/`lotus-geometry.ts`,
      `MobileMenu.tsx`, `Footer.tsx`, and every file in
      `docs/brand-assets/Logo/` (opened the actual SVGs — path counts,
      viewBox, fill structure) before editing anything.
- [x] `LogoDark.tsx` — replaced the `next/image` raster `<Image>` with
      `<LotusMark tone="color" className="h-full w-auto" />` (real
      per-facet brand teals, matches the old color PNG's intent); caption
      `text-[9px]` → `text-xs`.
- [x] `LogoWhite.tsx` — replaced the raster `<Image>` with `<LotusMark
      tone="mono" className="h-full w-auto text-white" />`; explicit
      `text-white` is load-bearing here — `tone="mono"` renders
      `fill="currentColor"`, and the parent `<Link>` in `Navbar.tsx:67`
      sets no color class, so without it `currentColor` would resolve to
      the inherited dark body foreground and silently render an invisible
      mark on the dark navbar state, passing `tsc` and `build` while
      doing it; caption `text-[9px]` → `text-xs` and `text-white/70` →
      `text-white/80` (the AA fix).
- [x] Verified no other reference to the two raster PNGs before deleting:
      grepped `src/` (including `src/app` metadata exports),
      `.storybook/`, `stories/`, `public/` (no manifest/webmanifest/
      browserconfig files exist in this repo), every root `*.json`/
      `*.md`, and a final repo-wide sweep excluding `node_modules`/
      `.next`/`.git`. Both filenames appeared only in the two files just
      edited.
- [x] Deleted `public/images/logo-icon-color.png` and
      `public/images/logo-white-notext.png` (`git rm`).
- [x] Ponytail self-review of the diff: `Lean already. Ship. net: -14
      lines possible.` — raster `<Image>` block removed outright, mark
      reuses the existing `LotusMark` component (no new geometry, no new
      file), only two Tailwind utility values changed per caption line.

## Acceptance criteria

- AC-1 (navbar logo is the correct SVG, crisp at all sizes): **met.**
  Coordinator-verified in Chrome on a fresh production build: mark is
  vector on every page state (`viewBox 0 0 148.47 141.48`, 16 paths, no
  `<img>` element left anywhere in the navbar); rendered box 42×40px
  identical at 390/768/1440/1600. Unscrolled/transparent navbar: mark
  computes to `rgb(255,255,255)` — the explicit `text-white` did its job,
  the `currentColor` inheritance trap did not fire. Scrolled navbar
  (white bg): path fills sample as `rgb(9,105,114)`, `rgb(97,195,215)`,
  `rgb(230,244,249)` — the real per-facet brand teals from the designer
  file, not an approximation.
- AC-2 (navbar typography corrected and consistent with the type
  system): **met.** Caption renders at 12px, one line, at every measured
  width; navbar height stays 64px at every width; `document
  .documentElement` overflow is 0 — the 33% size jump from 9px→12px did
  not wrap the caption, push the nav controls, or change navbar height,
  which the coordinator flagged as the specific risk to watch before
  measuring.
- AC-3 (AA contrast in the navbar): **met, with a margin note for the
  record.** Measured by decoding the rendered screenshot and running the
  WCAG formula on actual pixels (background vs. brightest fully-covered
  glyph pixel), not token math: **`/careers` 4.69:1** — exactly the
  planning-stage computed figure (white/80 over solid `#0d6a70`) — and
  **homepage 4.52:1**. Both clear AA (4.5:1). The homepage figure is
  lower because the hero overlay there lightens the effective bar color
  to roughly `rgb(16,109,116)` rather than solid `#0d6a70`. `LogoDark`'s
  caption is unchanged in color (`rgb(107,114,128)` on white), still
  passing. **Recorded for the record, not actioned:** the homepage's
  4.52:1 has very little margin above the 4.5:1 AA floor — if a future
  card lightens that hero overlay further, the tagline could drop below
  AA. Nothing changed now; it passes today.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (Next.js 16.2.6, Turbopack, all 22 routes
      generated).
- [x] Browser verification: coordinator, Chrome, fresh production build —
      see the measured figures under AC-1/AC-2/AC-3 above.

## Review

Two files changed (`LogoDark.tsx`, `LogoWhite.tsx`), two dead raster
assets deleted after a repo-wide reference sweep, net **-14 lines**. No
new component, no new geometry extraction — the mark reuses the existing
`LotusMark` component's `tone` prop exactly as F7 intended it to be
reused, and the wordmark stays real HTML text rather than being folded
into the designer's combined mark+wordmark lockup SVG, per the user's
explicit decision (selectable/screen-reader-friendly text, and no lockup
file contains the tagline regardless).

Two things deliberately **not** changed, both flagged during planning and
confirmed by the coordinator rather than decided unilaterally:

- `tracking-[0.14em]` / `tracking-[0.2em]` on both wordmark lines — the
  only genuinely ambiguous item in the diagnosis. They don't match any
  Tailwind tracking step, but they also don't match anything measurably
  broken (no AA angle, no illegibility angle at 12px+), and collapsing
  them to `tracking-wide`/`tracking-widest` would visibly retighten a
  wordmark that reads as a deliberate brand choice. Left alone.
- `Navbar.tsx` — already correct on inspection (right components, right
  sizing, right branch logic); no defect to fix there.

The one AA number worth carrying forward: homepage caption contrast is
4.52:1, only 0.02:1 above the AA floor, because the hero overlay under
the transparent navbar is lighter there than the solid `bg-primary-dark`
case. Not a defect today — recorded so a future hero-overlay change
doesn't silently regress it below AA.

`tasks/lessons.md` not touched — no correction occurred this round; the
Step 1 plan (mark→SVG, keep wordmark as text, explicit `text-white` on
the mono mark, `text-xs`/`text-white/80` on the caption) was right on
first pass and the coordinator's independent Chrome measurement confirmed
every number computed during planning.

---

# F6: Full-width lotus-pattern band

Branch: `feat/lotus-band-component`.

## Diagnosis

Not a bug fix — a new component. Plan 2.0 asks for a full-width rectangle of
the lotus pattern in brand colours as a recurring section device (p.1
sketch). Two reference screenshots in `docs/brand-assets/Logo/`
(`screenshot-2.png`/`screenshot-3.png` — see the F5 section below for why
those filenames, not the ones the card originally named) show a solid-colour
band tiled with `LotusMarkAlt`'s outline motif, overlapping horizontally and
cropped top/bottom by the band's own edges.

`LotusMarkAlt` (`src/components/lotus-mark/LotusMarkAlt.tsx`, added in F7)
is a single compound-fill path that already traces the outline shape the
reference shows — confirmed from the path data itself (~30 subpaths of
closed loops filled `nonzero`) before writing any code, so it is reused
as-is (`fill="currentColor"`); stroking it would double-draw already-thin
geometry.

## Must not break

- C-1: `src/components/lotus-mark/*` untouched — `LotusMarkAlt` is consumed
  via its public component export only, never a deep import of
  `lotus-geometry.ts`. Zero risk of a mistyped/rounded path coordinate.
- C-2: No page placement. This card builds the component and its Storybook
  story only; placement is a separate card (G2).
- C-3: No new dependency, no CSS module — Tailwind + inline SVG only, same
  convention as the existing `Blob`/`LotusMarkAlt` components.
- C-4: `globals.css` untouched — every colour is a `var(--color-*)`
  reference to a token that already exists.
- C-5: No `npm run build`/`build-storybook` (coordinator runs those
  centrally); `npx tsc --noEmit` and `npm run lint` only.

## Tasks

- [x] Read `LotusMarkAlt.tsx`, `lotus-geometry.ts`, `globals.css` (`@theme`
      token block), `Blob.tsx`/`Blob.stories.tsx` (prop/token-map
      convention), `Container.tsx` (width-system precedent), and
      `LotusPhotoMask.tsx` (`useId()`-scoped id convention) before writing
      anything.
- [x] Created `src/components/lotus-band/LotusBand.tsx` — seamless tiling:
      the inner `<svg>` carries **no `viewBox`**, so per the SVG spec 1 user
      unit = 1 real CSS px of its own rendered box; a `<pattern
      patternUnits="userSpaceOnUse" width={tileSize} height={height}>`
      inside it then repeats pixel-exact at any container width, zero
      distortion, no `ResizeObserver`.
- [x] **Two-copies-per-tile overlap construction** (`LotusBand.tsx:126-135`)
      — `<pattern>`'s default `overflow:hidden` clips *each repeated tile
      independently* to its own `[0,tileSize]×[0,height]` box. A single
      `LotusMarkAlt` copy per cell wider than `tileSize` doesn't "spill into
      the neighbour" — it just loses its clipped tail in every repeat, the
      same clipped tail, forever (a real defect this card avoided rather
      than shipped: "why does the pattern look chopped" was flagged
      explicitly during planning as the failure mode of a naive single-copy
      implementation). Fix: each tile draws `LotusMarkAlt` **twice** — once
      at local `x=0` (this cell's motif) and once at local `x=-tileSize`
      (the visible remainder of the *previous* cell's motif) — so with
      `motifSize > tileSize` the interlocking look is real, undistorted
      geometry, not a clipped illusion.
- [x] Sized `LotusMarkAlt` inside the pattern without touching
      `lotus-mark/*`: `LotusMarkAlt`'s props are `{ className }` only (no
      `style`, no rest-spread), and a Tailwind arbitrary-value class built
      from a runtime prop (`w-[${motifSize}px]`) isn't picked up by
      Tailwind's static JIT scan. Wrapped each copy in a plain nested `<svg
      x={} y={} width={motifSize} height={motifHeight} style={{ color }}>`
      (native SVG attributes, numbers as JSX props, no Tailwind involved)
      and gave `<LotusMarkAlt className="h-full w-full" />` inside it.
- [x] Top/bottom crop: `motifHeight = motifSize * (141.48/148.47)`
      (`LotusMarkAlt`'s own viewBox ratio, hardcoded as a local constant
      with a comment pointing at the source, not imported) comes out taller
      than `height`; each copy's `y={-(motifHeight-height)/2}` centres it,
      so the pattern's own clip crops it symmetrically top and bottom.
- [x] `useId()`-scoped pattern id (`lotus-band-${useId()...}`,
      `LotusBand.tsx:115`) — same convention as `LotusPhotoMask`'s
      `clipPath` id — so multiple band instances on one page/Storybook
      canvas don't collide.
- [x] Numeric `height` prop (default 96), not a Tailwind height class on
      `className` — the crop math needs a real number synchronously, and
      this repo has no `tailwind-merge`, so a caller height class and a
      component-default height class on the same element would race
      unpredictably. Also makes CLS zero by construction: the wrapper's
      `style.height` is set synchronously from a prop, no async asset load,
      no JS-driven resize.
- [x] Token-driven colours only, verified via WCAG relative-luminance
      formula against the real hexes (not eyeballed) — teal band
      `var(--color-teal-700)`, purple band `var(--color-purple-600)`,
      neutral spacer `var(--color-warm-bg)` (the site's existing
      established neutral-surface token, reused rather than introducing an
      unused `neutral-*` shade).
- [x] "Neutral" variant = plain spacer, no motif at all (the correct
      reading of Plan 2.0's "neutral spacer" wording, confirmed by the
      coordinator) — skips rendering the whole `<svg>`/`<pattern>` for that
      variant rather than an invisible/zero-opacity one.
- [x] `stories/ui/LotusBand.stories.tsx` — `Teal`/`Purple`/`NeutralSpacer`
      (the 3 F6 ACs) plus `WithOverlayText` (AA contrast demo, same role as
      `Blob`'s existing `BehindText` story). No test framework exists in
      this repo (`package.json` has no `test` script, zero `*.test.tsx`
      files anywhere) — Storybook stories are this project's verification
      artifact for UI components.
- [x] Ponytail self-review of the diff: one real finding — the optional
      `children` wrapper had `relative z-10 h-full`; established precedent
      for "content over an absolute decorative layer"
      ([[lotus_mark_alt_card_motif]] memory / `BenefitCard`) uses only
      `relative`. Fixed. Everything else (two-copy overlap, the three
      numeric tiling props) is required by the technique itself, not
      speculative.

## Acceptance criteria

- AC-1 (seamless full-width tiling, no visible seams, zero CLS): **met.**
  Coordinator measured periodicity directly against a static Storybook
  build, not by eyeballing boundaries: every pixel column at 1440px
  compared against the column one tile (112px) to its right, 49,956 sample
  pairs, **maxPeriodDiff = 0** — byte-identical repeats. Full-bleed and
  zero page overflow confirmed at 390/768/1440/1920. `rgb(13,106,112)`
  measured = teal-700, tile 112px, no `viewBox` present, as designed.
- AC-2 (band colour(s) driven by tokens; AA contrast for any overlaid
  text): **met.** All colours are `var(--color-*)` references (verified —
  no raw hex in the component); white overlay text measured contrast
  teal-700 ≈ 6.34:1, purple-600 ≈ 10.48:1, warm-bg/foreground ≈ 11.76:1 —
  all clear AA.
- AC-3 (Storybook story: teal, purple, neutral-spacer variants): **met** —
  see Tasks above.
- Additional, unplanned-for confirmation: vertical bleed is real, not
  shrunk-to-fit — coordinator measured 274 ink pixels on the band's top row
  and 144 on the bottom row, i.e. the motif genuinely gets cropped by the
  band edges rather than scaled to avoid it, matching the reference art.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build`/`npm run build-storybook` — not run by this agent
      (coordinator runs both centrally per standing instruction).
- [x] Browser verification: coordinator, Chrome, against a static
      Storybook build (`storybook-static` served on :6007 — the webpack dev
      server never finished bundling, so the coordinator built once and
      served the output) — see the measured numbers under AC-1/AC-2 above.

## Review

One new component (`src/components/lotus-band/LotusBand.tsx`, `index.ts`)
plus one Storybook story file — no edits to any existing file, no page
placement, no dependency added. The seamless-tiling mechanism (no-`viewBox`
SVG + `userSpaceOnUse` `<pattern>`) and the two-copies-per-tile overlap
construction are the two pieces of real technique here; both were reasoned
through from the SVG spec's actual clipping behaviour before implementation
rather than trial-and-error in the browser, and both were then independently
confirmed by the coordinator's pixel-level measurement (maxPeriodDiff = 0;
274/144 ink-pixel bleed counts).

One self-caught defect during ponytail-review (the `children` wrapper's
redundant `z-10`/`h-full`) — fixed before this went to verification, not
after.

`tasks/lessons.md` not touched — no user correction occurred in this round;
see the F5 section below for the two corrections that *did* land, both
self-caught or coordinator-relayed before implementation, not after.

---

# F5: Shape-divider component set (6 colourways)

Branch: `feat/shape-divider-components`.

## Diagnosis

**The card's stated asset location was wrong, and this was caught before
implementation, not silently worked around.** F5 as written says the 6
divider assets live in `docs/brand-assets/logo/`; that directory contains
only the raw logomark exports (`Lotus Care Alternative Logomark -
Black/Green/Purple/White.svg`/`.png`), no divider art. The coordinator
reported this gap to the user; the user then identified the *reference
screenshots already used for F6* as the divider art — three motif
colourways tiled on a teal band, three more on a purple band, "three plus
three is the six shape dividers." Re-opened both images myself rather than
taking that reading on trust; it holds up exactly.

**F5 and F6 are the same artwork serving two different jobs, not two
components.** F5 therefore widened the F6 `LotusBand` component (added a
second, independent colour axis) rather than building a parallel divider
component family. **This is a deliberate, permanent design decision, not an
in-progress state** — a future reader searching for a separate
`ShapeDivider`/`LotusDivider` component should find this note instead: it
does not exist by design, `LotusBand` covers both jobs.

**Reference files were renamed mid-task.** The original
`Screenshot 2026-08-08 195730/195757/195811.png` were deleted from
`docs/brand-assets/Logo/` and replaced by untracked `screenshot-1/2/3.png`
(`195730`→`screenshot-1`, the CR2 benefit-card reference; `195757`→
`screenshot-2`, teal band; `195811`→`screenshot-3`, purple band) — caught by
re-checking `git status` when a `Read` on the old path failed, not assumed.
The coordinator confirmed the rename is intentionally uncommitted and will
be staged alongside this work.

**Pixel-sampled the two reference images rather than eyeballing colour
names**, using ImageMagick (`identify`/`convert` histograms — available in
this environment, no new tool installed):

| Screenshot | Row | Sampled hex | Token used |
|---|---|---|---|
| screenshot-2 (teal band) | bg | `#096972` | `--color-teal-700` (closest by far) |
| screenshot-2 | row 1 | `#FFFFFF` | `--color-background` (exact) |
| screenshot-2 | row 2 | `#000000` | `--color-neutral-900` (closest defined token) |
| screenshot-2 | row 3 | `#761948` | `--color-purple-600` (**exact byte match**) |
| screenshot-3 (purple band) | bg | `#761948` | `--color-purple-600` (**exact byte match**) |
| screenshot-3 | row 1 | `#096972` | `--color-teal-700` (same value as the teal band's own bg — **not** teal-500) |
| screenshot-3 | row 2 | `#000000` | `--color-neutral-900` |
| screenshot-3 | row 3 | `#FFFFFF` | `--color-background` (exact) |

Two things the sampling found that colour *names* alone could not carry:

1. **`--color-neutral-900` (`#111827`), not `--color-foreground`
   (`#2d3436`), for "black."** `#111827` is measurably closer to the
   reference's pure `#000000` by luminance distance. This is a **deliberate
   divergence from the designer's export** — a token over a raw value — not
   an attempt to reproduce `#000000` exactly. Recorded as a decision.
2. **Self-caught bug in F6's own shipped code.** The purple band's motif
   had used `--color-teal-500`; the pixel sample showed the true value is
   `--color-teal-700` (byte-identical to the teal band's own background).
   Fixed in this same diff, found before the coordinator's browser
   verification, not after.

## Must not break

- C-1 (carried over from F6): `src/components/lotus-mark/*` untouched;
  `globals.css` untouched; no page placement; no new dependency; no
  `npm run build`/`build-storybook`.
- C-2: `variant`'s existing 3 values (`teal`/`purple`/`neutral`) and their
  meaning completely unchanged — the 4 existing F6 stories needed zero
  edits.
- C-3: No second component family. The divider requirement is served by
  widening `LotusBand`'s prop surface, confirmed explicitly with the
  coordinator before implementation (Step 1 plan, approved as written).

## User's design decision

Two independent props (`variant` for band colour, new `motifColor` for
outline colour) rather than a 7-member widened `variant` union
(`"teal"`/`"teal-black"`/`"teal-purple"`/`"purple"`/`"purple-black"`/
`"purple-white"`/`"neutral"`). Justification, by size: the 6 combos are a
clean cross product — `variant ∈ {teal, purple}` × `motifColor ∈ {white,
black, teal, purple} \ {variant's own hue}` (a colour can't be its own
band's motif, it would be invisible) = 2×4−2 = 6. A widened union would
repeat each band's `bg` value across 3 entries (3× `teal-700`, 3×
`purple-600`); the two-axis design declares each `bg` once. `motifColor` is
documented as "must differ from `variant`'s hue" rather than
runtime-validated — a compile-time developer choice between two decorative
props, not a trust boundary crossed by user input, so a doc comment is
proportionate (confirmed with the coordinator).

## Tasks

- [x] Re-opened both reference screenshots (at their renamed paths) and
      independently confirmed the coordinator's relayed colour-name list —
      correct, with the two additional pixel-level facts above.
- [x] `LotusBand.tsx:6-7` — added `LotusBandMotifColor` type
      (`"white"|"black"|"teal"|"purple"`).
- [x] `LotusBand.tsx:29-47` — added `MOTIF_COLOR` (the 4-value token map,
      with the pixel-sampling provenance recorded in the comment) and
      `DEFAULT_MOTIF` (each band's reference default when `motifColor` is
      omitted: teal→white, purple→teal, matching F6's original look
      exactly — zero visual change to the 4 existing stories' default
      renders beyond the teal-500→teal-700 bug fix).
- [x] `LotusBand.tsx:23-26` — fixed purple band's motif default from
      `--color-teal-500` to `--color-teal-700` (the self-caught bug above).
- [x] `LotusBand.tsx:49-79` — added `motifColor` to `LotusBandProps` with
      the "must differ from `variant`" doc note.
- [x] `LotusBand.tsx:82-105` — doc comment states the AA assumption
      explicitly: "contrast is checked against the band background only —
      the outline motif is decorative and low-coverage (thin strokes, not a
      fill), the same convention already used for `Blob`/`BenefitCard`" —
      recorded as a decision, not an oversight, per the coordinator's
      instruction.
- [x] `LotusBand.tsx:106-117` — component body resolves `motif` as
      `variant === "neutral" ? undefined : MOTIF_COLOR[motifColor ??
      DEFAULT_MOTIF[variant]]` — `DEFAULT_MOTIF`'s narrower
      `Record<"teal"|"purple", ...>` type (rather than folding it into
      `BAND_STYLE`'s `Record<LotusBandVariant, ...>`) is what keeps this
      lookup provably non-`undefined` in the already-narrowed branch;
      considered merging the two maps in ponytail-review and rejected it —
      a few lines saved for a real type-safety loss.
- [x] `stories/ui/LotusBand.stories.tsx` — added `AllSixDividers` (F5's
      "one story showing all 6" AC): a 6-entry `DIVIDERS` array of
      `{variant, motifColor}` pairs mapped to stacked `<LotusBand>`
      instances, reusing the component with no new markup complexity.
- [x] Ponytail self-review of the diff: one candidate considered
      (`DEFAULT_MOTIF`→`BAND_STYLE` merge, see above) and rejected with a
      stated reason. `net: -0 lines applied.`

## Acceptance criteria

- AC-1 (all 6 dividers available from one component, selectable by prop,
  sourced from the reference art): **met.** Coordinator verified by pixel
  histogram of the `AllSixDividers` story: teal-700 band with white /
  `#111827` / `#761948` motifs, and purple-600 band with teal-700 /
  `#111827` / `#ffffff` motifs — exactly the reference mapping, and the
  teal-500→teal-700 self-correction is visibly present in divider 4.
- AC-2 (colours come from brand tokens; no hardcoded hex): **met.** Every
  value in `MOTIF_COLOR`/`BAND_STYLE` is a `var(--color-*)` reference; the
  "black" mapping is `neutral-900`, never raw `#000`.
- AC-3 (full-width, responsive, zero CLS; AA contrast where a divider
  carries text/edges over content): **met.** Inherited from F6's numeric
  `height` prop and no-`viewBox` tiling (unchanged by this card). AA
  assumption stated explicitly in the component doc comment per the
  coordinator's instruction (see Tasks).
- AC-4 (Storybook story showing all 6): **met** — `AllSixDividers`.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build`/`npm run build-storybook` — not run by this agent
      (coordinator runs both centrally).
- [x] Browser verification: coordinator, Chrome, against the same static
      Storybook build as F6 — see the measured colourway table under AC-1
      above.

## Review

Two files touched, both already owned by F6
(`src/components/lotus-band/LotusBand.tsx`,
`stories/ui/LotusBand.stories.tsx`) — no new component file, no second
divider component family. The net new surface is one prop (`motifColor`)
and two small token maps, plus one bug fix inherited forward from F6
(teal-500→teal-700) that pixel-sampling caught before it reached a page.

Two corrections landed in this round, both caught before implementation
completed rather than after: the card's asset-location statement was wrong
(resolved by the user identifying the real reference, verified independently
by re-opening the images rather than trusting the relay); and F6's own
shipped purple-motif colour was wrong (caught by this agent's own
pixel-sampling during the F5 investigation, fixed in the same diff).

`tasks/lessons.md` not touched per the coordinator's explicit instruction —
both corrections above are recorded here instead, scoped to this component,
not generalized into a repo-wide lesson.
