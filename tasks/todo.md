# P5 — "Meet the Team" bigger presence

Card: `docs/build-plan.md` → **P5** · branch `feat/home-team-scale` · depends on F1, F2 (both done) · pairs with P6.

## Diagnosis

"Feels too small" has three concrete causes, not a vague one:

1. Grid opens to **4 columns at `xl`** with `gap-6` → 17 members render as a dense low strip.
2. Avatar is **64px** — smaller than `BoardSection`'s 80px on the same page.
3. Cards carry **only name + role**. No department, no bio, nothing to give a card height.

Chosen concept: **photo-forward grid** — cap at 3 columns, large photo, add a department chip in the
established alternating teal/purple style, add a 2-line bio excerpt from the existing `bio` field.
No data-model change. Filter logic untouched.

Plus: place the (currently unused) `<Blob>` behind the section, making P5 its first real adopter and
closing **F4**'s last open acceptance criterion.

## Must not break

- [ ] **C-1** — `key={activeDept}` grid remount that replays the `animate-fade-up` stagger on filter change — preserve or consciously replace.
- [ ] **C-2** — Mobile filter-pill scroll-fade hint (`sm:hidden`, hardcoded `right-0 top-0 bottom-4 w-8` offsets) — re-tune to the new vertical rhythm, it is tied to the current pill row height.
- [ ] **C-3** — A **single wrappable element** around the `<Image>` / initials fallback, so P6 can drop `<LotusPhotoMask>` in without re-doing P5's layout.
- [ ] **C-4** — `TeamModal` is **shared with `BoardSection`** — out of scope, do not touch. Same for `BoardSection` and `src/data/team.ts`.
- [ ] **C-5** — `alt={member.name}` preserved on every image; initials-gradient fallback preserved for missing `image`.
- [x] **C-6** — Empty `bio` values (e.g. Alan Doyle, Claire Maher in `src/data/team.ts`) must collapse cleanly — no empty line, no ragged card heights. *Resolved structurally, not compensated: user feedback (2026-08-05) removed the bio excerpt from the card entirely — descriptions belong in `TeamModal`, which already renders `bio` with a "Bio coming soon." placeholder. No card renders `bio` now, so an empty string can no longer cause height variance. The 58px ragged spread from the first verification pass is moot — its cause (an optional `<p>` block) no longer exists.*

## Tasks

