# Lessons

1. **Verify the whole criterion, not the half you can see in the source.**
   Constraint C-6 on card P5 required empty-`bio` members to "collapse cleanly — no empty line, no ragged card heights". The JSX was checked (`{member.bio && …}` correctly rendered no paragraph) and the constraint was marked satisfied, but card heights were never measured. A tester later found empty-bio cards rendering 58px shorter than siblings, because the grid item was a wrapper div that stretched while the nested `<button>` did not.
   **Rule:** when an acceptance criterion has two clauses, measure both — reading the markup proves the markup clause only.
   **Scope:** global.

2. **A visual claim without a number is a guess.**
   Across this build, every defect that mattered was found by measurement, never by inspection: the 58px height spread, 2462px of horizontal overflow at 390px, a heading sitting 90px off centre, and a CTA at 2.74:1 contrast.
   **Rule:** layout, contrast, overflow, and CLS claims must come from a running browser — `getBoundingClientRect()`, sampled pixels through the WCAG formula, `PerformanceObserver`. "Looks fine" is not evidence.
   **Scope:** global.

3. **Fix the cause, not the symptom.**
   The 58px height spread was first addressed by adding `h-full` to force the short card to stretch. The user's actual feedback was that descriptions do not belong on the cards at all — they were already in the modal. Removing the bio removed the source of the variance entirely and shortened the component.
   **Rule:** when a defect comes from content that may not need to exist, question the content before compensating for it in CSS.
   **Scope:** global.

4. **Removing a wrapper can remove a constraint you were relying on.**
   Card P3 gave `HomesCarousel` an `embedded` prop that skips its `<Container>`. That Container had been silently bounding a horizontally-scrolling child; without it, CSS Grid's automatic minimum size (`min-width: auto`) let the scroller expand its whole track, pushing the document to 2852px wide at a 390px viewport.
   **Rule:** when removing a layout wrapper, ask what it was constraining, and add `min-w-0` to grid/flex items that contain scrollable content.
   **Scope:** global.

5. **CSS reduced-motion handling does not cover media autoplay.**
   This project gates animation through one global `@media (prefers-reduced-motion: reduce)` block, which works for every CSS animation on the site. It cannot stop a `<video autoplay>`. Card P3 needed a JS `matchMedia` check instead.
   **Rule:** video and audio autoplay need an explicit scripted reduced-motion check; the global CSS rule is not sufficient.
   **Scope:** project (and global wherever media is added).

6. **Reuse the established pattern, but verify it before copying it.**
   Card P2's secondary CTA reused `CareersCTAStrip`'s outline treatment — correct. But that component's *primary* pairing (`bg-white` + `text-primary`) measures 2.74:1 and fails AA, so copying it wholesale would have propagated a defect.
   **Rule:** when adopting an existing pattern, measure it first; "it is already in the codebase" is not proof it is correct.
   **Scope:** project.

7. **Stated design decisions outrank a filename.**
   `dignity-activity.jpg` sounded like the ideal hero image for card P1's activity-imagery brief. Looking at it showed an elderly couple and a uniformed carer leaning over a wheelchair user — wrong demographic for a disability provider, and close to the care-sector clichés the card explicitly forbids.
   **Rule:** for imagery decisions, look at the image; filenames and alt text are not a substitute.
   **Scope:** project.

8. **A per-card exemption is not a standing one.**
   Security review was skipped for the P cards because they are static frontend changes with no backend, input, network, or secrets. Card N1 ("Have Your Say") is the one card that touches a Route Handler, an email service, spam protection and a safeguarding signpost.
   **Rule:** record exemptions against the card that earned them, and name the cards they do not cover.
   **Scope:** project.

9. **A carousel with no overflow is a carousel whose controls lie, and source arithmetic could not see it.**
   Card CR1's `CultureGallery` carousel went through two source-based diagnoses in a row that both put the defect in the index-rounding maths, copying the M3 `HomesCarousel` ceiling-guard pattern. Only a real-browser measurement showed the actual defect: `scrollWidth == clientWidth` at 1440px (four fixed-width cards exactly fit the container), so arrows and dots cycled their own highlight while nothing on screen moved. "The indicator is wrong" and "there is nothing to scroll" read identically in the source — only the DOM tells them apart.
   **Rule:** for any scroller, measure `scrollWidth` against `clientWidth` at every breakpoint before theorising about index maths.
   **Corollary trap:** a ceiling guard of the form `scrollLeft >= maxScrollLeft - 1` is unconditionally true when `maxScrollLeft` is `0`, so it must be written `maxScrollLeft > 0 && scrollLeft >= maxScrollLeft - 1` — applied bare, it would have pinned `activeIndex` to the last dot permanently at rest. `HomesCarousel.tsx` carries this exact unguarded form today; it is dormant only because 8 homes always overflow at every breakpoint that's been measured. Recorded as a known, deliberate non-fix — out of CR1's scope, worth a guard the day that assumption stops holding.
   **Scope:** global.

