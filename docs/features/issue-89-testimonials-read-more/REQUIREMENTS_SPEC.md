# Requirements Specification: Testimonials "Read More" (Issue #89)

## 1. Functional Requirements (FR)

FR-1: The home page's service-owner testimonials section must display a "Read More Testimonials" link that navigates to a testimonials listing page. (AC-6)

FR-2: The testimonials listing page must display one card for every service-owner testimonial record, arranged in a single responsive grid. (AC-1)

FR-3: Each card on the listing page must display a "Read testimonial" call-to-action link, positioned at the card's foot and separate from the rest of the card (not a whole-card link). (AC-2)

FR-4: Every call-to-action link produced by the listing page must resolve to an existing page — no link may lead to a not-found result. (AC-2)

FR-5: A testimonial detail page must be reachable at a unique address per testimonial record and must render every testimonial's content using the same page structure. (AC-3, AC-5)

FR-6: Requesting a testimonial detail page for an identifier that matches no existing record must display the site's standard not-found page, not a crash and not a blank page. (AC-4)

FR-7: A detail page must be pre-generated in advance for every service-owner testimonial record, and each must carry a page title and description specific to that testimonial. (AC-5)

FR-8: When a testimonial record's long-form content is absent, its detail page must render a stated fallback message in place of that content, so the page remains coherent and non-empty; the record's card must keep its "Read testimonial" link, which must still resolve to that page. (AC-3, AC-7 — see Assumption 7.1)

FR-9: The testimonials listing page and every testimonial detail page must display the site's standard navigation bar and footer. (AC-9)

FR-10: The testimonial quote text shown on the home page must originate from exactly one authoritative definition, shared with the matching entry on the testimonials listing. (AC-8)

FR-11: The testimonial quote text displayed on pages outside this feature (the careers "why us" page and the quality page) must remain unchanged, character for character, after this feature ships. (AC-8)

## 2. Acceptance Criteria (AC)

| AC-ID | Section | Assertion | Verdict |
|---|---|---|---|
| AC-1 | Listing | Every service-owner testimonial record renders as one `TestimonialCard`-equivalent card in a single responsive grid on the testimonials listing page. | pass/fail |
| AC-2 | Listing | Every card displays a separate "Read testimonial" link at the card's foot (not a whole-card link); every such link resolves to an existing detail page — zero not-found results from the listing. | pass/fail |
| AC-3 | Detail | Every testimonial detail page uses the same page structure; when the record's long-form content is present it is rendered in full, and the page is coherent and non-empty when that content is absent (see AC-7). | pass/fail |
| AC-4 | Detail | Requesting an unknown, malformed, or case-mismatched testimonial identifier displays the site's standard not-found page — not a crash, not a blank page, not a silent redirect. | pass/fail |
| AC-5 | Detail | A detail page is pre-generated for every testimonial record; each has a page title and description specific to that testimonial. | pass/fail |
| AC-6 | Home | The home page's service-owner testimonials section displays a "Read More Testimonials" link that navigates to the testimonials listing page; the section's existing two-column layout and decorative element are both still present after the change. | pass/fail |
| AC-7 | Detail | A record with no long-form content renders a stated fallback message on its detail page instead of appearing broken or near-empty; per Assumption 7.1, the card's "Read testimonial" link stays present and resolves to that page. | pass/fail |
| AC-8 | Data integrity | The home page's testimonial quote text has exactly one authoritative definition, shared with its corresponding listing card; the quote text on the careers "why us" page and on the quality page remains unchanged, character for character. | pass/fail |
| AC-9 | Chrome | The testimonials listing page and every testimonial detail page display the site's standard navigation bar and footer. | pass/fail |
| AC-10 | Accessibility | Every text element against its background on both new pages measures at least 4.5:1 contrast (3:1 for text sized 18pt/24px or larger, or 14pt/18.66px bold and larger), measured by sampling rendered pixel colour values through the WCAG contrast formula. | pass/fail |
| AC-11 | Responsive | Neither new page produces horizontal scrolling at a 390px viewport width; the page's total rendered width does not exceed the viewport width (measured via the document's full scrollable width against the viewport's visible width). | pass/fail |
| AC-12 | Accessibility | No animation on either new page plays when the visitor's reduced-motion accessibility preference is enabled. | pass/fail |
| AC-13 | Release readiness | The project's build process and its static code analysis (lint) checks both complete with zero errors. | pass/fail |

