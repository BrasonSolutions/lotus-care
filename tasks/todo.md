# Careers Overview follow-up: hub card border + testimonial marquee

Full plan: `C:\Users\andre\.claude\plans\misty-chasing-sky.md`. Direct user feedback on the just-shipped C1 work, same branch (`feat/careers-overview-revamp`).

## Tasks
- [x] `src/components/careers/hub-nav-card/HubNavCard.tsx` — remove top-border accent, keep alternating tinted icon chip
- [x] `src/app/globals.css` — `.testimonial-marquee-track` + `@keyframes marquee` (60s linear infinite, pause on hover)
- [x] `src/components/careers/testimonial-marquee/TestimonialMarquee.tsx` — new component, full-bleed, edge-mask, duplicated track for seamless loop, duplicate copy `aria-hidden`
- [x] `src/app/careers/page.tsx` — 2 obviously-fake placeholder testimonials (local const, not added to shared data file), swap static grid for `<TestimonialMarquee>`
- [x] Verify: `npx tsc --noEmit`
- [x] Verify: `npm run lint`
- [x] Verify: `npm run build`
- [x] Verify: manual check — hub cards no top border, marquee loops seamlessly, hover pauses it, full-bleed, reduced-motion shows static clean row

## Review

All requested changes done. Summary:

- `HubNavCard.tsx` — dropped the `border-t-[3px]` accent + its `ACCENT[accent].border` field; reverted to a plain `border border-gray-100`. Kept the alternating teal/purple tinted icon chip (`ACCENT[accent].chip`) untouched.
- `TestimonialMarquee.tsx` (new) — renders the testimonial list twice back-to-back in a flex track so the `translateX(-50%)` loop point is seamless by construction (verified live: no visible jump). Full-bleed via the standard `w-screen relative left-1/2 -translate-x-1/2` break-out technique (safe — `body{overflow-x:hidden}` already global), edge-fade via CSS `mask-image`. Second (duplicate) copy is `aria-hidden` so screen readers see each testimonial once. No arrows/dots — pure passive ticker per request.
- `globals.css` — `.testimonial-marquee-track` (60s linear infinite) + hover-pause. Reduced motion needed no bespoke override: the existing global rule forces 1 iteration at ~0 duration, and since no `animation-fill-mode` is set, the element reverts to its unanimated base state — verified live that this shows a clean, correctly-ordered static row (Sarah M → James O → Aoife N → Michael T → Lorem Ipsum → Dolor Sit), not a jump-cut.
- `page.tsx` — added 2 clearly-fake placeholder testimonials ("Lorem Ipsum"/"Dolor Sit", lorem-ipsum quotes) as a local const, deliberately kept out of the shared `src/data/careers.ts` export so they can't leak into a real-content context later (e.g. C3's Why-Us page). Combined with the 4 real testimonials for 6 total in the marquee.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually verified live via Playwright: hub cards show no top border with chips still alternating; marquee animation confirmed `running` by default and `paused` on hover (via computed `animationPlayState`); reduced-motion emulation confirmed the track lands on a static, fully-readable, correctly-ordered row with no visual glitch.

Known trade-off flagged to user (not blocking): no dedicated pause button for keyboard/touch-only users (WCAG 2.2.2 asks for a persistent pause control) — per explicit "no arrows" request. Mouse hover-pause + full stop under reduced-motion are the mitigations in place; a small pause/play button can be added later if needed.