10. **A class named for a unit is not a measure.**
    Card CR3's first fix added `max-w-prose` to a text column to bring its reading measure into a comfortable range. It measured byte-identical before and after — `canvas.measureText` against each element's real computed font returned the same 86/86/91/85 characters whether the class was present or not. Cause: Tailwind's `prose` cap is `65ch`, and `ch` is the width of the font's `"0"` glyph, not the font's average character width. At 16px Inter, `65ch` computes to ≈656px, which happened to already be the column's natural width — the cap was never binding, it just coincided with what was already there. The fix only landed once the cap was re-derived from a measured px-per-character ratio (`max-w-lg`/512px, predicting and then confirming ~67 real characters).
    **Rule:** verify a typographic cap by counting rendered characters (or measuring the box in px against a known px-per-character ratio for that font/size), never by the presence of the class. A fix that measures identical before and after is not a fix, no matter how plausible the class name reads.
    **Corollary:** `Container.tsx`'s shared `width="reading"` option resolves to this same `max-w-prose` value and is used elsewhere on the site (e.g. the `/quality` hub's intro paragraph) — the same overshoot likely applies wherever it's used. CR3 deliberately did not touch the shared primitive (out of its Quality/Safety-page surface); flagged for whichever card next has the whole site in scope.
    **Scope:** global.

11. **A whole-line `grep -v` filter drops real matches.**
    Card G1's first sweep for `bg-primary` (then, separately, `text-primary`) piped through `grep -v "bg-primary-dark"` to exclude the darker token. Excluding `bg-primary-dark` by filtering whole lines hid every line where the same className string also contained `hover:bg-primary-dark` — which is most buttons (`Navbar.tsx`'s primary CTA was the first casualty found). It bit twice in one card, on two different tokens, because the fix for the first instance (switch to a precise per-token regex) wasn't retroactively applied to the second search.
    **Rule:** when excluding a longer token that shares a prefix with the one you want, match at the token boundary (e.g. `grep -oP` on the exact token, or a regex with boundary lookarounds), never by discarding the whole line — a line can legitimately contain both the wanted token and the excluded one. Re-run the search precisely before trusting a count.
    **Scope:** global.

12. **A palette gap is a distribution problem, not a volume problem.**
    Card G1's brief said "use more of the brand colours." The plan responded by deepening teal (fixing ~28 files' worth of `bg-primary`/`text-primary` AA failures to `-dark` variants), which would have made the site *more* monochrome, not less — teal only, no purple, on three of four key pages. Pixel measurement (post-fix) showed the site was already 29–50% brand-hued but purple sat at 0.01–0.54% on those same pages — the site had plenty of colour, just concentrated in one hue.
    **Rule:** before acting on a "more colour" instruction, measure the existing distribution per hue, not just total brand-colour coverage — "not enough colour" and "the wrong balance of colours" look identical in source (both read as "mostly neutral-looking classNames") and call for opposite fixes: adding saturation vs. rebalancing what's already there.
    **Scope:** global.

