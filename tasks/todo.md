# P3: Homes 50/50 row (video + existing carousel)

Branch: `feat/home-homes-split-row`.

## Diagnosis

`HomesCarousel.tsx` was not a bare carousel widget — it owned its own section
chrome (`<SectionTitle>`, `<Container>`, `id="homes"`) as well as all the
interactive behaviour (scroll container, `scrollToIndex`/`scrollBy`, arrows,
dots, `activeIndex`, auto-scroll gated on `prefers-reduced-motion`,
`HomeModal`, `useInView`). "Drop it into the right half" could not mean
nesting that whole section inside a half-width column — it needed an
opt-in escape hatch for the chrome only, leaving every interactive piece
untouched.

There was also no homes montage video and no `public/videos/` directory —
the client has not supplied one. The row had to be built swap-ready from a
single config point rather than shipping a `<video>` with a missing `src`.

## Must not break

- C-1: `HomesCarousel`'s interactive behaviour (scroll, `scrollToIndex`,
  `scrollBy`, arrows, dots, `activeIndex`, auto-scroll, `HomeModal`,
  `useInView`) stays byte-for-byte identical for any existing caller that
  passes no `embedded` prop.
- C-2: `src/data/homes.ts` (the `Home` interface and the `homes` array) is
  untouched — no data-model changes.
- C-3: Design tokens only — no hardcoded hex in new/changed components.
- C-4: No new dependencies, no test framework.
- C-5: Video/motion is gated on `prefers-reduced-motion` via JS (CSS cannot
  stop `<video autoplay>`), reusing the project's existing reduced-motion
  detection rather than a bespoke per-component check.
- C-6: No layout shift — the video/poster panel reserves its aspect ratio
  up front.
- C-7: Do not touch team, board, hero, services, or quality components.
- C-8: Keep `src/app/page.tsx` working — the eight homes still reach the
  carousel.
- C-9 (added after browser verification): the split row must not scroll
  the page horizontally at any breakpoint — `document.documentElement.
  scrollWidth <= clientWidth` at 390/768/1440.

## Tasks

