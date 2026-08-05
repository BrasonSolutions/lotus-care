# Lotus Care Website — Build Plan

**Repo:** `BrasonSolutions/lotus-care`
**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · Tailwind CSS 4 · TypeScript · Storybook
**Mockup reference (not fully updated):** https://lotus-care12.vercel.app

---

## How to use this document (for Claude CLI agents)

- Each task card below is **self-contained**. Pick one card, read its full block, and execute only that scope.
- **Workflow:** one git branch + one PR **per feature** (per card), not per sub-task. Branch names are given per card.
- **Board:** issues live on the GitHub Projects "Lotus Care" kanban (Ready / In progress / Waiting for customer / In review / Done).
- **Do the Foundation epics first (F1–F4).** Most feature cards depend on them. See the Sequencing section at the end.
- If a card is marked `BLOCKED`, do not invent the missing content — implement it as swap-ready (single source of data) and leave a clear TODO.
- **Accessibility + motion are acceptance criteria, not nice-to-haves:** every animation must be gated behind `prefers-reduced-motion`, all media needs captions/alt/poster, colour contrast must pass WCAG AA.
- Keep the brand tone throughout: dignity, choice, connection; person-centred; never pitying. Ireland-based (Co. Offaly / the Midlands), HIQA-regulated — **not** Australian/NDIS (see L1).

---

## Brand & content facts (canonical — use these, correct anything that contradicts)

- **Who:** HIQA-registered disability residential + respite provider, adults and children, Co. Offaly / the Midlands (Ireland).
- **Tagline:** "Enhanced Living, Empowered Lives."
- **Mission:** "We believe every person deserves to live a life of dignity, choice, and connection."
- **Values (current — see BLOCKED note):** Person-Centred, Compassionate, Accountable, Inclusive.
- **Scale (current — see BLOCKED note):** 8 homes · 150+ staff · 200+ lives supported · 24/7 care.
- **Employer stats (current — see BLOCKED note):** 87% staff retention · 40% internal promotion · 4+ yr average tenure.
- **Governance:** HIQA + Garda Vetting + UNCRPD alignment. Three quality pillars: Human Rights Committee (per-centre Champions), internal MDT, Board Quality & Safety Subcommittee.
- **Philosophy:** least restrictive practice · dignity of risk · supported decision-making.
- **Homes (8, gemstone-named A–H):** Amethyst, Beryl, Citrine, Diamond, Emerald, Fluorite, Garnet, Heliodor.
- **Palette:** purple + teal + white.
  - ⚠️ **The hex values anywhere in this document (and in the mocks/appendices) are APPROXIMATE placeholders** — they were sampled from a design tool, not the real brand, so they are slightly off. **Do not treat them as the source of truth.**
  - ✅ **Source of truth = the repo.** Read the real brand tokens from the codebase — the Tailwind 4 `@theme` block (likely in `globals.css` / `app/globals.css` or the Tailwind config) and any existing CSS custom properties / logo SVG. Agents already have these locally. Use the repo values everywhere; where this doc shows a hex, substitute the matching real token.
  - Approximate stops used in mocks (for shape/contrast reference only, not colour truth): purple `~#7F77DD`/`~#534AB7`/`~#26215C`, teal `~#1D9E75`/`~#0F6E56`/`~#085041`, purple tint `~#EEEDFE`, teal tint `~#E1F5EE`.

---

## ⚠️ BLOCKED — awaiting client content (build swap-ready now)

These are deferred by the client and **will change later**. Build them so the copy lives in a **single source** (one data/config file, not hardcoded across components), so the future change is a content edit, not a refactor.

- **B1 — New values.** Current set (Person-Centred, Compassionate, Accountable, Inclusive) stays for now; client will revise. Affects the Careers Overview and any values block site-wide.
- **B2 — New stats.** Current employer stats (87% / 40% / 4+ yr) and homepage counters (8 / 150+ / 200+ / 24-7) stay for now; client will revise. Keep both sets in one config so they stay consistent when updated.

---

# FOUNDATION EPICS (do these first)

## F1 — Brand colour token system
`branch: feat/design-tokens`