- [ ] `src/components/team-card/TeamCard.tsx` — photo 64px → ~144px; add department chip (`w-12 h-12 rounded-xl`-family accent, `bg-primary/15 text-primary` ↔ `bg-purple-600/15 text-purple-600`, alternated by index); add `line-clamp-2` bio excerpt; padding to `p-6 sm:p-8`. Keep `rounded-2xl` + `border-gray-100` + `shadow-sm`/`hover:shadow-md` + `.card-hover`. **No top border** (rejected in C4).
- [ ] Pass the alternation index from `TeamSection` (it already maps with `i` for the stagger delay) — no new data field.
- [ ] Handle **empty `bio`** gracefully — `src/data/team.ts` has empty strings (e.g. Alan Doyle, Claire Maher); the excerpt must collapse, not render an empty line or ragged card heights.
- [ ] `src/components/team-section/TeamSection.tsx` — grid to `sm:grid-cols-2 lg:grid-cols-3` (drop `xl:grid-cols-4`), widen gap, increase section rhythm. Keep `<Container>` at default `width="wide"`.
- [ ] Add `<Blob>` behind the section (positioning context + clipping so it can't cause horizontal overflow). Colour via the token-restricted prop, default opacity.
- [ ] `next/image` sizing at 144px — set explicit dimensions + a correct `sizes` so there is **no CLS** and no blurry upscale if source assets are small.
- [ ] `stories/sections/TeamSection.stories.tsx` — update existing story (title `Sections/TeamSection`, `layout: "fullscreen"`, `tags: ["autodocs"]`). Refresh/add a `TeamCard` story if one exists.

## Acceptance criteria

From the card:

- [x] **AC-1** — Section reads as a major section. *Revised (2026-08-05, user feedback): the bio excerpt is no longer part of "major section" — the card is now photo + department chip + name + role only; descriptions live in `TeamModal` on click. Reason: a bio excerpt made cards with empty `bio` data render narrower/shorter than siblings, and the description was already fully available in the modal, so showing a duplicate truncated copy on the card added nothing. Measured: grid computes 3 columns at 1440px, photo renders 144px, department chip renders on all 17 cards, 0 bio excerpts present (by design).*
- [x] **AC-2** — Category filters all work. *Measured card counts match the data exactly: All 17 · Management 6 · Services 2 · Quality 2 · Clinical 3 · HR 3 · Finance 1.*
- [x] **AC-3** — Responsive with no horizontal overflow. *Measured `scrollWidth == clientWidth` at 390 / 768 / 1440.*

Carried over from F4 (because P5 now ships the first real `<Blob>`):

- [x] **AC-4** — Text over/near the blobs passes **WCAG AA**. *Measured from rendered pixels: section title over the teal-tinted area is 5.24:1 @390px and 5.88:1 @768/1440 (needs 3:1 as large text). Filter pills overlap no blob; cards are opaque white. The blob introduces no AA failure. See "Follow-up raised" below for a separate pre-existing issue found while measuring.*

Standing rules:

- [x] **AC-5** — Reduced motion respected. *Measured under `reducedMotion: reduce`: 19 animated elements, 0 still transparent, max animation-duration 0.00001s — the existing global rule covers everything, no bespoke override added.*
- [x] **AC-6** — No hardcoded brand hex. *grep clean on both changed component files.*
- [x] **AC-7** — No CLS. *Measured CLS 0.0000 @390px and 0.0017 @1440px (threshold 0.1). Explicit `next/image` `width`/`height` + `sizes="144px"`. Upscale concern retired — source assets are 584×584, so 144px is a downscale.*

## Pipeline note — Security stage skipped

User decision this cycle: P5 is a static, frontend-only visual change (no backend, no user input, no
network calls, no secrets, no server code), so the Security stage is skipped. Route is
Tech Lead → plan-validator → Worker ×3 → Tester → Quality → Gate.

**This exemption is per-card, not standing.** `N1` ("Have Your Say") is the one card in the build plan
that touches backend/infra — a Route Handler, an email-sending service, honeypot + rate-limiting, and
a safeguarding signpost. Security **must** run for N1. `P3` also warrants a look if the homes video
ends up loaded from a third-party host.

## Verification

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run build-storybook`
- [ ] Manual: each of the 7 filters; 3 breakpoints; reduced-motion emulation shows end state; contrast sampled over blob areas; no horizontal overflow from the blob.

## Follow-up raised (NOT part of P5)

**Pre-existing site-wide AA contrast miss.** While measuring AC-4 I found `text-muted`
`rgb(107,114,128)` on `warm-bg` `rgb(248,246,243)` = **4.48:1**, against the 4.5:1 AA floor for
normal-size text. It misses by 0.02.

- **Not caused by P5** — at 1440px the subtitle overlaps no blob at all and still measures 4.48:1.
  P5 changed no colour tokens and did not touch `globals.css` or `SectionTitle`.
- **Scope** — affects every `SectionTitle` subtitle site-wide, i.e. essentially every page.
- **Decision (user, this cycle)** — do not fix inside P5. Darkening `--color-muted` shifts secondary
  text on every page and belongs in one reviewable diff against the F1 token system, not in a
  team-section redesign.
- **Action** — to be written up as its own card against F1.

## Risks

- **Image payload.** 17 photos rendered at 144px instead of 64px. Sources are 584×584 so quality is safe (downscale), but `sizes` must be right or the browser fetches more than it needs.
- **Filter + stagger interaction.** The remount trick is the most likely silent breakage; taller cards make the reflow more visible.
- **Blob overflow.** Decorative shapes commonly cause horizontal scroll on mobile if not clipped.

## Review

_(to be filled in after the pipeline completes)_
