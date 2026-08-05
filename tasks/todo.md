# P2: Hero quick-action buttons

Branch: `feat/home-hero-cta` (based on `feat/home-hero-redesign`, which stacks on `main`).

## Diagnosis

P1 left the hero with a single CTA (`ctaLabel`/`ctaHref`, defaulting to "Read More" → `#about`)
and a known, flagged contrast defect: the CTA's white label text on `bg-primary` (`#1badb2`)
measured **~2.74:1** against its own fill — below the WCAG AA text minimum (4.5:1) — and the
fill itself measured **2.31:1** against the `bg-primary-dark` section background — below the
WCAG 2.1 SC 1.4.11 non-text/UI-component boundary minimum (3:1). P1 explicitly deferred both
to this card. The hero also had no fast entry point to Services or the Careers hub.

## Must not break

- C-1: P1's layout, imagery, `HERO_IMAGE` constant, and message/subtitle contrast results
  stay intact — this card adds CTAs, it does not re-do the hero.
- C-2: `title` / `titleHighlight` / `subtitle` props unchanged.
- C-3: Design tokens only — no hardcoded hex in the component.
- C-4: No new dependencies, no test framework.
- C-5: Every animation stays covered by the existing global `prefers-reduced-motion` block —
  no bespoke per-component override.
- C-6: No CLS. No horizontal overflow at 390px — CTAs wrap/stack gracefully.
- C-7: Do not touch team, board, or quality components. `ServicesSection.tsx` may only gain
  an anchor `id` if one is missing (it already has one — see Tasks).
- C-8: Both CTAs keyboard-focusable with a visible focus indicator, using the project's
  existing `focus-ring` / `focus-ring-white` utilities — no bespoke focus style.

## Tasks

- [x] Checked `ServicesSection.tsx` — already has `id="services"` (line 23). No edit needed;
      `ServicesSection.tsx` was not touched.
- [x] Verified `/careers` route exists (`src/app/careers/page.tsx`, confirmed by `npm run build`
      emitting a static `/careers` route).
- [x] Replaced `HeroSectionProps`' single `ctaLabel`/`ctaHref` with
      `primaryCtaLabel`/`primaryCtaHref` (default `"Our Services"` → `#services`) and
      `secondaryCtaLabel`/`secondaryCtaHref` (default `"Careers"` → `/careers`). All four
      remain optional with sensible defaults — `src/app/page.tsx` passes none of them
      already, so it needed no change.
- [x] Rendered two `<a>` CTAs in a `flex flex-col sm:flex-row gap-4 justify-center
      lg:justify-start` wrapper (stacks under 640px, sits inline from `sm:` up, no overflow).
- [x] Primary ("Our Services") — solid fill, reusing the `rounded-full` / generous padding /
      `focus-ring` idiom: `bg-white text-primary-dark hover:bg-teal-100`.
- [x] Secondary ("Careers") — outline/ghost on the dark hero, matching
      `CareersCTAStrip.tsx`'s existing dark-background outline CTA pattern exactly:
      `border-2 border-white text-white hover:bg-white/10 focus-ring-white`.
- [x] Updated `stories/sections/HeroSection.stories.tsx` args to pass explicit primary/secondary
      CTA label/href so the story documents both buttons rather than relying silently on
      component defaults.

## Acceptance criteria

- AC-1: Two CTAs in the hero, in a clear primary vs secondary visual hierarchy (solid fill vs
  outline), not two identical buttons.
- AC-2: Primary links to the Services section (`#services`); secondary links to the Careers
  hub (`/careers`).
- AC-3: Both CTAs are genuinely keyboard-focusable with a visible focus indicator
  (`focus-ring` / `focus-ring-white`).
- AC-4: Accessible labels — visible text ("Our Services", "Careers") makes the destination
  clear without relying on surrounding context.
- AC-5 (contrast fix): each button's fill/border reaches ≥3:1 against `bg-primary-dark`, and
  each button's label text reaches ≥4.5:1 against its own fill (see computed ratios below).

## Contrast — computed (WCAG relative-luminance formula), not eyeballed

Tokens used: `--color-teal-700` (`#0d6a70`, = `bg-primary-dark`, the section background),
`--color-teal-100` (`#d4f1f5`, hover fill), and `white`. No hex invented — all three come
from the existing `@theme` scale in `globals.css`.