**Problem:** Palette use is inconsistent; client wants purple/teal/white applied site-wide.
**Scope:** Define brand colour tokens once, refactor components to consume them.
**Approach:**
- **First, read the colours already in the repo** — the existing `@theme` block / `globals.css` / Tailwind config and the logo SVG. Those are the real brand values. **Ignore the approximate hex printed in this document** (they are placeholders and are slightly wrong).
- Consolidate the real values into a single Tailwind 4 CSS-first `@theme`: a purple scale, a teal scale, and neutrals/white.
- If a canonical scale doesn't exist yet, derive it from the real logo/existing usage — not from this doc's placeholder hex.
- Replace one-off/hardcoded colours in existing components with tokens.
**Acceptance criteria:**
- [x] Real brand values sourced from the repo/logo, not from this document's placeholder hex.
- [x] Purple + teal + neutral scales defined as tokens in one place.
- [x] No hardcoded brand hex left in component files (grep clean) — *`src/data/homes.ts` still has 8 raw per-home marker hex values, but those are home-identity colours, not brand purple/teal.*
- [x] Existing pages render unchanged except where intentionally re-themed.
- [x] Documented in Storybook (a colour-tokens story).
**Depends on:** nothing. **Blocks:** F4, and every visual card.

## F2 — Layout width system
`branch: feat/layout-width-system`

**Problem:** Pages feel too narrow; client asked for "~80% width" everywhere. Taking that literally on body text hurts readability (line length too long).
**Scope:** Two-tier container system, applied globally.
**Approach:**
- **Wide container** (~80% / large max-width) for heroes, galleries, infographics, 50/50 rows, media.
- **Reading container** (comfortable max measure, ~65–75ch) for body copy nested inside wide sections.
- Provide as reusable layout primitives/components.
**Acceptance criteria:**
- [x] Two container primitives exist and are documented in Storybook.
- [x] Heroes/galleries/infographics use the wide container.
- [x] Long-form text stays within the reading measure.
- [x] Resolves the "Open Roles — use more width" request (no separate work).
- [x] Verified at mobile / tablet / desktop breakpoints.
**Depends on:** nothing. **Blocks:** most page cards; C2 (Open Roles).

## F3 — Lotus mark as reusable SVG (separable petals)
`branch: feat/lotus-svg-component`

**Problem:** The lotus is needed in three places (Services petal animation, Team/Board photo mask, decorative motif) — it must be one asset, not three.
**Scope:** Build the lotus mark as a multi-path SVG React component, each petal its own path; plus a lotus-shaped photo-mask (clipPath) variant.
**Approach:**
- **Retrace the real brand logo** into separate petal `<path>`s. (A concept starter is in Appendix A — replace its placeholder geometry with the real mark.)
- Expose petals as individually targetable elements (ids/refs) so they can animate independently.
- Provide a **softened lotus-inspired mask** (`clipPath`) variant — see F3 note.
**F3 note (design decision):** Use a *softened* lotus mask for faces, **not** a hard multi-petal cutout. Hard petal notches crop chins/foreheads on real headshots. The soft mask still reads as the lotus. (Two options were mocked; soft mask chosen.)
**Acceptance criteria:**
- [x] `<LotusMark>` component renders the mark from separable petal paths.
- [x] Each petal is independently targetable for animation.
- [ ] `<LotusPhotoMask>` (soft variant) clips an `<img>`/photo without cropping faces awkwardly. *Built + has a Storybook story, but not actually wired into any Team/Board photo yet — `TeamCard`/`TeamModal`/`BoardSection` all still use plain `rounded-full`. Blocked on P5/P6.*
- [x] Storybook stories for both.
- [x] Works in light/dark contexts as used on site. *(`LotusMark` confirmed in both; `LotusPhotoMask` moot until P5/P6 wire it up.)*
**Depends on:** F1. **Blocks:** P4 (Services animation), P6 (Team/Board masks), F4 (blobs may reuse petal forms).

## F4 — Decorative palette "blobs"
`branch: feat/decorative-blobs`

**Problem:** Client wants soft organic palette-coloured background shapes where space allows.
**Scope:** Reusable decorative blob component(s), CSS/SVG (not images).
**Approach:**
- Low-opacity organic shapes in purple/teal, sitting **behind** content.
- Never reduce text contrast below AA; never behind dense body copy at high opacity.
- If animated (drift), gate behind `prefers-reduced-motion` and keep subtle.
**Acceptance criteria:**
- [x] Reusable blob component with position/colour/size props. *(size/position via `className`, colour via a token-restricted prop — no discrete numeric props, but fully configurable.)*
- [x] Zero network cost (inline SVG/CSS, no raster images).
- [ ] Text over/near blobs still passes AA contrast. *Component is designed for this (0.12 default opacity, dedicated `BehindText` Storybook story) but `<Blob>` isn't placed on any real page yet — only pre-existing, unrelated ad hoc shapes appear on the live site. Waiting on P4 (or another card) to actually deploy it.*
- [x] Reduced-motion respected if animated.
**Depends on:** F1. **Blocks:** cosmetic only.

