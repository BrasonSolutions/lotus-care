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

---

# M2: Our Homes — themed card border

Branch: `feat/our-homes-themed-border`.

## Diagnosis

Card wants a themed border for the Our Homes cards, either "the pattern the
shape divider uses, or brand colours" (p.2 sketch: thick brand border with a
dashed inner edge). The divider pattern (F5/F6) lives entirely in
`LotusBand.tsx`, which was mid-edit by a concurrent agent and out of scope —
so this card takes the card's own stated fallback, brand-token borders, not
the divider art.

`HomesCarousel.tsx`'s card `<button>` (`~L137`) had no border at all before
this change — `rounded-2xl overflow-hidden` only, `.card-hover` supplies a
hover-only `box-shadow`, `.focus-ring` supplies a `:focus-visible` `outline`.

## Decision: two pseudo-elements, not a real border, and `border` not `outline`

**Pseudo-elements over a real `border-4`.** `HomesCarousel.tsx` was already
carrying M3's fix, whose index arithmetic (`handleScroll`, `scrollToIndex`,
`scrollBy`) derives from each card's *measured* `offsetWidth`. A real
`border-4` on the button is width-neutral under Tailwind Preflight's
`box-sizing: border-box` — the button's width is explicitly set
(`w-[calc(85vw)] sm:w-[300px] md:w-[320px]`), so border-box shrinks the
content box to compensate and the rendered width stays pinned. **It is not
height-neutral**: the button's height is `auto` (sized by its header +
`p-5` content), and `box-sizing: border-box` only subtracts border/padding
from a dimension that is explicitly specified — on an `auto` dimension the
border is added on top, uncompensated. A real `border-4` would therefore
have added 8px (4px × 2) to every card's height. Wrapping both border layers
in absolutely-positioned pseudo-elements (`::before`/`::after`) on a
`relative` parent sidesteps the asymmetry entirely: neither pseudo
participates in the button's box layout, in either axis, so there is nothing
for M3's `offsetWidth`-based arithmetic to react to. **Do not "simplify"
this into a plain `border-4 border-primary` later** — it looks equivalent at
a glance and silently reintroduces the 8px height growth this card was
built to avoid.

**`border` on the pseudo-elements, not `outline` on the button itself.**
`.focus-ring:focus-visible` (`globals.css:93-97`) already sets `outline: 2px
solid var(--color-primary); outline-offset: 2px` on this same button for
keyboard focus visibility. Painting a decorative ring via `outline` on the
button would put two rules fighting over the same CSS property on the same
node — cascade-order dependent, and exactly the kind of collision that only
surfaces when someone tabs through the carousel rather than clicking it.
Real `border` on the pseudo-elements avoids the property collision
entirely; `outline` stays owned by keyboard focus alone.

## Must not break

- C-1: `handleScroll`, `scrollToIndex`, `scrollBy`, the `maxScrollLeft`
  guard, the `embedded` prop, and the dots/arrows JSX and wiring —
  untouched. The diff is confined to one `className` string on the card
  `<button>`.
- C-2: `src/components/lotus-band/*`, `src/components/lotus-mark/*`,
  `src/app/quality/*`, `src/components/quality/*` — untouched (owned by
  concurrent agents).
- C-3: Design tokens only — `border-primary` (`--color-teal-500`) and
  `border-teal-300`, both existing `@theme` tokens. No hardcoded hex.
- C-4: No `npm run build`/`build-storybook` (concurrent agents were live);
  `npx tsc --noEmit` and `npm run lint` only.

## Tasks

- [x] Read `HomesCarousel.tsx` in full, the M2 card in
      `docs/lotus-care-build-plan-2.md`, `tasks/lessons.md` (lesson 4, the
      `min-w-0`/overflow constraint), `globals.css` (`@theme` token block,
      `.card-hover`, `.focus-ring`), and `LotusBand.tsx` (to confirm the
      divider pattern is genuinely out of reach, not just inconvenient)
      before editing anything.
- [x] `HomesCarousel.tsx:137` — card `<button>` `className`: added
      `relative`, `after:content-[''] after:absolute after:inset-0
      after:rounded-2xl after:border-4 after:border-primary
      after:pointer-events-none` (outer solid ring), and `before:content-['']
      before:absolute before:inset-2 before:rounded-xl before:border
      before:border-dashed before:border-teal-300 before:pointer-events-none`
      (inner dashed ring). One line changed, nothing else touched.
- [x] Ponytail self-review of the diff: `Lean already. Ship.` — one
      `className` line, no new file, no wrapper element, no new dependency,
      no boilerplate beyond the `content-['']` Tailwind requires to render a
      pseudo-element.

## Acceptance criteria

- AC-1 (border uses the divider pattern or brand tokens; no hardcoded hex):
  **met.** Brand-token path taken (divider component out of scope, per
  Diagnosis). Both ring colours are `@theme` tokens — `border-primary`
  (teal-500) and `border-teal-300` — no raw hex anywhere in the diff.
- AC-2 (matches the sketched intent; AA maintained): **met.** Coordinator
  verified in Chrome on a fresh production build:
  - Rings render as specified: `::after` = `4px solid rgb(27,173,178)`
    (teal-500 / `border-primary`), `::before` = `1px dashed
    rgb(127,213,224)` (teal-300), both `position: absolute` — thick solid
    outer, dashed inner, per the sketch.
  - Card box: **332×266 at 390, 320×266 at 768 and 1440** — widths
    byte-identical to the pre-change numbers (332/320/320). **0px delta**
    confirms the pseudo-element approach added nothing to the box in either
    axis; a real `border-4` would have added 8px of height to every card
    (see Decision above).
  - Page overflow 0 at 390/768/1440 — lesson 4 holds.
  - M3 sequence intact at 390 and 1440: `[1,2,3,4,5,6,7,0]`.

**Observed during this card's verification, not a regression from it —
tracked separately:** at 768 the sequence measures
`[1,2,3,4,5,7,0,1]` — index 6 is skipped; Garnet House is reachable by its
dot but not by the "Next" arrow at that width. Nothing dimensional changed
by this diff (both rings are non-participating overlays, confirmed by the
0px box delta above), and the skip is a pure function of the 720px scroller
viewport: `maxScrollLeft` measures 2016 while card 7's snap-start is 2064,
so the M3 ceiling guard clamps and correctly reports index 7, one index
past 6. This is a pre-existing M3 behaviour at a breakpoint that card's own
verification didn't measure, not something introduced here. The coordinator
is tracking it as a separate M3 follow-up — do not attribute it to the
border work in this section.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build`/`npm run build-storybook` — not run by this agent
      (concurrent agents were active; coordinator verified on a fresh
      production build separately).
- [x] Browser verification: coordinator, Chrome, production build — see the
      measured figures under AC-2 above.

## Review

One file changed, one `className` line:
`src/components/homes-carousel/HomesCarousel.tsx`. No new file, no wrapper
`<div>`, no CSS module, no new dependency. Ponytail-review: `Lean already.
Ship.` — nothing to cut.

The two decisions worth a future reader's attention are both captured above
rather than left implicit in the diff: pseudo-elements instead of a real
border (the `box-sizing: border-box` width-vs-height asymmetry on an
`auto`-height element), and `border` on the pseudo-elements instead of
`outline` on the button (avoiding a property collision with
`.focus-ring:focus-visible`, which already owns `outline` on that node).

`tasks/lessons.md` not touched per the coordinator's explicit instruction —
no new global lesson; the reasoning specific to this card is recorded above
instead. The 768px M3 index-6 skip is explicitly not this card's finding to
own — recorded here only so it isn't mistakenly attributed to the border
work, with the actual follow-up tracked by the coordinator separately.

---

# CR3: Human Rights / MDT / Safety page revamp

Branch: `feat/safety-page-revamp`.

## Diagnosis

**Target identification.** The card names "Human Rights / MDT / Safety," and
`src/app/quality/` has four routes: the hub (`page.tsx`) plus three detail
pages (`human-rights/`, `mdt/`, `safety-improvement/`). Resolved by evidence,
not assumption:

- `QualitySubnav.tsx:8-13` labels exactly these three routes "Human Rights /
  MDT / Safety & Improvement" — verbatim match to the card title.
- The card states "Team part is good." Only the three detail pages render a
  `TeamStrip` (`human-rights/page.tsx`, `mdt/page.tsx`,
  `safety-improvement/page.tsx`, each ending in a `TeamStrip` section); the
  hub has a testimonial pull-quote instead, no team section at all.

**The one interpretive leap, flagged rather than silently resolved:**
Appendix A's Option A text says "each *pillar* (Human Rights Committee / MDT
/ Safety) is its own full-width block" — "pillar" is the hub page's own
vocabulary (`QualityPillars.tsx`, the hub's 3-card infographic). Read
literally, Option A would touch the hub, which has no team section and isn't
named as broken anywhere else in the card. Read as "each *content block
within* a detail page is its own full-width block," it fits every other
sentence in the card. Took the second reading — confirmed with the
coordinator before implementation, not decided unilaterally.

**The `max-w-prose` no-op — the core defect, and the one worth generalizing.**
`ContentSection.tsx`'s image-paired blocks rendered their text column with no
width cap at all (`grid md:grid-cols-2` only); the no-image blocks routed
through `<Container width="reading">`, which resolves to Tailwind's
`max-w-prose` (65ch). First attempt: added `max-w-prose` to the image-variant
column too, for consistency. **This measured byte-identical before and
after** — the coordinator's `canvas.measureText` pass against each element's
real computed font returned the same 86/86/91/85 characters (656/656/689/656px)
whether or not the class was present. Root cause: Tailwind's `ch` unit is the
width of the font's `"0"` glyph, not the font's average character width — at
16px Inter, `65ch` computes to ≈656px, which was already the image-variant
grid column's natural width (and already the no-image variant's rendered
width, since that was routing through the same `max-w-prose`). The cap was
never binding; it just happened to equal what was already there. **A class
whose name describes a target ("reading measure," implicitly ~65 characters)
is not the same thing as a cap that hits that target** — see the new
`tasks/lessons.md` entry.

Fix: derived the real px-per-character ratio from the coordinator's own
measurement (2657px ÷ 348 chars ≈ 7.635 px/char) and picked `max-w-lg`
(32rem/512px, an existing Tailwind scale step — no arbitrary value) as the
cap, predicting ≈67 characters at 1440px. Applied uniformly to (a) the
image-variant text column, (b) the no-image variant (which now bypasses
`Container`'s `"reading"` width entirely — see Must-not-break), and (c) the
intro-row text column duplicated at the top of all three pages. Because 512px
is below every natural width measured (656-689px), all elements converge on
the same real character count regardless of which grid arithmetic produced
their pre-fix width — this is what resolved the 689px outlier without any
element-specific handling.

**Infographic contrast, found while touching the file for something else.**
`CircularCycle.tsx`/`HubAndSpoke.tsx`'s numbered badges and hub core used
`bg-primary text-white` uniformly — `--color-primary` is `teal-500`
(`#1badb2`), and white text on it measures ≈2.74:1 (documented in
`LotusBand.tsx`'s own contrast comment, and the same pairing
`tasks/lessons.md` lesson 6 already flags elsewhere in this codebase) — an
AA failure regardless of this card. Refining the infographic's "missing
something" (flat, single-colour, no brand-colour variety despite the rest of
the site alternating teal/purple per the established
`accent={i % 2 === 0 ? "teal" : "purple"}` convention —
`.claude/agent-memory/skill-worker-frontend/accent_chip_convention.md`)
meant editing these exact classNames anyway, so the contrast fix rode along
with the alternation rather than being a separate change: `bg-primary` →
`i % 2 === 0 ? "bg-primary-dark" : "bg-purple-600"` on the step badges
(`CircularCycle.tsx`, desktop + mobile), and `bg-primary` → `bg-primary-dark`
on `HubAndSpoke`'s single (non-alternating) hub core and its mobile banner.
Spoke cards (`HubAndSpoke.tsx`) got a matching `border-l-4` accent alternating
the same two colours, since they had no numbered badge to alternate.

