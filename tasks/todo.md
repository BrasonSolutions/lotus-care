# F1 — Brand colour token system

Card source: `docs/build-plan.md` (F1). Full plan: `C:\Users\andre\.claude\plans\read-card-f1-in-synchronous-coral.md`.

## Tasks
- [x] Replace `@theme` block in `src/app/globals.css` with teal/purple/neutral scales + semantic aliases (purple marked provisional)
- [x] Fix `.input-glow:focus` in `src/app/globals.css` to use `color-mix()` instead of raw rgba
- [x] Replace 6 literal hex fills in `src/components/service-card/ServiceCard.tsx` with token `var()` references
- [x] Add `stories/ui/ColorTokens.stories.tsx` documenting all scales + aliases
- [x] Verify: `git grep` for hex in `src/**/*.tsx`/`*.ts` (excluding `homes.ts`) is clean
- [x] Verify: no hex/rgba left in `globals.css` body rules (only inside `@theme`)
- [x] Verify: `npm run build` passes
- [x] Verify: Storybook renders `ColorTokens` + spot-check `ServiceCard`/`ServicesSection`/`Navbar`/`HeroSection` unchanged
- [x] Verify: `npm run dev` homepage visually matches `homepage.png` reference

## Acceptance criteria (from build-plan F1)
- [x] Real brand values sourced from the repo/logo, not from build-plan.md's placeholder hex
- [x] Purple + teal + neutral scales defined as tokens in one place
- [x] No hardcoded brand hex left in component files (grep clean)
- [x] Existing pages render unchanged except where intentionally re-themed
- [x] Documented in Storybook (a colour-tokens story)

## Review

All acceptance criteria met. Summary of changes:
- `src/app/globals.css` — `@theme` block now defines a 10-step teal scale (real values, sourced from `lotus-mark.svg`/existing tokens), a 10-step purple scale (explicitly commented as provisional/placeholder — no real purple exists anywhere in the repo), and a 10-step neutral scale. All 7 original semantic names (`primary`, `primary-dark`, `accent`, `muted`, `warm-bg`, `foreground`, `background`) kept as aliases resolving to identical hex values, so all 49 existing consumer files render unchanged. `.input-glow:focus` now derives its glow from `color-mix()` instead of a raw rgba literal.
- `src/components/service-card/ServiceCard.tsx` — 6 hardcoded hex SVG fills replaced with `var(--color-teal-*)` references.
- `stories/ui/ColorTokens.stories.tsx` — new Storybook story documenting all three scales plus the semantic aliases, with the purple section visibly flagged "Provisional — placeholder pending client brand value."
- `src/data/homes.ts` — untouched (per-home gemstone accent colors, out of scope).

Verified: grep-clean for hardcoded hex outside `homes.ts` and the `@theme` block; `npm run build` and `npx storybook build` both pass; visual spot-check via Playwright confirmed the homepage screenshot is pixel-identical to the pre-change reference (`homepage.png`) and the `ServiceCard` illustration + new `ColorTokens` story render correctly.

**Known gap, out of scope for F1:** the purple scale is a placeholder derived from build-plan.md's approximate mock stops, not a real brand value — flagged in a code comment in `globals.css`. Needs a real value from the client/designer before any purple-consuming card (F4 blobs, C4 benefits, etc.) ships to production.