---

# HOMEPAGE

## P1 — Hero redesign (rebalance + activity imagery)
`branch: feat/home-hero-redesign`

**Problem:** The hero photo dominates and doesn't communicate what Lotus Care actually *does*.
**Scope:** Rebalance hero so imagery supports the message; shift to activity-based imagery (people engaged — e.g. arts & crafts, adults or children).
**Approach:**
- Reduce the photo's visual dominance; strengthen headline/message hierarchy.
- Imagery direction: warm, candid, natural light, focus on activity/engagement, real homes. **Avoid** care-sector clichés (posed hand-holding, wheelchair-from-behind, pity framing).
**Acceptance criteria:**
- [ ] Message reads first; image supports, doesn't swallow.
- [ ] Activity-focused imagery in place (or placeholder with art-direction note if asset pending).
- [ ] Passes contrast for any text over imagery.
- [ ] Responsive.
**⚠️ Safeguarding/consent note:** If images show *real* supported people (especially children), they require documented consent — HIQA-regulated. Prefer consented imagery, non-identifying activity framing, or high-quality authentic licensed stock. **Flag to client; do not ship unconsented images of real service users.**
**Depends on:** F1, F2. **Assets needed:** hero imagery (see safeguarding note).

## P2 — Hero quick-action buttons
`branch: feat/home-hero-cta`

**Problem:** No fast entry points from the hero.
**Scope:** Add two prominent CTAs: "Our Services" and "Careers."
**Approach:** Primary/secondary hierarchy (not two identical buttons); use brand tokens.
**Acceptance criteria:**
- [ ] Two CTAs in hero, clear primary vs secondary.
- [ ] Link to Services section and Careers hub respectively.
- [ ] Keyboard-focusable, accessible labels.
**Depends on:** F1; pairs with P1.

## P3 — Homes 50/50 row (video + existing carousel)
`branch: feat/home-homes-split-row`

**Problem:** Client wants a split row showcasing the homes.
**Scope:** One full-width row split 50/50 — **left:** looping muted video montage of the eight homes; **right:** the **existing houses carousel**, resized to fit its half and **fully interactive exactly as it works today** (do not rebuild the carousel).
**Approach:**
- Drop the current carousel component into the right half; adjust card size / arrows / dots for the narrower width.
- Left half: muted autoplay video montage with poster fallback.
- Mobile: stack to video-over-carousel.
**Acceptance criteria:**
- [ ] 50/50 row on desktop; stacks cleanly on mobile.
- [ ] Existing carousel behaviour preserved (interactive as today).
- [ ] Video is muted, has poster frame, respects reduced-motion (no autoplay motion if reduced).
- [ ] No layout shift on load.
**Depends on:** F2. **Assets needed:** homes video montage + poster image.

## P4 — Services section: animated lotus + blobs
`branch: feat/home-services-lotus-anim`

**Problem:** Services section is static; client wants an animated lotus on the side (petals animating separately).
**Scope:** Place `<LotusMark>` beside the Services content and animate petals (entrance/scroll — bloom/stagger/drift). Add blobs where they fit.
**Approach:**
- Use F3's separable-petal component; animate `transform`/`opacity` only.
- Gate behind `prefers-reduced-motion`.
**Acceptance criteria:**
- [ ] Petals animate independently on entrance/scroll.
- [ ] Reduced-motion shows a static bloomed lotus.
- [ ] No CLS / jank; 60fps target.
- [ ] Services cross-links to Quality pages preserved.
**Depends on:** F1, F3, F4.

## P5 — "Meet the Team" — bigger presence
`branch: feat/home-team-scale`

**Problem:** Section feels too small.
**Scope:** Increase scale/presence of the Meet the Team section (typography, spacing, layout weight).
**Acceptance criteria:**
- [ ] Section reads as a major section, not a minor strip.
- [ ] Category filters (All/Management/Services/Quality/Clinical/HR/Finance) still work.
- [ ] Responsive.
**Depends on:** F1, F2. **Pairs with:** P6.

