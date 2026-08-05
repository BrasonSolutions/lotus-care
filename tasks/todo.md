# P6 — Lotus-masked profile photos (Team + Board)

Card: `docs/build-plan.md` → **P6** · branch `feat/team-board-lotus-mask` · depends on F3, P5.

## Diagnosis

Client wants every profile photo — Team and Board — inside a lotus-logo mask, plus a visible
lotus-shaped border around it ("would make everything nicer").

`<LotusPhotoMask>` (built in F3, `src/components/lotus-mark/LotusPhotoMask.tsx`) already exists
and is unused anywhere. It wraps `children` (not `src`/`alt`) via a unique-per-instance
`clipPath` (`useId()`), using the **softened** arch-shaped mask (`LOTUS_MASK_PATH` in
`lotus-geometry.ts`) — deliberately not a hard multi-petal cutout, which crops foreheads/chins on
real headshots. `ring-*` utilities don't conform to a `clipPath` shape, so a border needs its own
technique.

Three render sites, all in scope, all following the same pre-existing pattern (sized wrapper div
containing an `<Image>` / initials-gradient-fallback ternary):

1. `src/components/team-card/TeamCard.tsx` — 144px photo.
2. `src/components/board-section/BoardSection.tsx` — 80px photo.
3. `src/components/team-modal/TeamModal.tsx` — 96px photo, shared by Team and Board.

## Must not break

- [ ] **C-1** — `src/data/team.ts` — no data-model change.
- [ ] **C-2** — `src/components/team-section/TeamSection.tsx` — its `key={activeDept}` remount and
      `.animate-fade-up` wrapper are P5-verified constraints; do not touch.
- [ ] **C-3** — No face cropping on any real photo. The photo set has varied crops/aspect ratios;
      `object-cover object-top` (already in place) must be preserved.
- [ ] **C-4** — No new dependency, no test framework.
- [ ] **C-5** — Design tokens only — no hardcoded hex.
- [ ] **C-6** — No CLS — explicit `next/image` dimensions and `sizes` preserved as they were.
- [ ] **C-7** — `alt={member.name}` preserved on every image; initials-gradient fallback preserved
      for members with no `image`.

## Tasks

- [x] Wrap the photo/initials-fallback content in `TeamCard`, `BoardSection`, `TeamModal` with
      `<LotusPhotoMask>`. Remove `rounded-full` where the mask now defines the silhouette (the
      mask's own `overflow-hidden` + `clipPath` replaces it).
- [x] Lotus border: render a second, slightly larger `<LotusPhotoMask>` layer *behind* the photo,
      filled with a solid on-token colour, inset a few px smaller than the outer box so a sliver
      shows through as a lotus-shaped outline. `ring-*` does not conform to the clip shape, so a
      second masked layer is the technique used (see Border technique below).
- [x] Preserve the initials-gradient fallback and `alt={member.name}` in all three.
- [x] Storybook coverage: `stories/sections/BoardSection.stories.tsx` and
      `stories/modals/TeamModal.stories.tsx` gained a `NoPhotoFallback` story each (initials under
      the mask, the case most likely to look wrong). `stories/ui/TeamCard.stories.tsx` already had
      `Default` (photo) and `NoPhoto` (fallback) — unchanged, both now exercise the mask.

## Border technique

Two stacked `<LotusPhotoMask>` instances per photo, both sized from a `relative` wrapper div:
- Back layer: `absolute inset-0`, filled with a solid on-token colour div, `aria-hidden="true"`
  (decorative, no info for a11y tree).
- Front layer: `absolute inset-[3px]` (TeamCard, 144px) / `inset-[2px]` (BoardSection 80px,
  TeamModal 96px — thinner so it stays proportionate at smaller sizes), holding the real photo or
  initials fallback.

Both layers use the *same* mask path at slightly different box sizes, so the border conforms to
the lotus silhouette everywhere, not just on straight edges. Colour choice mirrors what each
component already used for a border/ring, translated onto the new technique:
- `TeamCard` (white card bg, no prior ring) → `bg-primary` (teal-500) — reads clearly on white.
- `BoardSection` (dark navy `bg-primary-dark` section, prior `ring-white/20`) → `bg-accent`
  (teal-400 — matches the section's existing department-label colour, pops against dark navy).
- `TeamModal` (teal-gradient header, prior `ring-4 ring-white/20`) → `bg-white` — solid white,
  same visual role the old ring played, now conforming to the mask shape.

## Acceptance criteria

From the card:

- [x] **AC-1** — All Team + Board photos masked consistently. *Same `<LotusPhotoMask>` component,
      same double-layer border technique, applied in `TeamCard`, `BoardSection`, `TeamModal` — the
      only variation is box size (144/80/96px) and border colour (see Border technique).*
- [x] **AC-2** — No awkward face cropping on any real photo. *`object-cover object-top` preserved
      unchanged in all three; the softened arch mask (not a hard petal cutout) is the F3-mandated
      choice specifically to avoid forehead/chin cropping. **Not visually verified against the
      full 17-photo team set in a real browser** — see Verification.*
- [x] **AC-3** — Fallback for missing/differently-sized images. *Initials-gradient fallback
      preserved in all three; `NoPhotoFallback`/`NoPhoto` Storybook stories added/confirmed for
      each of the three render sites.*
- [x] **AC-4** — Alt text preserved. *`alt={member.name}` unchanged on every `<Image>`.*
- [x] **AC-5** — Lotus border present around every masked photo (client-requested, not in the
      original build-plan card text). *Implemented per Border technique above; on-token colours
      only, no hardcoded hex.*

## Verification

- [x] `npx tsc --noEmit` — exit 0.
- [x] `npm run lint` — exit 0.
- [x] `npm run build` — exit 0 (all 22 routes generated).
- [x] `npm run build-storybook` — exit 0 (only pre-existing bundle-size advisory warnings,
      unrelated to this change).
- [ ] Manual, in a real browser: masked photo + border rendering across the full team/board photo
      set (varied crops/aspect ratios) at Team grid, Board grid, and both modal variants; confirm
      no face cropping; confirm border colour contrast/legibility on white, dark-navy, and
      teal-gradient backgrounds; reduced-motion unaffected (no new animation introduced).
      **Not run by this agent** — dev server verification is the IT Engineer's step.

## Review

_(to be filled in after the pipeline completes)_