- [x] Read `HomesCarousel.tsx`, `src/hooks/use-in-view.ts`, `src/app/page.tsx`,
      `Container.tsx`, `SectionTitle.tsx`, `VideoTestimonialCard.tsx` (the
      codebase's existing poster/video swap-ready pattern), `ContentSection.tsx`
      (the codebase's existing 50/50 media-row grid pattern), and
      `HomeModal.tsx` before editing anything.
- [x] `src/hooks/use-in-view.ts` — extracted the existing
      `prefersReducedMotion` `useSyncExternalStore` wiring into a new
      exported `usePrefersReducedMotion()` hook; `useInView` now calls it
      internally. No behaviour change to `useInView` — pure extraction so
      the new video panel can reuse the same SSR-safe reduced-motion signal
      instead of a duplicate `matchMedia` check.
- [x] `HomesCarousel.tsx` — added an opt-in `embedded?: boolean` prop
      (default `false`). When `true`, the component returns only the
      interactive fragment (reveal wrapper, arrows, cards, dots, CTA,
      `HomeModal`) and skips `<section>`/`<Container>`/`<SectionTitle>`.
      Every hook, ref, and handler is unchanged — only the outer JSX
      wrapping branches.
- [x] New `src/components/homes-split-row/HomesSplitRow.tsx` — owns the
      `id="homes"` section chrome (`<SectionTitle>` + `<Container>`) and a
      `grid lg:grid-cols-2 gap-10 lg:gap-16 items-center` row: left = video
      montage panel, right = `<HomesCarousel homes={homes} embedded />`.
      Mobile (`< lg`) falls back to a single column, video first in
      document order → stacks video-over-carousel per the card.
- [x] Video montage config: a single `HOMES_MONTAGE` constant
      (`{ src?, poster, alt }`) at the top of `HomesSplitRow.tsx`. Today
      `src` is unset (client-pending) so only the poster `<Image>` branch
      ever renders; dropping a file at `public/videos/<name>.mp4` and
      setting `HOMES_MONTAGE.src` in that one constant is the only edit
      needed to activate the real `<video muted loop playsInline autoPlay
      controls>` branch — no other file changes.
      **Client-pending asset — drops in at
      `src/components/homes-split-row/HomesSplitRow.tsx:22` (`src:` field
      on `HOMES_MONTAGE`).**
- [x] Poster image: `/images/houses/apple_hill/Ah-Picture1.jpg` — an
      existing real photo (bungalow exterior, driveway, front garden),
      794×529, not referenced anywhere else in the codebase. Reserved via
      `aspect-[3/2]` (matches the poster's own ~3:2 ratio) on a `relative
      rounded-2xl overflow-hidden` wrapper, `<Image fill sizes="(min-width:
      1024px) 50vw, 100vw" className="object-cover">` — no CLS regardless
      of which branch (poster or video) renders.
- [x] Reduced-motion gating on the eventual `<video>`: `autoPlay={!
      prefersReducedMotion}` and `controls={prefersReducedMotion}`, using
      the new `usePrefersReducedMotion()` hook — under reduced motion the
      poster shows with native controls so the user can start playback
      deliberately, matching the card's guidance.
- [x] `src/app/page.tsx` — swapped `<HomesCarousel homes={homes} />` for
      `<HomesSplitRow homes={homes} />` (import updated to match). The
      eight `homes` records flow through unchanged.
- [x] Added `stories/sections/HomesSplitRow.stories.tsx` (fullscreen layout,
      `homes` data, single `Default` story) — matches every other
      `Sections/*` story's convention. `stories/sections/HomesCarousel.stories.tsx`
      left untouched; its `Default` story still documents the
      non-embedded, standalone-section behaviour, unchanged.
- [x] **Post-verification fix (390px horizontal overflow, C-9):** browser
      measurement found `document.documentElement.scrollWidth` at 2852px on
      a 390px viewport — the poster panel, the carousel's card row, and the
      dots row were all pinned to 2828px. Root cause: CSS Grid's automatic
      minimum size for grid items defaults to their content size; the
      carousel's horizontally-scrolling card row (`overflow-x-auto`) was
      contributing its full, un-scrolled content width as the grid item's
      min-content, forcing the shared grid track — and therefore its
      sibling item too — wider instead of letting the row scroll within
      itself. Fixed entirely inside `HomesSplitRow.tsx` (no change to
      `HomesCarousel.tsx`, so its scroll/arrow/dot/modal internals are
      untouched): added `min-w-0` to the poster panel's wrapper div, and
      wrapped `<HomesCarousel homes={homes} embedded />` in a new
      `<div className="min-w-0">` so the actual grid item carries the
      explicit minimum rather than the carousel's fragment root. Did not
      use `overflow-hidden` on the section (would clip the scroller) or
      re-wrap the carousel in `<Container>` (would undo the point of the
      `embedded` prop).

## Acceptance criteria

- AC-1: 50/50 row on desktop (`lg+`), stacks video-over-carousel on mobile.
- AC-2: Existing carousel behaviour preserved — interactive exactly as
  today (arrows, dots, snap-scroll, auto-scroll, modal).
- AC-3: Video muted, has a poster frame, respects `prefers-reduced-motion`
  (no autoplay motion under reduced motion; poster + a deliberate way to
  play remain available).
- AC-4: No layout shift on load (reserved aspect ratio on the media panel).
- AC-5 (added after browser verification): no horizontal page scroll at
  390/768/1440 — see C-9 and the post-verification fix above.

## Verification

- [x] `npx tsc --noEmit` — exit 0 (re-run after the overflow fix)
- [x] `npm run lint` — exit 0 (re-run after the overflow fix)
- [x] `npm run build` — exit 0 (re-run after the overflow fix)
- [x] `npm run build-storybook` — exit 0 (pre-existing bundle-size
      advisories only, unrelated to this change — same as prior cards; not
      re-run after the overflow fix since it touches Tailwind classes only,
      no story/build-graph change)
- [x] Manual/browser verification (IT Engineer, first pass): confirmed at
      1440 — 2-column grid, poster panel 656px of 1440px (true 50/50), no
      overflow, CLS 0.0017, carousel genuinely interactive (`scrollLeft`
      changes on control click). At 390 — grid correctly collapses to 1
      column, video panel above carousel, poster renders with no `<video>`
      element, CLS 0.0000. Flagged **2462px of horizontal overflow at
      390px** as a shipping blocker — fixed, see C-9 / Tasks above.
- [ ] Re-verification of the overflow fix (`scrollWidth <= clientWidth` at
      390/768/1440, 2-column split still holds at `lg`, `aspect-[3/2]`
      still reserved so CLS stays ~0, carousel `scrollLeft` still changes
      on control click) — pending, IT Engineer to re-check in browser. Dev
      server running at `http://localhost:3000`.

## Review

Replaced the standalone `HomesCarousel` section on the homepage with a new
`HomesSplitRow` section: a video montage panel (poster-only until the
client supplies the file) on the left, the existing carousel — now
`embedded` to skip its own section chrome — on the right, 50/50 at `lg+`
and stacked video-over-carousel below that.

`HomesCarousel.tsx` gained one opt-in prop (`embedded`, default `false`).
Existing callers that pass nothing get byte-for-byte the same output as
before — verified by reading the diff: the branch only changes which JSX
wraps the same fragment (reveal div → arrows → cards → dots → CTA →
`HomeModal`); no hook, ref, handler, or effect was touched.

`src/hooks/use-in-view.ts` gained one exported hook,
`usePrefersReducedMotion()`, extracted from logic `useInView` already had
— `useInView`'s own behaviour is unchanged (it now just calls the new
hook internally instead of inlining the same `useSyncExternalStore` call).
This is what the new video panel uses for its reduced-motion decision,
instead of a duplicate `matchMedia` check.

The video montage is a single `HOMES_MONTAGE` constant at the top of
`HomesSplitRow.tsx` — `{ src?, poster, alt }`. `src` is unset today (no
asset exists yet), so the component renders the poster image alone,
styled as a deliberate panel (rounded corners, reserved aspect ratio) —
not an error state. When the client supplies the file, setting
`HOMES_MONTAGE.src` at `src/components/homes-split-row/HomesSplitRow.tsx:22`
is the only edit required; the same component then renders
`<video muted loop playsInline poster autoPlay={!prefersReducedMotion}
controls={prefersReducedMotion}>`.

Poster image chosen: `/images/houses/apple_hill/Ah-Picture1.jpg` — a real
photo of a home exterior (bungalow, driveway, garden), not used anywhere
else in the codebase. The panel reserves `aspect-[3/2]`, matching that
image's own ~3:2 ratio, so there is no layout shift whichever branch
(poster or, later, video) renders.

Reused two existing local patterns rather than inventing new ones:
`VideoTestimonialCard.tsx`'s poster/video swap-ready branch (same shape:
optional `src`, always-present `poster`, conditional render), and
`ContentSection.tsx`'s 50/50 media-row grid (`grid ... gap-10 lg:gap-16`,
`relative rounded-2xl overflow-hidden aspect-[…]` + `<Image fill>`).

`src/app/page.tsx` now imports and renders `HomesSplitRow` instead of
`HomesCarousel`, passing the same `homes` data straight through.

**Could not verify in this run (no browser automation available to this
agent):** actual rendered 50/50 vs stacked layout at breakpoints, measured
column widths/overflow, CLS via `PerformanceObserver`, and computed styles
under `reducedMotion: "reduce"`. These are the IT Engineer's verification
responsibility per the `agents-frontend` contract; the dev server is
running at `http://localhost:3000`.

Verified: `npx tsc --noEmit` (exit 0), `npm run lint` (exit 0),
`npm run build` (exit 0), `npm run build-storybook` (exit 0, pre-existing
bundle-size warnings unrelated to this change).
