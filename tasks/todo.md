# Card: Issue #77 — Change navbar logo

Branch: `feat/issue-77-navbar-logo`
Pipeline variant: `fix` (adopt-only asset swap, no new architecture)

## Problem

`Navbar.tsx:69-71` renders a hand-built lockup — `LotusMark` icon plus two
hand-typed `<span>`s ("LOTUS CARE" / "ENHANCED LIVING"). The client has supplied
the real logo lockup as SVG. Replace the hand-built version with the client asset,
in both the colour and white variants.

## Source assets (verified present, real vectors)

| Variant | File | Facts |
|---|---|---|
| Colour | `docs/brand-assets/Logo/Lotus Care Logo - Colour.svg` | 36 paths, `viewBox="0 0 526.24 141.34"`, no background `<rect>` → transparent ✅ |
| White | `docs/brand-assets/Logo/Lotus Care Logo - White.svg` | 36 paths, same viewBox, transparent ✅ |

Aspect ratio 526.24 / 141.34 = **3.723**.

## Known traps (found during planning)

1. **Class-name collision.** Both SVGs define `.cls-1` … `.cls-4` in an internal
   `<style>` block. SVG `<style>` is document-global, not shadow-scoped. A scrolled
   page renders `LogoDark` (navbar) *and* `LogoWhite` (footer) at once, so the two
   rule sets would fight and one logo would render in the wrong palette.
   → Prefix classes per variant (`.lc-logo-colour-1`, `.lc-logo-white-1`, …).
2. **`LogoWhite` is shared with the footer** (`Footer.tsx:24`, `h-12 w-auto`).
   Editing the component changes the footer too. Assumed desirable (consistency —
   see #96); flagged for the user, not silently scoped away.
3. **Optical size change.** Today's lockup sets its own 14px caps text next to the
   mark. In the client SVG the wordmark is baked in, so at `h-10` (40px) the text
   renders smaller than it does now. Height may need bumping — decide by
   measurement, not by eye (lessons #2, #10).
4. **Do not retoken the SVG fills.** Client SVG uses `#096972 / #18a8b2 / #61c3d7 /
   #e6f4f9`; repo tokens are the near-but-not-equal `#0d6a70 / #1badb2 / #54c7d6 /
   #eef9fb`. The supplied asset is authoritative — keep its own hex.
5. **`LotusMark` stays.** Still used by `HeroSection`, `CareersHero`, `BenefitCard`.
   Only the *lockup* components change.

## Scope

- `src/components/logo-dark/LogoDark.tsx` — replace body with inlined colour SVG
- `src/components/logo-white/LogoWhite.tsx` — replace body with inlined white SVG
- Copy both SVGs into the repo source tree as the components' content

Out of scope: `LotusMark`, navbar layout/behaviour, the scroll swap logic, footer layout.

## Acceptance criteria — all verified in a real browser (Chromium, dev server)

- [x] AC-1 Top of page: navbar logo computed fills = `rgb(255,255,255)` only → white lockup
- [x] AC-2 Scrolled: navbar logo computed fills = `#e6f4f9 / #18a8b2 / #096972 / #61c3d7` → colour lockup
- [x] AC-3 No background `<rect>` in either source; renders transparent over teal (top) and white (scrolled)
- [x] AC-4 No text nodes remain — both components are pure `<svg>`, hand-typed spans deleted
- [x] AC-5 **Trap 1 proven handled.** Scrolled, with navbar + footer both mounted:
      navbar = 4 brand hexes, footer = white only. `<style>` removed, so no collision possible
- [x] AC-6 Ratio **3.723** at 375 / 768 / 1440 — exactly the viewBox ratio (526.24/141.34), all three
      viewports, both variants. Navbar 148.9×40, footer 178.7×48. No squash, no CLS
      (`<svg>` + viewBox reserves its box before paint — no image request to wait on)
- [x] AC-7 Wordmark cap height measured **11.5px** at `h-10` (via `getBBox()` × 0.283 scale).
      Previous hand-built lockup was `text-sm` = 14px font → ~10.1px cap.
      **Planning trap 3 was wrong in direction**: the client lockup renders slightly *larger*,
      not smaller. No height bump needed
- [x] AC-8 `npx tsc --noEmit` clean, `eslint --quiet` clean, `npm run build` green (16 routes)

## Review

Both lockups are now the client artwork, inlined as SVG components.

**What changed**
- `LogoDark.tsx` / `LogoWhite.tsx` — bodies replaced with the client vectors (39 elements each:
  36 paths + 3 polygons), generated mechanically from the source SVGs
- Components now take `SVGProps<SVGSVGElement>`, so `className` still flows through unchanged
  and every existing call site works untouched

**Why the `<style>` block was flattened into `fill=` attributes**
Both source SVGs ship the same `.cls-1`…`.cls-4` selectors. SVG `<style>` is document-global,
so a scrolled page (navbar colour + footer white, both mounted) would have had the two rule sets
overwrite each other. Flattening to per-element attributes removes the failure mode entirely
rather than working around it with prefixed class names.

**Accessibility**
The old lockup got its accessible name from the literal "LOTUS CARE" / "ENHANCED LIVING" spans.
Pure SVG would have left the home link nameless, so both components carry
`role="img"` + `aria-label="Lotus Care — Enhanced Living"`.

**Colours kept as supplied**
Client hexes (`#096972 / #18a8b2 / #61c3d7 / #e6f4f9`) sit near but not on the repo tokens
(`#0d6a70 / #1badb2 / #54c7d6 / #eef9fb`). The supplied asset is authoritative — not retokened.

**Scope note for review**
`LogoWhite` is shared with `Footer.tsx:24`, so the footer logo changed too. Treated as desirable
(consistency, cf. #96). Say the word if the footer should keep the old lockup.

`LotusMark` untouched — still used by `HeroSection`, `CareersHero`, `BenefitCard`.