## User's design decision

Option A — divider-segmented — chosen by the user from the three sketched
directions in Appendix A (B: two-column editorial with a sticky label
column; C: card-and-band hybrid on the full `LotusBand` pattern). Confirmed
before implementation; this plan did not re-litigate the choice.

## Divider placement and colourways

Two `LotusBand` dividers per page (three content groups), identical pattern
on all three detail pages — consistency over per-page variation, per the
build plan's "not a different treatment every section" principle. Each
`<LotusBand>` sits full-bleed, outside any `<Container>`, wrapped in a plain
`<div aria-hidden="true">` (decorative — `LotusBand`'s own prop surface has
no `aria-hidden`, and it was out of scope to edit, so the wrapper carries it
instead). `height={72}` on every instance — a starting value, tunable, not
argued over before rendering.

| Page | Group A | ↓ divider 1 | Group B | ↓ divider 2 | Group C |
|---|---|---|---|---|---|
| human-rights | `purpose` (primary heading) | `variant="teal"` | `approach`, `champions` | `variant="purple"` | `governance`, `culture` |
| mdt | `approach` (primary heading) | `variant="teal"` | `partnership`, `governance` | `variant="purple"` | `commitment` |
| safety-improvement | `commitment` (primary heading) | `variant="teal"` | `governance`, `improvement` | `variant="purple"` | `broaderView`, `culture` |

Both dividers use `LotusBand`'s own reference defaults (`teal`→white motif,
`purple`→teal motif) — no `motifColor` override, zero new colourway invented.
Group A's `ContentSection` gets the new `primary` prop (larger heading scale,
`text-2xl sm:text-3xl` vs the original `text-xl sm:text-2xl`) since it now
reads as each page's lead section, not one block among five in a flat list.

## Must not break

- C-1: `TeamStrip.tsx` untouched — "team part is good" per the card; no
  cascade required by the restructure above it.
- C-2: `src/data/quality.ts` untouched — every `ContentBlock` regrouped in
  JSX, no copy changed, no field added or removed.
- C-3: Hub page (`src/app/quality/page.tsx`, `QualityPillars.tsx`) untouched
  — the one interpretive leap above was resolved *against* touching it.
- C-4: `src/components/lotus-band/*`, `src/components/lotus-mark/*`,
  `src/components/homes-carousel/*` — untouched (owned by concurrent
  agents/out of surface). `LotusBand` is imported, never edited.
- C-5: `Container.tsx`'s shared `width="reading"` → `max-w-prose` mapping
  left unchanged, even though it carries the identical no-op defect. That
  primitive is also consumed by the hub page's intro paragraph
  (`quality/page.tsx`, `width="reading" padded`), outside this card's
  Quality/Safety-page surface — fixing the shared constant would silently
  change a page this card doesn't own. `ContentSection.tsx`'s no-image
  branch instead stopped routing through `Container` for this cap (plain
  `max-w-lg mx-auto` div; the now-unused `Container` import was dropped).
  The coordinator is taking the shared-primitive fix into card G1, where the
  whole site is in scope.
- C-6: No new dependency, no CSS module — Tailwind utility classes only,
  same convention as every other component in this file.
- C-7: No `npm run build`/`build-storybook` (coordinator runs those
  centrally, and other agents were concurrently active on `LotusBand`/the
  Our Homes carousel); `npx tsc --noEmit` and `npm run lint` only.

## Tasks

- [x] Read all four `src/app/quality/*` routes, every component under
      `src/components/quality/`, `Container.tsx`, `globals.css` (`@theme`
      token block, reduced-motion block, `.pop-item`/`.pillar-rise`
      keyframes), `src/data/quality.ts`, `tasks/lessons.md`,
      `.claude/agent-memory/skill-worker-frontend/accent_chip_convention.md`,
      and `LotusBand.tsx` (read-only — confirmed its finished `variant`/
      `motifColor`/`height` API before importing it) before writing anything.
- [x] `ContentSection.tsx` — added optional `primary?: boolean` prop
      (larger heading scale for a group's lead block); image-variant text
      wrapper `max-w-prose` → `max-w-lg`; no-image branch rewritten from
      `<Container width="reading">` to a plain `<div className="max-w-lg
      mx-auto">`, `Container` import dropped (now unused).
- [x] `CircularCycle.tsx` — step badges (desktop + mobile) alternate
      `bg-primary-dark`/`bg-purple-600` by `i % 2`, replacing the flat,
      AA-failing `bg-primary`.
- [x] `HubAndSpoke.tsx` — hub core and its mobile banner: `bg-primary` →
      `bg-primary-dark`. Spoke cards (desktop + mobile): added
      `border border-gray-100 border-l-4`, alternating
      `border-l-primary-dark`/`border-l-purple-600` by `i % 2`.
- [x] `human-rights/page.tsx`, `mdt/page.tsx`, `safety-improvement/page.tsx`
      — imported `LotusBand`; intro-row text `max-w-prose` → `max-w-lg`;
      each page's flat `ContentSection` stack (previously one
      `<Container className="space-y-16">` of 4-5 blocks) split into 3
      `<section className="py-16 sm:py-20">` groups per the table above,
      with two `<div aria-hidden="true"><LotusBand .../></div>` dividers
      between them; Group A's `ContentSection` passed `primary`.
- [x] Ponytail self-review of the diff (`ponytail:ponytail-review` skill,
      run against the 6-file diff): one finding —
      `border-t border-r border-b border-gray-100 border-l-4` on
      `HubAndSpoke.tsx`'s spoke cards shrinks to `border border-gray-100
      border-l-4` (Tailwind's `border` shorthand already sets all four
      sides; `border-l-4`/`border-l-{color}` only override the left side).
      Applied. `net: -2 lines`.

## Acceptance criteria

- AC-1 (one Appendix-A direction implemented, confirmed in Phase 1): **met.**
  Option A, user-confirmed before implementation (see User's design
  decision).
- AC-2 (text layout uses dividers, corrected margins/spacing, and a
  comfortable measure): **met, after one revision.** Dividers: coordinator
  verified two `LotusBand` mounts per page, all three pages, full-bleed at
  390/768/1440, `aria-hidden="true"`, CLS = 0 across both mounts. Measure:
  coordinator's `canvas.measureText` pass (real computed font per element)
  on `/quality/human-rights` at 1440 read **67 / 67 / 71 / 66 characters**
  (was 86 / 86 / 91 / 85 before the `max-w-prose`→`max-w-lg` fix — the first
  attempt, `max-w-prose` alone, measured byte-identical to baseline and did
  not count as meeting this AC). At 390: 46-49 characters. At 768: 44-47
  characters. All in the 45-75 comfortable band; the 689px outlier
  (a fourth, differently-sized element the first fix didn't cover) converged
  to the same band as the other three once the cap was expressed in real
  px rather than `ch`.
- AC-3 (infographic refined; animation still gated behind reduced-motion; AA
  throughout): **met.** Badge/core/border-accent contrast, computed by the
  coordinator from the solid, alpha-free colour pairs (exact, not sampled):
  `purple-600` + white = **10.48:1**; `primary-dark` (teal-700) + white =
  **6.34:1** — both matching the values predicted during planning. Reduced
  motion: coordinator's computed-style check under
  `prefers-reduced-motion: reduce` showed `.pop-item`/`.cycle-ring-flow`/
  `.spoke-line-flow` elements at `opacity: 1`, `transform: none`, ring
  `animation-duration` `1e-05s` — the existing global mechanism, untouched
  by this card, still holds with the new colours layered on top. No new
  keyframes added; only static colour classes changed.
- AC-4 (team section unchanged unless the revamp required it): **met, and
  it did not require it.** `TeamStrip.tsx` and its three call sites are
  byte-identical to `HEAD`.

**Two things confirmed pre-existing and explicitly out of this card's
scope — recorded here so a later reader doesn't attribute them to CR3:**

- **2px page overflow at 1440 on `/quality/human-rights`.** The coordinator
  traced it to `matrix(1.05, ...)` from the pre-existing `.reveal-scale` on
  the intro grid (`human-rights/page.tsx` line 30-ish in `HEAD`, before this
  card touched the file), which renders 1445px inside a 1376px container
  before it scrolls into view. A stashed-`CR3`, rebuilt baseline measurement
  showed the identical 2px overflow with none of this card's changes
  applied. Left untouched per explicit instruction; tracked separately by
  the coordinator.
- **95-character/720px paragraph at 768px.** Flagged by this agent as a
  possible fourth affected element; the coordinator traced it to the
  **footer's** blurb (`text-white/70`, inside the footer's
  `grid sm:grid-cols-2 lg:grid-cols-4`) — identical on every page, including
  ones CR3 never touched. Not pulled into scope.

## Verification

- [x] `npx tsc --noEmit` — exit 0 (checked after each revision round).
- [x] `npm run lint` — exit 0 (checked after each revision round).
- [x] `npm run build`/`build-storybook` — not run by this agent (other
      agents were concurrently active on `LotusBand`/the Our Homes
      carousel; coordinator verified on production builds separately).
- [x] Browser verification: coordinator, Chrome, production builds — see
      the measured figures under AC-2/AC-3 above.

## Review

Six files changed: three page files (regrouped JSX, no data/content
changes), `ContentSection.tsx` (one new optional prop, one cap-value fix,
one now-simpler no-image branch with `Container` dropped), `CircularCycle.tsx`
and `HubAndSpoke.tsx` (className-only colour/border changes, no new markup
elements beyond one `border-l-4` accent, no new state, no new animation).
No new component, no new dependency, no new CSS file — the `LotusBand`
divider is a straight import of a component another card already finished
and verified.

This card went through one real revision, caught by measurement rather than
by re-reading the source: the first `max-w-prose` fix looked plausible (the
class is *named* for a reading measure) but changed nothing, because
Tailwind's `ch` unit measures a glyph's advance width, not the font's
average character width, and 65ch happened to equal the already-existing
column width almost exactly. The fix only became real once the cap was
derived from measured px-per-character rather than trusted by class name —
see the new `tasks/lessons.md` entry, which generalizes this beyond CR3: the
same `Container.tsx` `"reading"` constant this card deliberately did not
touch (C-5) carries the identical overshoot everywhere else it's used.

Two findings surfaced during this card's verification are recorded above as
explicitly not CR3's to own — the pre-existing 2px `.reveal-scale` overflow
and the footer's 95-character paragraph — so neither gets silently
attributed to this diff by a later reader. Also noted for card G1, not
actioned here: the coordinator flagged the global "Skip to main content"
link on `bg-primary` at 2.74:1, the same lesson-6 pairing, on an
accessibility-only element.

---

# G2: Apply shape dividers across pages

Branch: `feat/apply-shape-dividers`.

## Diagnosis

The build plan explicitly leaves placement to the agent ("where it seems
fit"), which makes over-placement the real failure mode — a divider after
every colour change reads as noise, and the card names this risk directly.
The only fixed anchor is CR3's own precedent, already shipped on the three
`quality/` detail pages:

```tsx
<div aria-hidden="true">
  <LotusBand variant="teal" height={72} />