## 3. Edge Cases

- **Unknown identifier**: a detail-page address for a testimonial identifier that matches no record → not-found page (AC-4).
- **Malformed identifier**: an identifier containing unexpected characters, wrong casing, an empty value, or extra path segments → treated as unknown, same not-found behaviour as above (AC-4). Identifier matching is assumed case-sensitive and exact (Assumption 7.5).
- **Zero testimonial records**: if the data source ever holds no records, the listing page must render without an unhandled error. The exact empty-state message is unspecified, because this state does not occur with the data that exists today (Assumption 7.6).
- **Exactly one testimonial record**: the current real-world state. The listing must render a single-card grid correctly, without broken layout, and this is accepted as correct for this feature's first release, not a defect (Assumption 7.4).
- **Duplicate identifiers**: if two records were ever authored with the same identifier, resolution must be deterministic (first match wins) rather than crashing or picking unpredictably (Assumption 7.5).
- **Empty long-form content**: today, every record's long-form content is absent. This is the default rendering path for every detail page in the current data set, not a rare occurrence (AC-3, AC-7, AC-8, Assumption 7.1/7.3).
- **Long attribution or quote text**: card and detail-page layouts must not visually break under long text — existing text-truncation behaviour on the card is expected to continue applying (no new component is introduced for this feature).
- **Reduced-motion preference enabled**: no animation on either new page plays (AC-12).
- **Narrow viewport (390px)**: neither new page produces horizontal scrolling (AC-11).
- **Concurrent access**: N/A — justification: both new pages are read-only, statically defined content with no user input, no write operations, and no per-visitor state; concurrent visits cannot conflict.
- **Testimonial record withdrawn or removed**: removing a testimonial record from the data source is a single-record deletion with no other required change; its detail-page address must resolve to the standard not-found page (AC-4) on the next build after removal, and it must no longer appear as a card on the listing page (AC-1).

## 4. State Transitions

This feature is navigational rather than stateful — there is no persisted or mutable application state, only page-to-page navigation. The reachable states and their triggers:

1. **Home** → (visitor selects "Read More Testimonials") → **Testimonials Listing**.
2. **Testimonials Listing** → (visitor selects a card's "Read testimonial" link, valid identifier) → **Testimonial Detail — content present**, or **Testimonial Detail — fallback shown** (record's long-form content absent; see AC-7/AC-8).
3. **Any page** → (visitor requests a detail-page address with an identifier that matches no record, or a malformed one) → **Not Found**.
4. **Testimonials Listing** and **Testimonial Detail** are both reachable directly from an external address (e.g., a bookmark or shared link) without passing through Home; each must independently satisfy AC-9 (standard navigation bar and footer) regardless of entry point.

No transition is reversible-only or time-limited; all are ordinary page navigations.

## 5. Failure Conditions

- **Requested identifier matches no record**: the system must display the standard not-found page. No partial page content, no unhandled error surfaced to the visitor. (AC-4)
- **Testimonial data source contains zero records at render time**: the listing page must render without throwing an unhandled error. (Section 3, Assumption 7.6)
- **A given record's long-form content is absent**: the detail page must not error, must not render blank content, and must not omit the standard page chrome (navigation bar, footer). (FR-8, AC-3, AC-7, AC-9)
- **A listing link fails to resolve** (should not occur under FR-4): if a card's link ever points to an identifier with no matching record, this is a defect condition; the resulting behaviour still falls back to the not-found page defined in AC-4, never a crash.
- **Contrast, overflow, or motion checks fail measurement**: any single failed measurement (AC-10, AC-11, AC-12) is a release blocker for this feature — no partial credit for "close enough."

## 6. Non-Functional Clarifications

