# Q1: Quality Overview revamp

Full plan: `C:\Users\andre\.claude\plans\dynamic-wishing-sunset.md`.

## Tasks
- [x] `quality/page.tsx` — remove `stat`/`chips`/`avatarImages`/`avatarCaption` from `<CareersHero>` call
- [x] `quality/page.tsx` — add `<SectionTitle>` above the testimonial pull-quote
- [x] `quality/page.tsx` — add alternating `accent={i % 2 === 0 ? "teal" : "purple"}` to `<HubNavCard>` map
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — clean hero, testimonial heading, alternating hub card accents, sub-pages unaffected

## Review

Applied the same three changes C1 made to the Careers overview, to `src/app/quality/page.tsx`:
- **Hero**: dropped the `stat`/`chips`/`avatarImages`/`avatarCaption` overlay props from `<CareersHero>` — matches Careers' current simplified hero (title/subtitle/image only).
- **Testimonial section**: added a `<SectionTitle title="In Their Own Words" subtitle="...">` above the existing single anonymized resident pull-quote. Kept it as a single quote rather than building a `TestimonialMarquee` — Quality only has one real testimonial-shaped item (`anonymizedTestimonial` in `src/data/quality.ts`), unlike Careers' 4 real entries, so a marquee would require inventing content.
- **Hub cards**: added index-based `accent={i % 2 === 0 ? "teal" : "purple"}` to the 3 `<HubNavCard>`s, matching Careers' alternation exactly (chip-only accent, no top border, per existing `HubNavCard` implementation).

Deliberately did not add a "pillars" grid analogous to Careers' "Our Values" section — that would duplicate Q2's explicit scope (the three-pillars infographic redesign with lotus-bloom animation), so it's left entirely to that card.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually confirmed via Playwright at desktop (1440px) and mobile (390px) — hero renders clean, hub cards alternate teal/purple, testimonial section has its new heading. Confirmed all three Quality sub-pages (`/quality/human-rights`, `/quality/mdt`, `/quality/safety-improvement`) still return 200 and are unaffected.
