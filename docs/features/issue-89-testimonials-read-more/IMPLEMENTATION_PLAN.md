# Implementation Plan: Testimonials "Read More" (Issue #89)

## 1. Architectural Impact Analysis

- **Affected**: one data module (`src/data/testimonial.ts`), one new route segment (`/testimonials`), one shared component (`QuoteSection`), the home page.
- **Additive + modifying.** New: the `/testimonials` segment (layout, listing, detail). Modified: the testimonial record's shape, `QuoteSection` (optional CTA prop), `src/app/page.tsx` (passes that prop).
- **No new domain concepts, entities, or bounded contexts.** A testimonial record gains a `slug` and optional long-form field; it is the same record that already exists.
- **Verified premises** (read from source, not assumed):
  - `Navbar`/`Footer` are **not** in the root layout — each route segment supplies them (`src/app/careers/layout.tsx`, `src/app/quality/layout.tsx`). AC-9 therefore requires a `testimonials/layout.tsx`; it is not free.
  - `globals.css:385` already neutralises all animation and transition under `prefers-reduced-motion: reduce`, site-wide. AC-12 needs no new code — only that the new pages add no JS-driven motion.
  - There is no custom `not-found.tsx` anywhere. `careers/open-roles/[slug]` already calls `notFound()` and lands on Next's built-in page. That **is** the site's standard not-found page today.
  - `TestimonialCard` needs `initials` and `role`; the record currently carries only a combined `name: "JW, Service Owner"`.
  - `Container width="reading"` resolves to `max-w-lg` — already correct, no change needed.

## 2. Proposed Design

**Pattern: static data module + `find()` lookup + `generateStaticParams`** — the detail half of `src/app/careers/open-roles/[slug]/page.tsx`, followed exactly. No live fetch (that is the listing half of `open-roles`, deliberately not copied).

Data flow: `serviceOwnerTestimonials` (array, exported from `src/data/testimonial.ts`, containing the existing `homeQuote` record) is the single authoritative source. The home band, the listing grid, and every detail page read from it. Nothing re-declares the quote text or the attribution.

- **Listing** (`/testimonials`) maps the array to a responsive grid. Each cell = one `TestimonialCard` (reused as-is) plus a sibling `<a>` beneath it. The link is a separate element at the cell's foot — the card is not wrapped in an anchor (AC-2).
- **Detail** (`/testimonials/[slug]`) resolves `slug` via `find()`, calls `notFound()` on miss, and renders the record's long-form field when present or a stated fallback sentence when absent (AC-7 — the path every record takes today).
- **Attribution contract** (§7 item 2 of the spec): `initials` and `role` are added as fields **on that same record**. No component may contain the literal `"JW"` or `"Service Owner"`. A client reversal stays an edit to one object.
- **Home CTA**: `QuoteSection` gains one optional prop pair (link href + label). Rendered only when passed, so `/careers/why-us` — which also renders `QuoteSection` — is untouched.

## 3. Folder / Module Impact

**Created**
- `src/app/testimonials/layout.tsx`
- `src/app/testimonials/page.tsx`
- `src/app/testimonials/[slug]/page.tsx`

**Modified**
- `src/data/testimonial.ts`
- `src/components/quote-section/QuoteSection.tsx`
- `src/app/page.tsx`

**Deprecated**: none.

## 4. Execution Breakdown (Task Graph)

### Step 1: Extend the testimonial record
- **What**: Add `slug`, `initials`, `role`, and an optional long-form field to the service-owner testimonial record, and export it as an array; the top-of-file comment claiming attribution is unresolved is now stale and must be corrected to cite the 2026-08-29 decision.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: tdd-workflow
- **Files**: `src/data/testimonial.ts`
- **ACs**: AC-8
- **Depends on**: []
- **Done when**: `serviceOwnerTestimonials` exports the existing `homeQuote` record with a slug and structured attribution, `careersHearQuote` and `src/data/quality.ts` are byte-identical to before, and `npx tsc --noEmit` passes.

### Step 2: Segment chrome + listing page
- **What**: A `testimonials` layout supplying `Navbar solidWhenTop`, `<main id="main">`, `Footer` and a metadata template, plus the listing page rendering one `TestimonialCard` per record in a responsive grid with a separate "Read testimonial" link at each cell's foot.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: e2e-testing
- **Files**: `src/app/testimonials/layout.tsx`, `src/app/testimonials/page.tsx`
- **ACs**: AC-1, AC-2, AC-9
- **Depends on**: [1]
- **Done when**: `/testimonials` renders every record as a card with its own working link, navbar and footer both present, zero records renders without throwing.

