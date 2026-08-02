# C4: Benefits redesign

Full plan: `C:\Users\andre\.claude\plans\peppy-baking-tome.md`.

## Tasks
- [x] `BenefitCard.tsx` — add `accent?: "teal" | "purple"` prop (default `"teal"`), reusing `HubNavCard`'s chip-only `ACCENT` map; bump icon chip to `w-12 h-12 rounded-xl`; roomier padding (`p-6 sm:p-8`)
- [x] `benefits/page.tsx` — grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `gap-6`; pass alternating `accent` by index
- [x] Verify: `npx tsc --noEmit`, `npm run lint`, `npm run build`
- [x] Verify: manual check — 3-col desktop / 1-col mobile, roomier cards, chips alternate teal/purple, no CLS, hover/focus intact

## Review

Redesigned the Benefits page per C4, reusing `HubNavCard`'s already-shipped, contrast-verified accent pattern rather than introducing anything new:
- `BenefitCard` gained an `accent?: "teal" | "purple"` prop (default `"teal"`) driving the icon chip colour — same `bg-primary/15 text-primary` / `bg-purple-600/15 text-purple-600` map as `HubNavCard`. Per direct user decision this session, no top border was added (Appendix B calls for one, but the user explicitly dropped the equivalent top-border from `HubNavCard` on 2026-08-01 for a chip-only look — matched that here for consistency).
- Icon chip bumped `w-10 h-10 rounded-lg` → `w-12 h-12 rounded-xl`, padding `p-5` → `p-6 sm:p-8`, for the "roomier" ask.
- Grid changed `grid-cols-1 sm:grid-cols-2` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `gap-6` (was `gap-4`), matching Appendix B's 3-col desktop / 1-col mobile spec.
- Accent alternates by index across all 9 cards (teal/purple/teal/...).
- No copy changes — benefit titles/descriptions are unchanged (client-owned content, out of scope for this card).

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass. Manually confirmed live via Playwright at desktop (1440px, 3-col grid) and mobile (390px, clean 1-col stack) — chips alternate teal/purple, no layout shift, hover states intact.
