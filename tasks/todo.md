# Session handoff (2026-09-09)

The user is starting a fresh Claude Code session (to pick up newly-installed
skills — skills only load at session start, so this is a genuinely new session,
not a `--resume`). Read this section first, then continue with the card below.

## What happened last session

- Ran a full brand/design-skill audit of the site against the `lotus-care` skill
  (tokens, components, consistency rules). Findings and outcomes:
  - **Fixed & merged, PR #124** (`fix/hero-geometry-consistency`) — unified hero
    padding/min-height across `HeroSection` and both `CareersHero` variants.
  - **Fixed & merged, PR #125** (`refactor/button-chip-primitives`) — extracted
    shared `Button`/`Chip` components, converted 16+5 call sites site-wide.
  - **Investigated, not a bug:** the logo SVG's hex values differ slightly from
    `globals.css`'s design tokens — confirmed via `tasks/todo.md`/git history to
    be an intentional, already-documented decision (client's supplied asset is
    kept authoritative). Do not "fix" this.
  - **Explicitly deferred, not current priority:** the rainbow per-home colours
    in `src/data/homes.ts` / `HomesCarousel` / `HomeModal`. Leave alone unless
    asked.
- A stray `revert-125-refactor/button-chip-primitives` branch appeared on the
  remote (GitHub UI artifact from a misclick attempting to revert #125) — this
  has been **deleted**. #125 is correctly merged into `main` and should not be
  reverted.
- Cleaned up local git branches/worktrees (all merged work removed locally).
  Remote branch cleanup was requested but **descoped to local-only** per the
  user — the ~35 stale merged remote branches on `origin` are still there,
  untouched, if that's revisited later.
- Pulled the GitHub "Lotus Care" Projects board. Open issues carrying the
  "Model of Care" label: **#117, #119, #120, #121, #122** — see roadmap below.

## Environment notes (avoid re-discovering these)

- **Git push:** the SSH key at `~/.ssh/id_ed25519` is passphrase-protected and
  no agent is unlocked, so direct SSH push fails with "Permission denied
  (publickey)". Working alternative — push over HTTPS using the already
  `gh`-authenticated token, **without** touching the repo's committed git
  config: `git -c url."https://github.com/".insteadOf="git@github.com:" push
  origin <branch>`. Reuse this for every push/fetch against `origin` unless the
  user says they've unlocked the SSH agent themselves.
- **Browser verification:** neither `chromium-cli` nor the Chrome extension is
  available in this sandbox (user declined the Chrome extension). Use
  Playwright instead: `npx playwright install chromium` (no `--with-deps` —
  sudo isn't available, but the plain browser download works fine), then
  `npx playwright screenshot --viewport-size=W,H --wait-for-timeout=1200 <url>
  <file>.png` for visual checks. Always start the dev server first and leave
  it running per standing practice.
- This project has **no `.claude/agents/orchestrator` (or PM, reviewer, etc.)**
  actually defined, despite CLAUDE.md's Phase 2 describing that pipeline. Past
  cycles (this one included) were run as direct Planning → build → verify by
  the main assistant, delegating heavier/independent implementation work to
  `general-purpose` subagents (often in an isolated git worktree via
  `isolation: "worktree"`), not literal orchestrator/PM agent types.

## Agreed roadmap: Model of Care issues, in order

Each issue is its own Planning → Pipeline cycle — one branch, one PR — per this
repo's convention (confirmed by branch-naming history: `feat/issue-<N>-...`).
Full per-card specs are below. **Only #119 is confirmed to build; #121/#120/#117/#122
are planned but not yet approved to start** — ask before each cycle.

1. **#119 — 24-hour curriculum** → §Card 119 below.
2. **#121 — ADT** → §Card 121 below.
3. **#120 — Human Rights** → §Card 120 below.
4. **#117 — Remove Safeguarding section** → §Card 117 below. After #120, so
   safeguarding messaging is never dropped between merges (it moves from its
   own section into a Human Rights bullet). Kept as its own PR, not combined
   with #120 — explicit user preference, even though the two are
   content-coupled.
5. **#122 — Testimonials → Model of Care** → §Card 122 below. Most
   structurally invasive; last for that reason.

## Page-wide design plan (all 5 cards read this first)

Read via `lotus-care` + `frontend-design` skills against the real page
(`src/app/quality/model-of-care/page.tsx`) and its data (`src/data/quality.ts`).
This is **not new visual language** — every card below reuses an existing
component and existing tone rules already proven elsewhere on this exact page.
No new components are needed for any of the 5 cards.

**Section order, end state (after all 5 land):**

```
Hero (unchanged)
Pillars nav — QualityPillars, 3 pillars after #117 (curriculum · adt · human-rights)
Divider teal
Curriculum        — intro block + KeywordCards (teal)         [#119]
Divider purple
ADT               — intro block + Timeline (4 steps)
                    + specialty Chips + "Make a Referral" CTA  [#121]
Divider teal
Human Rights      — intro block, CircularCycle (5), purpose
                    KeywordCards (teal), approach KeywordCards
                    (purple, incl. "Safeguarding from Harm"),
                    Champions FeatureSlab (purple), Governance/
                    Culture split cards                        [#120 content refresh]
Divider purple
Testimonials      — TestimonialCard grid, 4 quotes             [#122, new — replaces
                                                                  the old Safeguarding
                                                                  slot in the DOM order]
Team Strip (unchanged)
CTA strip (unchanged)
```

Safeguarding's `ProvisionalSection` + its preceding purple Divider are removed by
#117; #122 fills that same slot with the new Testimonials section, so the
teal/purple divider alternation down the page is undisturbed — no other section's
Divider colour needs to change.

**Component reuse map — do not invent new components:**

| Card | Content shape | Component |
|---|---|---|
| #119 | intro + 3 term/description points | `KeywordCards` tone=`teal` (matches Human Rights' own `purposeKeywords` teal — keeps the two teal sections visually paired, purple sections in between/after) |
| #121 | 4 numbered sequential steps | `Timeline` (`src/components/timeline/`), horizontal on desktop — this **is** a real sequence (referral → committee → 12-week assessment → report), so numbering is warranted per the frontend-design skill's rule against decorative numbering |
| #121 | 7-item flat specialty list, no per-item description | `Chip` pills (tone `purple`, `sm`), wrapped — **not** `KeywordCards`, which requires a `description` per item and the issue gives none; inventing filler descriptions would violate "no lorem ipsum / no invented copy" |
| #121 | "Referrals" CTA | `Button` variant `primary`, `href="/referrals"`, label **"Make a Referral"** — reuses the exact label already used by this page's own closing `CareersCTAStrip` secondary CTA, so the same action reads identically wherever it appears on this page |
| #120 | 5-step cycle | `CircularCycle` (already wired to `humanRightsFramework`) — content edit only, no structural change |
| #120 | 6-item practice list | `KeywordCards` tone=`purple` (already wired to `approachKeywords`) — content edit only |
| #122 | 4 testimonials, varied length | `TestimonialCard` grid (same component `/testimonials/page.tsx` already uses), inside `Reveal`+`Container`, matching this page's own white/warm-bg section rhythm — not a single `QuoteCard` band, since there are 4 distinct quotes, not one |

**Tone/colour rhythm:** two brand colours only (teal-700, purple-600), alternating
by section per §5 of the `lotus-care` skill — already respected by the existing
Human Rights section (teal purpose → purple approach → purple Champions slab).
Curriculum picks up teal (first in sequence), ADT picks up purple, continuing the
alternation into Human Rights' own internal teal/purple pairing. No mid-teal button
fills, no emoji, no new gradients — everything sources hex values from the real
`@theme` tokens already in `globals.css`, never the placeholder hexes in
`docs/build-plan.md`.

**Motion/contrast/media (standing rules, apply to every card):** `Reveal` +
`prefers-reduced-motion` on every new block (all components above already gate this
internally — no bespoke animation is being added). Body text stays `text-foreground`
or `text-muted` per each tone's measured AA contrast (see `KeywordCards`' own code
comment on this — `text-muted` fails AA on the purple-50 tint, already handled).
Photos keep empty `alt` (decorative) and `sizes` as already patterned in
`ProvisionalSection`. No new CLS — all photo slots are `aspect-[4/3]` `fill` images
exactly like every existing section.

---

## Card 119: Issue #119 — 24-hour curriculum changes

Branch: `feat/issue-119-24-hour-curriculum`
Pipeline variant: `full` (new content section, not a pure adopt-only fix)
Status: **confirmed — this is the next thing to build.**

Card 1 of 5 in the Model of Care roadmap above.

## Problem

`/quality/model-of-care`'s "24-Hour Curriculum" section (`id="curriculum"`) is
currently a `ProvisionalSection` placeholder carrying a "Full detail coming soon"
badge (`src/app/quality/model-of-care/page.tsx:137`). Issue #119 supplies real,
final copy — the placeholder should be replaced with a fully built section.

## Source content (from issue #119, verbatim)

- Subtitle: "Learning doesn't stop when the school day ends"
- Intro (2 paragraphs, given in the issue)
- 3 points, each a term + one-sentence description: Everyday opportunities,
  Building independence, Learning together

## Scope

- `src/data/quality.ts`:
  - Add a `curriculumContent` export (subtitle + intro paragraphs + a
    `Keyword[]` of the 3 points), following the existing `humanRightsContent`
    pattern (same file, same shape family).
  - Update the `curriculum` entry in `modelOfCareSections`: set `provisional:
    false`. Decide whether `intro` there (used by `ModelPillars`' summary card
    and `Eyebrow`/heading in the section itself) needs updating to match the new
    copy, or stays as the shorter summary version it already is (the pillars nav
    card needs a short summary, not the full intro — keep it short, source the
    long-form copy from the new `curriculumContent` export only).
- `src/app/quality/model-of-care/page.tsx`:
  - Replace `<ProvisionalSection id="curriculum" />` with a fully built section,
    matching the Human Rights section's established two-part pattern: (1) an
    intro block — `Eyebrow` + `SectionTitle`-style heading + subtitle + intro
    paragraphs + the existing photo (`/images/stock/warm-home.jpg`) in the same
    2-column layout `ProvisionalSection` already uses (keeps visual rhythm
    identical to every other section on this page — same blobs, same
    `Reveal`/`reveal-scale` treatment); (2) a `KeywordCards` block below it for
    the 3 points, matching how Human Rights renders its "purpose"/"approach"
    keyword lists. Keep the `id="curriculum"` anchor and `ANCHOR_OFFSET` class
    for the pillars-nav jump link.

Out of scope: ADT, Human Rights, Safeguarding, Testimonials sections (separate
cards); `ModelPillars`' summary text (short, unaffected); any other page.

## Acceptance criteria

- [ ] `curriculumContent` added to `src/data/quality.ts` with the issue's real
      copy (subtitle, intro paragraphs, 3 keyword points) — no lorem ipsum, no
      "coming soon" language left for this section.
- [ ] `modelOfCareSections`'s `curriculum` entry has `provisional: false`.
- [ ] The rendered section no longer shows the `ProvisionalSection` "Full detail
      coming soon" badge.
- [ ] Visual/structural consistency with the rest of the page: same `Eyebrow`
      numbering (`01 — 24-Hour Curriculum`), same blob/`Reveal` treatment as
      other sections, `KeywordCards` styled identically to the Human Rights ones
      (teal tone, to alternate with Human Rights' existing teal/purple pair —
      confirm tone choice doesn't clash given ADT/Human Rights will also add
      their own `KeywordCards`/visual blocks later).
- [ ] The `#curriculum` jump link from `ModelPillars` still scrolls correctly
      (anchor offset unchanged).
- [ ] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green.
- [ ] Verified in a real browser (dev server) at desktop + mobile widths — no
      layout shift, text passes WCAG AA over the photo/blobs per standing rule.
- [ ] `prefers-reduced-motion` still respected (no new unguarded animation
      introduced).

## Review

(fill in after implementation)

---

## Card 121: Issue #121 — ADT (Admissions, Discharges & Transitions)

Branch: `feat/issue-121-adt`
Pipeline variant: `full`
Status: planned, **not yet confirmed to build** — do this after #119 merges.

Card 2 of 5. Depends on nothing from #119 beyond the shared page shell.

### Source content (from issue #121, verbatim)

- Subtitle: "A caring start"
- Intro (1 paragraph)
- 4-step flow: Referrals & Initial Needs Assessment → ADT Committee →
  12-Week Person-Centred Assessment → Report & Recommendations.

  **Resolved (2026-09-09, user confirmed):** the issue's step-3/step-4
  description text was identical in the source — it belongs to step 4 (it
  describes a report/recommendations output). The paragraph is used for step
  4 only; step 3 gets drafted copy below, marked as **draft pending client
  sign-off**, not final client-supplied text like the other three steps:

  1. Referrals & Initial Needs Assessment — "Referrals are reviewed through an
     Initial Needs Assessment to identify the service owner's needs, risks,
     strengths and assessment requirements."
  2. ADT Committee — "All referrals are considered by the Admission,
     Discharge & Transitions Committee prior to admission. The referring
     agent can select from a menu of clinical and multidisciplinary
     assessments."
  3. 12-Week Person-Centred Assessment — **[DRAFT, confirm with client]**
     "Over the 12 weeks, the multidisciplinary team carries out the agreed
     assessments — observing daily life and gathering clinical, social care
     and health information to build a full picture of the person's needs,
     strengths and preferences."
  4. Report & Recommendations — "A comprehensive assessment report is
     completed at the end of the 12 weeks, incorporating clinical findings,
     social care observations and physical health needs, with clear
     recommendations for ongoing and/or future care and support."
- 7-item clinical specialty list: ASD, ADHD, Developmental Trauma, Attachment
  Difficulties, Personality Disorder, Acquired Brain Injury (ABI), Physical
  Health Needs — no per-item description given
- A "Referrals" CTA button

### Scope

- `src/data/quality.ts`:
  - Add an `adtContent` export: subtitle, intro, `TimelineStep[]` (4 steps,
    `number`/`title`/`description` shape from `src/components/timeline/`), and
    a flat `string[]` of the 7 specialties.
  - Update the `adt` entry in `modelOfCareSections`: `provisional: false`.
    Keep `intro` there short (pillars-nav summary), same rule as #119.
- `src/app/quality/model-of-care/page.tsx`:
  - Replace `<ProvisionalSection id="adt" imagePosition="left" />` with: (1)
    the same intro-block-plus-photo pattern as Curriculum/Human Rights, image
    `/images/stock/clinical-consultation.jpg` (already assigned in
    `modelOfCareSections`); (2) `Timeline` (horizontal, `circleVariant="solid"`)
    for the 4 steps; (3) the 7 specialties as wrapped `Chip` pills (tone
    `purple`, `sm`) under a short subheading, **not** `KeywordCards` (see
    page-wide plan above — no per-item description exists to fill one); (4) a
    `Button` (`variant="primary"`, `href="/referrals"`) labelled **"Make a
    Referral"**, matching this page's own closing CTA strip's secondary button
    label for consistency.

Out of scope: everything on Curriculum/Human Rights/Safeguarding/Testimonials;
the `/referrals` page itself (destination only, not touched).

### Acceptance criteria

- [ ] `adtContent` added to `src/data/quality.ts` — real copy, no invented
      per-specialty descriptions. Step 3's description is the resolved draft
      text above (flag it to the user as draft/pending client sign-off in the
      PR description, since it's the one paragraph in this card that isn't
      verbatim client copy).
- [ ] `modelOfCareSections`'s `adt` entry has `provisional: false`.
- [ ] 4-step `Timeline` renders in issue order, numbered 1–4, horizontal on
      desktop / vertical on mobile (component's existing responsive behaviour).
- [ ] 7 specialties render as chips, purple tone, wrapped, no empty/placeholder
      descriptions anywhere.
- [ ] "Make a Referral" button links to `/referrals`, `primary` variant, `lg`
      size (section-level CTA, per the design system's size rule).
- [ ] Visual rhythm matches the rest of the page (`Eyebrow` `02 — ADT`, blobs,
      `Reveal`).
- [ ] `#adt` jump link from `ModelPillars` still scrolls correctly.
- [ ] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green.
- [ ] Verified in a real browser at desktop + mobile widths — no CLS, WCAG AA
      text contrast.
- [ ] `prefers-reduced-motion` respected.

### Review

(fill in after implementation)

---

## Card 120: Issue #120 — Human Rights content refresh

Branch: `feat/issue-120-human-rights`
Pipeline variant: `fix` (content/wording edit to an already-built section, no
new structure — closer to an "adopt-only" card per CLAUDE.md's `fix` rule)
Status: planned, **not yet confirmed to build** — do this after #121 merges.

Card 3 of 5.

### What's actually changing

`humanRightsContent`/`humanRightsFramework` in `src/data/quality.ts` are
**already built and already carry copy very close to issue #120's** — this
page's Human Rights section is not a placeholder. Diffing the issue against
the live data, the real deltas are:

**Resolved (2026-09-09, user confirmed): rewrite `humanRightsFramework` to
match the issue's exact wording** (not keep the current richer copy). Exact
target text — the 5-step `CircularCycle`, in order:

1. **Human Rights Framework** — "Grounding our services in dignity, human
   rights and equal respect."
2. **Rights in Action** — "Protecting rights, promoting autonomy and
   supporting meaningful daily living."
3. **Oversight & Assurance** — "Reviewing practice, feedback and outcomes to
   ensure rights are upheld." (drop the current "Rights " prefix on the label)
4. **Rights-Based Response** — "Responding to concerns with actions that
   strengthen rights protection." (issue has a typo, "Right-based response" —
   normalise casing/hyphenation to match this list's Title Case pattern, same
   as every other label)
5. **Embedding Practice** — "Building a culture of learning, respect and
   person-centred practice." (drop the current "Rights Culture & " prefix)

`approachKeywords` (6-item "how we put rights into practice" list) — two
wording deltas the issue explicitly calls for, description text unchanged
since it already fits:

- item 5: live "Protection from Harm" → **"Safeguarding from Harm"** (keep
  existing description "Protection through a rights-based lens" — deliberate
  rename: this is the exact phrase that lets #117 remove the standalone
  Safeguarding section without dropping the word "safeguarding" from the
  page).
- item 6: live "Transparency & Accountability" → **"Open & Accountable"**
  (keep existing description "Transparent and accountable decision-making at
  all levels.").

No structural change: `CircularCycle`, `KeywordCards` (teal purpose / purple
approach), `FeatureSlab` Champions band, and the Governance/Culture split
cards all stay exactly as built. `purposeKeywords` is untouched (issue
doesn't address it).

### Scope

- `src/data/quality.ts` only: reword `humanRightsFramework` (all 5
  label+description pairs, verbatim per above) and `approachKeywords` (items
  5 and 6 only) per the decision above. No `page.tsx` changes expected.

Out of scope: everything else on the page; the `purposeKeywords` list (issue
doesn't touch it); `humanRightsContent.champions`/`.governance`/`.culture`.

### Acceptance criteria

- [ ] `humanRightsFramework`'s 5 labels/descriptions match the resolved
      wording above exactly (issue's phrasing, typo normalised on item 4).
- [ ] `approachKeywords` item 5 reads "Safeguarding from Harm" (or equivalent
      case matching the rest of the list's Title Case terms).
- [ ] `approachKeywords` item 6 reads "Open & Accountable".
- [ ] No other content on the page changes.
- [ ] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green.
- [ ] Verified in a real browser — the two reworded cards render correctly,
      no layout shift from the new label lengths.

### Review

(fill in after implementation)

---

## Card: Human Rights card redesign + Model of Care animation retrofit

Branch: `redesign/human-rights-cards`
Pipeline variant: `full` (new components + page rewiring, not a pure adopt-only fix)
Status: **confirmed — approved via visual-companion mockups this session, building now.**
Not part of the numbered #119–#122 roadmap (no GitHub issue) — user-initiated design
polish on top of #120 (now merged as PR #128). Runs before #117 since it touches the
same Human Rights section; #117 doesn't depend on it either way.

### Problem

User feedback, verbatim: "Purpose of the Committee, Our Approach, and Human Rights
Champions don't look good. They need to be somewhat cards based, but they just have
the same design as other cards" — Purpose/Approach both render the generic
`KeywordCards` component (also used by Curriculum, same page), and Champions has no
card structure at all (a `FeatureSlab` colour panel with loose wrapped pills + a
plain bullet list). Separately: "Animations are not present in almost every
component used in the model of care page, especially stuff that I designed" —
confirmed by reading the code: `CircularCycle` and `Timeline` both drive a real
per-item staggered pop-in (`.pop-item` + `useInView`, established in `globals.css`),
but `KeywordCards`, `FeatureSlab`, and the inline Governance/Culture cards only get a
single wrapping `<Reveal>` that fades the whole block in at once — no per-item
animation. Safeguarding is out of scope (removed in a future card, #117).

### Design (approved via visual-companion mockups)

- **New component `PrincipleCards`** (`src/components/quality/principle-cards/`):
  numbered-bento layout. First item renders full-width ("opener"); the rest render
  in a 2-column grid; if the remainder is odd, the last item also renders
  full-width ("closer") instead of leaving a dangling gap (this was iterated live —
  an earlier version forced a fixed 3-column grid for the remainder and left a
  visible empty cell). Supports term+description items (Purpose, Approach) and
  description-only items (Champions' Responsibilities — the data has no titles for
  these, so none are invented). Large ghost numeral (`aria-hidden`) replaces the
  pill badge as the card's visual anchor — teal-100/purple-100 resting, teal-200/
  purple-200 on hover, white card background, 16px radius, `shadow-sm` resting,
  lift -4px + `shadow-card-hover` + 30%-brand border tint on hover (exact
  lotus-care skill §4 Cards spec). Used only for Purpose/Approach/Champions —
  Curriculum keeps its existing `KeywordCards` untouched (explicit user decision).
- **New component `PrincipleTags`** (same folder): compact numbered tile grid for
  Champions' 6 Focus Areas — no descriptions exist for these in the data, so they
  stay honest as tags rather than being padded into full cards. Uniform 3-column
  grid (6 items divide evenly, no bento asymmetry needed since these are peers,
  not a featured item + rest).
- **Champions section restructure**: `FeatureSlab` trims to intro only (heading +
  one intro sentence + photo — same shell every other page's `FeatureSlab` already
  uses). The 6 focus areas render as `PrincipleTags` and the 5 responsibilities as
  `PrincipleCards` (description-only), both in normal page flow below the panel,
  not crammed inside it. No changes needed to `src/data/quality.ts` — the existing
  `champions.keywords`/`champions.bullets` arrays already have the right shape,
  this is presentation-layer only.
- **Animation retrofit, whole page** (not just Human Rights): every card/list grid
  gets the same per-item staggered pop-in already used by `CircularCycle`/
  `Timeline` (`pop-item` + `useInView`, 90ms per item):
  - `KeywordCards` (Curriculum's cards) — stagger added internally, no visual change.
  - New small `SpecialtyChips` client component replaces ADT's flat chip row.
  - New small `SplitCards` client component replaces the inline Governance/Culture
    pair in `page.tsx` — same side-by-side layout with the centre divider rule,
    just adds the missing entrance animation.
  - `PrincipleCards`/`PrincipleTags` (new) get the same stagger built in from the
    start.

### Scope

- `src/components/quality/principle-cards/PrincipleCards.tsx` (new)
- `src/components/quality/principle-cards/PrincipleTags.tsx` (new)
- `src/components/quality/principle-cards/index.ts` (new, barrel)
- `src/components/quality/keyword-cards/KeywordCards.tsx` (edit — add stagger only)
- `src/components/quality/specialty-chips/SpecialtyChips.tsx` (new)
- `src/components/quality/split-cards/SplitCards.tsx` (new)
- `src/app/quality/model-of-care/page.tsx` (edit — wire up all of the above)

Out of scope: `src/data/quality.ts` content (no wording changes), Curriculum's
visual design, Safeguarding, any other page.

### Acceptance criteria

- [x] `PrincipleCards` renders the opener/2-col/closer bento pattern correctly for
      both 6-item lists (Purpose, Approach — opener + 2x2 + closer, no gap) and the
      5-item Champions Responsibilities list (opener + clean 2x2, no closer needed
      since the remainder is even).
- [x] `PrincipleCards` supports description-only items (no term/heading rendered)
      for Champions Responsibilities, without a separate component.
- [x] `PrincipleTags` renders Champions' 6 Focus Areas as a uniform numbered tile
      grid, no invented descriptions.
- [x] Curriculum's `KeywordCards` visually unchanged, only gains per-item stagger.
- [x] Champions' `FeatureSlab` shows only heading + intro + photo — no keywords or
      bullets rendered inside the coloured panel.
- [x] Every card/tile/chip across Curriculum, ADT, and Human Rights (Purpose,
      Approach, Champions, Governance/Culture) does a staggered pop-in on scroll
      into view, matching `CircularCycle`/`Timeline`'s existing motion — not a
      single flat fade for the whole block. Safeguarding excluded.
- [x] All new/changed text passes WCAG AA (all new card text sits on white
      background, well above AA — `text-foreground`/`text-teal-800`/`text-purple-700`
      on `#ffffff`).
- [x] Ghost numerals are `aria-hidden="true"` (decorative, redundant with DOM order
      and heading text).
- [x] `prefers-reduced-motion` respected — verified via `useInView`'s source
      (returns `inView: true` immediately under reduced motion) and the existing
      global `.pop-item`/`.reveal` CSS override; no new bespoke animation added
      outside that established mechanism.
- [x] `npx tsc --noEmit` clean, `eslint` clean (scoped to changed files — repo-wide
      `eslint .` also flags ~14k pre-existing warnings/errors in `.next/dev/**`
      build artifacts, unrelated to this change), `npm run build` green (25 routes).
- [x] Verified in a real browser (dev server + Playwright screenshots) at
      1440px and 390px — no horizontal overflow, bento grid never leaves a
      dangling empty cell at any item count (6 items → opener+2x2+closer, 5 items →
      opener+2x2).

### Review

**Bug found and fixed during verification:** the description-only `PrincipleCards`
variant (Champions' Responsibilities — no `term`) had no reserved space for the
ghost numeral on the paragraph itself, only the (absent) heading — so at 390px
width the numeral overlapped the first line of text on cards 02–05. Term-based
cards were unaffected (the numeral sits at the card's top, same row as the
heading; the paragraph starts below it). Fixed by giving description-only
paragraphs `pr-10` (regular) / `pr-16 sm:pr-0` (bookend, where `sm:max-w-[70%]`
already clears it at sm+) — this is exactly the kind of thing lessons.md #2 warns
about ("a visual claim without a number/screenshot is a guess"); it wasn't visible
in the desktop screenshot, only mobile.

**Also fixed during implementation (not a late bug, a design-time catch):**
`KeywordCards`/`PrincipleCards`/`PrincipleTags` all combine a hover transition
(lift + shadow) with the new `pop-item` reveal transition. Putting both on the
same element would mean the reveal's per-item `transitionDelay` (up to ~450ms for
the last item) leaks into the hover transition too, since inline `transition-delay`
applies to every transitioning property on that element — a card revealed last
would take an extra ~450ms to start its hover-lift. Fixed by splitting each into
an outer wrapper (reveal only: opacity/transform/delay) and an inner card (hover
only: its own independent transition, no delay). `SpecialtyChips`/`SplitCards`
didn't need this split — neither `Chip` nor the original Governance/Culture cards
carry a hover transition.

**Champions restructure:** `FeatureSlab` now renders only `heading`/`intro` (no
`keywords`/`bullets` props passed) — the panel's closing sentence ("...supporting
colleagues and raising concerns as they arise:") still ends with a colon from the
original client copy, which read naturally when it introduced the pills/bullets
immediately below inside the same panel. It now introduces content two sections
further down the page instead. Left as-is (client wording, not touched without
being asked), but flagging it — worth a client check on whether that colon still
reads right, or should become a period.

**Files changed:**
- `src/components/quality/principle-cards/{PrincipleCards,PrincipleTags,index}.ts(x)` (new)
- `src/components/quality/specialty-chips/{SpecialtyChips,index}.ts(x)` (new)
- `src/components/quality/split-cards/{SplitCards,index}.ts(x)` (new)
- `src/components/quality/keyword-cards/KeywordCards.tsx` (stagger + hover-split only)
- `src/app/quality/model-of-care/page.tsx` (wired all of the above)
- No changes to `src/data/quality.ts` — confirmed no content edits were needed.

**Verification evidence:** `npx tsc --noEmit` clean, `npm run build` green (25
routes), `npx eslint` clean on every changed file. Playwright screenshots at
1440×9200 and 390×15000 (tall single-viewport, forces all `IntersectionObserver`-
gated content into view per lessons.md #20) confirm: Purpose/Approach render the
6-item bento correctly in both tones, Champions' Focus Areas render as 6 uniform
purple tags, Responsibilities render as the 5-item bento (opener + clean 2x2),
Governance/Culture unchanged, no horizontal overflow at 390px (confirmed exact
390px image width, not clipped).

**Not yet done:** branch not committed/pushed, no PR opened yet — pending user's
in-browser review (dev server running on `localhost:3000`).

---

**2026-09-12 addendum — ticket audit found real content bugs, fixed on this same
branch before committing:**

Scanned all 5 "Model of Care" labelled GitHub issues directly (not the local
`todo.md`, which had paraphrased rather than quoted some of them) and diffed each
against the live `src/data/quality.ts`. Findings, all user-confirmed:

- **#121 ADT — real bug, fixed.** `adtContent.intro` was invented text, not
  sourced from the issue at all. Replaced with the issue's actual sentence: "Our
  admissions process makes sure every placement starts with a deep understanding
  of the person – and a clear plan for their future."
- **#120 Human Rights — missing content, fixed.** The issue specifies a subtitle,
  "Rights at the heart of care", never implemented. Added it (rendered the same
  way Curriculum/ADT render theirs — bold tagline directly above the intro
  paragraphs). The existing (non-matching) intro paragraphs were kept as-is per
  user decision — treated as still-valid legacy copy, not replaced with the
  issue's shorter version.
- **"Purpose of the Committee" + its 6 keywords — removed entirely, per client
  confirmation via user.** Traced via `git log` to issue #91/#112 (the original
  standalone Human Rights page, predating this whole Model of Care initiative) —
  not backed by any current open ticket. Removed the `SectionTitle` + `PrincipleCards`
  block from `page.tsx` and the `purpose`/`purposeKeywords` fields from
  `humanRightsContent` in `quality.ts`. Human Rights section now flows Framework →
  Approach → Champions directly.
- **#119 Curriculum — checked, no discrepancy.** Matches the issue exactly.
- **#122 Testimonials — not yet built, but caught a planning gap.** The old
  `todo.md` Card 122 only captured the 3 new quotes' attribution labels
  ("Stakeholder comment", "Family member" ×2), never the actual verbatim quote
  text. Re-fetched from the issue directly — the real quotes are now known for
  whenever this card is built.
- **All 5 issues are still OPEN on GitHub** despite #119/#120/#121 being merged —
  none of the 3 merge PRs auto-closed their issue (missing `Closes #N`). Worth
  closing #119/#120/#121 once this branch also merges, and deciding #117/#122's
  build order next.

**Environment note:** deleting `.next/dev` while the dev server is still running
(rather than killing it first) leaves the server serving 500s indefinitely — it
doesn't self-heal. Killed by port and did a full `rm -rf .next` + restart instead.

**Re-verified after these fixes:** `npx tsc --noEmit` clean, `npx eslint src/`
clean, `npm run build` green (25 routes), Playwright screenshot confirms ADT's
new intro, Human Rights' new subtitle, and Purpose's removal all render
correctly with no gap in the section flow.

---

**2026-09-12, second addendum — structural fix: Framework + Approach unified
into one panel.**

User feedback: "Human Rights, then human rights framework, then our approach...
it seems like 3 different sections, I dont want that." Diagnosis: each of the
three got its own full centred `SectionTitle` (same big-heading treatment as
top-level Curriculum/ADT), so they read as peer sections rather than one section
with parts. Brainstormed two options via the visual companion (unified tint panel
vs. a connecting rail reusing `Timeline`'s rail motif) — user picked the panel.

Implementation: replaced the two separate `SectionTitle`-headed blocks with one
`rounded-3xl` panel containing both, each demoted to a plain `h3` (matching the
same sub-heading weight already used for Champions' "Focus Areas"/
"Responsibilities" this session) with a hairline `border-t` divider between them.

**Real bug caught mid-implementation:** the panel was first built with
`bg-warm-bg`, which is the wrong token — `src/app/quality/layout.tsx:26` wraps
the *entire* `/quality/*` route group in `bg-warm-bg` ambient, a fact missed
earlier in this same session (I'd incorrectly concluded the page's ambient was
plain white, based on `body`'s global background only, without checking the
route-group layout). Against that ambient, a `bg-warm-bg` panel is invisible —
`bg-white` is what actually reads as a distinct floating panel here. Confirmed
via screenshot before and after: first version showed no visible panel boundary
at all; corrected version shows a clear white card against the warm backdrop.
This also retroactively explains the visible cream/white alternation in earlier
screenshots this session that was noted-but-not-investigated at the time.

**Re-verified:** `tsc`/`eslint`/`build` clean, Playwright at 1440px and 390px —
panel reads as one bounded unit top-to-bottom, no dangling gap at either end, no
horizontal overflow on mobile.

---

**2026-09-12, third addendum — "Human Rights Champions" removed entirely.**

User: "You can also remove the human rights champions section." Interpreted as
the whole thematic unit — the `FeatureSlab` intro panel plus the Focus Areas
(`PrincipleTags`) and Responsibilities (`PrincipleCards`) blocks that were framed
by it, not just the intro panel alone (those two blocks have no independent
meaning without the Champions framing). Same rationale as removing "Purpose of
the Committee" — confirmed issue #120 never mentions Champions either, so this
is more legacy content predating the current ticket set.

Removed: the `FeatureSlabGroup`/`FeatureSlab` block, the Focus Areas and
Responsibilities blocks, the now-unused `FeatureSlab`/`FeatureSlabGroup`/
`PrincipleTags` imports, and `humanRightsContent.champions` from `quality.ts`.
`PrincipleTags` component itself is left in place (unused for now, not deleted —
it's a generic primitive, not Champions-specific, may be reused later).

Human Rights section now flows: intro → Framework+Approach panel → Governance/
Culture → Safeguarding. Verified via Playwright: clean transition, no gap or
orphaned content at the seam. `tsc`/`eslint`/`build` all clean.

---

**2026-09-12, fourth addendum — "Governance & Oversight"/"Culture of
Rights-Based Practice" cards removed too.**

Same pattern, same rationale (predates #120, no ticket backs it, client doesn't
want it). Removed the `SplitCards` usage + its wrapping `Blob`/`Container`/
`Reveal` div from `page.tsx`, the now-unused `SplitCards` import, and the
`governance`/`culture` fields from `humanRightsContent` in `quality.ts`.
`SplitCards` the component is left in place (generic 2-block primitive, not
deleted, matching `PrincipleTags` being kept unused too).

Human Rights section now flows: intro → Framework+Approach panel → (straight
into the purple `Divider`) → Safeguarding. Verified via Playwright: panel closes
cleanly right after the "Open & Accountable" card, no gap. `tsc`/`eslint`/`build`
all clean.

---

**2026-09-12, fifth addendum — client-supplied photo refresh (all 5 photo slots
on this page replaced).**

Client dislikes the existing stock photos on this page, including the hero.
User connected the "claude.ai Google Drive" MCP connector this session
(authenticated via `/mcp`) and pointed at their "Lotus Care → Stock photos for
website use" Drive folder — 15 candidate images (10 Pexels-sourced JPGs with
verifiable IDs in the filename, 5 Canva "Untitled design" PNGs of unclear
original source). Downloaded and visually reviewed all 15 (per lessons.md #7 —
looked at the actual image, not just the filename) before choosing.

Picked only from the 10 verifiable-Pexels set, so `CREDITS.md` stays accurate —
skipped the 5 Canva exports since their original source/license can't be
confirmed. Resized to 1600px wide (matching the repo's existing convention) and
saved into `public/images/stock/`:

- `caring-embrace.jpg` (Antoni Shkraba, pexels.com/photo/6288105) → Hero
- `learning-through-play.jpg` (Mikhail Nilov, pexels.com/photo/8923363) → Curriculum
- `assessment-session.jpg` (Pavel Danilyuk, pexels.com/photo/8422150) → ADT
- `guided-choice.jpg` (Ksenia Chernaya, pexels.com/photo/8535183) → Human Rights
- `supervised-play.jpg` (Pavel Danilyuk, pexels.com/photo/8422249) → Safeguarding

**Important: these stock images (`dignity-activity.jpg`, `warm-home.jpg`,
`clinical-consultation.jpg`, `community-friends.jpg`, `team-meeting.jpg`) are
shared across many other pages** (careers/*, quality/mdt, quality/safety-
improvement, testimonials) — confirmed via grep before touching anything. Only
this page's own references were repointed (`src/data/quality.ts`'s
`modelOfCareSections` image fields, the hero `image` prop, and the hardcoded
Human Rights intro `src` in `page.tsx`) — the shared files and every other
page's usage are untouched.

`CREDITS.md` updated with proper Pexels attribution for all 5 new images.
Verified in-browser at 1440px and 390px (exact 390px width confirmed, no
overflow) — all 5 slots show real, warm, non-cliché imagery consistent with the
lotus-care skill's imagery guidelines (no posed hand-holding, no pity framing,
genuine disability representation in the hero). `tsc`/`eslint`/`build` all
clean.

---

## Card 117: Issue #117 — Remove Safeguarding section

Branch: `redesign/human-rights-cards` (folded into this branch, not its own —
user asked for it mid-session, after #120 was already merged)
Pipeline variant: `fix` (removal only, no new content)
Status: **done.**

Card 4 of 5.

### Scope

- `src/app/quality/model-of-care/page.tsx`:
  - Remove `<ProvisionalSection id="safeguarding" imagePosition="left" />` and
    its preceding `<Divider variant="purple" />` (the #122 Testimonials
    section takes this DOM slot next card, keeping divider alternation intact
    — don't also remove the divider that follows it).
  - Update the hero `subtitle`. **Resolved (2026-09-09, user confirmed).**
    From: "How we support every person day to day — a 24-hour curriculum,
    considered transitions, a rights-based approach, and safeguarding
    throughout." To: **"How we support every person day to day — a 24-hour
    curriculum, considered transitions, and a rights-based approach."**
  - Update `metadata.description` — same clause, same treatment. From:
    "Lotus Care's model of care — the 24-hour curriculum, transitions, human
    rights, and safeguarding that shape how we support every person." To:
    **"Lotus Care's model of care — the 24-hour curriculum, transitions, and
    human rights that shape how we support every person."**
- `src/data/quality.ts`:
  - Remove the `safeguarding` entry from `modelOfCareSections`.
  - Narrow `ModelOfCareSection["id"]` union to drop `"safeguarding"`.
  - Confirm (grep) `safetyImprovementTeam` is not used by this page before
    touching it — it isn't, per this session's read; leave it alone, it likely
    belongs to `/quality/safety-improvement`.
- No change needed to `QualityPillars`/`ModelPillars`: it already derives
  pillar count and the "foundation" strip text from `modelOfCareSections`, so
  dropping one entry automatically renders 3 pillars in the existing
  `sm:grid-cols-3` layout (`QualityPillars`'s 4-column branch simply stops
  applying) — verify this visually, don't add new column logic.

Out of scope: #120's content (must already be merged — safeguarding messaging
must already live in the "Safeguarding from Harm" Human Rights bullet before
this card starts); Testimonials (#122, separate PR, separate cycle).

### Acceptance criteria

- [x] Safeguarding section and its section-specific `ProvisionalSection`
      instance are gone from the rendered page.
- [x] Hero subtitle and `metadata.description` no longer mention safeguarding
      as its own pillar, but the page still reads coherently (word
      "safeguarding" may still legitimately appear inside Human Rights copy
      from #120 — that's correct, not a leftover).
- [x] `ModelPillars` renders exactly 3 pillars (curriculum, adt, human-rights),
      3-column layout, no broken grid from the now-odd pillar count.
- [x] `ModelOfCareSection["id"]` type no longer includes `"safeguarding"`;
      `npx tsc --noEmit` catches any stale reference automatically.
- [x] `eslint` clean, `npm run build` green.
- [x] Verified in a real browser — no divider needed at the seam any more since
      Champions/Governance/Culture were also removed this session (see
      addenda above); Approach panel now flows straight into Team Strip and
      the closing CTA, no gap.

### Review

**Scope grew slightly beyond the original spec, caught during implementation:**

- `ProvisionalSection` (the helper component `Safeguarding` was the last user
  of) became fully dead code once removed — deleted the whole function, not
  just its call site, plus a stale doc-comment on `CurriculumSection` that
  referenced it by name.
- **Real bug caught in the browser, not in the original spec:** the pillars
  infographic's heading still read "Four Parts, One Model" after dropping to 3
  pillars — the original card's acceptance criteria checked pillar *count* and
  grid layout but not this specific heading string. Fixed to "Three Parts, One
  Model". Also updated two now-inaccurate code comments (one said "the four
  Model of Care sections", one said "same four words") — comments only, no
  behaviour change, but worth keeping accurate since the next person reading
  this file would otherwise be misled.
- The originally-planned branch (`feat/issue-117-remove-safeguarding`, its own
  PR) didn't happen — user asked for this mid-session on top of everything
  else already in progress on `redesign/human-rights-cards`, so it's bundled
  into that same branch/PR instead.

Verified: `tsc`/`eslint`/`build` all clean. Playwright screenshots confirm the
hero, pillars strip, and page tail all read correctly with no orphaned
Safeguarding references (the word "safeguarding" still appears exactly where
it should — the Human Rights "Safeguarding from Harm" item and general CTA
copy — confirmed via `curl | grep` context check, not just visual glance).

---

## Card 122: Issue #122 — Testimonials → Model of Care

Branch: `redesign/human-rights-cards` (folded into this same branch, not its own
— built in the same session as everything else above)
Pipeline variant: `full` (new section + route-redirect structural change)
Status: **done — last card on the Model of Care board.**

Re-scanned issue #122 fresh from GitHub (2026-09-12) rather than trusting this
file's older summary — full verbatim text confirmed unchanged from what's
recorded below. Card 5 of 5 (last one on the Model of Care board), the most
structurally invasive.

### Source content (from issue #122, verbatim)

- "Testimonials' own page should be deleted, and instead moved as a last
  section in the Model of Care page" — per **explicit user instruction**,
  "deleted" is being interpreted as *unreachable*, not removed from the
  codebase: the user expects to reuse `/testimonials` and its data later.
- "Include John's full testimonial" — this is the existing `jw` entry in
  `serviceOwnerTestimonials` (`src/data/testimonial.ts`) — John = the `JW`
  initials already there. Reuse as-is, don't re-enter it.
- Plus 3 new quotes from the SO & Stakeholder Satisfaction Survey, verbatim:
  1. "Staff are caring, kind and genuinely know the children and young
     people. They treat our family with respect and keep us informed. Our
     child is happy, settled and thriving – we feel truly blessed to be a
     part of the Lotus Care family." – **Stakeholder comment**
  2. "The environment is welcoming, homely, clean and safe. My child loves
     living here and takes part in lots of activities. It is great to see
     them so happy and included." – **Family member**
  3. "The progress my son has made towards toileting independence after many
     years of unsuccessful attempts is ground breaking. The staff never gave
     up on him and believed in what he could achieve" – **Family member**

  Attributed by role only, never by name, per the site's existing convention
  (`teamTestimonials` already does this: `name: "Team Leader"`).

### Design decisions (confirmed this session)

- **Section placement — resolved.** The old plan anchored this to a purple
  `Divider` that no longer exists (removed along with Champions/Governance
  earlier this session). New plan: insert a **new** `<Divider variant="purple" />`
  right after the Human Rights section's closing `</section>`, then the new
  Testimonials section, then Team Strip — continuing the page's teal/purple
  rhythm (last one before Human Rights was teal).
- **Animation — extends this session's retrofit.** Every other card grid on
  this page (Curriculum, ADT, Purpose/Approach/Focus-Areas/Responsibilities —
  now just Approach) got the same staggered pop-in `CircularCycle`/`Timeline`
  use, instead of a single flat `Reveal` fade. The Testimonials grid should
  match — needs a small new client component (`TestimonialGrid`, same shape
  as this session's `SpecialtyChips`/`SplitCards`: `useInView` + `.pop-item`
  per card, 90ms stagger), not a plain `Reveal`-wrapped map.

### Scope

- **Routes** (`redirect()` pattern, exactly as `src/app/careers/page.tsx:82`
  already does — leave the page/data files in place below the redirect, same
  as that precedent):
  - `src/app/testimonials/page.tsx`: add `redirect("/quality/model-of-care#testimonials")`
    as the first line of the component, before its existing JSX (which stays,
    unreachable, per the same-file precedent, with a comment explaining why).
  - `src/app/testimonials/[slug]/page.tsx`: **no redirect added here.** Detail
    pages stay reachable via direct link, matching the `/careers` precedent
    where only the hub/index redirects.
- **Data** (`src/data/testimonial.ts`):
  - Add the 3 new quotes above as plain `Testimonial` objects (from
    `@/data/careers` — the shape `TestimonialCard` already accepts). `name`
    is the role string, `initials` derived from it: "Stakeholder comment" →
    "SC", "Family member" → "FM" (used for both family-member quotes;
    duplicate initials across two cards is fine — avatars aren't unique
    identifiers elsewhere on the site either).
  - Export a new `modelOfCareTestimonials: Testimonial[]` combining John's
    entry (converted to plain `Testimonial` shape: `name`/`initials` from
    `jw.initials`, `role` from `jw.role`, `quote` from `jw.quote`, the opening
    paragraph — clamped visually, not truncated in data) + the 3 new ones.
    Don't repurpose `serviceOwnerTestimonials` in place — `/testimonials`'s
    own (now-unreachable-from-nav but still-live) JSX still reads that array.
- **New component** `src/components/quality/testimonial-grid/TestimonialGrid.tsx`
  ("use client"): takes `items: { testimonial: Testimonial; clampQuote?: boolean; action?: ReactNode }[]`,
  renders each as a `TestimonialCard` with its own `pop-item` stagger, matching
  `SpecialtyChips`'s exact pattern.
- `src/app/quality/model-of-care/page.tsx`:
  - After Human Rights' closing `</section>`: `<Divider variant="purple" />`,
    then a new `<section id="testimonials" className={ANCHOR_OFFSET}>`
    containing `SectionTitle` (reusing `/testimonials/page.tsx`'s existing
    title/subtitle copy verbatim — "Testimonials" / "Real voices from the
    people we support, in their own words.") + `TestimonialGrid`.
  - John's card gets `clampQuote` + an `action` "Read more" link to
    `/testimonials/jw` (same pattern `/testimonials/page.tsx` already uses)
    rather than repeating his full 11-paragraph story inline.
  - Then Team Strip, unchanged.
- `src/app/page.tsx`:
  - Line 89: `ctaHref="/testimonials"` → `ctaHref="/quality/model-of-care#testimonials"`.
- Do **not** add a "Testimonials" pillar to `ModelPillars`/`modelOfCareSections`
  — it isn't one of the "Three Parts" of the model, it's a closing proof
  section, same relationship Team Strip already has to the rest of the page.

Out of scope: deleting any file; changing `/testimonials/[slug]`'s JSX at all
(it stays exactly as built, still directly reachable); any other page linking
to bare `/testimonials` (grepped fresh this session — only the homepage CTA
found, no nav/footer links).

### Acceptance criteria

- [x] `/testimonials` redirects to `/quality/model-of-care#testimonials`
      (never 404, never renders its old standalone grid) — verified: `curl`
      shows `307` → `http://localhost:3000/quality/model-of-care#testimonials`.
- [x] `/testimonials/jw` (and any other slug) still renders its full detail
      page directly — unchanged, unlinked from nav, but not redirected —
      verified: `curl` shows `200`, no redirect.
- [x] `/testimonials`'s page/data files still exist in the repo, unreachable
      via its own route but intact.
- [x] New Model of Care testimonials section renders John's excerpted
      testimonial (with a "Read more" link to `/testimonials/jw`) plus the 3
      new role-attributed quotes verbatim, styled with the existing
      `TestimonialCard` component, initials "SC"/"FM" per the resolved
      decision above.
- [x] New purple `Divider` separates Human Rights from Testimonials.
- [x] Testimonials grid does a staggered pop-in per card (`TestimonialGrid`),
      not a single flat block fade — matches this session's animation
      retrofit standard for every other grid on this page.
- [x] Homepage's testimonials CTA (`src/app/page.tsx:89`) now points at the
      new in-page section and lands correctly — confirmed via
      `curl | grep href="/quality/model-of-care#testimonials"`.
- [x] No orphaned links anywhere in the site still point at bare `/testimonials`
      expecting the old standalone grid's content — repo-wide grep confirmed
      only the homepage CTA and `/testimonials/[slug]` (out of scope, untouched)
      referenced it.
- [x] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green.
- [x] Verified in a real browser at desktop + mobile widths — no CLS (exact
      390px screenshot width confirmed), `prefers-reduced-motion` respected
      (inherits the same global `.pop-item`/`useInView` mechanism verified
      earlier this session).

### Review

**Full pipeline used for this card:** Explore agent verified exact current
file state → Plan agent drafted the concrete implementation → reviewed the
draft against the real `TestimonialCard` rendering behaviour before
implementing (see refinement below) → wrote the plan to a plan file → user
approved → implemented directly.

**One real refinement caught during the review pass, before any code was
written:** the draft plan had the 3 new quotes' `role` field set to `""`
(since `Testimonial.role` is a required string and the issue gives only one
descriptor per quote, e.g. "Family member", not a separate name+role pair).
`TestimonialCard` renders `role` unconditionally in its own paragraph, so an
empty string would have left a blank second line under every one of the 3 new
cards. Caught by re-reading how `/testimonials/page.tsx` already renders
John's own card (`name: testimonial.initials, role: testimonial.role` — i.e.
name=initials, role=the human-readable descriptor) — an already-shipped
convention, just not the obvious first reading of the issue. Fixed by mapping
"Stakeholder comment"/"Family member" into `role` and "SC"/"FM" into `name`,
matching John's own card exactly. Confirmed visually — no blank lines, all 4
cards render consistently.

**One real lint error caught during implementation** (not anticipated by the
plan): a plain `<a href="/testimonials/jw">` for John's "Read more" action
tripped `@next/next/no-html-link-for-pages` — the old `/testimonials/page.tsx`
version of this same link uses a *dynamic* `href` (a template literal), which
the rule doesn't statically resolve, so it never got caught there. This new
one uses a static string matching a real route, so the rule flagged it. Fixed
by using `next/link`'s `Link` instead, matching the convention
`/testimonials/[slug]/page.tsx` already uses for its own "All Testimonials"
back-link.

**Files added:** `src/components/quality/testimonial-grid/{TestimonialGrid,index}.ts(x)`.
**Files changed:** `src/data/testimonial.ts` (3 new quotes + `modelOfCareTestimonials`
export), `src/app/testimonials/page.tsx` (redirect), `src/app/quality/model-of-care/page.tsx`
(new section + imports + `Link`), `src/app/page.tsx` (CTA repoint).
No files deleted, `serviceOwnerTestimonials`/`careersHearQuote`/`teamTestimonials`
untouched, no "Testimonials" pillar added to `ModelPillars`.

**This closes out every card on the Model of Care board** (#117, #119, #120,
#121 already merged/closed; #122 done here). Not yet committed — pending
review.

---

**2026-09-12, follow-up fix — user feedback: JW's quote cut mid-sentence, and
card heights were inconsistent ("looks awful").**

Researched real-world patterns first (21st.dev, Dribbble) per the user's
explicit ask — confirmed the standard approach for uneven testimonial content
is exactly what this component already had the capability for: a fixed-height
card + `line-clamp` on the quote, avatar pinned to the bottom via flex. The
bug wasn't a missing design, it was inconsistent + miscalibrated application:

1. Only John's card had `clampQuote` applied; the 3 survey cards didn't —
   fixed by applying `clampQuote: true` uniformly to all 4 in
   `testimonialItems` (`src/app/quality/model-of-care/page.tsx`).
2. John's card's underlying `quote` text was his full ~700-character opening
   paragraph (reused from `serviceOwnerTestimonials[0].quote`), so
   `line-clamp-4` cut it off wherever the 4th line happened to wrap — never a
   clean sentence. Fixed with a curated ~250-character excerpt
   (`johnExcerpt` in `src/data/testimonial.ts`) that ends on a complete
   sentence on its own; his full story is still one click away via "Read
   more".

**Second bug found only by measuring, not screenshotting** (per lessons.md
#2 — a visual claim without a number is a guess): fixing #2 above still left
mobile-width cards clipping mid-word. Wrote a small throwaway Playwright
script (`page.evaluate`, cloned each `blockquote` with the clamp removed to
measure natural wrapped height) rather than guessing pixel widths, and got
real numbers: the longest quotes need **6 wrapped lines** at the 308px mobile
card width, but only **3** at the 626px desktop column width — `line-clamp-4`
was simultaneously too tight for mobile and barely relevant on desktop.

Fixed `TestimonialCard.tsx` (shared component — also used by
`TestimonialMarquee`, checked before touching it) with a responsive clamp:
`line-clamp-6 md:line-clamp-4` — strictly ≥ the old value at every breakpoint,
so `TestimonialMarquee`'s existing behaviour can only show *more* text than
before, never less (no regression risk there).

That alone still clipped mid-line, though — a second measurement pass
(`figure`/`blockquote`/`figcaption` real rendered rects, not assumed padding
math) showed the fixed `h-64` card height didn't actually leave room for 6
lines once the figure's own padding and the figcaption's real height were
accounted for (a hand-calculation error on the first attempt — assumed
generous padding, measured tighter reality). Fixed with a responsive height
too: `h-80 md:h-64` — confirmed via the same measurement script that the
blockquote's real available space (206px) now comfortably exceeds what 6
lines need (156px) before re-screenshotting.

**Re-verified after both rounds:** `tsc`/`eslint`/`build` clean. Screenshots
at 390px and 1440px confirm all 4 cards are identical size at each
breakpoint, every quote ends on a complete sentence with no mid-word cuts,
and desktop is visually unchanged from before (its clamp/height values were
already sufficient, only mobile needed the fix).

---

**2026-09-12, second follow-up — "Our Quality & Compliance Team" removed,
hover animation added to testimonial cards ("last thing for this part").**

- Removed the `TeamStrip` section (heading "Our Quality & Compliance Team")
  and its now-unused `TeamStrip`/`humanRightsTeam` imports from
  `src/app/quality/model-of-care/page.tsx`. `humanRightsTeam` the data export
  itself is left in `src/data/quality.ts` (now unused anywhere in the repo,
  confirmed via grep) — kept rather than deleted, same reasoning as
  `PrincipleTags`/`SplitCards` earlier this session: cheap to keep, a real
  team-member dataset, not dead logic. Page now flows Testimonials directly
  into the closing CTA strip.
- Added the site's standard card hover treatment to `TestimonialCard.tsx`
  (shared component — also used by `TestimonialMarquee`, so this is a
  pure addition with no prior hover state to conflict with): `card-hover`
  (4px lift + the brand's `shadow-card-hover`) + `hover:border-primary/30`
  border tint, matching `TeamCard`/`ServiceCard`'s exact existing pattern —
  no new CSS invented.
- **Verified with a real simulated hover**, not just by reading the
  classNames: a small throwaway Playwright script (`figure.hover()`) measured
  `getComputedStyle` before/after. Confirmed `transform` went from `none` to
  `translateY(-4px)`, `box-shadow` became exactly
  `0 8px 24px rgba(0,0,0,0.12)`, and `border-color` picked up the 30%-opacity
  teal tint — all three effects firing correctly, not just present in source.

Re-verified: `tsc`/`eslint`/`build` clean; confirmed via `curl` that "Our
Quality & Compliance Team" text no longer renders; screenshots confirm a
clean Testimonials → CTA strip transition with no gap.

---

**2026-09-12, third follow-up — all dividers on this page are teal only,
saved as a standing rule.**

User: "the divider used should only be the teal one with the white lotus.
Replace the other dividers with the right colors on this page" — plus an
explicit instruction to remember this for future prompts.

- Replaced both `<Divider variant="purple" />` call sites (before ADT, before
  Testimonials) with teal.
- Simplified the local `Divider` helper itself to drop the `variant` prop
  entirely and always render `LotusBand variant="teal"` — so a purple one
  can't be silently reintroduced here later; all 4 call sites are now bare
  `<Divider />`.
- **Verified without eyeballing a giant screenshot**: resized the full-page
  screenshot to a 1px-wide column and scanned for exact teal-700 (`#0D6A70`)
  vs purple-600 (`#761948`) pixel values — found only teal, zero purple, at
  every divider location. Confirmed the closing `CareersCTAStrip`'s purple
  gradient (a different component, not a `Divider`) is untouched and still
  intentionally purple.
- **Saved to persistent memory** (`feedback_model-of-care-divider-color.md`,
  new `MEMORY.md` index — first memory files for this project) since the user
  asked this to be remembered for future prompts, not just fixed once.

`tsc`/`eslint`/`build` all clean.

---

**2026-09-12, fourth follow-up — user asked to confirm DM Sans is actually
being used. It wasn't, site-wide, and not because of anything from this
session.**

Source-level everything looked correct: `next/font`'s `DM_Sans` loader wired
up in `src/app/layout.tsx`, `--font-dm-sans-loaded` defined, `globals.css`'s
`@theme` block setting `--font-sans: var(--font-dm-sans-loaded), ...`, `body`
using `font-family: var(--font-sans)`. Per lessons.md #2 ("a visual claim
without a number is a guess"), checked the actual rendered computed style
instead of trusting the source — `getComputedStyle(document.body).fontFamily`
came back as `ui-sans-serif, system-ui, sans-serif, ...` (a generic fallback
stack), not DM Sans, anywhere on the page. Ruled out the known stale-Turbopack-
cache issue (lessons.md #19) first with a full `.next` wipe + clean restart —
same result, so this was real, not a caching artifact.

**Root cause**: `dmSans.variable` (which defines `--font-dm-sans-loaded`) was
applied to `<body>`'s className, but `globals.css` declares
`--font-sans: var(--font-dm-sans-loaded), ...` on `:root` (`<html>`, body's
*ancestor*). A custom property's `var()` references resolve using what's in
scope at its own declaration's element, not at wherever it's later used —
`--font-dm-sans-loaded` didn't exist yet at `:root`'s scope, so `--font-sans`
computed as invalid *at `:root`*, and that invalid value inherited down
through the entire page (body, headings, every component), silently falling
back to the browser default sans-serif everywhere, on every page of the site
— not just Model of Care.

**Fix**: moved `dmSans.variable` from `<body>` to `<html>` (the same element
`:root` refers to), so `--font-dm-sans-loaded` is in scope when `--font-sans`
is computed. Re-verified with the same computed-style check — every selector
tested (`body`, `h1`/`h2`/`h3`, `p`, `nav`, card text, buttons) now correctly
resolves to `"DM Sans", "DM Sans Fallback", ...`. Confirmed visually too
(distinct DM Sans letterforms now visible, not the generic fallback).

This is a one-line, site-wide fix (`src/app/layout.tsx` only) — affects every
page, not just Model of Care, so flagging it clearly: this was pre-existing,
unrelated to any change made this session, just caught while checking this
page's typography as asked. `tsc`/`eslint`/`build` (all 25 routes) clean.

---

## Card: Issue #92 — MDT page redesign, mirroring Model of Care's layout

Branch: `feat/issue-92-mdt-redesign`
Pipeline variant: `full`
Status: **built, verified, pending user review of screenshots before commit.**

### Source

Issue #92 (heading rename, blocked-on-client video/photos) + a follow-up
comment (2026-09-12) with updated copy for 6 of 8 `HubAndSpoke` discipline
descriptions, a screenshot confirming which section, and a "Recommended
Photos" category list. Separately, the user asked for the whole page's
*layout* to mirror `/quality/model-of-care`'s just-finished structure —
explicitly not touching the `HubAndSpoke` diagram itself.

Full plan brainstormed via harness plan-mode (Explore agent → Plan agent →
review → `AskUserQuestion` → written plan → approved) — plan file was at
`~/.claude/plans/okay-you-can-execute-composed-cascade.md` (now stale/reused
for the next planning cycle, don't trust it after this card).

### Confirmed decisions (via AskUserQuestion before designing)

- No pillars-nav equivalent (MDT has no natural "parts" to link to).
- Dividers teal-only, matching Model of Care's own standing rule (now true
  for both pages, not just one — worth promoting to a site-wide default if a
  third page gets this treatment).
- No bottom photo gallery (dropped in favour of a pure layout match).
- Video: a clearly-marked "Coming soon" placeholder, not a real embed — no
  asset exists.

### What changed

- `src/data/quality.ts`: 6 of 8 `mdtSpokes` descriptions updated verbatim
  from the issue comment (order preserved exactly — it drives `HubAndSpoke`'s
  radial angles). GP and Play Therapy untouched (no new copy given). One
  flagged correction: the client's Nursing text used American
  "person-centered"; normalised to house-style "person-centred" (same
  reasoning as #120's "Right-based response" casing fix).
  `mdtContent.commitment` kept in the data file with a comment noting it's
  now sourced into the closing CTA strip instead of its own section.
- `src/app/quality/mdt/page.tsx`: full rewrite mirroring
  `model-of-care/page.tsx`'s patterns exactly — `Divider` (teal-only),
  `VideoPlaceholder` (new, reuses `VideoTestimonialCard`'s exact play-icon/
  "Coming soon" `Chip` convention, zero network requests), `IntroSection`
  (Curriculum-style 2-col), `InternalMdtSection` (Human-Rights-panel-style:
  `bg-white rounded-3xl` panel holding `HubAndSpoke` — **completely
  unchanged component/invocation** — + a hairline + `PrincipleTags` for the
  5 Approach bullets), `PartnershipSection` (ADT-style: photo+text then
  `PrincipleTags` for the 4 Governance bullets). `TeamStrip` kept (heading
  → "Our Multidisciplinary Team" per the issue) even though Model of Care's
  own got removed — flagged as a judgment call, the 3 named clinicians are
  page-specific real content. New closing `CareersCTAStrip` (MDT never had
  one), folding `mdtContent.commitment`'s sentence into its body.
  `PrincipleTags` (built earlier this session, previously unused anywhere
  since Champions was removed from Model of Care) gets its first real
  second consumer here.
- 3 new photos (`hands-on-support.jpg`, `everyday-connection.jpg`,
  `team-around-the-child.jpg`) + `CREDITS.md` entries. **Explicit
  limitation, not glossed over**: no photo in the client's Drive folder
  shows an actual clinician, therapy session, or multi-professional
  meeting — issue #92's recommended categories have no match in the
  available 15-photo set. Picks are the closest available warm carer+child
  stock, stated as such in the credits comment. Excluded the 4 pexels
  photos already used by Model of Care's own refresh (cross-page variety)
  and all 5 "Untitled design" PNGs (unverifiable source/license, same rule
  as Model of Care). **One thing flagged for review**: `everyday-
  connection.jpg` shows the same two people as Model of Care's hero photo
  (same shoot, different pose) — hard to avoid entirely with only 15 source
  photos across both pages; call it out if it reads as odd side-by-side.

### Verified

- `npx tsc --noEmit` clean, `npx eslint` clean on both changed files,
  `npm run build` green (25 routes).
- Real browser (dev server): screenshots at 1440px and 390px — panel/hairline/
  card-grid treatments match Model of Care's rhythm, `HubAndSpoke` renders
  with its usual radial layout at desktop and stacked list at mobile
  (unchanged from production except the 6 updated description strings), no
  horizontal overflow at 390px, `TeamStrip` heading correct, closing CTA
  strip renders with working links.
- Video placeholder: wrote a throwaway Playwright script checking
  `page.on('request', ...)` for any `.mp4`/`.webm`/video-pattern URL —
  zero found — plus zero console errors/warnings page-wide.

### Review

Screenshots shared with user; not yet committed/pushed pending their
sign-off (per the plan's "preview before committing" step — no separate
static mockup was built, since every visual pattern reused here already
exists pixel-exact in the codebase from Model of Care).

**Follow-up fixes requested after first review:**

1. **`PrincipleTags` grid alignment + height, fixed at the component level**
   (so both consumers — MDT's Approach/Governance — benefit): the grid was
   fixed at 3 columns regardless of item count, leaving a dangling
   half-empty row for 5 items (3+2) and a worse one for 4 (3+1) — exactly
   the same class of bug fixed on `PrincipleCards`' bento grid earlier this
   session, just never applied here since `PrincipleTags` had no live
   consumer at the time. Capped at 2 columns; when the count is odd, the
   last tile spans both columns as a centred closing "bookend" instead of
   leaving a gap. Separately, tile height inconsistency was the same bug
   class fixed on `TestimonialCard` earlier — the bordered/padded visual box
   was the *inner* div, one level below the actual grid item, so CSS grid's
   row-stretch was sizing the (invisible) `<li>` correctly but the visible
   box never filled it. Added `h-full` to the inner box. Verified visually:
   Approach (5 items) now reads 2+2+1-full-width, Governance (4 items) reads
   a clean 2×2, all tiles matching height within each row.
2. **Two MDT-only team members added**: Dr Sara Tarr (Psychologist) and
   Sinead Cahillane (Dietician), both named in issue #92's spoke-description
   comment. Explicit requirement: must NOT appear in the site's "Meet the
   Team" sections (homepage, `/careers`), which are powered by
   `teamMembers` in `src/data/team.ts`. Added as a separate `mdtOnlyMembers`
   array directly in `src/data/quality.ts` instead — bypasses `teamMembers`
   entirely, only ever reachable via `mdtTeam`. Photos supplied by the user
   locally (`~/Downloads/Sara Tarr - Psychologist.jpg`, `~/Downloads/Sinead
   Diet.png`), copied into `public/images/staff/` as `Sara-Tarr.jpg` /
   `Sinead-Cahillane.png`, matching the existing staff-photo naming
   convention (`FirstName-LastName.ext`, original format/size kept as-is —
   confirmed this repo has no resize convention for staff photos, unlike
   the resized-to-1600px stock photography). Verified via `curl` that
   neither name appears on the homepage.

**Re-verified after both fixes:** `tsc`/`eslint`/`build` all clean,
screenshots at 1440px and 390px confirm the grid fix and both new team
members rendering correctly with their photos, `curl` confirms no leak onto
the homepage's team section.

**Third follow-up:** Katie Kelly (Behaviour Support Specialist) was missing
from the page. Unlike Sara Tarr/Sinead Cahillane, she already exists in the
shared `teamMembers` array (`src/data/team.ts:117`, `department: "MDT"`) —
she was just never included in `mdtTeam`'s `pickTeam([...])` list. Added her
there (the normal, existing mechanism), not to `mdtOnlyMembers` — she already
appears in "Meet the Team" elsewhere and belongs there, so no leak concern.
`mdtTeam` now has 6 members total. Re-verified: `tsc`/`eslint`/`build`
clean, screenshots at both breakpoints confirm all 6 render correctly in one
row (1440px) / stacked (390px), no overflow.

**Fourth follow-up — Partnership section photo swapped, then its crop
tuned.** User placed `helping-child-write.jpg` directly into
`public/images/stock/` themselves (untracked, no git history — a real
client-supplied photo, not from Pexels/Unsplash, flagged as such in
`CREDITS.md` since no stock licence applies and its usage rights aren't
independently verified). Swapped in for `team-around-the-child.jpg`, which
became orphaned and was deleted (file + its `CREDITS.md` line) since it was
only ever added for this same card.

The new photo is a very tall portrait crop; the `aspect-[4/3]` container's
default `object-cover` centring cut off both people's faces entirely
(confirmed via screenshot, not assumed). First attempt used `object-top`,
which brought both faces into frame but cropped out the actual craft
activity (hands, scissors, book) below them. User asked to show "the kid
being helped" specifically — tried a middle position (`object-[50%_35%]`)
and confirmed via screenshot it keeps the carer's face, the boy, *and* the
hands-on activity all in frame together. Note: the boy's own face isn't
visible in the source photo at any crop — he was shot from behind/the side
— so this is the closest any crop can get, not a limitation introduced
here.

Re-verified: `tsc`/`eslint`/`build` clean, screenshots at 1440px and 390px
confirm the final crop and no overflow.

---

## Card 118: Issue #118 — Our Services changes (2 cards → 3)

Branch: `feat/issue-118-services-cards`
Pipeline variant: `fix` (adopt-only — data-only change, `ServicesSection`/
`ServiceCard` already flex to a 3-card grid, no new component needed)
Status: **building now.**

### Problem

Homepage "Our Services" grid (`src/data/services.ts`'s `services` array,
rendered by `ServicesSection`) currently has 2 cards: one combined
"Residential Disability Services for Adults & Children" card, and one
"Non-Residential Respite for Adults & Children" card. Issue #118 wants 3
cards instead: split Residential into separate Children's/Adults' cards,
and refresh the Respite copy.

### Source content (from issue #118, verbatim)

1. Children's Residential Services — "Safe, nurturing and individualised
   care - children are supported within a structured, caring environment
   that promotes development, positive relationships, education, community
   participation and increasing independence."
2. Adults Residential Services — "Supporting choice, independence and
   quality of life - Individualised residential support enables adults to
   build skills, exercise choice, participate in their communities and work
   towards personally meaningful goals."
3. Non-residential Respite — "Temporary daytime support to children and
   adults – Offering daytime social activities, stimulation and safe
   environment, making use of community facilities where possible." — **to
   be revised by Trevor** (draft, not final client copy).

### Decision (user confirmed)

Ship the draft Respite copy now rather than blocking the card on Trevor's
revision — same precedent as #121's ADT step-3 draft text. Flagged as draft
in this commit/PR so it's easy to find and swap later.

### Scope

- `src/data/services.ts` only:
  - Replace the single Residential entry with two entries (Children's,
    Adults'), both `icon: "home"`, `hasImage: true` (reuses the existing
    "home" illustration — no new artwork).
  - Update the Respite entry's title (shortened to "Non-Residential
    Respite" since the description now names both audiences) and
    description to the issue's draft wording, `icon: "heart"` unchanged.
  - Update the file's leading comment (currently points at #90's "two
    services" decision) to reflect #118.
- No changes to `ServicesSection.tsx`/`ServiceCard.tsx` — grid already goes
  `lg:grid-cols-3` above 2 items, accent already alternates by index, both
  icons already exist in `ServiceCard`'s icon/illustration maps.

Out of scope: `enhanceServices` (untouched, separate group); any other page.

### Acceptance criteria

- [x] `services` array has exactly 3 entries in the order above, verbatim
      issue copy (Respite marked as draft in the PR description only, not
      in the data itself — no "TODO"/placeholder text shipped to users).
- [x] Homepage "Our Services" grid renders 3 cards, `lg:grid-cols-3` at
      desktop, no dangling gap at any breakpoint.
- [x] Accent colours still alternate teal/purple by position; both
      Residential cards render the "home" illustration correctly.
- [x] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green.
- [x] Verified in a real browser at desktop + mobile widths — no CLS, text
      over the illustration overlay passes WCAG AA (existing overlay
      gradient, unchanged).

### Review

Pure data change, exactly as scoped — no `ServicesSection.tsx`/`ServiceCard.tsx`
edits needed, the grid/icon/illustration machinery already supported a 3rd
card. Verified: `tsc`/`eslint`/`build` all clean; Playwright screenshots at
1440px and 390px confirm the 3-card teal/purple/teal grid, both Residential
cards sharing the "home" illustration correctly, no overflow/CLS at mobile
width. Respite copy shipped as-is per user decision, flagged as draft
pending Trevor's revision in the PR description.

---

## Card: `/quality/safety-improvement` rebuild (third page on the Model of Care/MDT pattern)

Branch: `redesign/safety-improvement-cards`
Pipeline variant: `full` (structural rewrite, new local section functions —
though every component reused is pre-existing, nothing new built)
Status: **done, pending user review before commit.**

No GitHub issue — user-initiated design polish, explicitly "content shouldn't
change as of right now." Full plan brainstormed via harness Plan Mode (2
parallel Explore agents — current page state, then the MDT reference pattern
— followed by a Plan agent, then `AskUserQuestion` on the two genuinely open
calls: photo assignment and whether to add a closing CTA strip). Plan file:
`~/.claude/plans/we-re-gonna-rebuild-the-distributed-crab.md`.

### What changed

`src/app/quality/safety-improvement/page.tsx` fully rewritten to match
`/quality/mdt`'s established pattern: hand-rolled local section functions
(`IntroSection`, `CycleAndCommitmentSection`, `GovernanceSection`,
`BroaderViewSection`) instead of the old flat `ContentSection` calls, a
teal-only `Divider()` (the stray purple `LotusBand` this page still had is
gone), no pillars-nav (matches MDT's precedent — this page is one continuous
narrative, not distinct linkable parts), and a closing `CareersCTAStrip`
(this page had none before — now 3/3 with Model of Care and MDT). All text
in `src/data/quality.ts` (`qualitySafetyCycle`, `qualitySafetyContent`,
`safetyImprovementTeam`) is byte-identical, confirmed field-by-field against
the old file before rewriting — the only new prose anywhere is the CTA
strip's heading/body, templated directly on the other two pages' own phrasing.

Two components got their first real reuse this card: `PrincipleTags` (for
Commitment's 5 bullets, previously plain `ContentSection` bullets) and
`SplitCards` (for Broader View + Culture — orphaned since Model of Care's
own Governance/Culture split was removed, and built for exactly this
"two heading+body blocks, no image, no bullets" shape).

**Photos:** checked the client's Drive folder first (same "Stock photos for
website use" folder used for Model of Care/MDT) — its 4 remaining unused
Pexels photos are all warm child-play moments, wrong theme for a
governance/audit-themed page. Sourced 2 new ones from Pexels directly
instead (same license convention — free, no attribution required), a
matched pair from the same Kampus Production shoot (same people/office/
wardrobe) for visual continuity between the two sections that use them:
`team-review.jpg` (Intro) and `governance-review.jpg` (Governance section,
tighter shot with data-chart printouts visible). Hero keeps
`team-meeting.jpg` unchanged (already fits, avoids 3 near-identical "people
around a table" photos back to back). This drops `clinical-consultation.jpg`
from this page (Improvement's photo — that block became text-only, matching
MDT's own text-only Governance sub-block) and frees `dignity-activity.jpg`
(previously Intro's photo) — both files are still used elsewhere, not
deleted. `CREDITS.md` updated with a new "Safety Improvement page redesign"
entry.

### Acceptance criteria

- [x] Every field in `qualitySafetyCycle`/`qualitySafetyContent`/
      `safetyImprovementTeam` still renders somewhere, verbatim — confirmed
      by reading the live data file before writing the new page and
      diffing each block against the new JSX.
- [x] All dividers teal, zero purple — confirmed via `grep` (single
      `Divider()` definition, `variant="teal"` only) and a 1px-column pixel
      scan of the full-page screenshot (the only near-purple pixels found
      are the closing `CareersCTAStrip`'s intentional gradient, a different
      component, matching the same distinction made for this exact check on
      Model of Care).
- [x] No pillars-nav added (matches MDT precedent).
- [x] `PrincipleTags` 5-item bookend layout (odd count → last tile spans
      both columns) renders with no dangling gap, both breakpoints.
- [x] `npx tsc --noEmit` clean, `eslint` clean, `npm run build` green (25 routes).
- [x] Verified in a real browser (dev server + Playwright, full-page
      screenshots at 1440px and 390px): hero, intro, cycle, commitment
      tags, governance+improvement, broader-view/culture split cards, team
      strip, and closing CTA all render correctly; exact 390px mobile width
      confirmed, no horizontal overflow; footer/page-bottom spacing
      cross-checked against MDT's own screenshot at the same viewport
      height and found pixel-identical (not a regression).

### Review

First pass under-applied the MDT/Model of Care pattern in two ways, caught
by the user comparing this page against the other two directly:

1. **Cycle and Commitment were left as two separate full-width sections**
   instead of one bounded `bg-white rounded-3xl` panel with a hairline
   between them — the exact treatment MDT gives HubAndSpoke+Approach and
   Model of Care gives Framework+Approach. Fixed: merged into
   `CycleAndCommitmentSection`, `CircularCycle` on top, `PrincipleTags` below
   the hairline, one `SectionTitle` for the whole panel (not two).
2. **6 dividers, including one immediately after the hero** — MDT/Model of
   Care never put a divider directly against the hero (always at least one
   content block first) and use them sparingly. Fixed: down to 2, placed
   after Intro (before the Cycle+Commitment panel) and after
   Governance+Improvement (before Broader View/Culture) — confirmed via
   `AskUserQuestion` rather than guessing the count. Hero flows straight
   into Intro; Governance+Improvement flows straight out of the panel; Team
   and the CTA strip follow Broader View/Culture with no divider, matching
   both other pages' endings exactly.

Checked 21st.dev/Dribbble per the user's suggestion for general inspiration,
but the actual fix was simply applying the site's own already-proven
pattern correctly rather than sourcing anything new — flagged this
explicitly rather than pretending external research drove the fix.

Re-verified after both fixes: `tsc`/`eslint`/`build` all clean; Playwright
screenshots at 1440px and 390px confirm the merged panel closes cleanly
(rounded corners, hairline, no dangling gap) at both breakpoints, and the
2-divider page reads as one continuous flow with breathing room at exactly
two points, never adjacent to the hero.

Not yet committed/pushed — pending user's in-browser review (dev server
running on `localhost:3000`).

---

**2026-09-13, follow-up — Governance/Improvement and Broader View/Culture
redesigned, merged into one icon-card grid.**

User feedback: these two sections still didn't look right even after the
divider/panel fixes above — "for me they don't look right at all," asked to
pull real inspiration from 21st.dev before touching anything, and to see
mockups before any code changed ("we only leave here when we get the perfect
design").

**Root cause, on inspection:** these are 4 short heading+paragraph blocks (no
bullets, only 1 of 4 with a photo) that were split across two mismatched
constructs — a photo-heavy grid for Governance with a bare text block bolted
on for Improvement underneath it, then a totally different bordered-card
split for Broader View/Culture right after. Four sibling ideas, three visual
languages.

**Process:** pulled real reference screenshots from 21st.dev (a quiet
icon+text grid with left-rule dividers, no card chrome; a HIPAA/SOC2
compliance grid — literally the same kind of content; a bento icon-card
grid) via Playwright (`file://`/live-URL screenshots, since the Chrome
extension isn't connected in this sandbox — same fallback as every other
visual check this session). Sent all 3 references to the user via
`SendUserFile` before proposing anything. Noticed the homepage's own
`enhanceServices` icon-cards already include a teaser card for this exact
page ("Quality, Safety & Continuous Improvement") — proposed echoing that
card's own visual language rather than importing a foreign pattern.
`AskUserQuestion` on card style (icon-card vs. quiet/editorial) got: "show
me examples... so I can see the difference" — built a live HTML mockup
(real brand tokens, real copy, the actual governance photo, both options
stacked) and sent it as a rendered screenshot rather than describing it in
words. User picked the icon-card option (Option B) and confirmed leaving
"Our Culture"'s single-sentence brevity as-is rather than padding it.

**What changed:** new component `src/components/quality/icon-cards/{IconCards,index}.ts(x)`
— a 2-col icon-card grid (icon tile, heading, body, no link), reusing the
exact 4 SVG icons already coded in `ServiceCard.tsx` (`shield-check`,
`chart-bar`, `globe`, `users`) and the same 10%-tint-to-solid hover-invert
treatment, so it reads as a deliberate callback to the homepage's own card
rather than a new visual language. Own `useInView` + `pop-item` stagger
(reveal on the `<li>`, hover on the inner card — same split
`PrincipleTags`/`PrincipleCards` use, so the per-item reveal delay never
leaks into the hover transition). `GovernanceSection()` and
`BroaderViewSection()` in `page.tsx` replaced with one `PrinciplesSection()`:
`governance-review.jpg` now a wide `aspect-[21/9]` banner above the grid
(not a 50/50 split with just one of the four topics), followed by all 4
blocks (Governance, Improvement, Broader View, Culture) as equal-weight
cards. `SplitCards` import removed from this page (component itself
untouched, still used/kept as a generic primitive elsewhere in spirit).
Divider count stays at 2 (after Intro, after the Cycle+Commitment panel) —
merging Governance+Improvement+BroaderView+Culture into one section removed
the need for a divider between them.

**Verified:** `tsc`/`eslint`/`build` all clean. Playwright screenshots at
1440px and 390px confirm the 2×2 (1-col on mobile) grid renders correctly,
banner photo at the correct `21:9` ratio, no CLS. A real simulated hover
(`tile.hover()` + `getComputedStyle` before/after) confirmed the icon tile's
background actually inverts from 10%-tint to solid `teal-700`
(`rgb(13,106,112)`), not just present in source.