</div>
...
<div aria-hidden="true">
  <LotusBand variant="purple" height={72} />
</div>
```

Two bands per page, `height={72}`, no `motifColor` override (teal band →
white motif, purple band → teal motif, `LotusBand`'s own reference
defaults), each wrapped in a plain `<div aria-hidden="true">`, rendered as a
full-bleed sibling outside any `<Container>`, teal always before purple.
This card's job was pure placement using that exact call signature — no new
`LotusBand` prop, no new colourway — because "consistent usage (not a
different treatment every section)" is an explicit AC, and CR3 already set
what "consistent" means on this site.

**Scope carve-out.** `quality/human-rights`, `quality/mdt`, and
`quality/safety-improvement` were done under CR3 and are untouched by this
card — they already carry two dividers each, in the pattern quoted above.
Treating them as G2's precedent (rather than re-deriving a placement
convention from scratch) is what keeps the site-wide usage consistent, per
the AC.

## Placement and colourways

Five new placements across four page-composition files — every other page
in the surface was read and a placement decision made, not skipped by
omission (see Rejected boundaries below).

| Page | Boundary | Variant | Why this boundary |
|---|---|---|---|
| `src/app/page.tsx` (homepage) | `HomesSplitRow` → `TeamSection` | `teal` | Closes the "what we do" chapter (About/Services/Homes) and opens the "who we are" chapter (Team/Board) — the single biggest content pivot on the page. |
| `src/app/page.tsx` (homepage) | `BoardSection` → `RecruitmentSection` | `purple` | Closes the "people" chapter (Team/Board) and opens the "get involved" chapter (Recruitment CTA/Contact) — mirrors CR3's second-divider position relative to its first. |
| `src/app/careers/page.tsx` | Testimonials section → Hub-nav-cards section | `teal` | Pivots from "voices" (testimonial marquee) into "structured reference" content (nav cards → featured roles → values) — the clearest tonal shift on the page. |
| `src/app/quality/page.tsx` | Pillars-infographic section → Testimonial section | `teal` | Pivots from "our framework" (pillars) into "resident voice" (anonymized testimonial) — the clearest content-type shift on a short page. |
| `src/app/careers/why-us/page.tsx` | Culture-narrative section → Testimonials section | `teal` | Pivots from "who we are as an employer" (culture narrative + stats) into "hear from our team" (testimonials + video testimonials) — the page's one clear voice-shift. |

The homepage gets two dividers (teal then purple), matching CR3's own
per-page count and spacing rhythm on its longest pages. The three hub/detail
pages each get one — a shorter, single-seam page doesn't need a second
divider to hit a quota; forcing one would be the mechanical-insertion
failure mode the card warns against.

## Rejected boundaries

The rejected list is longer than the accepted list, deliberately — every
candidate boundary on every touched page was considered, not silently
skipped. Two recurring reasons:

**An existing strong seam already does the job — a second device there is
redundant, not additive:**

- Homepage, Contact → Footer: `Footer` already renders on `bg-primary-dark`;
  that colour flip is already a clear structural end-of-page seam.
- Careers hub, Company Values → CTA strip; Quality hub, Testimonial → CTA
  strip; Why-us, Video testimonials → CTA strip: `CareersCTAStrip` already
  carries its own `bg-gradient-to-r from-primary-dark to-primary` on every
  page that uses it — an existing strong seam, not a gap.
- Why-us, CultureGallery → Culture narrative: `CultureGallery` is already a
  rich, visually distinct full-bleed carousel, and the narrative section's
  own dark background is already a strong seam — stacking a divider there
  would be two visual breaks back-to-back for one job.

**Sections that are one continuous chapter, not two — dividing every colour
change is exactly the "stacking so close it reads as noise" failure mode:**

- Homepage: Hero→About (Hero is already a strongly differentiated,
  motif-heavy dark section; a divider right under it crowds the top of the
  page before any content is read), About→Services, Services→Homes (one
  continuous "what we do" chapter), Team→Board (would sandwich Team between
  two dividers, adjacent to the Homes→Team one already chosen; Team+Board
  read as one "our people" chapter), Recruitment→Contact (same "get
  involved" chapter, no thematic shift).
- Careers hub: Hub-nav-cards→Featured-Roles, Featured-Roles→Company-Values
  (all three are the same "informational grid" chapter).
- Quality hub: Intro→Pillars (both are the opening "what quality means"
  statement, too close together / same chapter).
- Why-us: Testimonials→Video-testimonials (same "hear from our team"
  chapter, split only by media type — mechanical, not thematic).

## Structural-risk skips (not "no boundary exists")

`/careers/training` and `/careers/how-we-hire` were skipped for a third,
distinct reason from the two above, and it is recorded explicitly so
neither reads as an oversight: both pages **do** have a real thematic seam
(`training`: career-progression pathway → training programmes grouped by
type; `how-we-hire`: process timeline → compliance-checks card → FAQ), but
in both pages every section lives inside **one continuous
`<div className="py-10 sm:py-14"><Container>...</Container></div>`
wrapper**, not top-level page siblings the way the homepage/careers-hub/
quality-hub/why-us sections do. `LotusBand` must render full-bleed, outside
any `Container` (the hard constraint — a band nested inside a padded
Container blows the page width, `tasks/lessons.md` lesson 4's class of
failure). Fitting one into either page means splitting that single wrapper
into two, changing the page's padding/wrapper structure for a fairly minor
page, for marginal gain. Skipped for structural risk, not because no seam
was found.

`/careers/benefits`, `/careers/open-roles`, and `/careers/contact` were
skipped for the plainer reason that they have no internal seam at all —
each is a single homogeneous content block (benefit cards / job list / a
contact form) between a hero and (for benefits and open-roles) an
already-branded `CareersCTAStrip`; `contact` doesn't even carry a closing
CTA strip.

## Must not break

- G-1: `src/components/lotus-band/LotusBand.tsx` — consumed only, never
  edited.
- G-2: `quality/human-rights/page.tsx`, `quality/mdt/page.tsx`,
  `quality/safety-improvement/page.tsx` — CR3's scope, byte-identical to
  `HEAD`.
- G-3: `careers/benefits/page.tsx`, `careers/training/page.tsx`,
  `careers/how-we-hire/page.tsx`, `careers/open-roles/page.tsx`,
  `careers/contact/page.tsx` — no divider, no other edit; byte-identical to
  `HEAD`.
- G-4: No component internals touched (`HomesSplitRow`, `TeamSection`,
  `BoardSection`, `RecruitmentSection`, `CultureGallery`, `QualityPillars`,
  `TestimonialMarquee`, `HubNavCard`, `CareersCTAStrip`, etc.) — only the
  four page-composition files change.
- G-5: No `npm run build`/`build-storybook` (coordinator runs those
  centrally); `npx tsc --noEmit` and `npm run lint` only.
- G-6: No commit.

## Tasks

- [x] Read the G2 card in full, CR3's shipped divider treatment on all
      three `quality/` detail pages (confirmed identical on all three, not
      just `safety-improvement`), `LotusBand.tsx`'s finished prop surface
      (read-only), and every page under the homepage/Careers/Quality
      surface — `page.tsx`, `careers/page.tsx`, `careers/why-us/page.tsx`,
      `careers/benefits/page.tsx`, `careers/training/page.tsx`,
      `careers/how-we-hire/page.tsx`, `careers/open-roles/page.tsx`,
      `careers/contact/page.tsx`, `quality/page.tsx` — before proposing any
      placement.
- [x] Plan written and approved by the coordinator before any edit (Step 1
      gate) — 5 accepted placements, longer rejected list with reasons,
      structural-risk skips named plainly.
- [x] `src/app/page.tsx` — imported `LotusBand`; two `<div
      aria-hidden="true"><LotusBand .../></div>` inserts (teal, purple) at
      the two boundaries in the table above.
- [x] `src/app/careers/page.tsx` — imported `LotusBand`; one teal divider
      insert.
- [x] `src/app/quality/page.tsx` — imported `LotusBand`; one teal divider
      insert.
- [x] `src/app/careers/why-us/page.tsx` — imported `LotusBand`; one teal
      divider insert.
- [x] Ponytail self-review of the diff (`ponytail:ponytail-review` skill,
      run against the 4-file diff): no findings — "Lean already. Ship."
      `net: 0 lines possible`. Every line is a required import or a divider
      instance following `LotusBand`'s existing call signature; no
      abstraction, no config, nothing to cut.

## Acceptance criteria

- AC-1 (dividers placed at sensible section boundaries on the main pages):
  **met.** 5 placements across the homepage, Careers hub, Quality hub, and
  `/careers/why-us`, each justified against a specific content pivot in the
  table above.
- AC-2 (consistent usage, not a different treatment every section): **met.**
  Every instance uses `LotusBand`'s CR3 call signature verbatim —
  `height={72}`, no `motifColor` override, `aria-hidden` wrapper, full-bleed
  outside `Container`, teal-before-purple ordering on the one page with two.
  Zero new colourways invented.
- AC-3 (AA + reduced-motion respected): **met.** No new colour pairing
  introduced (reused `LotusBand`'s already-verified variant/motif tokens);
  no motion added by this card, so nothing new to gate behind
  `prefers-reduced-motion`.

**Coordinator verification, production build, 4 pages × 3 breakpoints (390/
768/1440), 12 measurements — quoted verbatim:**

> G2 VERIFIED on a production build — 12 measurements, 4 pages × 3
> breakpoints, all clean:
> - Band counts exactly as planned: 2 on the homepage, 1 each on
>   `/careers`, `/quality`, `/careers/why-us`.
> - **Full-bleed confirmed structurally**, not by eye: every band's width
>   equals `document.documentElement.clientWidth` and its `x` is 0, at
>   390/768/1440. This was the real risk in the card — one band nested
>   inside a padded `Container` would have blown the page width — and all 5
>   are correctly outside.
> - Computed height 72px at every width on every band, so space is reserved
>   and there is no CLS.
> - `aria-hidden="true"` present on all 5 wrappers.
> - Pattern element populated on every band, so the motif genuinely tiles
>   rather than rendering as a flat colour stripe.
> - **Page overflow 0 on all four pages at all three widths** — identical to
>   the pre-change baselines. No page gained overflow.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build`/`build-storybook` — not run by this agent (coordinator
      runs those centrally); coordinator verified on a production build
      separately — see the quoted measurement block above.
