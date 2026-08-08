# Lotus Care Website — Build Plan 2.0

A refinement pass over the executed Plan 1. The goal is to make the brand *show up properly* across the site — more brand colour, the sketched shape dividers used where they fit, the full-width lotus-pattern band, and lotus SVG motifs instead of the current flatter treatment — plus a set of specific fixes (two misbehaving carousels, Benefits cards, the Human Rights / MDT / Safety page layout).

Source of truth for *intent*: the handwritten "Plan 2.0" (8 Aug 2026). Source of truth for *the codebase* (tokens, existing components, real assets): the repo.

---

## How to use this document

- This is the **spec of record** that feeds the existing two-phase workflow (Planning → Pipeline). It does not replace it. **One card per cycle = one branch = one PR.** Branch names are given in each card.
- In Phase 1, reference the specific card (e.g. `@docs/build-plan-2.md` → card `M2`) and translate its acceptance criteria into `tasks/todo.md`. Do not plan multiple cards in one cycle.
- Plan 1 is **done**; its foundations (colour tokens, width system, lotus SVG, blobs) already exist in the repo. Build on them — do not rebuild them.

## Standing rules (apply to every card, both phases)

- **Colours:** read the **real** brand tokens from the repo (the Tailwind 4 `@theme` block / `globals.css` / logo SVG). Any hex printed in this document are **placeholders — do not use them.**
- **Motion:** every animation gated behind `prefers-reduced-motion`.
- **Contrast:** must pass WCAG AA, including text over the lotus pattern, coloured cards, and decorative blobs.
- **Don't rebuild what exists:** the Our Homes carousel is a **fix**, not a rewrite; the Meet-the-team cards are "good, leave the size."
- **Client-pending content is swap-ready:** anything marked DEFERRED lives in a single config, never hardcoded across components, so the future change is a content edit not a refactor.

---

## ASSET SOURCING — assets are in the repo

All brand art (lotus images, logo, divider source, pattern) lives under **`docs/brand-assets/logo/`**. Read the real files from there — do not trace, guess, or use the placeholder hex in this document.

- **The 6 shape dividers** — source from `docs/brand-assets/logo/`. F5 componentises the existing assets; no paper-to-vector step needed.
- **The full-width lotus band** — the lotus/pattern art is in `docs/brand-assets/logo/`; F6 tiles it. Confirm the exact filenames in Phase 1, but the assets are there.

---

# FOUNDATION CARDS (do these first)

## F5 — Shape-divider component set
`branch: feat/shape-divider-components`

**Problem:** Plan 2.0 wants "one of the 6 shape dividers used where it seems fit." They aren't a reusable component yet.
**Scope:** Turn the 6 sketched dividers into one reusable, themeable divider component (or a small family).
**Approach:**
- Use the real lotus/divider art under **`docs/brand-assets/logo/`**. Build each as an inline SVG that scales to full width with no layout shift.
- Single component with a `variant` (which of the 6) and a `colour` prop bound to brand tokens — not per-use hardcoding.
- Any motion gated behind `prefers-reduced-motion`.
**Acceptance criteria:**
- [ ] All 6 dividers available from one component, selectable by prop, sourced from `docs/brand-assets/logo/`.
- [ ] Colours come from brand tokens; no hardcoded hex.
- [ ] Full-width, responsive, zero CLS; AA contrast where a divider carries text/edges over content.
- [ ] Storybook story showing all 6.
**Depends on:** assets in `docs/brand-assets/logo/`. **Blocks:** G2, M2, CR3.

## F6 — Full-width lotus-pattern band
`branch: feat/lotus-band-component`