### Step 3: Detail page
- **What**: Dynamic `[slug]` page using `generateStaticParams`, `generateMetadata` (per-testimonial title and description), exact-match `find()`, `notFound()` on miss, and a stated fallback where the long-form field is absent.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: e2e-testing
- **Files**: `src/app/testimonials/[slug]/page.tsx`
- **ACs**: AC-3, AC-4, AC-5, AC-7
- **Depends on**: [1]
- **Done when**: every slug from the listing renders a titled page; an unknown, wrong-cased, or empty slug lands on the standard not-found page; the fallback sentence renders for records with no long-form content.

### Step 4: Home-page "Read More Testimonials" link
- **What**: An optional CTA prop on `QuoteSection`, rendered only when supplied, passed from the home page pointing at `/testimonials`.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: e2e-testing
- **Files**: `src/components/quote-section/QuoteSection.tsx`, `src/app/page.tsx`
- **ACs**: AC-6
- **Depends on**: [1]
- **Done when**: the home quote band shows the link and still has its two-column grid and `Blob`; `/careers/why-us` renders with no such link and is otherwise unchanged.

### Step 5: Measured verification sweep
- **What**: Measure — not inspect — contrast, overflow, and motion on both new pages, fix any defect found, and confirm release readiness.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: e2e-testing
- **Files**: `src/app/testimonials/layout.tsx`, `src/app/testimonials/page.tsx`, `src/app/testimonials/[slug]/page.tsx` (fix-only; no new files)
- **ACs**: AC-10, AC-11, AC-12, AC-13
- **Depends on**: [2, 3]
- **Done when**: every text/background pair on both pages measures ≥4.5:1 (≥3:1 large) from **sampled rendered pixels** run through the WCAG formula; `document.documentElement.scrollWidth <= window.innerWidth` at 390px on both pages; no animation runs with reduced-motion emulated; `npx tsc --noEmit`, `npx eslint src`, and `npm run build` all exit clean.

#### Parallelism Analysis

| Step | Depends On | Files | Parallel Group |
|------|-----------|-------|----------------|
| 1 | [] | `src/data/testimonial.ts` | A |
| 2 | [1] | `src/app/testimonials/layout.tsx`, `src/app/testimonials/page.tsx` | B |
| 3 | [1] | `src/app/testimonials/[slug]/page.tsx` | B |
| 4 | [1] | `src/components/quote-section/QuoteSection.tsx`, `src/app/page.tsx` | B |
| 5 | [2, 3] | testimonials pages (fix-only) | C |

## 5. Test Strategy

- **Unit**: none warranted. There is no branching logic beyond `find()` and one presence check; a unit test over a static array asserts the array, not behaviour.
- **Integration**: `npm run build` is the real integration check here — `generateStaticParams` must emit a route for every record and every listing link must match one (AC-2, AC-5). A build that emits a link with no matching static param is the failure this catches.
- **Live / browser** (owned by Step 5 and re-run by the Tester): visit `/testimonials`, follow every card link, request a bogus slug, request a wrong-cased slug. Measure contrast by sampling rendered pixels; measure overflow via `scrollWidth`; re-run both with reduced-motion emulated.
- **Regression**: `/careers/why-us` and `/quality` must render unchanged quote text, character for character (AC-8), and `/careers/why-us` must not gain the new CTA. Home's quote band keeps its two-column grid and `Blob` (AC-6).

## 6. Risk Analysis