- [x] Browser verification: coordinator, production build, 4 pages × 3
      breakpoints — see AC block above.

## Review

Four files changed, all page-composition files: `src/app/page.tsx`,
`src/app/careers/page.tsx`, `src/app/quality/page.tsx`,
`src/app/careers/why-us/page.tsx`. Each got one new import
(`LotusBand`) and one or two `<div aria-hidden="true"><LotusBand
variant="..." height={72} /></div>` inserts between existing top-level JSX
siblings — no new component, no new `LotusBand` prop, no CSS change, no
component-internal edit. `ponytail-review` found nothing to cut.

This card's actual difficulty was never the code — it was judgement, which
is why the rejected-boundary list above is longer than the accepted one and
carries a reason for each entry. Two structurally different reasons back
every rejection: an existing strong seam (CTA-strip gradients, the footer's
`bg-primary-dark` flip, the culture gallery's own full-bleed carousel)
already does the separating job a second device would duplicate; or the
candidate sections are one continuous chapter, not two, and dividing every
colour change inside it is the exact "stacking so close it reads as noise"
failure the card warns against. `/careers/training` and
`/careers/how-we-hire` are called out separately because their reason is
neither of those — both pages have a genuine thematic seam, but it sits
inside a single continuous `<Container>` wrapper that a full-bleed band
cannot join without restructuring the page; skipped for structural risk,
not for lack of a boundary, so a later reader doesn't "helpfully" add one on
a false premise. No correction occurred on this card — the plan was
approved as proposed and the coordinator's production-build measurements
matched it exactly, so no new `tasks/lessons.md` entry.

---

# G1: Brand-colour saturation pass

Branch: `feat/brand-colour-pass`.

## Diagnosis

The card's own warning — "not everywhere for its own sake," "no rainbow
over-use" — is the hard part; a pass that tints everything is a failure of
this card, not a success. Before any colour work, the coordinator named
three site-wide defects found by measurement while verifying other cards,
and required they be fixed as part of this deliverable (this card is the
only one with the whole site in scope):

**1. Skip-link contrast.** `.skip-link` in `globals.css` paired
`background: var(--color-primary)` (teal-500, `#1badb2`) with white text —
2.74:1 against white, failing AA on an element that exists purely for
accessibility. `--color-primary-dark` (teal-700, `#0d6a70`) measures
6.33:1 with white.

**2. `Container`'s `width="reading"` overshoot.** `max-w-prose` is
Tailwind's `65ch`, and `ch` is the "0" glyph's advance, not the average
character width — at 16px Inter it computes to ≈656px, rendering ≈86 real
characters per line (lesson 10's exact trap, now hitting the shared
primitive rather than a page-local instance).

**3. `.reveal-scale` 2px overflow.** `Reveal.tsx` renders one div carrying
both the IntersectionObserver ref and, when passed in via `className`, the
`reveal-scale` transform — there is no separate clipping wrapper.
`overflow` on an element clips its *children*, never the box it's declared
on, so nothing contained the pre-in-view `scale(1.05)`'s own paint bleed.
Root cause, reusable beyond this card: **a scaled element cannot clip its
own overflow; only a non-transformed ancestor can.** At 1440px, `Container`
(`max-w-wide` = 1440px) plus its `lg:px-8` gutter (32px/side) leaves 1376px
of content — `1376 × 1.05 = 1444.8px`, a ~34.4px bleed against a 32px
gutter. Fixed at the single shared CSS rule, not per-page: `scale(1.03)`
keeps the bleed (`1376 × 0.03 / 2 ≈ 20.6px`) inside the gutter with an 11px
margin, at every breakpoint checked.

## The systemic finding: teal-500 fails AA in both directions

A precise re-grep (see lesson 11 — the first pass's `grep -v` silently
dropped every line that also contained `hover:bg-primary-dark`) found the
skip-link's defect was not an isolated instance: **`--color-primary`
(teal-500) fails AA both as a background under white text (2.74:1) and as
a foreground text colour on white (2.74:1, same math, direction-symmetric);
`--color-accent` (teal-400) is worse as text-on-white (≈2.0:1).** ~28 files
carried one of these pairings — active-state pills, avatar-initial circles,
number badges, and, by far the largest group, the site's ~16 duplicated
"primary button" instances (`bg-primary text-white … hover:bg-primary-dark`
— Navbar, MobileMenu, JobCard, OccupopJobCard, TeamModal, ContactSection,
RecruitmentSection, HomeModal, and four page files).

**Fix pattern for buttons** (the reusable part): swap resting **and** hover
together, not just resting — `bg-primary-dark text-white …
hover:bg-teal-800`. Moving only the resting state to `-dark` while leaving
`hover:bg-primary-dark` unchanged would collapse resting and hover to the
same colour (no visible interactive feedback); moving hover to a *third*,
still-safe step (`teal-800`, ≈10:1) keeps every state ≥6.3:1 instead of
relocating the AA failure into the hover state. Active-state pills and
static badges (no hover) went straight to `bg-primary-dark`/`text-primary-dark`.
Two "outline → fills solid on hover" buttons (`RecruitmentSection.tsx`,
`HomesCarousel.tsx`) got the same treatment on both the resting
border/text and the hover fill. Hover-only colour dips that don't
introduce a *background-fill* failure (e.g. `hover:bg-accent
hover:text-white` on the white "bg-white text-primary" buttons) were left
alone — reached only via an already-hovering pointer, not the primary way
the label is read, and re-tuning them is a design opinion beyond an
accessibility fix.

**`CareersCTAStrip` gradient** (shared by 8 pages): `from-primary-dark
to-primary` swept through the flat 2.74:1 fail at its teal end, and the
interpolated midpoint under this strip's centred text still measured
<4.5:1. Added a `tone?: "teal" | "purple"` prop (see purple section below);
both tone gradients now stay inside the darkest two steps of their scale —
`from-teal-800 to-primary-dark` (≥6.3:1 throughout) and `from-purple-700
to-purple-600` (≥10.5:1 throughout).

## Tier 2 — found, deliberately not fixed

- `TeamCard.tsx`, `BoardSection.tsx` (department/role chip text, initials-
  fallback gradients) — same failure pattern, but both files carry a
  standing don't-touch boundary from card P6 (fragile card-height fix).
  Flagged, not touched.
- Initials-fallback gradients in `TeamCard`, `TeamModal`, `TeamStrip`,
  `BoardSection` — unreachable: every team member and board member in
  `src/data/team.ts` has an `image`, so the fallback branch never renders.
- `HeroSection.tsx:63` hero highlight word (`text-accent` on
  `bg-primary-dark`, ≈3.17:1) — passes the 3:1 large-bold-text threshold by
  a narrow margin; left for the coordinator's pixel sample rather than
  fixed on a source-only guess.
- `why-us/page.tsx:70` stat number — presumed on a dark section background
  (the `text-accent`/`text-purple-100` alternation only makes sense
  there); left for the same pixel-sample check.
- `CareersHero` (no-image variant) and `open-roles/[slug]` hero gradient
  (`from-primary-dark via-primary to-accent/80`) — the failing corner is
  diagonal and current markup places text away from it; not deterministic
  like the flat CTA strip, so left for render-time measurement rather than
  a source-only fix (lesson 9's exact trap).
- All icon-only `bg-primary/10 text-primary` chips (`ServiceCard`,
  `ContactSection` svgs, `HomeModal`, `FaqAccordion`, checkmark/chevron
  icons across several career pages) — decorative, `aria-hidden` or paired
  with an adjacent visible text label, exempt from WCAG 1.4.3/1.4.11.
- `HomeModal`/`HomesCarousel`/`CultureGallery` progress dots (`bg-primary`,
  no text) — non-text UI component contrast is a different criterion
  (WCAG 1.4.11, 3:1 against adjacent colours), out of this card's explicit
  "white-on-bg-primary" scope.
- No shared `Button` component built to de-duplicate the ~16 repeated
  button classNames — a real duplication smell, but an architectural
  change this card didn't ask for.

## Purple: two placements, not five

Coordinator pixel-measurement (full-page screenshots, 1440px) showed the
real gap: the site was already 29–50% brand-hued, but purple sat at
0.01–0.54% on three of four key pages — a distribution problem, not a
volume problem (lesson 12). Deepening teal for the AA fixes above would
have made this worse, not better, so purple placement was scoped
separately, extending the existing index-parity accent convention
(`TeamCard`/`HubNavCard`) rather than inventing a new one:

| Placement | Where | Token(s) | Predicted contrast | Measured |
|---|---|---|---|---|
| `ServiceCard`/`ServicesSection` accent alternation | Homepage — `accent={i % 2 === 0 ? "teal" : "purple"}` on all service cards; the 2 `hasImage` cards (indices 0, 1) split exactly one teal, one purple | `purple-600` (chip/overlay), `purple-400`/`purple-300` (illustration accents) | `purple-600` vs white ≈10.5:1 | Homepage purple 0.54% → 1.48% |
| `CareersCTAStrip` `tone="purple"` | `/quality` and `/careers` hub CTA strips — 2 of the 3 near-zero-purple pages | `from-purple-700 to-purple-600` | 13.8:1 → 10.5:1, safe throughout | `/careers` purple 0.01% → 7.17%; `/quality` purple 0.01% → 10.37% |

`/careers/benefits` (already 20.7% purple from CR2's alternating cards) got
no additional placement — no gap to close. Footer was considered and
rejected: one flat section, nothing to alternate against. Two good
placements over five decorative ones, per the coordinator's own framing.

**Net effect — the criterion that actually mattered:** total brand-colour
share barely moved (homepage 29.09%→29.16%, `/careers` 36.20%→36.36%,
`/quality` 50.55%→49.30%) while purple share rose 7–100×. The palette was
rebalanced, not piled on — "no rainbow over-use" met in its strictest
reading.

## Must not break

- G1-1: `src/components/lotus-band/LotusBand.tsx` — another agent was
  concurrently editing this file during implementation; never touched,
  confirmed via a diff scoped to only this card's files.
- G1-2: `TeamCard.tsx`, `BoardSection.tsx` — standing P6 boundary; Tier-2
  findings only, no edits.
- G1-3: No component API changed without saying so — `CareersCTAStrip`'s
  `tone` prop and `ServiceCard`'s `accent` prop are both new, additive,
  default-preserving, and named here explicitly; every other change is a
  same-shape className/value substitution.
- G1-4: No `npm run build` (coordinator runs those centrally, and another
  agent was concurrently running builds against `.next`); `npx tsc
  --noEmit` and `npm run lint` only.
- G1-5: No commit — the coordinator committed both passes as a single
  commit after verification, with a message distinguishing the two.

## Tasks

- [x] Read the G1 card, `tasks/lessons.md` lessons 6 and 10, and the
      current state of `globals.css`, `Container.tsx`, `Reveal.tsx` before
      any edit.
- [x] Audited the current brand-colour state (commits `fc12aed`, `69669be`,
      `b5c348c`, `ac2e398`) rather than the pre-those-commits plan text.
- [x] Plan written and approved by the coordinator before any edit (Step 1
      gate), with one addition requested after approval — the purple
      introduction, added as a second, separately-described pass.
- [x] Fixed all three named defects at their single shared source
      (`globals.css`, `Container.tsx`) — no per-page patching.
- [x] Precise re-grep for `bg-primary`/`text-primary`/`text-accent`
      (token-boundary regex, not whole-line `grep -v`) — caught the
      `hover:bg-primary-dark` blind spot on `bg-primary`, then hit the same
      blind spot again on `text-primary` and fixed it before trusting the
      list (lesson 11).
- [x] Applied the button resting+hover fix pattern across ~28 files (Pass
      1) — `npx tsc --noEmit` and `npm run lint` both exit 0 after.
- [x] Added `ServiceCard`/`ServicesSection` accent alternation and
      `CareersCTAStrip`'s `tone` prop + two `tone="purple"` call sites
      (Pass 2).
- [x] Ponytail self-review of the diff (`ponytail:ponytail-review`): one
      marginal 2-line shrink noted in `ServiceCard.tsx`'s illustration
      dispatch (if/else vs. a lookup table), not worth taking; rest is
      pure token substitution or the two new additive props. No
      unnecessary abstraction found.
- [x] Verified the diff was scoped to only this card's files (excluded the
      concurrently-edited `LotusBand.tsx` and unrelated pre-existing
      `tasks/lessons.md`/`tasks/todo.md` changes from another session).

## Acceptance criteria

- AC-1 (measurable increase in purposeful brand-colour use across key
  pages): **met**, precisely — purple share rose 7–100× on the pages that
  lacked it, while total brand share stayed flat, which is the
  distribution fix the coordinator's measurement called for rather than a
  blanket increase.
- AC-2 (all colour from tokens; AA maintained everywhere): **met.** Every
  value used is an existing `@theme` token (`primary-dark`, `teal-800`,
  `purple-600`, `purple-700`, `purple-400`, `purple-300`); zero hardcoded
  hex introduced. Zero white-text-on-teal-500/teal-400 AA failures remain
  on the three pages the coordinator swept.
- AC-3 (no "rainbow" over-use — colour still reads as intentional):
  **met.** Two purple placements, both reusing the site's existing
  index-parity accent convention; no new colourway invented.

**Coordinator verification, production build — quoted verbatim:**

> G1 VERIFIED on a production build. Measured:
>
> **The three defects, all fixed:**
> - Skip link: `rgb(13,106,112)` with white = **6.34:1** (was 2.74:1).
> - `/quality` reading measure: **58, 53, 41 characters** (was 86). In band.
> - `.reveal-scale` overflow: `/quality/human-rights` now measures
>   `scrollWidth - clientWidth` = **0** (was 2). Your root cause was right —
>   overflow cannot clip an element's own transform, and 1376 × 1.05 =
>   1444.8 matched the measured 1445 exactly.
>
> **AA remediation:** zero elements with white text on teal-500 or
> teal-400 remain on `/`, `/careers`, or `/quality/human-rights`. Page
> overflow 0 on all three.
>
> **Purple, the addition I asked for:**
>
> | Page | Purple before | Purple after | Total brand before → after |
> |---|---|---|---|
> | Homepage | 0.54% | 1.48% | 29.09% → 29.16% |
> | /careers | 0.01% | 7.17% | 36.20% → 36.36% |
> | /quality | 0.01% | 10.37% | 50.55% → 49.30% |
>
> Note what total brand share did: essentially nothing. You rebalanced the
> palette toward purple rather than piling more colour on, which is the
> "no rainbow over-use" criterion met in its strictest reading. Two
> placements, not five, was the right call.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build`/`build-storybook` — not run by this agent (another
      agent was concurrently editing `LotusBand.tsx` and running builds
      against the same `.next`); coordinator verified on a production
      build separately — see the quoted measurement block above.
- [x] Browser verification: coordinator, production build — see AC block
      above.

## Review

Thirty files changed. Three defects fixed at their single shared source
(`globals.css`'s `.skip-link` background and `.reveal-scale` transform,
`Container.tsx`'s `reading` width) rather than per-page. The systemic
AA sweep touched ~28 files with the same two moves — a background/text
token swap (`bg-primary`→`bg-primary-dark`, `text-primary`→
`text-primary-dark`) and, on real buttons, a matching hover retune
(`hover:bg-primary-dark`→`hover:bg-teal-800`) so the fix never just
relocated the failure into the hover state. Two additive, default-
preserving component props (`CareersCTAStrip.tone`, `ServiceCard.accent`)
carried the purple pass, reusing `TeamCard`/`HubNavCard`'s existing
index-parity convention rather than inventing a new one.

Two corrections occurred on this card, both self-caught rather than
found by review, and both are now `tasks/lessons.md` entries: the
whole-line `grep -v` filter dropping real matches (bit twice, on two
different tokens — lesson 11), and the "more colour" instruction being a
distribution problem rather than a volume one, which pixel measurement
caught after the plan had already proposed deepening teal everywhere
(lesson 12). The coordinator's own addition mid-review — the purple
placements — is the direct fix for the second correction; the plan as
originally approved would have shipped a more monochrome site under a
"use more brand colour" card, and would have looked correct doing it,
since darkening ~28 teal instances reads exactly like "more colour" in a
diff.

---

# #80: Homepage "Hear It From Our Own" quote section

Branch: `feat/homepage-quote-section`.

## Diagnosis

Not a bug fix — client supplied a Figma screenshot + CSS export of a
full-width teal quote band, asking for a bigger "wow" testimonial
treatment on the homepage than the existing plain white card embedded in
`ServicesSection`. The quote text in the Figma is word-for-word the
site's existing testimonial (`serviceOwnerTestimonial.body`, the Pine
Lodge / JW quote) — no client content blocker.

Two real defects found in the Figma's own hex values, not this repo's
choices: eyebrow purple (`#761944`) on the teal band (`#08656E`) measures
1.65:1, and the pink blockquote/quote-mark colour (`#FFB7D1`) measures
3.91:1 — both fail WCAG AA's 4.5:1 floor for their text size. No existing
purple token clears it either (purple-100, the lightest stop, is only
4.11:1). Fixed by lightening to one new token (`--color-blossom:
#ffdce9`, 5.03:1 against `--color-teal-700`) used for both the eyebrow
and the blockquote/quote-mark — real margin above the floor, not a
paper-thin pass (lesson: NB1's 4.52:1 was flagged as risky-thin).

## Must not break

- C-1: `LotusBand` untouched — it's a thin decorative divider strip, not
  a content-section wrapper, so this card built a new component
  (`QuoteSection`) instead of bending `LotusBand` to fit.
- C-2: `Blob` untouched — reused as-is (`color="teal"`, existing variant,
  a rotate utility on `className`) for the corner decoration, no new
  shape built from scratch.
- C-3: `serviceOwnerTestimonial`'s only two consumers were
  `testimonial.ts` itself and `ServicesSection.tsx` (confirmed via
  repo-wide grep before editing) — safe to fully restructure the data
  shape rather than keep both old and new fields side by side.
- C-4: Every colour is a `var(--color-*)` token; the one new token
  (`--color-blossom`) is documented in `globals.css` with its AA
  provenance, not a bare hex dropped into the component.

## Tasks

- [x] Read `globals.css` (`@theme` tokens), `layout.tsx` (font setup),
      `Blob.tsx`, `LotusBand.tsx` (props only), `ServicesSection.tsx`,
      `testimonial.ts`, `SectionTitle.tsx`, `Container.tsx`,
      `use-in-view.ts`, and the reveal-animation classes in `globals.css`
      before writing anything.
- [x] Rendered the client's actual SVG lockup file for a separate issue
      (#77) mid-session and found my own earlier text-based read of it
      wrong — corrected before it reached a plan. Applied the same
      "render/measure it, don't infer" discipline here: computed AA
      contrast in Node for every Figma colour against `teal-700` before
      picking a fix, then re-verified against real rendered pixels in the
      browser after implementation (both matched exactly: 5.03:1).
- [x] `globals.css` — added `--font-dm-sans` (literal stack, same pattern
      as the existing `--font-sans`) and `--color-blossom` (with AA
      provenance comment).
- [x] `layout.tsx` — added `DM_Sans` via `next/font/google`, same pattern
      as the existing `Inter` setup (`variable`-only, applied on `body`).
- [x] `src/data/testimonial.ts` — restructured `serviceOwnerTestimonial`
      into `homeQuote` (`HomeQuote` type: eyebrow/heading/subtext/quote/
      name/date), reusing the existing quote text verbatim.
- [x] New `src/components/quote-section/QuoteSection.tsx` + `index.ts` —
      full-bleed section, two-column grid (stacks on mobile, same pattern
      as `AboutSection`/`HomesSplitRow`), `Blob` corner decoration,
      `.reveal`/`.reveal-delay-2` scroll-in (existing sitewide convention,
      already reduced-motion-safe via the hook it's built on).
- [x] `ServicesSection.tsx` — removed the old embedded testimonial block
      and its now-unused import.
- [x] `page.tsx` — mounted `QuoteSection` in `ServicesSection`'s old
      testimonial spot (between `ServicesSection` and `HomesSplitRow`).

## Acceptance criteria

- AC-1 (matches the Figma as closely as possible, using real tokens):
  **met.** Every Figma colour maps to an existing token exactly or
  near-exactly (background→`teal-700`, eyebrow→`purple-600` exact,
  heading→`teal-50`, subtext→`teal-100`) except the pink, which needed a
  new token for AA (see below). Verified visually against the Figma
  screenshot side-by-side.
- AC-2 (AA contrast maintained): **met, with a documented deviation from
  the literal Figma hex.** Real rendered-pixel measurement: eyebrow and
  blockquote both 5.03:1 (was 1.65:1 / 3.91:1 in the raw Figma values).
- AC-3 (animations): **met.** Reuses the site's existing `.reveal`
  scroll-in convention, staggered left-then-right column.
- AC-4 (blobs added): **met.** One `Blob` instance, corner-positioned,
  reusing the existing component and its established low-opacity
  convention.
- AC-5 (no overflow, any breakpoint): **met.** `scrollWidth - clientWidth
  = 0` at 390/768/1440.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (Next.js 16.2.6, Turbopack, all 22 routes
      generated).
- [x] Browser verification: production build (`next start -p 3100`),
      Playwright against system Chrome. 390/768/1440px: zero overflow,
      correct column stacking. Real WCAG contrast measured on rendered
      pixels (not just token math): 5.03:1 for both flagged colours.

## Review

Five files changed, two new (`QuoteSection.tsx`, its `index.ts`), one new
CSS token, one new font. No component was reused where it didn't fit
(`LotusBand`) and no component was rebuilt where it did (`Blob`). The
one real finding — two of the Figma's own colours failing AA on its own
background — was caught by computing contrast before implementing, not
after, and fixed with a single new token carrying its own provenance
comment rather than two separate one-off hex tweaks.

`tasks/lessons.md` not touched — no user correction occurred this round.

---

## #80 follow-up: purple two-up variant (`TestimonialPair`)

Same branch (`feat/homepage-quote-section`). Client sent a second Figma
screenshot: same band mechanics, purple (`purple-600`, exact token match)
instead of teal, no intro column — two testimonials side by side instead
of one.

**Refactor:** extracted the quote-mark/blockquote/figcaption markup out of
`QuoteSection` into a shared `QuoteCard.tsx` (`tone: "teal" | "purple"`),
so both variants render from one place instead of duplicating that block.
`QuoteSection` now composes `QuoteCard`; new `TestimonialPair.tsx` renders
two of them in a `grid-cols-1 md:grid-cols-2`. No AA fix needed this time
— `purple-600` is darker than `teal-700`, so the existing `teal-50`/
`teal-100` tokens clear AA on it with even more margin (9.77:1 measured,
vs. 5.03:1 on the teal variant).

**One real snag:** `Blob`'s `color="purple"` resolves to the exact same
`purple-600` as this section's own background — at any opacity, a shape
filled with a colour identical to what's behind it is invisible (not
subtle, literally a no-op; opacity blending a colour with itself is still
that colour). Rather than extend `Blob`'s fixed 2-colour palette for a
one-off need, used `mix-blend-mode: multiply` on the existing `Blob`
instance — same `purple-600` fill, but blended it reads as a visibly
darker patch, matching the reference's subtle same-hue corner shape.
`Blob.tsx` itself: untouched.

No page placement yet (client hasn't said where this goes) — built with a
Storybook story (`stories/sections/TestimonialPair.stories.tsx`) instead,
same as F5/F6's "component + story, placement is a separate call" pattern.
`QuoteSection.stories.tsx` was also added (it had none before this).

Data: `src/data/testimonial.ts` gained `QuoteEntry` (the shared
quote/name/date shape — `HomeQuote` now extends it) and `teamTestimonials`
(the 2 entries from this screenshot — "Team Leader"/"Person in Charge",
verbatim quote text transcribed from the image).

Verification: `tsc`/`lint` exit 0. Storybook built successfully
(`npm run build-storybook`, `storybook-static` served statically —
**not** via `serve`, which turned out to 301-redirect `/iframe.html?...`
→ `/iframe` and silently drop the query string, breaking direct story
deep-links; switched to a plain Node static server with no URL rewriting).
Verified in Chrome: 390/768/1440px zero overflow, two-column desktop /
single-column mobile stacking, real pixel contrast 9.77:1.

`tasks/lessons.md` not touched — no user correction, both findings above
were self-caught before they reached the user.

---

# Homepage reconciliation against Figma export (#79 / #56)

Branch: `feat/homepage-figma-reconcile` (stacked on `feat/homepage-quote-section`
— depends on that branch's `homeQuote` data shape, which isn't merged yet).

## Diagnosis

Client sent a full-page CSS export + screenshot from Figma, asking for
"whatever changes there are" across the whole homepage. Diffed it
section-by-section against live code (3 parallel research passes) before
touching anything, because the first check — the About section's "150+"
Staff Members figure — turned out to be the stale *pre-fix* value (commit
`7d88da7` already corrected it to "200+" per the client). That proved
this export is at least partly an older/mixed snapshot, not a clean new
design, so only genuinely new/different information was acted on.

**Confirmed already matching, zero changes:** About section, Services
section (all 3 cards), Team section (real roster — issue #57 already
resolved this), Board section (real 5-member roster), Careers/"Join Our
Team" section (3 featured jobs), Contact section (form + real contact
info), Footer.

## Must not break

- C-1: `aboutStats` in `src/app/page.tsx` stays at "200+" — the Figma's
  "150+" is confirmed stale, not reverted.
- C-2: `TestimonialPair` (the purple two-up variant from the prior card)
  untouched — the client's explicit answer was "replace the title and
  text only, the rest is fine," scoped to `QuoteSection`'s `homeQuote`
  only.
- C-3: `HomesCarousel.tsx` itself not rewritten — it already had a
  non-embedded standalone mode (`embedded` prop, default `false`) that
  renders exactly the Figma's separate carousel section (own `<section
  id="homes">`, heading, arrows/dots, "Enquire About Our Homes" CTA) —
  this was a wiring change (stop passing `embedded`), not new carousel
  work.

## User's design decisions

- Quote section: keep the current #80 layout/colours exactly as shipped;
  only swap in the new heading/subtext copy and the real attribution
  ("JW, Service Owner" / "With Lotus Care since 2018", replacing the
  "Administrator" placeholder) found in the export.
- Ireland map: source a real, accurate open-license county map and
  restyle it to brand — not a pixel clone of the Figma's raw vector
  (that data isn't reconstructable from CSS position percentages alone).
- No pins on the map — counties with homes render in a different fill
  colour instead.
- County data is client-pending beyond Offaly (the only county
  confirmable from existing data — HQ address, site's own "Co. Offaly
  and the Midlands" copy) — built swap-ready, not blocked on.

## Tasks

- [x] 3 parallel research passes confirmed the "already matching"
      sections above before any edit was made.
- [x] `src/data/testimonial.ts` — `homeQuote.heading`/`.subtext`/`.name`/
      `.date` updated to the export's copy and real attribution;
      `.eyebrow`/`.quote` unchanged (already matched).
- [x] Sourced "Ireland complete.svg" (Wikimedia Commons, released into
      the public domain by its author, no attribution required) — 32
      county boundary paths, but the file's paths carry no id/name
      attributes of their own. Matched each path to its county name via
      nearest label-to-path-centroid distance (label layer has real
      county names + positions; distances came out tight — Mayo 6,
      Meath 4, Clare 4 units on an 800×1000 canvas — a few looked
      larger, e.g. Monaghan 97, so **verified by rendering**, not
      trusted blind: the matched "Offaly" path sits exactly where it
      should, in the geographic midlands with no coastline).
- [x] New `src/components/ireland-map/county-paths.ts` — the 32 matched
      paths + source/method documented in a header comment — and
      `IrelandMap.tsx`: renders all 32, `highlightedCounties` prop picks
      the fill (`--color-teal-400` vs `--color-teal-800`), no pins, no
      labels, `role="img"` + `aria-label` naming the highlighted
      counties for screen readers since the visual distinction alone
      wouldn't convey that.
- [x] New `src/data/homes-map.ts` — `HIGHLIGHTED_COUNTIES` swap-ready
      config, defaulted to `["Offaly"]`, comment flagging it as
      client-pending for the full list.
- [x] `src/components/homes-split-row/HomesSplitRow.tsx` — repurposed:
      dropped the carousel entirely (moved to its own standalone
      section), kept the existing video panel (`HOMES_MONTAGE`,
      untouched, still poster-only), added `IrelandMap` in its place.
      `id="homes"` moved with the carousel to its new standalone section
      (via `HomesCarousel`'s own built-in `id="homes"`) — anchor links
      unaffected.
- [x] `src/app/page.tsx` — `<HomesSplitRow homes={homes} />` replaced
      with `<HomesCarousel homes={homes} />` (standalone) directly
      followed by `<HomesSplitRow />` (now prop-less: video + map only).
- [x] `stories/sections/HomesSplitRow.stories.tsx` — dropped the now
      unused `homes` arg.

## Acceptance criteria

- AC-1 (About/Services/Team/Board/Careers/Contact/Footer unchanged):
  **met** — confirmed via research before implementation, zero edits to
  any of those files.
- AC-2 (quote section — copy only, layout/colour untouched): **met.**
  `QuoteSection.tsx`/`QuoteCard.tsx`/`TestimonialPair.tsx` — zero edits,
  only `testimonial.ts` data changed.
- AC-3 (homes carousel split into its own section, unchanged behaviour):
  **met.** Verified in-browser: still auto-rotates, arrows/dots/modal
  all work, "Enquire About Our Homes" CTA present — this was `embedded`
  wiring only, the component itself wasn't touched.
- AC-4 (video + Ireland map row, no pins, county-colour highlight
  instead): **met.** Verified in-browser at 390/768/1440px.

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (Next.js 16.2.6, Turbopack, all 22 routes
      generated).
- [x] Browser verification: dev server, Chrome. 390/768/1440px: zero
      page overflow (`scrollWidth - clientWidth = 0` at all three), map
      renders inside its container at every width, video+map stack
      correctly on mobile, quote-section copy renders correctly, homes
      carousel section confirmed still full-width with heading/CTA.

## Review

Five files changed, three new (`IrelandMap.tsx`, `county-paths.ts`,
`homes-map.ts`). The research-first approach (3 parallel passes before
any edit) turned what looked like a full-homepage rebuild into a
5-file change — 7 of 11 sections in the export needed nothing at all,
and one figure (the stats "150+") would have been a real regression if
adopted blindly. The map's county-to-path matching used a distance
heuristic rather than trusted source ids (the source file has none) —
flagged the larger-distance matches explicitly rather than silently
trusting the algorithm, and confirmed by rendering before writing the
matched geometry into the component.

`tasks/lessons.md` not touched — no user correction; the "verify the
150+ stat before reverting" catch and the map-matching verification were
both self-driven, not corrections after the fact.

---

## Homepage reconciliation follow-up: the hero was under-checked

Same branch. User correction: the initial reconciliation pass declared
the hero "already matches, just needed the font" — wrong. Real diffs
existed that a component-level skim missed entirely:

- **Image**: still the old Unsplash placeholder (`community-friends.jpg`).
  The user supplied the client's actual chosen photo directly (a Pexels
  stock image, `pexels-shkrabaanthony-6288114.jpg`) — swapped in as
  `hero-finger-painting.jpg`, resized 4000×6000 → 1600px wide via
  `sharp` (already a dependency) to match this repo's other stock-photo
  file sizes (~130–330KB, was 3.6MB), credited in
  `public/images/stock/CREDITS.md` (Pexels License, no attribution
  required, confirmed via the live Pexels page before use).
- **Heading**: was still split into two colours (`text-accent` on the
  second phrase) — Figma shows one solid white heading, different
  wording/casing ("Enhanced living empowering lives.", not "Enhanced
  Living, Empowered Lives"). Updated copy in `page.tsx` +
  `HeroSection.stories.tsx`, dropped the accent-colour span, bumped
  `text-3xl md:text-4xl lg:text-5xl` → `text-4xl md:text-5xl lg:text-6xl`
  to get closer to the Figma's 55px display size without hardcoding a
  literal px value.
- **Subtitle**: had an extra "Co. Offaly and" the Figma's copy doesn't.
- **Background decoration**: the big rotated bottom-left watermark in
  the Figma (1069px, opacity 0.06) was being rendered as a small
  (320px), unrotated, bottom-*right* `LotusMark` (the solid-bloom mark).
  The Figma's shape — many small disconnected "Vector" pieces in
  nested "Group"s — matches `LotusMarkAlt`'s construction (a compound
  outline path), not `LotusMark`'s few solid petal facets. Swapped
  component, went from `w-80` to `lg:w-[64rem]`, added
  `rotate-[-23deg]`, repositioned to bottom-left with negative insets
  so it bleeds off-canvas (matches the reference's off-canvas bleed);
  `overflow-hidden` on the section (already present) clips it safely.
  Kept the existing top-right `LotusMarkAlt` untouched — that one
  already matched the Figma's smaller top-right motif.

Font stayed DM Sans, not the Figma's literal 'Cactus Classical Serif' —
that substitution was the user's own explicit instruction from an
earlier message in this session, not a guess, so it wasn't re-litigated
here.

## Verification

- [x] `npx tsc --noEmit` / `npm run lint` / `npm run build` — all exit 0.
- [x] Browser: 390/1440px, zero overflow, image/heading/decoration all
      confirmed visually against the reference screenshot.

---

# #78: Merge Training into Why Work With Us, remove Overview tab

Branch: `feat/careers-why-us-revamp`.

## Diagnosis

Client sent a Figma CSS export + screenshot for a revamped `/careers/why-us`
page, plus explicit instructions: remove "Overview" and "Training" from the
careers navigation, delete the training page. This is issue #78 (long
deferred, "Combine Training & Why Work With Us in Careers Hub") — the
client's design finally answers it: the training page's career-pathway
timeline and "Invest in Your Future" CTA move into `why-us`; its
mandatory/professional/leadership training-card grid does not carry over —
confirmed by the Figma export itself (that block is `display: none` in the
source, not just visually absent from the screenshot).

Two parallel research passes (careers nav/hub/training/CTA-strip;
video-testimonials + a search for the new "Vision & Values" content)
confirmed every reused piece below against the actual current code before
any edit — several pieces turned out to be exact or near-exact matches
already sitting in the codebase, not new builds:

- `CareersHero`'s image-variant overlay gradient already matches the
  Figma's stops.
- `CareersCTAStrip`'s existing `tone="teal"` gradient
  (`from-teal-800 to-primary-dark` = `#094a4e`→`#0d6a70`) is an *exact*
  match to the Figma's `linear-gradient(90deg, #094A4E, #0D6A70)` — zero
  component changes needed there.
- `Timeline` (`orientation="horizontal"`) is literally the training page's
  own "Career Progression Pathway" component — reused as-is, just fed 5
  stages instead of 4.
- `QuoteSection`/`TestimonialPair` (built earlier this session for the
  homepage) — the Figma's two quote-section instances are, respectively,
  the *original* pre-edit `homeQuote` copy (now living in this page's own
  new `careersHearQuote` export, since `homeQuote` itself moved on to the
  homepage's newer "Real voices" copy) and the *exact* existing
  `teamTestimonials` data, verbatim. Zero new quote-section component
  work.
- `VideoTestimonialCard`'s fixed-px play-button/badge sizing coincidentally
  already matches the Figma's numbers at the much larger "featured video"
  size it's now used at.
- All 4 "Vision & Values" icons (Respect/Compassion/Quality/Hope) already
  exist in `careers-icons.tsx`'s dispatch (`user-circle`/`heart`/
  `shield-check`/`user-group`) — same icons `companyValues` already uses
  for a different, unrelated value set.

## Must not break

- C-1: `src/components/timeline/Timeline.tsx` is also used by
  `careers/how-we-hire` — confirmed via grep before touching it. The one
  change made (`TimelineStep.number: number | string` →
  `ReactNode`, to accept an icon) is a pure type-widening, zero behaviour
  change; `how-we-hire` still passes plain strings and still renders plain
  numeral badges — verified in-browser after the change, not just assumed.
- C-2: `LotusMark`/`LotusMarkAlt` untouched — the progressive-bloom stage
  icon is a new, separate component (`LotusStageIcon`), not a prop bolted
  onto the shared mark components every other page also uses.
- C-3: `CareersHero`'s new `titleHighlight`/`secondaryCtaLabel`/
  `secondaryCtaHref` props are additive-only (undefined unless passed) —
  every other existing caller (`/careers`, `/careers/benefits` — training's
  own call is now deleted along with the page) keeps its exact current
  render, unverified by inspection alone: confirmed by reading each
  remaining caller's props after the change, none pass the new props.
- C-4: `VideoTestimonialCard`'s new `sizes` prop defaults to the exact
  previous hardcoded value — the 3-up "In Their Own Words" grid pattern
  isn't used on this page anymore (per your answer, only James O. features
  here), but the component itself still behaves identically if reused
  elsewhere at the old grid size.
- C-5: `cultureGalleryImages`, `employerStats`, `testimonials` (the 4-person
  "Hear From Our Team" set) — all dropped from this page's render (not in
  the new design) but deliberately left in `src/data/careers.ts`, not
  deleted — real content, just not rendered here anymore.
- C-6: The hub page's own "Our Values" section (`companyValues` —
  Person-Centred/Compassionate/Accountable/Inclusive) is explicitly flagged
  in `docs/build-plan.md` as deferred/placeholder content the client said
  would change — a separate, out-of-scope page. Not touched.

## Tasks

- [x] Navigation cleanup: removed the `Overview` entry from
      `CareersSubnav.tsx`'s `links` (no `/careers/overview` route exists —
      it was a nav label pointing at the hub, confirmed by directory
      listing before removing); removed `Training` from the same list, from
      `CareersBreadcrumb.tsx`'s `pageLabels`, from the hub page's
      `hubCards`, and from the main navbar's mobile "Careers" submenu
      (`src/data/navigation.ts`).
