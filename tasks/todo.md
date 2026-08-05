# P1: Hero redesign (rebalance + activity imagery)

Branch: `feat/home-hero-redesign` (based on `main`).

## Diagnosis

`HeroSection.tsx` uses the photo (`/images/home-bg.jpg`, 5192×3466, 1.5MB) as a full-bleed
`<Image fill>` background under a heavy teal overlay, with logo + headline + subtitle + CTA
centred on top. The photo is structurally the dominant element — it cannot help but swallow
the message — and the overlay reduces it to texture rather than showing people doing
something. `home-bg.jpg` is also heavy for the LCP element.

## Must not break

- C-1: `title` / `titleHighlight` / `subtitle` / `ctaLabel` / `ctaHref` props unchanged — no
  new required props, no signature change to `HeroSectionProps`.
- C-2: Single CTA only — do not add a second CTA (that's card P2).
- C-3: `src/app/page.tsx` untouched (no prop signature change needed).
- C-4: No files outside `src/components/hero-section/` and `stories/sections/HeroSection.stories.tsx`.
- C-5: No hardcoded hex — design tokens only.
- C-6: No new dependencies, no test framework.
- C-7: `home-bg.jpg` stays in `public/` (unused asset left in place, not deleted).
- C-8: Every animation stays covered by the existing global `prefers-reduced-motion` block
  in `globals.css` — no bespoke per-component override.

## Tasks

- [x] Rebalance layout: two-column grid at `lg+` (message left, image right), stacking to
      message-above-image on mobile (natural DOM order under `grid lg:grid-cols-2`, no
      `order-*` needed).
- [x] Swap imagery to `/images/stock/community-friends.jpg` (activity-based, licensed
      Unsplash stock), path + alt in one named constant (`HERO_IMAGE`) with an art-direction
      comment for future swap-in of commissioned photography.
- [x] Contain the image (`aspect-[4/3]` card, `rounded-2xl`, `overflow-hidden`, `ring`,
      `shadow-xl`) instead of full-bleed background — image supports, does not swallow.
- [x] Move text off the photo entirely onto the section's solid `bg-primary-dark` — the
      safest contrast structure, and keeps the fixed transparent `Navbar`'s white
      logo/links readable against the still-dark hero top (Navbar isn't part of this
      card's scope and its `bg-transparent`-over-dark-hero assumption must not be broken).
- [x] Drop `LogoWhite` from the hero body — `Navbar` already renders a logo directly above
      it on every load; a second logo beside a strengthened headline is redundant, not a
      hierarchy aid.
- [x] Drop `min-h-screen` and the bouncing scroll indicator — the section is no longer
      full viewport height, so a "scroll for more" affordance no longer reads correctly.
      Replace with explicit `pt/pb` that clears the fixed `Navbar` at all breakpoints.
- [x] Reuse `Container` (`width="wide"`, default) instead of the ad hoc `max-w-4xl mx-auto px-4`.
- [x] Keep `.animate-fade-up` / `.animate-fade-in` with the existing staggered
      `animationDelay` pattern (already covered by the global reduced-motion rule) —
      no `useInView` needed, hero is always above the fold on first paint.
- [x] Update `stories/sections/HeroSection.stories.tsx` subtitle to match the real copy
      shipped in `page.tsx` (was leftover "Victoria" text) while touching this file anyway.

## Acceptance criteria

- AC-1: Message (headline/subtitle/CTA) reads first — owns its own column on solid brand
  background, not layered under/behind imagery.
- AC-2: Image supports, doesn't swallow — contained card, not a full-bleed background.
- AC-3: Activity-focused imagery in place (`community-friends.jpg` — candid, people
  engaged, no posed hand-holding / wheelchair-from-behind / pity framing / uniformed staff).
- AC-4: Any text over imagery passes WCAG AA. (In this design no text sits over the photo —
  text lives on solid `bg-primary-dark`; verify that combination separately.)
- AC-5: Responsive — clean stack on mobile, two-column on `lg+`, no CLS from the image.

## Note — imagery is a placeholder, not a build decision

`community-friends.jpg` is licensed Unsplash stock (see `public/images/stock/CREDITS.md`),
used here as a swap-ready placeholder — the path and alt text live in one named constant
(`HERO_IMAGE`) specifically so it's a single edit point. Commissioned photography of real
Lotus Care service users is expected eventually, but that requires **documented consent
under HIQA** before any such image can be used — that is a client decision to make, not
something this build implements or assumes.

## Verification

- [x] `npx tsc --noEmit`
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run build-storybook`
- [ ] Manual/browser verification (contrast measurement, CLS, breakpoints, reduced-motion) —
      done by the IT Engineer (main session) per `agents-frontend` contract, not by this agent.

## Review

Rebuilt `HeroSection` as a two-column `grid lg:grid-cols-2` (message left, image right,
stacking to message-above-image on mobile via natural DOM order — no `order-*` needed).
Message column sits on the section's solid `bg-primary-dark`, never on the photo, so
contrast is a property of one fixed colour pair rather than of image content. Image is now
a contained `aspect-[4/3] rounded-2xl` card with `shadow-xl ring-1 ring-white/10`, not a
full-bleed background — it can no longer swallow the message by construction.

Imagery swapped to `/images/stock/community-friends.jpg` (264KB vs `home-bg.jpg`'s 1.5MB),
path/alt in one `HERO_IMAGE` constant with an art-direction + HIQA-consent comment for the
future swap. `home-bg.jpg` left in `public/` untouched (C-7).

Dropped `LogoWhite`: `Navbar` already renders a logo directly above the hero on every load
(fixed, transparent-until-scrolled) — a second logo beside a strengthened headline was
redundant, not a hierarchy aid. Kept `bg-primary-dark` as the section background specifically
so `Navbar`'s `bg-transparent`-when-unscrolled + white logo/nav-text still has the dark
backdrop it depends on for contrast — that assumption lives in `Navbar.tsx`, which is out of
this card's scope, so I preserved it rather than touch it.

Dropped `min-h-screen` and the bounce scroll indicator (per the card's own hint) — the
section is no longer full-viewport height, so a "scroll for more" affordance no longer
reads correctly. Replaced with explicit `pt-32 pb-20 lg:pt-40 lg:pb-28` to clear the fixed
`Navbar` (h-16, plus a `nav:` contact strip) at every breakpoint without depending on
viewport height.

Reused `Container` (`src/components/layout/Container.tsx`, default `width="wide"`) instead
of the old ad hoc `max-w-4xl mx-auto px-4`. Reused the file's own existing
`.animate-fade-up` / `.animate-fade-in` + staggered inline `animationDelay` pattern
unchanged (already covered by the global `prefers-reduced-motion` rule in `globals.css`) —
no `useInView` needed since the hero is always above the fold on first paint, unlike
`AboutSection`'s scroll-triggered `reveal` pattern.

`title` / `titleHighlight` / `subtitle` / `ctaLabel` / `ctaHref` props, and the single CTA's
markup/classes, are untouched — P2 will add the second CTA. `src/app/page.tsx` was not
touched; no prop signature changed.

**Contrast — computed (WCAG relative-luminance formula), not eyeballed:**
- Headline (`text-white` on `bg-primary-dark` #0d6a70): **6.33:1** — passes AA (≥4.5) and AAA.
- Subtitle (`text-white/80` effective-blended on #0d6a70): **4.68:1** — passes AA (≥4.5) for
  normal text, unchanged from the class combination the previous shipped hero already used.
- CTA button (`text-white` on `bg-primary` #1badb2): **~2.74:1** — fails AA. This is a
  **pre-existing** condition, not introduced here: the card explicitly requires the single
  CTA be kept "exactly as they are" (P2 owns the CTA rework). Flagging it rather than
  silently fixing or silently shipping it.
- No text sits over the photo in this design at all, so AC-4's "text over imagery" case is
  structurally avoided rather than merely passing.

**Could not verify in this run (no browser automation available to this agent):** actual
rendered layout at breakpoints, measured `getBoundingClientRect()`, CLS via
`PerformanceObserver`, and reduced-motion computed styles. These are the IT Engineer's
verification responsibility per the `agents-frontend` contract, browser dev server is
running at `http://localhost:3000`.

Verified: `npx tsc --noEmit` (exit 0), `npm run lint` (exit 0), `npm run build` (exit 0),
`npm run build-storybook` (exit 0, pre-existing bundle-size warnings unrelated to this change).