## P6 — Lotus-masked profile photos (Team + Board)
`branch: feat/team-board-lotus-mask`

**Problem:** Client wants profile photos inside a lotus-logo mask (applies to Team **and** Board).
**Scope:** Apply the **soft** `<LotusPhotoMask>` (F3) to all Team and Board photos.
**Approach:** Use the softened mask variant; verify no face-cropping across the real photo set (varied crops/aspect ratios).
**Acceptance criteria:**
- [ ] All Team + Board photos masked consistently.
- [ ] No awkward face cropping on any real photo.
- [ ] Fallback for missing/differently-sized images.
- [ ] Alt text preserved.
**Depends on:** F3, P5.
**Note:** Board currently lists two CEOs (David Corboy, Madeline Corboy) — **confirmed correct by client**, leave as-is.

---

# CAREERS

## C1 — Careers Overview revamp
`branch: feat/careers-overview-revamp`

**Problem:** Hero has buttons/cards to remove; the stats/info block ("150+…" counters) should become testimonials; benefit cards are "too simple, too white, too basic"; values need revising.
**Scope:**
1. Remove the buttons/cards currently in the hero.
2. Remove the current stats/info block and **replace it with testimonials**.
3. Redesign benefit cards using the palette (see C4 style direction / Appendix B).
4. Values block: keep current copy but swap-ready (B1).
**Acceptance criteria:**
- [x] Hero buttons/cards removed.
- [x] Stats/info block replaced by testimonials section.
- [ ] Benefit cards use palette accents, not flat white. *This page's own "Our Values" grid is still flat white/bordered — the palette-accented cards this refers to live on the separate Benefits page (C4's scope), not here.*
- [x] Values sourced from single config (swap-ready).
**Depends on:** F1, F2. **Related:** C4 (Benefits), C3 (Why-Us testimonials/gallery).

## C2 — Open Roles width
`branch: feat/careers-open-roles-width`

**Problem:** Open Roles feels narrow.
**Scope:** Apply F2 wide container. **No bespoke work — this is just adopting the width system.**
**Acceptance criteria:**
- [x] Open Roles uses the wide container consistently with the rest of the site.
**Depends on:** F2.

## C3 — Why Work With Us
`branch: feat/careers-why-us`

**Problem:** Needs a photo gallery, stronger "respect" section, updated stats, values removed, video testimonials added.
**Scope (four changes):**
1. **Photo gallery with carousel** (culture/workplace photos).
2. **More contrast** on the "culture built on respect" section so it stands out.
3. **Update stats** — BLOCKED (B2); build swap-ready.
4. **Remove the values block**; add **video testimonials at the bottom** of the page.
**Acceptance criteria:**
- [x] Accessible gallery carousel (keyboard + reduced-motion). *Native keyboard-focusable prev/next + dot buttons, autoplay gated behind `prefers-reduced-motion`; doesn't have full ARIA carousel semantics (`role="region"`, `aria-live`) but is keyboard-operable and motion-safe.*
- [x] "Respect" section visibly higher-contrast / stands out.
- [x] Stats from single config (swap-ready).
- [x] Values block removed; video testimonials section at page bottom with captions + poster frames. *Poster always renders; `<track>` captions render once a real `captionsSrc` is provided — currently showing the documented "coming soon" placeholder state since real footage/captions are still pending from the client.*
**Depends on:** F1, F2. **Assets needed:** culture photo set; testimonial video files + captions + posters.

## C4 — Benefits redesign
`branch: feat/careers-benefits-redesign`

**Problem:** "Change layout, use all the palette, make it better, less is more."
**Scope:** Fewer, roomier cards; one brand accent per card; cut filler.
**Approach:** See Appendix B / the approved style direction — tinted icon chip, top-border colour hit, generous padding, calm everything-else. Content stays current unless client provides new.
**Acceptance criteria:**
- [x] Tighter grid, generous spacing, one palette accent per card. *Chip-only accent, no top border — dropped per user feedback despite Appendix B specifying one.*
- [x] Icons + accents from brand tokens; AA contrast in light/dark. *No dark mode exists anywhere in this site, so "dark" is inapplicable; tokens + light-mode contrast confirmed.*
- [ ] Filler content removed ("less is more"). *Layout/spacing/accent styling changed, but the benefit count/copy is untouched (10 items, same text) — matches the card's own scope note ("content stays current unless client provides new") but isn't a content trim.*
- [x] Responsive (stacks to 1 column on mobile).
**Depends on:** F1, F2.