- [x] Deleted `src/app/careers/training/` and `trainingPrograms`/
      `TrainingProgram` from `src/data/careers.ts` (confirmed via grep: used
      only by the deleted page).
- [x] Fixed the one dangling internal link found during research —
      `careers/benefits`'s CTA strip pointed `secondaryHref` at
      `/careers/training`; repointed to `/careers/why-us` with a new label
      ("Career Growth") matching where the progression content now lives.
- [x] `CareersHero.tsx` — added `titleHighlight` (renders in
      `text-blossom`), `secondaryCtaLabel`/`secondaryCtaHref`, in both the
      image and no-image render branches for consistency.
- [x] `VideoTestimonialCard.tsx` — added optional `sizes` prop, default
      preserves current behaviour exactly.
- [x] `Timeline.tsx` — widened `TimelineStep.number` to `ReactNode`;
      fixed the two `key={step.number}` usages to `key={step.title}` since
      a ReactNode isn't a valid React key.
- [x] New `src/components/lotus-mark/LotusStageIcon.tsx` — renders
      `LOTUS_FACETS` (the real logomark geometry, already grouped into 6
      petals by the existing `.lotus-bloom` CSS animation's own reveal
      order: center → bottom → left/right → upper-left/upper-right) at a
      `stage` 1–5, filling that many groups white at full opacity and the
      rest at 0.25 — literal "career blooms in stages," using real brand
      geometry rather than a generic icon, per your explicit answer to use
      the same SVG the logo is already split into petals from.
      Self-review: initially assumed a `white circle + border` badge style
      to match the Figma pixel-for-pixel, which would have required
      modifying `Timeline`'s circle styling; reused `Timeline`'s existing
      solid-teal circle unchanged instead (icon renders in white on it) —
      keeps `Timeline` untouched beyond the one type change, a closer
      "spirit not pixel clone" match to this repo's established precedent
      (the Ireland map, the hero decorative mark) than modifying a
      component two pages share.
