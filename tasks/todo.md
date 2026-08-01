# C1 — Careers Overview revamp

Card source: `docs/build-plan.md` (C1). Full plan: `C:\Users\andre\.claude\plans\misty-chasing-sky.md`.

## Tasks
- [x] `src/app/careers/page.tsx` — drop hero `stat`/`chips`/`avatarImages`/`avatarCaption` props
- [x] `src/app/careers/page.tsx` — replace stats `<dl>` section with 3-card testimonial grid (`Reveal` + `TestimonialCard`, `testimonials.slice(0, 3)`)
- [x] `src/app/careers/page.tsx` — remove duplicate lower pull-quote testimonial section
- [x] `src/app/careers/page.tsx` — pass alternating `accent` prop into `HubNavCard` map
- [x] `src/components/careers/hub-nav-card/HubNavCard.tsx` — add `accent?: "teal" | "purple"` prop, top-border + tinted chip per Appendix B
- [x] Verify: `npx tsc --noEmit`
- [x] Verify: `npm run lint`
- [x] Verify: `npm run build`
- [x] Verify: manual check on `/careers` — hero plain, testimonial grid in place of stats, hub cards alternate teal/purple with top border, no duplicate testimonial section, values unchanged

## Acceptance criteria (from build-plan C1)
- [x] Hero buttons/cards removed
- [x] Stats/info block replaced by testimonials section
- [x] Benefit cards (hub nav grid) use palette accents, not flat white
- [x] Values sourced from single config (swap-ready) — already true, confirmed only

## Explicitly out of scope (confirmed with user / per plan)
- `/careers/benefits` page / `BenefitCard` component — C4
- `/careers/why-us` testimonial/gallery work — C3
- `/careers/open-roles` width — C2 (next)
- Values *content* changes — client hasn't revised them yet (B1, blocked)

## Review

All acceptance criteria met. Summary:

- `src/app/careers/page.tsx` — hero call-site simplified to title/subtitle/CTA/image only (dropped the floating pill-badge/stat-card/avatar-cluster overlays). The stats `<dl>` block was replaced by a 3-testimonial grid (`testimonials.slice(0, 3)`: Sarah M., James O., Aoife N. — best role variety), reusing the existing `TestimonialCard` component and the same `Reveal`-wrapped-grid pattern already used elsewhere on this page. The now-redundant single pull-quote testimonial section further down the page was removed (its `/careers/why-us` link is still reachable via the "Why Work With Us" hub card). Hub cards now alternate an `accent` prop (`i % 2 === 0 ? "teal" : "purple"`).
- `src/components/careers/hub-nav-card/HubNavCard.tsx` — added `accent?: "teal" | "purple"` (default `"teal"`), implementing Appendix B's style direction: 3px top border + ~15%-opacity tinted icon chip, alternating real brand teal (`--color-primary`) / real brand purple (`--color-purple-600`, confirmed a real `@theme` token, not the approximate placeholder hex from the build-plan doc). `rounded-2xl`/`p-6` already matched Appendix B's radius/padding spec, no change needed there.
- Company Values section: no code change — `companyValues` in `src/data/careers.ts` was already a single-source array, B1's swap-ready bar was already met.
- Resolved two ambiguities in the card text before implementing (confirmed with user): "hero buttons/cards" = the hero's floating overlay props (not the primary CTA button); "benefit cards" = the `HubNavCard` grid (not the separate `BenefitCard`/`Benefit` type used only on `/careers/benefits`, which is C4's page).

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually verified in a live dev server via Playwright (scrolled through to properly trigger scroll-reveal animations, since a one-shot full-page screenshot without scrolling under-triggers `useInView`/`.reveal` — not a bug, just a capture-timing artifact): hero is plain with no floating overlays, testimonial grid renders correctly where stats used to be, hub cards alternate teal/purple with visible top border and tinted icon chips (Open Roles/Benefits/How We Hire = teal, Why Work With Us/Training/Contact = purple), no duplicate testimonial section remains, Featured Roles and Values sections unchanged and rendering correctly.