## C5 — Training page
`branch: feat/careers-training`

**Problem:** Career Progression should lead; timeline should be horizontal, bigger, animated, palette-driven, standout.
**Scope:**
1. Move **Career Progression to the top** of the page.
2. Convert the timeline to **horizontal**, larger, animated, palette-driven.
**Approach:** Use the **shared timeline component** (see C6 — build once, two variants).
**Acceptance criteria:**
- [x] Career Progression is the first major section.
- [x] Horizontal timeline, animated on scroll, brand palette.
- [x] **Mobile fallback**: horizontal-scroll or collapse-to-vertical (must not break on phones).
- [x] Reduced-motion respected.
**Depends on:** F1, F2, C6.

## C6 — Shared animated timeline component
`branch: feat/timeline-component`

**Problem:** Training (C5) and How We Hire (C7) both need animated timelines — build one, reuse.
**Scope:** One `<Timeline>` component with horizontal and vertical variants, animated, palette-driven.
**Acceptance criteria:**
- [x] Horizontal + vertical variants, prop-driven steps.
- [x] Scroll/entrance animation, reduced-motion safe.
- [x] Documented in Storybook.
- [x] Used by both C5 and C7.
**Depends on:** F1. **Blocks:** C5, C7. *(Build this before C5/C7.)*

## C7 — How We Hire
`branch: feat/careers-how-we-hire`

**Problem:** Hiring timeline should animate; FAQ animation is "too snappy."
**Scope:**
1. Animate the 6-step timeline (via C6): **Apply → Screening call → Interview → Offer → Pre-employment checks → Start.**
2. Soften the **FAQ accordion** animation — fade in/out with proper easing + sensible duration (not snappy).
**Acceptance criteria:**
- [x] 6-step timeline animated, correct order/labels.
- [x] FAQ open/close uses fade + eased transition (no snap).
- [x] Reduced-motion respected.
**Depends on:** F1, C6.

---

# QUALITY & GOVERNANCE

## Q1 — Quality Overview revamp
`branch: feat/quality-overview-revamp`

**Problem:** Overview needs the same uplift as the Careers overview.
**Scope:** Apply the C1 overview treatment to the Quality hub for cross-hub consistency (layout, palette, removal of dated blocks, testimonial/quote where appropriate).
**Acceptance criteria:**
- [x] Visual/structural consistency with the revamped Careers overview.
- [x] Uses width system + tokens.
**Depends on:** F1, F2, C1 (as reference).

## Q2 — Infographics: "more WOW and intuitive"
`branch: feat/quality-infographics-wow`

**Problem:** Existing CircularCycle / hub-and-spoke infographics should be more impressive **and** more intuitive.
**Scope:** Redesign the quality infographics so a first-time visitor understands the three pillars / MDT model at a glance; the "wow" comes from motion + the lotus motif, not complexity.
**Approach:** See Appendix C concept — three pillars (Human Rights, MDT, Board oversight) supporting "a culture of quality & safety," lotus blooming above, foundation strip (least restrictive practice · dignity of risk · supported decision-making) below. Animate: pillars rise on scroll, lotus blooms petal-by-petal, foundation fades in. Pillars clickable through to existing detail pages.
**Acceptance criteria:**
- [x] Concept is legible at a glance (intuitive priority).
- [x] Entrance/scroll animation, `transform`/`opacity` only, reduced-motion safe.
- [x] Reuses `<LotusMark>` (F3) for the motif.
- [x] Existing infographic content/links preserved or improved, not lost.
- [x] Storybook story.
**Depends on:** F1, F3.

---

# NEW FEATURE

## N1 — "Have Your Say" anonymous feedback
`branch: feat/have-your-say`

**Problem:** Client wants a site-wide button opening a modal form for feedback, categorised, anonymity **optional**.
**Audience:** everyone — stakeholders, families, staff, residents.
**Destination:** email inbox.
**Anonymity:** optional — include an **optional email field** so a person can identify themselves; not required.