- [x] `careers-icons.tsx` — added a `clock` icon for the pathway section's
      "Progression isn't only vertical" callout.
- [x] `src/data/careers.ts` — removed `trainingPrograms`/`TrainingProgram`;
      added `whyUsValues` (Respect/Compassion/Quality/Hope, copy verbatim
      from the Figma, reusing existing icon names).
- [x] `src/data/testimonial.ts` — added `careersHearQuote` (the
      pre-"Real voices" original copy, since `homeQuote` now holds the
      homepage's newer revision).
- [x] Rewrote `src/app/careers/why-us/page.tsx` in full: hero → breadcrumb
      → pathway (Timeline + lateral-note callout, both wrapped in the
      existing `Reveal` scroll-in convention) → `QuoteSection` →
      `TestimonialPair` → Vision & Values grid (also `Reveal`-wrapped) →
      featured video (`Reveal`-wrapped) → `CareersCTAStrip`.

## Acceptance criteria

- AC-1 (Overview + Training removed from careers nav): **met.** Verified
  in-browser: sub-nav shows exactly 5 tabs (was 7), main navbar's mobile
  Careers submenu has 5 children (was 6), hub page has 5 hub-cards (was 6).
  `/careers/training` returns 404. Grepped the whole repo post-edit for
  `careers/training` and `Overview` inside `src/components/careers/` —
  zero hits.
- AC-2 (why-us revamped per the Figma): **met.** Verified in-browser
  section-by-section against the reference screenshot: hero (real photo,
  highlighted "career.", two CTAs), pathway (5 stages, progressive-bloom
  icons visibly filling in left-to-right, dashed callout), both quote
  sections (byte-identical copy to the Figma), Vision & Values (4 cards,
  correct icons/copy), featured video (James O., large single card), CTA
  strip (exact gradient + copy match).
- AC-3 (`how-we-hire` unaffected): **met.** Verified in-browser — its
  `Timeline` still renders plain numeral badges ("1", "2"...), unchanged.
- AC-4 (no dangling links): **met.** `benefits` page's CTA strip fixed and
  verified pointing at `/careers/why-us`.

## Verification

- [x] `npx tsc --noEmit` — exit 0 (one stale `.next` type-validator error
      referencing the deleted training route, resolved by clearing `.next`
      — a cache artifact, not a real error).
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0, 21 routes generated (was 22 — training
      route gone, confirmed absent from the route list).
- [x] Browser verification: dev server, Chrome. 390/1440/1600px (1600 used
      specifically to clear the sub-nav's own `1440px` breakpoint token and
      confirm it renders) — zero overflow at every width, all sections
      matched against the reference screenshot, nav cleanup confirmed via
      DOM queries (not just visual spot-checks) on the hub, subnav, and
      main navbar dropdown.

## Review

Fourteen files touched, two new (`LotusStageIcon.tsx`, the rewritten
`why-us/page.tsx`). The research-first pass again did most of the work
before any code was written — of the 8 sections in the new design, 3
(quote sections, CTA strip, pathway timeline) needed zero new component
code, only new data fed into existing components, because the client's
design turned out to reuse copy/gradients/layouts already sitting in the
codebase from earlier cards. The one genuinely new build — the
progressive-bloom stage icon — used the real logomark geometry rather than
a generic icon, per your explicit steer toward the "petals" SVG data,
and was scoped as a new component specifically so the two shared
components it's adjacent to (`Timeline`, `LotusMark`) stay exactly as
every other page already relies on them.

`tasks/lessons.md` not touched — no user correction this round.

---

## #78 follow-up: 5 corrections from user review

Same branch. User caught 5 real defects in the shipped version:

1. **Pathway circles were solid dark teal** — should be white with a
   dark-teal stroke. Fixed via a new `Timeline` prop,
   `circleVariant?: "solid" | "outline"` (default `"solid"`, so
   `how-we-hire`'s existing circles are untouched — verified in-browser
   after the change, still solid dark teal with white numerals).
2. **Wrong SVG treatment** — `LotusStageIcon` was rendering every facet
   flat white, discarding the real per-facet brand colours that were
   sitting right there in `LOTUS_FACETS` (`lotus-geometry.ts`) the whole
   time — the same colours `LotusMark tone="color"` uses. Fixed:
   revealed petals now render in their real `facet.color`; unrevealed
   ones in a flat muted grey (`--color-neutral-300`) instead of a
   same-colour opacity fade, so they read clearly as "not yet bloomed"
   against the now-white circle.
3. **Last stage wasn't a full bloom** — `BLOOM_ORDER.slice(0, stage)`
   with 5 stages against 6 petal-groups meant stage 5 only ever revealed
   5 of 6 — an off-by-one from mapping stage count directly onto group
   count without checking they matched. Fixed with an explicit
   `REVEAL_COUNTS = [2, 3, 4, 5, 6]` spread across the 5 stages, so stage
   5 always resolves to all 6 groups — verified by screenshot, the fifth
   circle is now visibly the complete, real-colour mark.
4. **DM Sans wasn't applied anywhere on the page** — despite being
   explicitly specified in the same Figma export for the hero, both
   `SectionTitle` headings, the pathway step titles, and the value-card
   titles, none of it landed in the first pass. Fixed with the same
   additive-prop pattern used elsewhere this session: `SectionTitle`
   gained `dmSans?: boolean` (default off, every other caller on the
   site unaffected), `Timeline` gained `titleClassName?: string`: both
   confirmed via `getComputedStyle` on the live page, not just visually,
   that `font-dm-sans` actually resolves to `"DM Sans", ...` — `Careers
   Hero`'s `h1` got the class directly (applies to every `CareersHero`
   page, a deliberate, not per-instance, call, since the display font is
   a heading-level brand choice, not page-specific state like
   `titleHighlight`). `CareersCTAStrip`'s heading deliberately left
   alone — the Figma's own CSS specifies Inter for that one heading, not
   DM Sans, confirmed by re-reading the export rather than assumed.
