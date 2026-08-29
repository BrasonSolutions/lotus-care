# Feature Context Card: Testimonials "Read More" (Issue #89)

Adds a "Read More Testimonials" link to the home page's service-owner testimonials section, a new listing page showing every testimonial as a card, and a per-testimonial detail page sharing one layout.

## Acceptance Criteria

| AC-ID | Section | Assertion | Verdict |
|---|---|---|---|
| AC-1 | Listing | Every service-owner testimonial record renders as one card in a single responsive grid on the listing page. | pass/fail |
| AC-2 | Listing | Each card has a separate "Read testimonial" link at its foot (not a whole-card link); every link resolves — zero not-found results from the listing. | pass/fail |
| AC-3 | Detail | Every detail page uses the same structure; renders content in full when present, and stays coherent/non-empty when absent (see AC-7). | pass/fail |
| AC-4 | Detail | Unknown/malformed/case-mismatched identifier → standard not-found page, not a crash or blank page. | pass/fail |
| AC-5 | Detail | A detail page is pre-generated for every record; each has a testimonial-specific title and description. | pass/fail |
| AC-6 | Home | Home page shows "Read More Testimonials" link to the listing; existing two-column layout and decorative element still present. | pass/fail |
| AC-7 | Detail | Record with no long-form content renders a stated fallback (not omission); card's link stays present and resolves (Assumption 1). | pass/fail |
| AC-8 | Data integrity | Home quote text has exactly one authoritative definition, shared with its listing card; text on careers "why us" and quality pages stays byte-identical. | pass/fail |
| AC-9 | Chrome | Listing and every detail page show the standard navigation bar and footer. | pass/fail |
| AC-10 | Accessibility | Text/background contrast ≥4.5:1 (≥3:1 large text), measured via sampled pixels through the WCAG formula. | pass/fail |
| AC-11 | Responsive | Zero horizontal overflow at 390px viewport on either new page. | pass/fail |
| AC-12 | Accessibility | No animation plays when reduced-motion preference is enabled. | pass/fail |
| AC-13 | Release readiness | Build and lint both complete with zero errors. | pass/fail |

## Out of Scope

- Fixing `/referrals`'s missing navbar/footer (pre-existing, separate issue).
- Deduplicating the JW quote across the careers "why us" page and the quality page — content-integrity decision for a separate issue.
- The placeholder testimonials array on the careers page — belongs to a separate issue.
- Merging staff testimonials into this listing — service-owner testimonials only.
- A third testimonial component — the existing card component is reused as-is.

## Key Constraints

- WCAG AA contrast, measured (not eyeballed), including over decorative backgrounds.
- All motion gated behind reduced-motion preference.
- No horizontal overflow at 390px.
- Build and lint must both pass with zero errors.
- Quality Reviewer and Security Advisor gates are waived for this feature (frontend-only, no auth/data/API surface) — see task assignment.
- Attribution "JW, Service Owner" (item 2 below) lives on the same single authoritative testimonial record AC-8 already requires, never duplicated as a separate literal, and is not applied to the separately-anonymized quote elsewhere in the product.

## Assumptions

1. AC-7 resolves to "render a stated fallback," not "omit the card's link" — omission would break every current card, since every record's long-form content is absent today.
2. **Decision, not assumption** (2026-08-29, user on behalf of client): detail pages attribute the quote as "JW, Service Owner" despite the identical quote being anonymized elsewhere — a dedicated indexable permalink was judged higher exposure. Full reasoning: REQUIREMENTS_SPEC.md §7 item 2.
3. Every current record renders via the fallback path — no long-form copy exists yet.
4. A single-card listing at first release is accepted, not a defect.
5. Testimonial identifiers are unique and matched case-sensitively; a duplicate would resolve to first-match.
6. Zero records must not crash the listing; exact empty-state copy is unspecified (unreachable today).
7. Removing a record is a single-array deletion; its old address then resolves to not-found on the next build.
