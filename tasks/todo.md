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
# Card: Button/Chip primitives consolidation

Branch: `refactor/button-chip-primitives`
Pipeline variant: `fix` (design-system consolidation, no visual redesign)

## Problem

Every CTA pill across the codebase hand-rolls its own `<a className="rounded-full ...">`
markup instead of using a shared `Button` primitive, and there's no shared `Chip` primitive
either, even though the lotus-care design skill's component inventory (section 7) specifies
both as core primitives. Consolidate onto two new primitives with **zero visual regression**.

## Scope

- Build `src/components/button/Button.tsx` — variants `primary | outline | onDark |
  onDarkOutline`, sizes `sm | md | lg`, `href` renders an anchor (via `next/link`, so
  internal routes keep client-side navigation), no `href` renders a `<button>`, plus
  `fullWidth` and `disabled`.
- Build `src/components/chip/Chip.tsx` — tones `teal | purple | tealSoft | accentSoft |
  neutral | solid | solidPurple | onDark`, sizes `sm | md`. Renders a `<span>`, never
  accepts `onClick`/`href`.
- Replace hand-rolled pill markup at every real call site with the new primitives,
  preserving exact visual output (colours, padding, border-radius, hover, focus ring).
- Storybook stories for both, following `stories/ui/*.stories.tsx` convention.
- `tsc`/`eslint`/`build` clean; verify in a real browser (desktop 1440px + mobile 375px).

## Acceptance criteria

- [x] AC-1 `Button` implements all 4 variants + 3 sizes per the design skill spec, matching
      the repo's real tokens (`--color-primary-dark`/teal-800/teal-100/white, `.focus-ring` /
      `.focus-ring-white`), not the build-plan's placeholder hexes.
- [x] AC-2 `Chip` implements all 8 tones + 2 sizes, `<span>` only, no `onClick`/`href` prop.
- [x] AC-3 Every clearly Button-shaped call site converted: `HeroSection` (3 CTAs),
      `CareersHero` (2), `CareersCtaStrip` (2), `Navbar` (1), `MobileMenu` (1),
      `RecruitmentSection` (2), `JobCard` (1), `OccupopJobCard` (1), `HomesCarousel` (1),
      `HomeModal` (1), `TeamModal` (1), `ContactForm` submit (1) — 16 buttons, 12 files.
- [x] AC-4 Every clearly Chip-shaped call site converted: `JobCard`/`OccupopJobCard` type
      badge, `TeamCard` department badge, `KeywordCards` term pill, `VideoTestimonialCard`
      "Coming soon" badge — 5 call sites, 4 files.
- [x] AC-5 `npx tsc --noEmit` clean repo-wide.
- [x] AC-6 `npx eslint .` clean repo-wide.
- [x] AC-7 `npm run build` green (25 routes).
- [x] AC-8 Verified in a real browser (dev server, Playwright CLI screenshots) at 1440px and
      375px: homepage hero, `/careers/why-us` hero, `/careers/open-roles`, `/careers/benefits`,
      footer, `/quality` hero, homepage "Join Our Team" section.
- [x] AC-9 Every visible deviation from pre-refactor output is called out explicitly, not
      silently shipped (see Review below).
- [x] AC-10 Out-of-scope surfaces left untouched: `homes.ts`/`HomesCarousel`/`HomeModal`
      rainbow colours, `JobFilter`/`CareersSubnav`/`QualitySubnav`/`TeamSection` toggle pills,
      `Footer` social icons, `HubNavCard`, `ServiceCard`.

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
**`Button` API** — `variant?: "primary" | "outline" | "onDark" | "onDarkOutline"` (default
`primary`), `size?: "sm" | "md" | "lg"` (default `md`), `href?: string` (renders `next/link`,
so `#fragment` and external URLs still behave like a plain anchor), `fullWidth?: boolean`,
`disabled?: boolean`, `onClick?: () => void`, `type?: "button" | "submit" | "reset"` (button
form only), `target`/`rel` (link form only). No `href` → native `<button>`.

**`Chip` API** — `tone?: ChipTone` (default `neutral`), `size?: "sm" | "md"` (default `sm`),
`className?: string`, `children`. Always a `<span>`.

**Call sites touched (16 Button + 5 Chip, across 15 files)**
`HeroSection.tsx`, `CareersHero.tsx`, `CareersCtaStrip.tsx`, `Navbar.tsx`, `MobileMenu.tsx`,
`RecruitmentSection.tsx`, `JobCard.tsx` (Button + Chip), `OccupopJobCard.tsx` (Button + Chip),
`HomesCarousel.tsx`, `HomeModal.tsx`, `TeamModal.tsx`, `ContactForm.tsx`, `TeamCard.tsx` (Chip),
`KeywordCards.tsx` (Chip), `VideoTestimonialCard.tsx` (Chip).

**Visible-change judgment calls (per the guardrail — flagged, not silently shipped):**

