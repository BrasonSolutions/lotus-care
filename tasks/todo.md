# C6 — Shared animated timeline component

Card source: `docs/build-plan.md` (C6). Full plan: `C:\Users\andre\.claude\plans\misty-chasing-sky.md`.

## Tasks
- [x] `src/components/timeline/Timeline.tsx` — `TimelineStep`/`TimelineProps`, `orientation` ("horizontal" | "vertical", default "vertical"), reuses `useInView` + `.pop-item` stagger (CircularCycle pattern)
- [x] `src/components/timeline/index.ts` barrel
- [x] `stories/ui/Timeline.stories.tsx` — Vertical (4 steps) + Horizontal (6 steps) stories, CSF3, autodocs
- [x] Verify: `npx tsc --noEmit`
- [x] Verify: `npm run lint`
- [x] Verify: `npm run build`
- [x] Verify: `npm run build-storybook`
- [x] Verify: `npm run storybook` manual check — Vertical/Horizontal render, Horizontal collapses to vertical below 768px, reduced-motion emulation shows no stagger

## Acceptance criteria (from build-plan C6)
- [x] Horizontal + vertical variants, prop-driven steps
- [x] Scroll/entrance animation, reduced-motion safe
- [x] Documented in Storybook
- [ ] Used by both C5 and C7 — N/A this cycle, tracked as future work (C5/C7 depend on C6, not the reverse)

## Explicitly out of scope (confirmed with user)
- Migrating `ProcessTimeline` (careers/how-we-hire) to `<Timeline>` — C7's job
- Migrating the training page's inline pathway list to `<Timeline>` — C5's job
- A `color` prop / second brand color — no current consumer needs it
- Storybook viewport addon — not configured, not needed to demonstrate the collapse

## Review

All in-scope acceptance criteria met. Summary:

- `src/components/timeline/Timeline.tsx` (new) — single `<Timeline>` component, `orientation` prop ("horizontal" | "vertical", default "vertical"). Vertical renders a left-border connector with numbered circle badges (same visual language as the training page's existing pathway list). Horizontal renders a numbered-circle row with a static connecting line on `md:` and up, and auto-collapses to the same vertical markup below `md` (one shared `verticalList` JSX value, no duplication). Column count for the horizontal grid is set via inline `gridTemplateColumns` since Tailwind JIT can't resolve a dynamically-interpolated `grid-cols-N` class, and step count is arbitrary (C7 needs 6, existing precedent had 4).
- Animation: reuses the existing `useInView` hook (`src/hooks/use-in-view.ts`, already reduced-motion safe) and the existing `.pop-item`/`.pop-item.in-view` CSS (already in `globals.css`), staggered via inline `transitionDelay = index * 90ms` — the exact pattern `CircularCycle`/`HubAndSpoke` already use. No new CSS, no new library.
- `src/components/timeline/index.ts` (new) — barrel, mirrors `src/components/blob/index.ts`.
- `stories/ui/Timeline.stories.tsx` (new) — `Vertical` (4-step fixture) and `Horizontal` (6-step fixture) stories, CSF3, autodocs, `orientation` radio control.
- Scope deliberately limited to building/documenting the component per the card and user decision: `ProcessTimeline` (careers/how-we-hire) and the training page's inline pathway list are both left untouched — migrating them is C7's and C5's job respectively, since both depend on C6 rather than the reverse.

Verified: `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run build-storybook` all pass. Manually checked in a live Storybook instance via Playwright: `Vertical` and `Horizontal` stories render correctly with real brand colors; resizing the `Horizontal` story's canvas to 400px confirmed it collapses to the vertical layout; emulating `prefers-reduced-motion: reduce` confirmed steps render at `opacity: 1` immediately with `transition-duration` collapsed to ~0 (no stagger).
