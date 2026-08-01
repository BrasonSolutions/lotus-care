# C3 — Why Work With Us

Card source: `docs/build-plan.md` (C3). Full plan: `C:\Users\andre\.claude\plans\misty-chasing-sky.md`.

## Tasks
- [x] `src/data/careers.ts` — add `StatItem`/`GalleryImage`/`VideoTestimonial` interfaces + `employerStats`, `cultureGalleryImages`, `videoTestimonials`
- [x] `src/components/careers/culture-gallery/CultureGallery.tsx` + `index.ts` — carousel mirroring `HomesCarousel` (keyboard arrows, reduced-motion-gated auto-scroll, dots)
- [x] `src/components/careers/video-testimonial-card/VideoTestimonialCard.tsx` + `index.ts` — real-video branch + "coming soon" placeholder branch
- [x] `src/app/careers/why-us/page.tsx` — remove values section; insert gallery; recolor Respect section to `bg-primary-dark` (BoardSection treatment) using `employerStats`; add video-testimonials section after existing testimonials
- [x] Verify: `npx tsc --noEmit`
- [x] Verify: `npm run lint`
- [x] Verify: `npm run build`
- [x] Verify: manual check — gallery arrows keyboard-focusable, reduced-motion disables auto-scroll interval, Respect section high-contrast, values gone, video cards show poster+badge with no console errors

## Acceptance criteria (from build-plan C3)
- [x] Accessible gallery carousel (keyboard + reduced-motion)
- [x] "Respect" section visibly higher-contrast / stands out
- [x] Stats from single config (swap-ready)
- [x] Values block removed; video testimonials section at page bottom with captions + poster frames

## Explicitly out of scope (per plan)
- Homepage stats/counters (`src/app/page.tsx`) — B2 cross-page consistency is separate
- Real photography/video assets — swap-ready scaffolding only, per user decision
- Existing text-testimonial "Hear From Our Team" section — untouched

## Review

All acceptance criteria met. Summary:

- `src/data/careers.ts` — added `employerStats` (extracted verbatim from the page's old inline array, B2 swap-ready), `cultureGalleryImages` (4 of the 5 existing stock photos, real alt text + captions), `videoTestimonials` (reuses 3 real testimonial names/roles with generic stock-photo posters, `videoSrc`/`captionsSrc` intentionally absent — honest "real person, video pending" state).
- `src/components/careers/culture-gallery/CultureGallery.tsx` (new) — mirrors `HomesCarousel`'s interaction code (scroll-snap, keyboard-focusable arrow buttons, dot indicators, auto-scroll gated behind `prefers-reduced-motion`, pause-on-hover), simplified for captioned photos instead of clickable home cards.
- `src/components/careers/video-testimonial-card/VideoTestimonialCard.tsx` (new) — real-`<video>` branch (with `<track kind="captions">` wired for when a real file exists) vs. a "coming soon" placeholder branch (poster image + decorative play icon + visible badge, no fake interactive control). White-card style, consistent with `TestimonialCard`/`HubNavCard`.
- `src/app/careers/why-us/page.tsx` — values section deleted; gallery inserted after the breadcrumb; "A Culture Built on Respect" section recolored to `bg-primary-dark` with `bg-white/10` glass stat cards (mirrors `BoardSection`'s established high-contrast treatment) — a clear, deliberate standout against the white sections around it; new "In Their Own Words" video-testimonials section added after the existing (untouched) text-testimonial section, before the CTA strip.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually verified live via Playwright: values block gone, gallery/Respect/video sections render correctly, no console errors. Confirmed via `setInterval` instrumentation that the gallery's auto-scroll interval is only created when `prefers-reduced-motion` is NOT set (isolates the gating logic itself from a separate, pre-existing finding below).

**Flagging, not blocking:** clicking the gallery's arrow buttons under Playwright's automated `.click()`/keyboard-Enter computes the correct scroll target (confirmed via `scrollTo` instrumentation) but the visible scroll position doesn't settle within automated polling. Reproduced identically on the already-shipped, already-merged `HomesCarousel` on the homepage (`/#homes`) — a pre-existing characteristic of this codebase's `scroll-snap-mandatory` + JS `behavior:"smooth"` combination under headless/automated browser conditions, not a regression introduced by this card. Worth a real-browser manual check by the user; not something this card's scope should "fix" in `HomesCarousel`'s shared pattern.
