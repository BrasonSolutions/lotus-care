# Implementation Plan: Meet the Team — Photo-Forward Grid (P5)

## 1. Architectural Impact Analysis
- Affects 2 existing components (`TeamCard`, `TeamSection`) and 2 existing Storybook stories. No new routes, no new data files.
- **Modifies existing behavior** — not additive-only: grid column cap, avatar size, card content, and (per C-2) the mobile scroll-fade hint's tuning all change on already-shipped UI. Auto-approve criterion 1 fails; this plan follows the standard two-phase flow.
- No new domain concepts, entities, or bounded contexts. `TeamMember`/`departments` (`src/data/team.ts`) and filter logic are untouched — the redesign is presentational only.
- `<Blob>` (`src/components/blob/Blob.tsx`) exists but is currently unused anywhere in the app; this plan makes `TeamSection` its first real consumer, closing F4's last open AC (AA contrast) in a real layout rather than only in Storybook.

## 2. Proposed Design
- **TeamCard**: avatar 64px → 144px inside a single wrappable container (keeps the `<Image>`/initials-fallback swap intact for P6 to later wrap with `<LotusPhotoMask>` — C-3). Adds a department-accent chip (`w-12 h-12 rounded-xl`, `bg-primary/15 text-primary` / `bg-purple-600/15 text-purple-600`) — this exact class pair and index-parity alternation (`i % 2 === 0 ? "teal" : "purple"`) already exists in `BenefitCard`, `HubNavCard`, and 2 page-level call sites; reused verbatim, not reinvented. Adds a `line-clamp-2` bio excerpt that collapses cleanly when `bio` is `""` (C-6) via a conditional render, not an empty paragraph. Padding moves to `p-6 sm:p-8`. No top border (rejected in C4). Card gains one new prop: `accent?: "teal" | "purple"` (default `"teal"`), supplied by the caller — no new state, no new files.
- **TeamSection**: grid becomes `sm:grid-cols-2 lg:grid-cols-3` (drop `xl:grid-cols-4`), gap and vertical rhythm widened to suit taller cards. Passes `accent={i % 2 === 0 ? "teal" : "purple"}` to each `TeamCard` using the `i` already in scope for the stagger delay — no new data field. Places one `<Blob>` behind the section inside a `relative overflow-hidden` wrapper sized/clipped so it cannot cause horizontal scroll, using the existing token-restricted `color` prop (no arbitrary hex). The `key={activeDept}` remount + `animate-fade-up` stagger (C-1) is preserved as-is — it is orthogonal to card content. The mobile scroll-fade hint (C-2, hardcoded `right-0 top-0 bottom-4 w-8`) is re-checked against the new vertical rhythm since it is offset against the filter-pill row, not the card grid — likely unchanged, but must be verified, not assumed.
- **Storybook**: both existing story files (`TeamSection.stories.tsx`, `TeamCard.stories.tsx`) are updated in place — no new files. `TeamCard.stories.tsx` needs an `accent` arg added to its stories so the alternation is visible in isolation.
- Data flow is unchanged: `members`/`departments` still flow from `src/data/team.ts` → `src/app/page.tsx` → `TeamSection` → `TeamCard`. Filtering (`activeDept` state) is untouched.

## 3. Folder / Module Impact
**Modified** (no creations, no deprecations):
- `src/components/team-card/TeamCard.tsx`
- `stories/ui/TeamCard.stories.tsx` — not in the original files-in-scope hint but required: it exists (`title: "UI/TeamCard"`), and the build-plan card explicitly requires refreshing it. Flagged here rather than silently expanding scope.
- `src/components/team-section/TeamSection.tsx`
- `stories/sections/TeamSection.stories.tsx`

**Explicitly out of scope — do not touch (C-4)**: `src/components/team-modal/` (shared with `BoardSection`), `src/components/board-section/BoardSection.tsx`, `src/data/team.ts`.

## 4. Execution Breakdown (Task Graph)

### Step 1: TeamCard photo-forward redesign
- **What**: Grow the avatar to 144px, add the department-accent chip and 2-line bio excerpt (collapsing cleanly on empty `bio`), add the `accent` prop, update `TeamCard.stories.tsx` to exercise it.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: tdd-workflow
- **Files**: `src/components/team-card/TeamCard.tsx`, `stories/ui/TeamCard.stories.tsx`
- **ACs**: AC-1, AC-6, AC-7, C-3, C-4, C-5, C-6
- **Depends on**: []
- **Done when**: `TeamCard` renders a 144px photo (or initials fallback), a department chip, a truncated bio (or nothing, for empty `bio`), with explicit `next/image` `width`/`height`/`sizes` and no hardcoded hex.
- **Hints**: `[team, card, cards, photo, photos, member, members, initials, fallback, accent, purple, teal]` bfs

### Step 2: TeamSection grid + Blob placement
- **What**: Cap the grid at 3 columns, widen rhythm, wire the `accent` alternation into `TeamCard`, place a clipped `<Blob>` behind the section, re-verify the mobile scroll-fade hint and filter/stagger behavior.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: e2e-testing
- **Files**: `src/components/team-section/TeamSection.tsx`
- **ACs**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, C-1, C-2, C-4
- **Depends on**: [1]
- **Done when**: grid has no `xl:grid-cols-4`, a `<Blob>` renders behind content with no horizontal overflow at 390/768/1440px, and all 7 department filters still render the correct subset.
- **Hints**: `[team, section, blob, blobs, filter, grid, container, reveal, motion, reduced, prefers, contrast]` bfs

