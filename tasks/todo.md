# F2 — Layout width system

Card source: `docs/build-plan.md` (F2, on branch `feat/design-tokens` / PR #37 — not yet in `main`). Full plan: `C:\Users\andre\.claude\plans\enumerated-marinating-gray.md`.

## Tasks
- [x] Add `--container-wide: 90rem;` token to `src/app/globals.css` `@theme` block
- [x] Create `src/components/layout/Container.tsx` (`WideContainer` + `ReadingContainer`) and `src/components/layout/index.ts` barrel
- [x] Group A — mechanical swap of `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` → `<WideContainer>` across ~30 files (Footer, Navbar, section components, careers/quality page wrappers, Open Roles)
- [x] Group B — standalone reading sections → `<ReadingContainer padded>` (quality overview intro + testimonial, careers testimonial pull-quote)
- [x] Group C — `ContentSection.tsx`: text variant → `<ReadingContainer>`; image/50-50 variant → drop inner `max-w-6xl` cap
- [x] Resolve individual-judgment spots: open-roles/[slug] job header → `WideContainer`; careers/training, careers/benefits intros left as Group D (short, not genuinely long-form)
- [x] Leave Group D bespoke display copy untouched (HeroSection, CareersHero, SectionTitle, CareersCtaStrip, RecruitmentSection, BoardSection, HomeModal)
- [x] Add `stories/layout/WideContainer.stories.tsx` + `ReadingContainer.stories.tsx` (default + nested composition story)
- [x] Verify: `npm run build` passes
- [x] Verify: `npx tsc --noEmit` passes
- [x] Verify: Storybook renders both new stories
- [x] Verify: `npm run dev` visual check at 375px and 1440px — wide sections wider, Open Roles resolved, nested reading copy still comfortable

## Acceptance criteria (from build-plan F2)
- [x] Two container primitives exist and are documented in Storybook
- [x] Heroes/galleries/infographics use the wide container
- [x] Long-form text stays within the reading measure
- [x] Resolves the "Open Roles — use more width" request (no separate work)
- [x] Verified at mobile / desktop breakpoints (Playwright, 375px + 1440px)

## Review

All acceptance criteria met. Summary of changes:

- `src/app/globals.css` — added `--container-wide: 90rem` (1440px) to the `@theme` block, generating the `max-w-wide` Tailwind utility.
- `src/components/layout/Container.tsx` (new) — `WideContainer` (`max-w-wide`, gutters on by default) and `ReadingContainer` (`max-w-prose` ≈ 65ch, gutters off by default since it's normally nested). Barrel at `src/components/layout/index.ts`.
- **Group A** (~30 files): mechanical swap of the repeated `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` wrapper to `<WideContainer>` — Footer, Navbar (including normalizing the top contact strip's non-standard padding), every section component (About/Board/Team/Contact/Services/HomesCarousel/Recruitment), all careers/quality subnavs, breadcrumb, CTA strip, and every careers/quality page wrapper including `open-roles/page.tsx` and `open-roles/[slug]/page.tsx` (resolves the Open Roles width request).
- **Deviation from the reviewed plan, called out here:** the plan's Group B assignment for the `quality/human-rights|mdt|safety-improvement` Framework/TeamStrip sections (`ReadingContainer`) was corrected to `WideContainer` during implementation. Those sections hold the `CircularCycle`/`HubAndSpoke` infographics and a team-member strip — not body prose — and the F2 acceptance criteria explicitly say infographics belong in the wide tier. Squeezing a diagram into a 65ch reading measure would have broken its layout. The genuine reading-measure cases (quality overview intro paragraph, two testimonial pull-quotes, `ContentSection`'s text-only variant) do use `ReadingContainer` as planned.
- **Group C** — `ContentSection.tsx`: text-only variant now uses `ReadingContainer`; the image/50-50 variant's own inner `max-w-6xl` cap was dropped so it inherits the enclosing `WideContainer` directly (confirmed via Playwright screenshot — the widened media rows read as well-balanced, not overstretched).
- `stories/layout/WideContainer.stories.tsx` + `ReadingContainer.stories.tsx` (new) — Default + a Nested story showing the compositional pattern from the spec, verified rendering in Storybook.

Verified: `npm run build` and `npx tsc --noEmit` both clean; Storybook renders both stories; Playwright checks at 375px (mobile gutters intact) and 1440px (Home, Open Roles, Quality/Human Rights) confirm the wider layout renders correctly with no console errors.