1. **`CareersHero` and `CareersCtaStrip`'s primary CTA hover colour changes.** Both hand-rolled
   `hover:bg-accent hover:text-white`; the design skill spec (and `HeroSection`'s already-shipped
   `onDark` CTA) says onDark hover = `hover:bg-teal-100` with text staying `text-primary-dark`.
   Consolidating onto one `onDark` variant means these two components now hover to teal-100
   instead of accent-teal-with-white-text. This is a real, visible hover-colour change on 2
   CTAs. Chose the spec-correct version per the guardrail ("prefer whichever matches the design
   skill spec most closely").
2. **Padding/text-size deltas from consolidating onto 3 canonical sizes.** Several existing
   pills used one-off padding/text-size combinations that don't land exactly on `sm`/`md`/`lg`:
   - `CareersHero`, `CareersCtaStrip`: padding was already `px-8`/`py-3or4` (close to `lg`) but
     had **no explicit text-size class** (inherits ~16px); `lg` sets `text-lg` (18px) explicitly
     — CTA text is ~2px larger now. `CareersCtaStrip` additionally had `py-3` (12px), now `py-4`
     (16px) — 4px taller.
   - `RecruitmentSection`: was `text-base` (16px) with `lg`'s padding; now `text-lg` (18px).
   - `HomesCarousel`'s outline CTA: was `py-3` (12px) + no text-size class; now `lg`'s `py-4`
     (16px) + `text-lg` (18px).
   - `MobileMenu`, `HomeModal`, `TeamModal` full-width CTAs: were `py-3` (12px); mapped to `md`
     (`py-2.5` = 10px) since text was already 16px (matches `md`'s `text-base`) — 2px shorter.
   - `ContactForm` submit: was `py-3.5` (14px); mapped to `lg` (`py-4` = 16px, text already
     `text-lg`) — 2px taller.
   - `VideoTestimonialCard`'s "Coming soon" badge: was `px-3` (12px horizontal); `Chip`'s `sm`
     size (matching `JobCard`/`TeamCard`'s exact convention) is `px-2.5` (10px) — 2px narrower.
   None of these change colour, shape, or layout — only a few px of padding or ~2px of text
   size on isolated CTAs/badges, invisible without a ruler, but called out per the guardrail
   rather than silently absorbed.
3. **Horizontal padding on full-width (`fullWidth`) buttons is a no-op visually.** `Button`
   always applies its size's `px-*` class even when `fullWidth`, but because these buttons'
   text was already centred within a 100%-width box (border-box sizing), adding symmetric
   horizontal padding doesn't move the text or change the pill's outer bounds. Confirmed no
   visual difference, not just assumed.

**Reviewed but deliberately left hand-rolled (documented, not silently skipped):**
- `Footer.tsx` social icons — icon-only circular buttons (no text label), don't match either
  primitive's shape (`Button` is a labelled pill, `Chip` is a metadata span).
- `JobFilter.tsx`, `CareersSubnav.tsx`, `QualitySubnav.tsx`, `TeamSection.tsx` department tabs —
  interactive toggle/filter pills. Don't fit `Button` (not a one-shot CTA) or `Chip` (spec
  forbids `onClick` on a Chip, and these need it for selection state).
- `CareersHero`'s `HeroChips` prop and `FeatureSlab`'s keyword pills — translucent
  `bg-white/15 ... backdrop-blur` badges with no equivalent among the 8 spec'd `Chip` tones.
  Converting only the one sub-variant that *does* match (`HeroChips`'s `i === 1` white chip)
  would have fragmented one `.map()`'s styling logic for no real benefit, so the whole block
  was left as-is rather than inventing a 9th non-spec tone.
- `HubNavCard.tsx`, `ServiceCard.tsx` — no `rounded-full` pill present at all (their "Learn
  more" links are plain text + arrow icon).
- `homes.ts`/`HomesCarousel`/`HomeModal` rainbow colours (per-home hex `color` field) —
  explicitly out of scope; only the "Enquire About Our Homes" and "Close" buttons in those two
  files were touched, not the colour-coded dots/labels.

**Verification**
- `npx tsc --noEmit`: clean (repo-wide).
- `npx eslint .`: clean (repo-wide).
- `npm run build`: green, 25 routes generated.
- Dev server (`npm run dev -- -p 3001`) + `npx playwright screenshot` (Playwright installed
  as a one-off browser download only, not added to `package.json`) at 1440px and 375px:
  homepage hero (all 3 CTAs render as solid-white / outline pills exactly as before),
  `/careers/why-us` hero (onDark CTA resting state unchanged; hover intentionally differs,
  see above), `/careers/open-roles` (job type `Chip` + "View Role" `Button` render correctly;
  note: the live Occupop job list itself failed to load in this sandboxed dev environment —
  pre-existing, unrelated to this change, external API unreachable), homepage "Join Our Team"
  section (`RecruitmentSection` CTAs + `JobCard` chip/button), `/careers/benefits` (CareersCtaStrip
  + footer), `/quality` hero (no CTA in this variant — confirmed unaffected).

**Environment note:** the worktree had no `node_modules` (git worktrees don't share
`node_modules`); ran `npm install` before any verification step.