| Button | State | Pair | Ratio | Requirement |
|---|---|---|---|---|
| Primary (`Our Services`) | idle | fill `white` vs section bg `teal-700` | **6.34:1** | ≥3:1 (non-text) |
| Primary | idle | text `teal-700` vs fill `white` | **6.34:1** | ≥4.5:1 (text) |
| Primary | hover | fill `teal-100` vs section bg `teal-700` | **5.34:1** | ≥3:1 (non-text) |
| Primary | hover | text `teal-700` vs fill `teal-100` | **5.34:1** | ≥4.5:1 (text) |
| Secondary (`Careers`) | idle | border `white` vs section bg `teal-700` | **6.34:1** | ≥3:1 (non-text) |
| Secondary | idle | text `white` vs effective bg `teal-700` | **6.34:1** | ≥4.5:1 (text) |

Both P1-flagged defects (2.74:1 text, 2.31:1 fill boundary) are resolved — every combination
above clears its WCAG threshold with margin.

## Verification

- [x] `npx tsc --noEmit` — exit 0
- [x] `npm run lint` — exit 0
- [x] `npm run build` — exit 0 (confirms `/careers` route exists and is statically generated)
- [x] `npm run build-storybook` — exit 0 (pre-existing bundle-size advisories, unrelated)
- [ ] Manual/browser verification (measured contrast on real pixels, breakpoint layout, CLS,
      reduced-motion computed styles) — done by the IT Engineer (main session) per the
      `agents-frontend` contract, not by this agent. Dev server running at
      `http://localhost:3000`.

## Review

Replaced the hero's single CTA with two, in a primary/secondary hierarchy, and fixed the
contrast defect P1 flagged and deferred.

`HeroSectionProps` gained `primaryCtaLabel`/`primaryCtaHref`/`secondaryCtaLabel`/
`secondaryCtaHref` (all optional, defaulting to "Our Services" → `#services` and
"Careers" → `/careers`) in place of the old single `ctaLabel`/`ctaHref`. `src/app/page.tsx`
passes neither the old nor the new props — it already relied entirely on defaults — so it
required no edit.

`ServicesSection.tsx` already carries `id="services"` (added well before this card), so no
component beyond `HeroSection.tsx` and its story needed touching — the card's allowance to
add an anchor id there turned out to be unnecessary.

Primary CTA reuses the site's established "solid fill" idiom (`rounded-full`, `px-8 py-4`,
`focus-ring`) but swaps the fill from `bg-primary` (the defective pairing) to `bg-white` with
`text-primary-dark` — the same token pairing used for primary buttons on dark sections
elsewhere in the codebase is `bg-white`/`text-primary` (`CareersCTAStrip.tsx`), but that
pairing's `text-primary` still fails 4.5:1 (2.74:1, the exact defect this card exists to fix),
so `text-primary-dark` was chosen instead — same idiom, corrected token, verified by
computation rather than assumed correct because a sibling component does it.

Secondary CTA reuses `CareersCTAStrip.tsx`'s dark-background outline pattern verbatim
(`border-2 border-white text-white hover:bg-white/10 focus-ring-white`) — an existing pattern
already proven at ≥3:1/4.5:1 against a similar dark gradient background, and not a new
dialect for this component to invent.

Both CTAs are `<a>` elements throughout (no button-as-link), each with sensible standalone
label text ("Our Services", "Careers") that names its destination without depending on
surrounding copy. `focus-ring` and `focus-ring-white` are the pre-existing global utilities
(`globals.css`) — no bespoke focus style added. Layout wraps via `flex flex-col sm:flex-row
gap-4`, matching the wrap pattern `RecruitmentSection.tsx` already uses for its own two-CTA
row, so there is no new responsive-wrap convention introduced either.

**Could not verify in this run (no browser automation available to this agent):** actual
rendered contrast on real pixels, `getBoundingClientRect()` layout at 390px/breakpoints,
CLS via `PerformanceObserver`, and reduced-motion computed styles. These are the IT
Engineer's verification responsibility per the `agents-frontend` contract; the dev server is
running at `http://localhost:3000`.

Verified: `npx tsc --noEmit` (exit 0), `npm run lint` (exit 0), `npm run build` (exit 0,
`/careers` confirmed as a real statically-generated route), `npm run build-storybook`
(exit 0, pre-existing bundle-size warnings unrelated to this change).