| Risk | Mitigation |
|---|---|
| `QuoteSection` is shared with `/careers/why-us`; an unconditional CTA leaks there | CTA prop is optional and unset on that page — Step 4's Done-when checks it explicitly |
| `initials`/`role` get hardcoded in the listing component, breaking the §7.2 attribution contract | Step 1 puts them on the record; Step 2 may not contain either literal |
| `TestimonialCard` was built for the light careers pages; the listing must sit on a light ground | Listing uses `bg-warm-bg` like the careers/quality segments — do **not** reach for `QuoteCard`, whose `teal-50` text only passes on coloured bands |
| Contrast passed by eye and failed on measurement (issue #91 precedent) | Step 5 is a distinct step with pixel sampling in its Done-when, not a checklist item |
| A single-card grid looks thin | Accepted, not a defect — Assumption 7.4 |
| Backward compatibility | None at risk: no persisted state, no API, no consumer outside this repo |

## 7. Security Considerations

No new attack surface. Both pages are statically generated at build time from a checked-in array, with no user input, no query parameters read, no form, no write path, no auth or privilege boundary touched. The `slug` parameter is used only as a `find()` comparison key and is never interpolated into markup, a URL, or a query. Quality and Security gates are waived for this feature by user decision recorded in the task assignment; nothing in this design contradicts that assessment.

The one non-technical exposure is deliberate and already adjudicated: the spec's §7 item 2 records the dated human decision to attribute the quote as "JW, Service Owner" on an indexable permalink for a service recipient in a HIQA-regulated context. It is settled and must not be re-litigated downstream. Its only implementation obligation is the single-record constraint above, which exists so a client reversal is one edit.

## 8. Rollback Strategy

Revert the commit. No data migration, no schema, no persisted state, no external system — the pages are static output regenerated on the next build. Reverting `src/data/testimonial.ts` restores the record's original shape and the home band with it.

**Trigger conditions**: any AC-10 contrast measurement below threshold that cannot be fixed in place; the client withdrawing the "JW, Service Owner" attribution decision before release (in which case the one-record edit is the cheaper fix than a revert).

## 9. Definition of Done

- [ ] Every service-owner testimonial record renders as one card in a single responsive grid on `/testimonials` (AC-1)
- [ ] Each card carries a separate "Read testimonial" link at its foot, not a whole-card link, and every link resolves — zero not-found results from the listing (AC-2)
- [ ] Every detail page shares one structure, renders long-form content in full when present, and stays coherent when absent (AC-3)
- [ ] An unknown, malformed, or wrong-cased slug shows the site's standard not-found page — no crash, no blank page, no silent redirect (AC-4)
- [ ] A page is pre-generated for every record, each with its own title and description (AC-5)
- [ ] The home quote band shows a "Read More Testimonials" link to `/testimonials`, with its two-column layout and `Blob` both still present (AC-6)
- [ ] A record with no long-form content renders a stated fallback, and its card's link still resolves (AC-7)
- [ ] The quote text and attribution have exactly one authoritative definition; `/careers/why-us` and `/quality` quote text is byte-identical to before; no component contains `"JW"` or `"Service Owner"` as a literal (AC-8)
- [ ] Listing and every detail page show the standard navbar and footer, including on direct entry (AC-9)
- [ ] Every text/background pair on both new pages measures ≥4.5:1 (≥3:1 large text) from sampled rendered pixels through the WCAG formula (AC-10)
- [ ] `document.documentElement.scrollWidth <= window.innerWidth` at 390px on both new pages (AC-11)
- [ ] No animation plays on either new page with reduced-motion enabled (AC-12)
- [ ] `npx tsc --noEmit`, `npx eslint src`, and `npm run build` all complete with zero errors (AC-13)
- [ ] `npx eslint src --rule '{"complexity":["warn",{"max":10}]}'` reports no violation
- [ ] `tasks/todo.md` and `tasks/lessons.md` are not committed
- docs_required: false

## 10. Lean Pass

| Step cut/merged | Rung | Why | ACs it served | Re-homed to |
|---|---|---|---|---|
| "Add `src/app/not-found.tsx`" | 1 | `careers/open-roles/[slug]` already relies on Next's built-in page — that **is** the site's standard not-found today. Adding one changes existing behaviour on every route. | AC-4 | Step 3 |
| "Add reduced-motion guards to the new pages" | 2 | `globals.css:385` already neutralises all animation and transition site-wide under `prefers-reduced-motion: reduce`. Nothing to add — only verify. | AC-12 | Step 5 |
| "New `src/data/testimonials.ts` module" | 1 | A second data module for one record, when the authoritative record already lives in `src/data/testimonial.ts`. A separate module would also break the single-definition contract. | AC-8 | Step 1 |
| "Build a `TestimonialListCard` wrapper (card + CTA)" | 1 | One implementation, one caller, one `map()`. Inline the link as a sibling of the card. | AC-2 | Step 2 |
| "Empty-state component for zero records" | 1 | Unreachable with today's data (Assumption 7.6); an empty grid renders nothing and throws nothing. Copy is explicitly unspecified. | — | — |
| "Separate `layout.tsx` step" | merge | Three lines of chrome that only exist to serve the listing and detail pages. | AC-9 | Step 2 (merged) |
| "Separate metadata step" | merge | `generateMetadata` is four lines in the file that already does the `find()`. | AC-5 | Step 3 (merged) |
| "Separate AC-7 fallback step" | merge | One ternary in the detail page. | AC-7 | Step 3 (merged) |
| "Per-page accessibility steps (one per new page)" | merge | Same measurement run, same tooling, one browser session. | AC-10, AC-11, AC-12 | Step 5 (merged) |

**Reuse, not build** (rung 2 — no step needed): `TestimonialCard`, `Container width="reading"` (already `max-w-lg`), `Navbar`, `Footer`, `QuoteCard`, the `bg-warm-bg` / `nav:pt-28` segment-layout convention, and the `open-roles/[slug]` detail pattern.

Eight candidate steps reduced to five. No acceptance criterion lost a home.