5. **"Overview" still reachable** — removed `viewAllHref`/`viewAllLabel`
   from the Careers entry in `src/data/navigation.ts` (the only two
   fields controlling that link's render in both `HomesDropdown` and
   `MobileMenu`, confirmed by reading both before editing) so it no
   longer appears in either the desktop dropdown or the mobile drawer.
   Per the user's explicit instruction not to remove the hub page from
   the actual code, `src/app/careers/page.tsx` itself is untouched
   except for one added line: an unconditional `redirect("/careers/
   open-roles")` as the first statement in the component, so the bare
   `/careers` URL also stops resolving to hub content (confirmed:
   `curl` returns a 307 to `/careers/open-roles`) — the hub's own
   JSX/data stays in the file below the redirect, unreachable but not
   deleted, exactly matching "don't need to remove it on the actual
   code, but remove it from being accessed."

## Verification

- [x] `npx tsc --noEmit` / `npm run lint` / `npm run build` — all exit 0
      (one spurious "unused eslint-disable" warning surfaced and was
      removed — the `no-unreachable` rule doesn't fire on this pattern in
      this repo's config, confirmed by running lint rather than assumed).
- [x] Browser, Chrome: pathway circles confirmed white/teal-stroke with
      real per-facet colours via screenshot; DM Sans confirmed via
      `getComputedStyle` on 4 separate headings (hero, both `SectionTitle`
      instances, pathway titles, value-card titles) rather than eyeballed;
      `/careers` redirect confirmed via `curl`; "Overview" absence
      confirmed via DOM query on both the desktop dropdown and mobile
      drawer; `how-we-hire`'s `Timeline` re-confirmed unaffected (solid
      dark circle, white "1") after the `circleVariant` change.