**Scope:**
- Site-wide "Have Your Say" trigger → modal form.
- Fields: category (select), message (required), optional email, optional name.
- Server-side email delivery + spam protection.
- Safeguarding signpost.

**Approach / technical reality:**
- This is the **only item touching backend/infra**. A Next.js Route Handler (or server action) plus an email-sending service (e.g. Resend or SMTP) is required. Provision the inbox + sending service.
- Spam protection: honeypot field + lightweight rate-limit/captcha.
- **Categories (placeholder, make trivially editable):** e.g. `Quality & Safety`, `HR / People`, `A home or service`, `General / Other`. Client to finalise.

**Acceptance criteria:**
- [ ] Accessible modal (focus trap, ESC to close, labelled fields, keyboard-usable).
- [ ] Category select + required message + optional email/name.
- [ ] Submissions delivered to the configured inbox.
- [ ] Honeypot + rate-limit (or captcha) in place; no auth required.
- [ ] Categories in one editable config.
- [ ] **Safeguarding signpost near submit:** e.g. "If you have an urgent concern about someone's safety or wellbeing, please contact [X] directly." (Contact/route = client input.)
- [ ] Success/error states; no silent failures.

**⚠️ Safeguarding note (must resolve with client):** Because families/residents can use this, an anonymous channel can become the route for a safeguarding or complaint concern. For a HIQA provider this can sit in tension with statutory complaints-handling. The signpost above is **non-negotiable**; the specific escalation contact is a client decision.

**Depends on:** F1. **Blocked on client:** final categories, safeguarding escalation contact, inbox + sending-service provisioning.

---

# CONTENT / QA

## L1 — Localisation sweep (remove Australian content)
`branch: fix/localisation-au-to-ie`

**Problem:** The site still contains Australian content from a template — e.g. hero says services are "across Victoria," About calls Lotus Care a "registered NDIS provider." Lotus Care is Irish: Co. Offaly / the Midlands, HIQA, Garda Vetting, UNCRPD. For a HIQA provider this is a credibility risk.
**Scope:** Full sweep — not just the two known spots. Replace all AU references (Victoria, NDIS, AU phrasing) with correct IE equivalents.
**Acceptance criteria:**
- [ ] No "Victoria," "NDIS," or other AU-specific references anywhere (grep clean).
- [ ] Region reads Co. Offaly / the Midlands; regulator reads HIQA; vetting = Garda Vetting; rights framework = UNCRPD.
- [ ] Folded into the Quality-section content QA pass.
**Depends on:** nothing. **Priority:** high (credibility).

---

# Already on the board (existing work — track, don't duplicate)

- Mobile navbar collapse bug — *in review*. (Coordinate with C5/C7 horizontal-timeline mobile behaviour.)
- Content QA pass for Quality section — *in review*. (Fold L1 into this.)
- "Our Homes" navbar item fix — *open/in progress*.
- Board / team info — *open/in progress*. (Relates to P5/P6.)
- "Learn More" button on House cards — *open/in progress*.

---

# Sequencing (dependency-ordered)

**Wave 0 — Foundations (do first, can parallelise F1 then F3/F4):**
1. F1 design tokens → then F2 width system, F3 lotus SVG, F4 blobs.

**Wave 1 — Shared components:**
2. C6 timeline component (blocks C5, C7).

**Wave 2 — Feature build (parallel branches, each depends on Wave 0/1):**
- Homepage: P1, P2, P3, P4, P5→P6
- Careers: C1, C2, C3, C4, C5, C7
- Quality: Q1, Q2
- New: N1
- Content: L1 (can run anytime; high priority)

**Cross-cutting reminders for every card:**
- `prefers-reduced-motion` on all animation.
- WCAG AA contrast (check against blobs/imagery).
- Media: alt text, captions, poster frames, no CLS.
- Values (B1) and stats (B2) from single config, swap-ready.
- One branch + one PR per card.

---

# Appendix A — Lotus mark starter SVG (concept — retrace to real logo)

Placeholder geometry **and placeholder colours** — both are approximate. Replace the paths with the real brand mark and the `fill` values with real brand tokens (F1). Each `<path>` is one petal so it can be animated independently.

**Updated to the fuller bloom (thicker petals + lower tier).** This is a 9-petal full flower — an upper crown plus a lower tier fanning outward — not the top-crown-only earlier version. Colours below are approximate; swap for real tokens.