### Step 3: Storybook sync
- **What**: Update `TeamSection.stories.tsx` to reflect the new layout (still `Sections/TeamSection`, `layout: "fullscreen"`, `tags: ["autodocs"]`); confirm `TeamCard.stories.tsx` (updated in Step 1) builds cleanly alongside it.
- **Worker**: skill-worker-frontend
- **Language**: typescript
- **Test hint**: e2e-testing
- **Files**: `stories/sections/TeamSection.stories.tsx`
- **ACs**: none (visual verification only — all ACs already covered by Steps 1–2)
- **Depends on**: [1, 2]
- **Done when**: `npm run build-storybook` succeeds and both stories render the redesigned grid/card without controls errors.
- **Hints**: `[story, stories, storybook, team, card, section]` bfs

#### Parallelism Analysis

| Step | Depends On | Files | Parallel Group |
|------|-----------|-------|-----------------|
| 1    | []        | src/components/team-card/TeamCard.tsx, stories/ui/TeamCard.stories.tsx | A |
| 2    | [1]       | src/components/team-section/TeamSection.tsx | B |
| 3    | [1, 2]    | stories/sections/TeamSection.stories.tsx | C |

Step 2 depends on Step 1 for the real reason that matters: it needs `TeamCard`'s new `accent` prop signature to compile, not just proximity. No genuine parallel opportunity here — 3 files, 3 sequential groups.

## 5. Test Strategy
- **Unit (Step 1, tdd-workflow)**: `TeamCard` — empty-`bio` collapse (C-6), `alt={member.name}` present, initials-fallback renders when `image` is absent (C-5), accent-chip class toggles by prop.
- **Integration/E2E (Step 2, e2e-testing)**: all 7 filters (`All`/Management/Services/Quality/Clinical/HR/Finance) render the correct subset (AC-2); 390px/768px/1440px with no horizontal overflow (AC-3); reduced-motion emulation shows end state, not mid-animation (AC-5); contrast sampled over the blob area passes WCAG AA (AC-4).
- **Regression**: `TeamModal` open/close behavior (shared with `BoardSection`, untouched) must keep passing — verify by exercising it from `TeamSection`, not by editing it.
- **Build gates**: `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run build-storybook` — all must be clean (see DoD).

## 6. Risk Analysis
- **Image upscale (mitigated, verify don't assume)**: todo.md flags 584×144 upscale risk. Source assets in `public/images/staff/` are 584×584 (checked: `Mary-Bardin.png`, `Alan-Doyle.png`) — 4× the 144px target, so this is a downscale in practice. The real requirement is still explicit `next/image` `sizes` for correct responsive downscale, not a raw dimension bump (AC-7).
- **Filter + stagger interaction**: the `key={activeDept}` remount trick (C-1) is the most likely silent breakage — taller cards make any reflow/flash more visible. Verify, don't just carry the code over unchanged.
- **Blob overflow**: decorative absolutely-positioned shapes are the most common source of mobile horizontal scroll on this site; the containing section needs `overflow-hidden` and the blob must be sized/clipped inside it (AC-3).
- **Mobile scroll-fade hint (C-2)**: the fade hint's offsets are hardcoded against the *current* pill row height. If the pill row is unaffected by this redesign (chips move into cards, not the filter row), the offsets likely don't need to change — but Step 2 must confirm this, not assume it.

## 7. Security Considerations
- No new attack surface: presentational-only change to a public marketing page, no new inputs, no auth/authz boundary, no PII beyond what's already public (staff names/photos/bios already rendered today).

## 8. Rollback Strategy
- Pure UI change, no data migration, no schema. Rollback is a straight `git revert` of the PR / redeploy of the prior build.
- Rollback trigger: any of AC-2 (filters), AC-3 (overflow), or AC-4 (contrast) failing in production after deploy.

## 9. Definition of Done
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npm run build-storybook` passes
- [ ] AC-1 through AC-7 and C-1 through C-6 each verified with evidence (Tester)
- [ ] All 7 department filters verified individually
- [ ] No horizontal overflow at 390px / 768px / 1440px
- [ ] Reduced-motion emulation shows end state (no mid-animation frame)
- [ ] Contrast sampled over blob areas passes WCAG AA
- [ ] `TeamModal`, `BoardSection`, and `src/data/team.ts` unmodified (diff check)
- docs_required: false

## 10. Lean Pass
No steps cut. Three steps map 1:1 to the three files actually in scope (card / section / stories); each is independently testable and none is speculative — every step is directly required by an AC or C in the source card. The department-accent alternation itself is rung-2 reuse (identical pattern already live in `BenefitCard`, `HubNavCard`, and 2 page call sites) — implemented inline in Step 2 rather than as a new shared helper; this is a Worker-level (rung 3+) decision, not a task-graph cut, so it is not tabled here.