---

## #78 follow-up: Vision & Values cards — scale up + stagger animation

Same branch. Two small asks: bigger cards, and animation on them (they
were already inside a `Reveal` but as one block — all 4 faded in
together with no stagger, unlike every other card grid on the site).

Scaled: `p-6`→`p-8`, icon box `w-12 h-12`→`w-16 h-16` (icon itself
`w-6 h-6`→`w-8 h-8` via a `[&>svg]:` selector — `getCareersIcon`'s icons
are hardcoded at a fixed size, so this overrides it per-instance rather
than changing the shared icon set), title un-sized→`text-lg`,
description `text-sm`→`text-base`, grid `gap-5`→`gap-6`.

Staggering an entrance animation needs client-side state
(`useInView`) per card, but `why-us/page.tsx` exports `metadata`, which
requires it to stay a Server Component — can't add `"use client"` there.
Extracted a new small client component, `ValuesGrid.tsx`
(`src/components/careers/values-grid/`), mirroring the exact convention
`ServiceCard`/`ServicesSection` already use elsewhere: one `useInView`
on the grid container, each card gets `reveal reveal-delay-{index+1}`
(the 4 cards land on `reveal-delay-1..4`, `globals.css`'s existing 1-5
stagger steps) plus the sitewide `card-hover` hover-lift. No new
animation CSS — reused what's already there and already
reduced-motion-safe.

## Verification

- [x] `npx tsc --noEmit` / `npm run lint` / `npm run build` — all exit 0.
- [x] Browser: confirmed via DOM query that each of the 4 cards carries a
      distinct `reveal-delay-1` through `-4` class (not eyeballed timing);
      screenshot confirms larger cards/icons; 390px zero overflow.

---

## #78 follow-up: Values cards — white + shadow + hover lift

Same branch. Cards were `bg-neutral-50` with no shadow, styled ad hoc
rather than against any existing pattern. Matched them to `HubNavCard`'s
exact classlist (the closest sibling — icon/title/description info card
in a grid): `bg-white shadow-sm border border-gray-100 hover:shadow-md
hover:-translate-y-1 transition-all duration-200`.

**One real dead end, corrected before it shipped wrong.** First attempt
diagnosed the hover lift as broken — `getComputedStyle(el).transform`
stayed `matrix(1,0,0,1,0,0)` even while `:hover` was confirmed matching —
and "fixed" it by splitting the card into two nested divs (reveal wrapper
+ hover surface) on the theory that `.reveal.in-view`'s unlayered
`transform: translateY(0)` was beating Tailwind's layered
`hover:-translate-y-1` utility. That diagnosis was wrong: Tailwind v4
compiles `-translate-y-*` to the standalone CSS `translate` property, not
`transform` — checking `transform` was checking the wrong property
entirely, there was no real conflict. Caught by re-verifying
`getComputedStyle(el).translate` (`"0px -4px"` on hover, both before and
after reverting the split), which confirmed the original single-div
version already worked correctly. Reverted to one div, matching
`HubNavCard`'s actual structure exactly — no unnecessary nesting shipped.

## Verification

- [x] `npx tsc --noEmit` / `npm run lint` / `npm run build` — all exit 0.
- [x] Browser, Chrome: real `:hover` via Playwright (not just CSS
      inspection) confirmed `translate: 0px -4px` and the shadow
      escalating from `shadow-sm` to `shadow-md` on the actual rendered
      card; screenshot shows the hovered card visibly lifted with a
      shadow against its neighbours; 390px zero overflow.

---

## #78 follow-up: match "Join Our Team" animation, not ServiceCard's

Same branch. User correction: this repo has *two* different reveal
conventions for card grids — `ServiceCard`/`ServicesSection`'s per-card
`reveal-delay-{index}` stagger, and `JobCard`/`RecruitmentSection`'s
single `reveal` around the whole grid (cards only animate via hover, not
individually on entrance). The values grid had been built against the
former; the user pointed at the homepage's "Join Our Team" cards
(`RecruitmentSection`) as the actual comparison point, and asked why it
didn't match.

Re-read `RecruitmentSection.tsx`/`JobCard.tsx` in full rather than
guessing from memory. Rebuilt `ValuesGrid` to mirror that pattern
exactly: one `reveal`/`in-view` on the grid container (no per-card
`reveal-delay`), and `JobCard`'s literal hover classes
(`hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`) —
previously `-translate-y-1` (4px), now `-translate-y-0.5` (2px) to match
`JobCard`'s actual lift distance, not just its direction.

## Verification

- [x] `npx tsc --noEmit` / `npm run lint` / `npm run build` — all exit 0.
- [x] Browser: confirmed via DOM query the grid container carries
      `reveal in-view` (not the individual cards) and each card's
      classlist is byte-identical to `JobCard`'s hover treatment; real
      `:hover` confirmed `translate: 0px -2px` (was `-4px` before the
      fix); 390px zero overflow.