13. **"Same components, same CTA labels" is not "matches the spec" — check literal values, not structural shape.**
    Reconciling the homepage against a Figma export, the hero was declared "already matches, just needed the font" after noticing it used the same grid/CTA/decorative-mark *components* as the reference. It didn't match: still the old placeholder image (not the client's actual chosen photo, supplied separately), a two-colour heading where the Figma showed one solid colour with different wording, an extra clause in the subtitle, and a decorative watermark that was the wrong component (`LotusMark` vs `LotusMarkAlt`), 3× too small, unrotated, and on the wrong corner. All of this was sitting in the same CSS export already being used to check the rest of the page — it just wasn't checked for this one section, because "same shape" read as "already correct" and the diff stopped early.
    **Rule:** when reconciling against a spec, diff literal values (asset src, exact copy, exact colour, exact size/rotation/position of every decorative element) section by section — never conclude a section matches because it uses the same components/structure. Structural similarity and content match are independent checks; do both, especially for the most prominent section (the user's own words: "one of the most important parts").
    **Scope:** global.

14. **Don't simplify a spec's colours/fonts to "close enough" when the real values are sitting right there in the data.**
    Building the career-pathway stage icons, the source geometry (`LOTUS_FACETS`) already carried each facet's real designer colour — the same data `LotusMark tone="color"` uses — but the icon was built rendering every facet flat white instead, because "white on a dark circle" was a plausible-looking simplification made without re-checking whether the real colours were available. Same pattern with the page's typography: the Figma explicitly specified DM Sans for five separate headings on the page, `font-dm-sans` was already a proven, working utility class from earlier the same session, and it still didn't get applied anywhere — the default sans-serif looked plausible enough that it wasn't checked against the spec's literal `font-family` value.
    **Rule:** when a spec gives an explicit colour or font value, use that literal value or the token nearest to it — never substitute a simpler default (flat colour, default font) because it "looks about right." If real per-element data already exists in the codebase (a colour map, a token), prefer it over inventing a flatter version. After building, grep/inspect the rendered output for the specific values the spec named (a color hex, a font-family string) rather than eyeballing "does this look like the reference."
    **Scope:** global.

15. **When N stages map onto M discrete states and N ≠ M, check the boundary explicitly — don't assume a linear slice lines up.**
    A 5-stage career pathway was mapped onto a 6-petal-group lotus reveal via `BLOOM_ORDER.slice(0, stage)` — stage 5 sliced 5 of 6 groups, so the "final, most senior" stage never actually reached full bloom, undercutting the entire "blooms in stages" concept at its one most-visible moment (the last step). The mismatch (5 stages, 6 groups) was known at build time; the slice was written as if they matched anyway.
    **Rule:** when distributing N steps across M states where N ≠ M, explicitly verify (or force) that the boundary conditions land correctly — first step's minimum state and last step's maximum/terminal state — rather than trusting a proportional slice/index to land there on its own. Write out the actual sequence for a few values and check the ends, don't just trust the formula.
    **Scope:** global.

16. **In this codebase (Tailwind v4), `-translate-y-*`/`-translate-x-*`/`rotate-*`/`scale-*` compile to the standalone `translate`/`rotate`/`scale` CSS properties, not `transform` — check the right property before diagnosing a cascade conflict.**
    A card's `hover:-translate-y-1` looked broken (`getComputedStyle(el).transform` stayed identity even with `:hover` confirmed matching), which was diagnosed as `.reveal.in-view`'s `transform: translateY(0)` winning the cascade — a plausible, wrong theory that led to an unnecessary two-div restructure before it was checked. Tailwind v4 emits translate/rotate/scale utilities against their own modern CSS properties (`translate`, `rotate`, `scale`), composed with `transform` only via the separate `.transform` utility class. `getComputedStyle(el).translate` showed `"0px -4px"` on hover the whole time — the utility was working correctly; the wrong property was being read.
    **Rule:** in this repo, when checking whether a Tailwind `translate-*`/`rotate-*`/`scale-*` utility applied, read `getComputedStyle(el).translate`/`.rotate`/`.scale` — not `.transform` — unless the element also carries the literal `.transform` class. Verify the property name before theorising about *why* a style isn't applying.
    **Scope:** project (Tailwind v4-specific compilation behaviour).

17. **This codebase has more than one reveal/hover convention for card grids — match the actual sibling section, not just any precedent that happens to look similar.**
    Told to "add animations" to a new careers-page card grid, `ServiceCard`/`ServicesSection`'s per-card `reveal-delay-{index}` stagger was used as the reference — a real, working convention, just the wrong one. The homepage's "Join Our Team" cards (`JobCard`/`RecruitmentSection`) use a different convention: one `reveal` around the whole grid, cards animate only on hover, no per-card entrance stagger. The user's actual complaint wasn't "no animation," it was "inconsistent with the cards right next to this concept" — and `RecruitmentSection` was the more directly comparable section (same careers domain), not `ServicesSection` (a different page entirely).
    **Rule:** when a task says "make it consistent" or "add animation like X," find and read the *specific* X named or most contextually adjacent — don't reach for whichever existing pattern is remembered/found first. If a codebase turns out to have multiple conventions for the same kind of UI, that's worth surfacing, but the immediate fix should match the one the user is actually comparing against.
    **Scope:** project (multiple reveal conventions exist here) — the general rule (verify which precedent is actually being asked for) is global.
