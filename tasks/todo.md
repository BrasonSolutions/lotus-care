# Testimonial marquee fixes: uniform card size + standard container width

Full plan: `C:\Users\andre\.claude\plans\misty-chasing-sky.md`. Direct user feedback on the marquee just shipped, same branch (`feat/careers-overview-revamp`).

## Tasks
- [x] `TestimonialCard.tsx` — add opt-in `clampQuote?: boolean` prop (line-clamp-4 + fixed height), default off
- [x] `TestimonialMarquee.tsx` — drop full-bleed `w-screen` break-out, pass `clampQuote` to each card
- [x] `page.tsx` — move `<TestimonialMarquee>` inside `<Container>`
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — cards uniform height/aligned, marquee width matches hub-cards section, `/careers/why-us` and `/quality` unaffected (still natural height, no line-clamp)

## Review

Both complaints fixed:
- Cards in the marquee are now uniform height (`h-64` + `line-clamp-4` on the quote when `clampQuote` is set), flush-aligned top and bottom regardless of quote length — verified visually, long quotes truncate cleanly with an ellipsis.
- Marquee no longer breaks out to the viewport edge; it now lives inside the same `<Container>` as the rest of the page, so its width matches the hub-cards/featured-jobs sections exactly — verified visually, left/right edges line up.
- `TestimonialCard`'s new `clampQuote` prop is opt-in (default `false`), so its other two call sites (`/careers/why-us`, `/quality`) are unaffected — verified via computed styles that those cards keep natural height and no `line-clamp` class.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