- **Contrast**: every text/background pairing on both new pages must measure at least 4.5:1 (or 3:1 for text 18pt/24px or larger, or bold text 14pt/18.66px or larger), measured from sampled rendered pixel colour values run through the WCAG contrast formula — including where text sits over any decorative background element. (AC-10)
- **Responsive layout**: zero pixels of horizontal overflow at a 390px viewport width on either new page. (AC-11)
- **Motion / accessibility**: no animation on either new page executes when the visitor's operating-system-level reduced-motion preference is enabled. (AC-12)
- **Release readiness**: the project's build process and its static code analysis must both complete with zero errors before this feature is considered releasable. (AC-13)
- **Data integrity**: the home page's testimonial quote text must have exactly one authoritative definition; a change to that text must not require a second, independent edit to keep the corresponding listing card in sync. The quote text used on the careers "why us" page and the quality page is out of scope and must remain byte-identical to its current form. (AC-8)

## 7. Assumptions Made Explicit

1. **AC-7's fallback behaviour resolves to "render a stated fallback," not "omit the card's link."** AC-2 requires every listing card to carry a working call-to-action link with zero not-found results, and AC-3 establishes that empty long-form content is the default state for every record that exists today (not a rare edge case). Omitting the link for every current record — the other option AC-7 names — would leave the listing with no functioning detail links at all, which is inconsistent with AC-1/AC-2. This spec proceeds on "render a stated fallback." The exact wording of that fallback message is left to downstream implementation.
2. **HUMAN DECISION — not an assumption — recorded 2026-08-29 by the user, on behalf of the client:** the testimonials detail pages introduced by this feature (AC-7) will attribute the quote as "JW, Service Owner." This is a decision on the record, not a derived assumption, and must not be re-opened as an open question in any later review of this spec.
   - **What was weighed before deciding:** (a) the identical quote is fully anonymized elsewhere in the product — shown as "A Lotus Care Resident" with no name or initials — under a documented client decision; (b) the testimonial's own source-data documentation independently notes that attribution beyond the initials "JW" was still unresolved as of authoring; (c) a dedicated, indexable, SEO-titled permalink (this feature's new page) is a materially greater exposure than that same quote's existing embedding in the home-page band, for a disability-service recipient in a HIQA-regulated context — a distinction the user weighed and decided did not require matching the anonymized treatment.
   - **Implementation constraint carried from this decision:** the attribution text "JW, Service Owner" must remain part of the same single authoritative testimonial record that AC-8 already requires the quote text to be drawn from — read from that one definition everywhere it is displayed, never duplicated as a separate literal value. A future reversal by the client must be achievable as a one-line change to that record, with no other change required.
   - **Scope boundary:** this decision applies only to the new testimonials detail/listing surface built by this feature. The already-anonymized quote used elsewhere in the product is a deliberately different treatment of the same underlying content in a different context and must not be changed to match this decision (see Section 3, "concurrent work" boundary carried in the task assignment for this revision).
3. No record in the current data set has long-form content beyond a single opening line. Every detail page in the current data set is expected to render via the fallback path described in Assumption 7.1.
4. A listing page showing a single card is accepted as correct for this feature's first release. A thin grid is not treated as a defect (per the planning notes' own Risks section, reviewed and accepted by the user).
5. Testimonial identifiers are assumed unique per record and are matched with an exact, case-sensitive comparison. No two records are expected to share an identifier; if they ever did, the first match is assumed to win.
6. If the testimonial data source ever holds zero records, the listing page must render without an unhandled error; the exact empty-state message is unspecified because this state does not occur with the data that exists today.
7. The "Read More Testimonials" link added to the home page's service-owner section must not change that section's existing column count or remove its decorative background element — it is added as a new element within the existing section, not a restructuring of it.
8. "Read testimonial" and "Read More Testimonials" are used here as descriptive labels for the two link types; the exact visible wording is not prescribed by this spec beyond being unambiguous to the visitor about its destination.

## 8. Ambiguities Found

N/A — no unresolved ambiguity requiring user clarification remains. Of the three content-related risks noted in the planning notes: long-form copy absent for every record (Assumption 7.3) and a single-card listing at first release (Assumption 7.4) were reviewed and accepted by the user in planning and are carried into this spec as assumptions, not as blockers. The third — attribution — is no longer an open question at all: it is the settled, dated human decision recorded as item 2 of Section 7 ("JW, Service Owner," decided 2026-08-29), not an assumption. The one internal tension found between AC-2 and AC-7 (Assumption 7.1) is resolved through the other locked acceptance criteria's own logical consequence, not through information only the user could supply, so it did not require pausing the pipeline.
