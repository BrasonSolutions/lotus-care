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
