# Why Work With Us: add purple accents

Full plan: `C:\Users\andre\.claude\plans\misty-chasing-sky.md`. Direct user feedback on C3, same branch (`feat/careers-why-us`).

## Tasks
- [x] `VideoTestimonialCard.tsx` — add `accent?: "teal" | "purple"` prop, applied to "Coming soon" badge background
- [x] `why-us/page.tsx` — Respect section stats alternate `text-accent`/`text-purple-100` by index
- [x] `why-us/page.tsx` — video testimonials map passes alternating `accent` prop
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — stats and badges alternate teal/purple, purple legible against dark background

## Review

Added purple as a second brand accent, reusing C1's hub-card alternating-teal/purple convention rather than inventing a new pattern:
- Respect section stat values now alternate `text-accent` (teal) / `text-purple-100` (purple) by index. Picked `purple-100` specifically after checking contrast against the dark `bg-primary-dark` background — `purple-300`/`purple-200` both fail WCAG AA's 3:1 large-text threshold there (~2.06:1 and ~2.97:1), `purple-100` passes comfortably at ~4.11:1 while still reading clearly as purple, not washed out.
- `VideoTestimonialCard` gained an `accent` prop (default `"teal"`) controlling the "Coming soon" badge's fill color (`bg-primary` / `bg-purple-600`), alternated across the 3 video cards. Solid-fill badges have no contrast concern (white on `purple-600` is ~10.5:1).

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually confirmed live via Playwright: stat cards alternate teal/purple legibly, video testimonial badges alternate teal/purple across all 3 cards.