```svg
<g transform="translate(340,235)">
  <path id="petal-lower-outer-l" d="M0,0 Q-34,-56 0,-112 Q34,-56 0,0 Z" transform="rotate(-150)" fill="#AFA9EC"/>
  <path id="petal-lower-outer-r" d="M0,0 Q-34,-56 0,-112 Q34,-56 0,0 Z" transform="rotate(150)"  fill="#AFA9EC"/>
  <path id="petal-lower-l"       d="M0,0 Q-36,-58 0,-116 Q36,-58 0,0 Z" transform="rotate(-112)" fill="#5DCAA5"/>
  <path id="petal-lower-r"       d="M0,0 Q-36,-58 0,-116 Q36,-58 0,0 Z" transform="rotate(112)"  fill="#5DCAA5"/>
  <path id="petal-outer-l"       d="M0,0 Q-34,-62 0,-124 Q34,-62 0,0 Z" transform="rotate(-72)"  fill="#AFA9EC"/>
  <path id="petal-outer-r"       d="M0,0 Q-34,-62 0,-124 Q34,-62 0,0 Z" transform="rotate(72)"   fill="#AFA9EC"/>
  <path id="petal-inner-l"       d="M0,0 Q-36,-64 0,-128 Q36,-64 0,0 Z" transform="rotate(-35)"  fill="#1D9E75"/>
  <path id="petal-inner-r"       d="M0,0 Q-36,-64 0,-128 Q36,-64 0,0 Z" transform="rotate(35)"   fill="#1D9E75"/>
  <path id="petal-center"        d="M0,0 Q-40,-70 0,-140 Q40,-70 0,0 Z" fill="#534AB7"/>
</g>
```

_Earlier top-crown-only version (kept for reference, superseded by the above):_

```svg
<g transform="translate(120,210)">
  <path id="petal-outer-l" d="M0,0 Q-22,-70 0,-135 Q22,-70 0,0 Z" transform="rotate(-64)" fill="#AFA9EC"/>
  <path id="petal-outer-r" d="M0,0 Q-22,-70 0,-135 Q22,-70 0,0 Z" transform="rotate(64)"  fill="#AFA9EC"/>
  <path id="petal-inner-l" d="M0,0 Q-20,-64 0,-122 Q20,-64 0,0 Z" transform="rotate(-32)" fill="#1D9E75"/>
  <path id="petal-inner-r" d="M0,0 Q-20,-64 0,-122 Q20,-64 0,0 Z" transform="rotate(32)"  fill="#1D9E75"/>
  <path id="petal-center"  d="M0,0 Q-19,-72 0,-140 Q19,-72 0,0 Z" fill="#534AB7"/>
</g>
```

**Soft photo-mask clipPath (chosen variant — face-safe):**
```svg
<clipPath id="lotusPhotoMask">
  <path d="M505,255 L505,150 Q505,116 524,102 Q542,90 560,96 Q578,90 596,102 Q615,116 615,150 L615,255 Z"/>
</clipPath>
```
Do **not** use a hard multi-petal cutout for faces — petal notches crop foreheads/chins.

---

# Appendix B — Benefits card style direction

- Card: `--surface-1` background, subtle border, `border-radius:16px`, generous padding (~24px).
- One brand accent per card: 3px top border + a tinted icon chip (icon in solid brand colour, chip background at ~14–16% opacity of the same colour so it survives dark mode).
- Alternate purple / teal across the grid.
- Title + one short supporting line only ("less is more"). Optional small tag/pill in the same accent.
- Grid: 3 columns desktop → 1 column mobile.

---

# Appendix C — Quality infographic concept ("three pillars")

- **Top:** lotus blooms (reuse `<LotusMark>`).
- **Below the lotus:** a bar — "A culture of quality & safety" / subtitle "Not a function — the foundation."
- **Three pillars (clickable → existing detail pages):**
  - Human rights — "Committee & per-centre champions"
  - The MDT — "Nursing, therapies, psychology & more"
  - Board oversight — "Quality & safety subcommittee"
- **Foundation strip (dashed):** "Least restrictive practice · dignity of risk · supported decision-making."
- **Animation:** pillars rise on scroll → lotus blooms petal-by-petal → foundation fades in. `transform`/`opacity` only; reduced-motion shows the final state.
- **Priority:** intuitive first (legible at a glance); wow via motion + motif, not density.