**Problem:** Plan 2.0 asks for a full-width rectangle of the lotus pattern in brand colours (p.1 sketch) as a recurring section device.
**Scope:** A full-bleed band component tiling the lotus pattern, with configurable band colour(s).
**Approach:**
- Use the lotus/pattern art under **`docs/brand-assets/logo/`**. Tile seamlessly at any width; respect the two-tier width system from Plan 1 for any inner content.
- Colour via tokens (teal / purple variants + neutral spacer as sketched).
**Acceptance criteria:**
- [ ] Seamless full-width tiling, no visible seams, zero CLS.
- [ ] Band colour(s) driven by tokens; AA contrast for any overlaid text.
- [ ] Storybook story (teal, purple, neutral-spacer variants).
**Depends on:** assets in `docs/brand-assets/logo/`. **Blocks:** CR3 (Option C), any section using the band.

## F7 — Lotus decorative-background utility
`branch: feat/lotus-bg-utility`

**Problem:** Hero and navbar both want the lotus SVG as a low-opacity decorative layer; doing it per-page duplicates work.
**Scope:** A small utility/component that places the existing lotus SVG (from Plan 1's F3) as a positioned, low-opacity background layer.
**Approach:**
- Reuse the existing lotus mark; expose opacity, position, and scale. Keep it decorative (`aria-hidden`).
**Acceptance criteria:**
- [ ] Reuses the existing lotus SVG — no new mark.
- [ ] Low-opacity layer never drops text contrast below AA.
- [ ] Used by M1 (hero) and NB1 (navbar).
**Depends on:** Plan 1 F3. **Blocks:** M1, NB1.

---

# GLOBAL CARDS

## G1 — Brand-colour saturation pass
`branch: feat/brand-colour-pass`

**Problem:** Plan 2.0: "Use more of the brand colours throughout the whole website." The site currently under-uses purple/teal.
**Scope:** Audit pages/components for neutral-heavy areas and apply brand tokens intentionally (not everywhere for its own sake).
**Approach:**
- Work from the real token scales. Add brand colour to section backgrounds, accents, headings, and dividers where it strengthens hierarchy without hurting readability.
- Keep body-copy surfaces calm; concentrate colour on structure and accents.
**Acceptance criteria:**
- [ ] Measurable increase in purposeful brand-colour use across key pages.
- [ ] All colour from tokens; AA maintained everywhere.
- [ ] No "rainbow" over-use — colour still reads as intentional.
**Depends on:** Plan 1 F1. **Blocks:** nothing.

## G2 — Apply shape dividers across pages
`branch: feat/apply-shape-dividers`

**Problem:** Dividers exist (F5) but aren't placed. Plan 2.0 leaves placement to the agent "where it seems fit."
**Scope:** Introduce dividers at natural section breaks across the main page, Careers hub, and the Safety page.
**Approach:**
- Use F5. Choose variants/colours per context; avoid stacking dividers so close they read as noise.
**Acceptance criteria:**
- [ ] Dividers placed at sensible section boundaries on the main pages.
- [ ] Consistent usage (not a different treatment every section).
- [ ] AA + reduced-motion respected.
**Depends on:** F5. **Blocks:** nothing.

---

# MAIN PAGE CARDS

## M1 — Hero lotus / logo background
`branch: feat/hero-lotus-bg`

**Problem:** Plan 2.0: hero should have the lotus alternate SVG behind it at low opacity, and the original logo at low opacity alongside the blobs, "so it looks better."
**Scope:** Add two decorative layers to the hero — lotus-alternate SVG behind, original logo low-opacity near the blobs.
**Approach:** Use F7. Keep both layers decorative and behind content; tune opacity so the hero headline stays AA.
**Acceptance criteria:**
- [ ] Lotus-alternate SVG sits behind the hero at low opacity.
- [ ] Original logo appears low-opacity alongside the blobs.
- [ ] Hero text remains AA; layers are `aria-hidden`; reduced-motion respected.
**Depends on:** F7. **Blocks:** nothing.

## M2 — Our Homes: themed border
`branch: feat/our-homes-themed-border`

**Problem:** Plan 2.0: the Our Homes cards want a themed border using the pattern the shape divider uses, or brand colours (see p.2 sketch — thick brand border with a dashed inner edge).
**Scope:** Restyle the Our Homes card/border only.
**Approach:** Derive the border treatment from the F5 divider pattern (or brand tokens if the pattern doesn't lend itself to a border). Match the sketched thick-border + inner-dash look.
**Acceptance criteria:**
- [ ] Border uses the divider pattern or brand tokens (no hardcoded hex).
- [ ] Matches the sketched intent; AA maintained.
**Depends on:** F5. **Blocks:** nothing.

## M3 — Our Homes: carousel sync + column margin
`branch: fix/our-homes-carousel`

**Problem:** Plan 2.0: "Carousel doesn't look right, not synced with number of houses. Also the margin should be bigger between the two columns." (8 homes.)
**Scope:** Fix the carousel's item/indicator count and the inter-column spacing. Reuse the existing carousel — this is a fix, not a rewrite.
**Approach:** Bind the carousel to the real house count (indicators/paging reflect 8). Increase the gap between the two columns.
**Acceptance criteria:**
- [ ] Carousel paging/indicators match the actual number of houses.
- [ ] Larger, correct margin between the two columns; no overlap at any breakpoint.
- [ ] Existing carousel reused, not rebuilt.
**Depends on:** nothing. **Blocks:** nothing.

## M4 — Meet the team: blob pass (minor)
`branch: feat/meet-the-team-blobs`

**Problem:** Plan 2.0: "Size of cards is good, use more blobs (maybe)." Card size stays; blobs are a *maybe*.
**Scope:** Optionally add more blob decoration to the Meet-the-team section. Do **not** change card size.
**Approach:** Add tasteful blob accents behind/around the section. If it clutters, leave as-is — this card is discretionary.
**Acceptance criteria:**
- [ ] Card size unchanged.
- [ ] Blobs added only if they improve the section; AA + reduced-motion respected.
**Depends on:** Plan 1 F4. **Blocks:** nothing.

## M5 — Our Board: match team-card size (minor)
`branch: fix/our-board-card-size`

**Problem:** Plan 2.0: "Have it the same size as the cards in [Meet the team]."
**Scope:** Resize Our Board cards to match the Meet-the-team card size.
**Approach:** Reuse the team-card sizing tokens/component so the two stay consistent.
**Acceptance criteria:**
- [ ] Our Board cards match Meet-the-team card dimensions.
- [ ] Consistent across breakpoints.
**Depends on:** nothing. **Blocks:** nothing.

---

# NAVBAR CARD

## NB1 — Navbar logo + typography
`branch: fix/navbar-logo-typography`

**Problem:** Plan 2.0: "FIX logo and typography (use SVG!!)." The navbar logo/wordmark currently isn't the clean SVG treatment.
**Scope:** Replace the navbar logo with the proper SVG and correct the navbar typography.
**Approach:** Use the real logo SVG (via F7's utilities where useful). Align type to the site's type scale; ensure crisp rendering at all sizes.
**Acceptance criteria:**
- [ ] Navbar logo is the correct SVG, crisp at all sizes.
- [ ] Navbar typography corrected and consistent with the type system.
- [ ] AA contrast in the navbar.
**Depends on:** F7 (optional). **Blocks:** nothing.

---

# CAREERS HUB CARDS

## CR1 — "Why work with us" carousel fix
`branch: fix/careers-why-work-carousel`

**Problem:** Plan 2.0: "Carousel doesn't work properly." (Two adjacent notes are DEFERRED — see D1, D2.)
**Scope:** Fix the "Why work with us" carousel behaviour. Leave the stats and "In their own words" copy alone (deferred).
**Approach:** Diagnose and fix the broken carousel (paging/scroll/responsiveness — confirm the actual bug in Phase 1).
**Acceptance criteria:**
- [ ] Carousel works correctly across breakpoints.
- [ ] No change to deferred copy (D1, D2).
**Depends on:** nothing. **Blocks:** nothing.

## CR2 — Benefits cards rebuild
`branch: feat/benefits-cards-rebuild`

**Problem:** Plan 2.0: "Cards should be changed completely. The colours are good, but they are small but lack character." (See p.4 sketch — brand-coloured cards, faint lotus pattern behind.)
**Scope:** Redesign the Benefits cards — keep the brand colours, make them larger and give them character (pattern/iconography/hierarchy).
**Approach:** Rebuild the card: bigger footprint, stronger type hierarchy, faint lotus pattern behind (reuse F6/F7 art), brand-coloured per the sketch. Keep the existing benefit copy/data.
**Acceptance criteria:**
- [ ] Cards visibly larger with clearer hierarchy and more character.
- [ ] Brand colours retained via tokens; faint lotus pattern behind stays AA.
- [ ] Existing benefit content preserved.
**Depends on:** F7 (pattern), optionally F6. **Blocks:** nothing.

## CR3 — Human Rights / MDT / Safety page revamp
`branch: feat/safety-page-revamp`

**Problem:** Plan 2.0: infographic "animation is alright but missing something"; the **text part "does not look good at all"** — needs shape dividers, better margins/spacing, better info display; "make him sketch some options" (done — see Appendix A). Team part is good; change only if the revamp cascades.
**Scope:** Rework the text layout of the Safety page and refine the infographic. Adopt one of the three sketched layout directions.
**Approach:**
- Pick a layout from Appendix A (A: divider-segmented · B: two-column editorial · C: card-and-band hybrid). Confirm the direction with the client/user in Phase 1.
- Apply F5 dividers and (for Option C) the F6 band. Fix margins/spacing/measure so the text reads well.
- Refine the infographic — identify the "missing something" (labels, motion polish, hierarchy, brand colour) and address it; keep reduced-motion support.
- Touch the team section only if the revamp forces it.
**Acceptance criteria:**
- [ ] One Appendix-A direction implemented, confirmed in Phase 1.
- [ ] Text layout uses dividers, corrected margins/spacing, and a comfortable measure.
- [ ] Infographic refined; animation still gated behind reduced-motion; AA throughout.
- [ ] Team section unchanged unless the revamp required it (noted in the PR if so).
**Depends on:** F5 (all options), F6 (Option C). **Blocks:** nothing.

---

# DEFERRED — client content pending (build/leave swap-ready)

- **D1 — "A culture built on Respect" stats.** Plan 2.0: change later depending on client feedback. Keep the current values in a single config so the future update is a content edit.
- **D2 — "In their own words".** Plan 2.0: can change later, "doesn't look half-bad." Leave as-is for now; keep the content swap-ready.

---

# Sequencing

**Foundations first:** `F5` → `F6` → `F7` (all read art from `docs/brand-assets/logo/`).
Then global (`G1`, `G2`), then page cards (`M1`–`M5`, `NB1`, `CR1`–`CR3`) in any order, respecting each card's `Depends on`.
`D1`/`D2` are no-build-now.

---

# Appendix A — Safety page layout options (sketched)

Three candidate directions for the Safety page text section. Pick one in Phase 1 (confirm with client). All three keep the revamped infographic at the top.

**Option A — divider-segmented.** Each pillar (Human Rights Committee / MDT / Safety) is its own full-width block, separated by an F5 shape divider. Calm, editorial, generous vertical rhythm. Best when the copy is moderate and you want a clean, unhurried read. Lowest risk.

**Option B — two-column editorial.** A narrow left column holds the pillar label (sticky as you scroll its section); the wider right column holds the content, with dividers between rows. Most scannable — best if the text is dense. Slightly more layout work; watch the mobile collapse (label stacks above content).

**Option C — card-and-band hybrid.** The three pillars become brand-coloured panels sitting on the F6 full-width lotus band, infographic above. Most visual character and the strongest brand presence, but the busiest — needs careful contrast management for text on the coloured panels over the band (AA is the constraint to watch).

*(Rendered wireframes were produced during planning; retrace to the real components — dividers from F5, band from F6, colours from tokens. The hex in any exported sketch are placeholders.)*
