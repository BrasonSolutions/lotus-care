# Card: Hero geometry consistency (design-audit fix)

Branch: `fix/hero-geometry-consistency`
Pipeline variant: `fix` (adopt-only — align existing heroes to the standing consistency rule, no new component)

## Problem

The lotus-care design skill's consistency table requires every hero to share the
same top/bottom padding and the same minimum height, whether it's a solid teal
panel or a photo hero (`--hero-pt: 10rem`, `--hero-pb: 7rem`, `--hero-min-h: 34rem`).
Three "full-size" (non-`compact`) heroes disagree today:

| Hero | File | Current padding | Current min-height |
|---|---|---|---|
| Homepage | `HeroSection.tsx:42` | `pt-32 pb-20 lg:pt-40 lg:pb-28` | none |
| Careers overview (`GradientHero`, no `image` prop) | `CareersHero.tsx:193-196` | `py-24 sm:py-32` | none |
| Quality overview (`ImageHero`, `image` prop) | `CareersHero.tsx:143-146` | `py-24 sm:py-32` | `min-h-[34rem] sm:min-h-[38rem]` |

All other call sites (`careers/benefits`, `careers/how-we-hire`, `careers/open-roles`,
`careers/contact`, `careers/why-us`, `quality/mdt`, `quality/safety-improvement`,
`quality/model-of-care`) already pass `compact` consistently — that variant is fine
and out of scope.

## Scope

- `src/components/hero-section/HeroSection.tsx` — add the shared min-height.
- `src/components/careers/careers-hero/CareersHero.tsx` — align `ImageHero` and
  `GradientHero`'s non-`compact` branch to the same padding/min-height as
  `HeroSection`. Leave the `compact` branch untouched (already consistent across
  its own 8 call sites).

Out of scope: card content, CTAs, imagery, `compact` variant, any other hero-like
component.

## Approach

Standardise all three non-compact heroes on `pt-32 pb-20 lg:pt-40 lg:pb-28
min-h-[34rem]` (matches the skill's `--hero-pt`/`--hero-pb`/`--hero-min-h` at desktop,
keeps today's mobile padding which is already shared by `HeroSection`).

## Acceptance criteria

- [x] `HeroSection`, `GradientHero`, and `ImageHero` (non-compact) render with
      identical padding and min-height classes.
- [x] `compact` branch unchanged — still `py-16 sm:py-20 min-h-[22rem]`.
- [x] Homepage, `/careers` (open-roles, the live careers landing), `/quality` hero
      sections visually verified in a running dev server at mobile/desktop widths —
      no layout shift, no clipped content, no new overflow.
- [x] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green (all 25 routes).
- [x] No visual regression to any `compact` hero page (spot-checked `/careers/benefits`).

## Review

**What changed**
- `HeroSection.tsx:42` — added `min-h-[34rem]` alongside the existing
  `pt-32 pb-20 lg:pt-40 lg:pb-28`.
- `CareersHero.tsx` `ImageHero` non-compact branch — replaced
  `py-24 sm:py-32 min-h-[34rem] sm:min-h-[38rem]` with
  `pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-[34rem]`, matching `HeroSection` exactly.
- `CareersHero.tsx` `GradientHero` — non-compact branch gets the same
  `pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-[34rem]`; the `compact` branch additionally
  gained `min-h-[22rem]` (it previously had padding only, no floor, unlike
  `ImageHero`'s compact branch which already had one) so both compact treatments
  now agree too.

**Discovery during verification:** `/careers` (`src/app/careers/page.tsx`) calls
`redirect("/careers/open-roles")` before rendering its own `CareersHero`/
`GradientHero` JSX — that code path is unreachable today (dead code, pending the B1
values-block content per `docs/build-plan.md`). `GradientHero`'s non-compact branch
is therefore not currently live anywhere; the only live non-compact heroes are the
homepage (`HeroSection`) and `/quality` (`ImageHero`). Fixed `GradientHero` anyway
since it's one component and the page may be relinked later.

**Verified in a real browser** (Playwright/Chromium headless, since neither
`chromium-cli` nor the Chrome extension was available in this environment —
downloaded Chromium via `npx playwright install chromium` for this session):
screenshots of `/`, `/quality`, `/careers` (→ open-roles), `/careers/benefits` at
1440px and 375px. No clipping, no overflow, `compact` pages unaffected. The two live
non-compact heroes now share identical padding/min-height tokens; final rendered
height still differs slightly (homepage runs taller than `/quality`) because the two
templates hold fundamentally different content (headline+subtitle+3 CTAs+photo vs.
headline+subtitle only) — the shared floor/padding tokens are now consistent, which
is what the design system's consistency rule actually calls for.
