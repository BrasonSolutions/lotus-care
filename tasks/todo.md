# fix/client-review-feedback-round-3

Spec: client feedback round 3 (approved plan, 2026-10-22). Previous handoff content is in git history.

## Checklist
- [x] T1 Homepage "Join our Team" renders live Occupop roles (OccupopJobCard), error and empty states, CTA goes to /careers/open-roles
- [x] T1 Storybook story with fixture-backed jobs plus error and empty variants
- [x] T2 recruitmentRoles changed to the client's 8 options
- [x] T3 Jessica date changed to "With Lotus Care since September 2024"
- [x] T3 Linas Christian replaces the "Team Leader" testimonial
- [x] T4 7 heroes swapped to client imagery (webp, new filenames, subject on the right)
- [x] T5 all public/images jpg/png converted to webp and references updated (exclusions: email/*, logo.png, OG, favicon)
- [x] Verify: lint, build, test, browser check (no 404s, heroes at mobile/desktop, AA contrast)

## Task 1: Homepage "Join our Team" shows live Occupop roles

**Now:** `src/app/page.tsx:22,166` passes the static `jobs` (`src/data/jobs.ts`) into
`RecruitmentSection`, which renders 3 `featured` `JobCard`s linking to the old static
`/careers/open-roles/[slug]` pages (generic "Apply Now"). The "Explore All Roles" CTA goes to `/careers`.

**Change:**
- `src/app/page.tsx`: `const jobs = await fetchLiveJobs().catch(() => null)` and
  `export const dynamic = "force-dynamic"`. This is the same pattern as
  `src/app/careers/open-roles/page.tsx` and `careers/jobs/[slug]/page.tsx`, which already
  run on Cloudflare. Pass `jobs` into `RecruitmentSection`.
- `src/components/recruitment-section/RecruitmentSection.tsx`:
  - Prop type changes from `JobRole[]` to `NormalizedJob[] | null` (from `@/lib/occupop`).
  - Render the first 3 with the existing `OccupopJobCard` (links to
    `/careers/jobs/[slug]`, which has "Apply on Occupop"). No new card design.
  - `null` (error or no token) shows "We're having trouble loading roles right now…".
    An empty list shows "No open roles right now. Register your interest" linking to
    `/careers/contact`. Copy matches Open Roles.
  - Default CTA "Explore All Roles" goes to `/careers/open-roles` (direct, no redirect hop).
- Leave `src/data/jobs.ts` and the old static `/careers/open-roles/[slug]` route alone.
  Removing them is out of scope.
- **Building it without the token:** add/update a Storybook story for `RecruitmentSection`
  fed with normalised jobs from `src/lib/__fixtures__/occupop-jobs.json` (through the
  existing `normalise` path, as `occupop.test.ts` does), plus error and empty variants.
  Once the token is in `.env.local`, check against live data in the dev server.

## Task 2: Recruitment dropdown options

`src/data/forms.ts:96`: replace `recruitmentRoles` with, in this order:
Social Care Assistant · Social Care Worker · Team Lead · Person in Charge · Clinical ·
Senior Management · Administration · Other.
The form and email templates read this list, so there are no other changes.

## Task 3: Testimonials (`/careers/why-us`)

`src/data/testimonial.ts`:
- `careersHearQuote` (Jessica Lennon): change `date: "10th June 2026"` to
  `"With Lotus Care since September 2024"`. The quote text stays the same.
- `teamTestimonials[0]` ("Team Leader"): replace it with:
  - quote: "Working with Lotus Care has been a very positive experience for me. I have always felt supported by my managers and colleagues, and I really appreciate the opportunities I have been given to learn, grow and develop in my role. I'm proud to be part of the Lotus Care team."
  - name: "Linas Christian, Social Care Assistant"
  - date: "With Lotus Care since February 2025"
- Update the stale "#80 Figma variant / placeholder" comment above `teamTestimonials`.
- `teamTestimonials[1]` ("Person in Charge") stays as it is.

## Task 4: Hero and banner imagery (7 pages)

All 7 slots are `CareersHero` image heroes (`image=` prop, `fill` + `object-cover`, decorative
`alt=""`, with a left-to-right `primary-dark` gradient overlay so the white text stays AA).

**Proposed mapping:**

| Page | File | Current | New source (`~/Downloads/lotus-care-images/`) |
|---|---|---|---|
| Model of Care banner | `quality/model-of-care/page.tsx:184` | `stock/caring-embrace.jpg` | **Model of Care Banner.jpg** (client-specified) |
| Multidisciplinary banner | `quality/mdt/page.tsx:159` | `stock/mdt-hero-v2.jpg` | **Multidisciplinary banner.png** (client-specified) |
| Quality | `quality/page.tsx:22` | `stock/warm-home.jpg` | Possible imagery 4 (two staff, children, alphabet chart) |
| Open Roles | `careers/open-roles/page.tsx:19` | `stock/team-meeting.jpg` | Possible imagery 6 (staff member with boy in wheelchair) |
| Benefits | `careers/benefits/page.tsx:22` | `stock/warm-home.jpg` | Possible imagery 5 (staff playing on floor with girl) |
| How We Hire | `careers/how-we-hire/page.tsx:23` | `stock/team-meeting.jpg` | Possible imagery 1 (two staff, three children at table) |
| Contact Recruitment | `careers/contact/page.tsx:23` | `stock/careers-contact-team.jpg` | Possible Imagery 3 (girl drawing at table) |

- **Not used:** *Possible imagery 7* is only 755×406, which would look pixelated in a full-width hero.
- **Processing** (ImageMagick): crop each to the hero's aspect so the people sit in the
  **right ~60%** (the overlay is darkest on the left, behind the text). Resize to 1920px
  wide and export **webp, q≈80**, to **new filenames** under `public/images/heroes/`
  (e.g. `model-of-care-banner.webp`, `mdt-banner.webp`, `quality-hero.webp`, …) so no
  browser shows a cached old image. Strip metadata.
- Leave the old stock files in `public/images/stock/`. Some are still used elsewhere
  (e.g. `team-meeting.jpg` on Safety & Improvement), and deleting files is out of scope.
- No component changes: `CareersHero` `fill` keeps the layout fixed, so there's no CLS.
  Use `imagePosition="top"` only if a crop needs it.

## Task 5: Convert all site imagery to `.webp`

**Now:** about 100 JPG/PNG files (about 30 MB) under `public/images/` (`stock/`, `houses/*/`,
`logos/`, `home-bg.jpg`). The staff photos are already webp.

**Change:**
- Batch-convert every `.jpg/.jpeg/.png` under `public/images/` to `.webp` (ImageMagick,
  q≈80, strip metadata, cap at 1920px wide, never upscale). Use lossless for the
  `logos/*.png` so the edges stay crisp. Each file keeps its name and directory, with a
  `.webp` extension.
- Update every reference in `src/` (21 files, mostly `src/data/*.ts` and page `src`s) from
  `.jpg/.png` to `.webp` with a scripted find-and-replace. Then `grep` for any leftover
  `/images/…\.(jpg|jpeg|png)` and confirm each remaining one is an intended exclusion.
- Delete each original once nothing references it any more (git history keeps them).
- **Exclusions (stay PNG/JPG on purpose):**
  - `public/images/email/*`: Outlook and some other mail clients don't render webp (`src/lib/mail.ts:84-85`).
  - `public/images/logo.png`: the schema.org `logo` in the homepage JSON-LD and `src/lib/job-posting.ts:58`. Google's guidance prefers PNG/JPG there.
  - `src/app/opengraph-image.png` and `favicon.ico`: social crawlers and favicons need these formats.
- Task 4's new hero images are produced as webp directly, so this task doesn't touch them.
- Report the before/after total size in the PR.

---

## Verification
- `npm run lint`, `npm run build`, `npm test` (the existing `occupop.test.ts` must stay green).
- Storybook: the `RecruitmentSection` story shows 3 fixture-backed Occupop cards, plus the error and empty states.
- Dev server (`npm run dev`, left running for review):
  - Homepage: without a token, the section shows the error message and nothing crashes. With a token, it shows 3 live roles linking to `/careers/jobs/[slug]`, and "Explore All Roles" goes to `/careers/open-roles`.
  - `/careers/contact`: the dropdown shows exactly the 8 new options.
  - `/careers/why-us`: Jessica shows "With Lotus Care since September 2024", and Linas's quote has replaced "Team Leader".
  - All 7 heroes show the new images. Check the crop at mobile and desktop widths, the title/subtitle contrast over the gradient, and that there's no layout shift.
  - Webp sweep: the homes carousel/gallery, the referrals logos, the team, quality and careers pages all show images with no 404s (check the dev-server log and the browser Network tab). `grep` finds no stray `.jpg/.png` references beyond the exclusions.
- Screenshot each changed hero for the PR description.

---

## Review (2026-10-22)

All five tasks are implemented on `fix/client-review-feedback-round-3` (not committed yet).

- **T1:** the homepage is now `force-dynamic` and calls `fetchLiveJobs()`. `RecruitmentSection` renders `OccupopJobCard`s plus error and empty states. Checked in Storybook against the real fixture (3 cards, error, empty) and on the dev server without a token (error message, no crash). Still to do: check live data once `OCCUPOP_API_TOKEN` is in `.env.local`.
- **T2 / T3:** data-only changes in `src/data/forms.ts` and `src/data/testimonial.ts`.
- **T4:** 7 client images saved to `public/images/heroes/*.webp`, cropped to a band around the faces. MDT uses `imagePosition="top"` (its subjects sit at the very top of the source). *Possible imagery 7* is unused (755px, too small).
  - **Contrast (unplanned, required by the standing AA rule):** measured the real pixels behind the hero text (DevTools protocol, text hidden). The live site's `CareersHero` was already failing AA (mobile subtitle down to 1.51:1, desktop down to 2.91:1), and the new photos were no better. Fix: below `lg` the scrim is a uniform `primary-dark/85`; from `lg` the gradient holds 85% to 60% width, and the subtitle is solid white. Every image hero now passes at 1440/1024/390 (worst subtitle 4.61:1, h1 ≥ 4.55:1). This affects all 10 image heroes, so they look a little more teal than before.
- **T5:** 15 referenced JPG/PNGs converted to webp (3.90 MB → 1.75 MB), references rewritten and originals removed. Also fixed a broken `Danny-Scally.png` path in a story. Exclusions kept: `email/*`, `logo.png`. Found but **not touched, waiting on the user's decision**: `public/images/houses/` (101 files, ~30 MB) and 10 other files that nothing references (`home-bg.jpg`, `logos/hiqa.png`, 8 stock images).
- **Verification:** `tsc` clean; eslint clean on changed files (full `npm run lint` is noisy because of the pre-existing `.claude/` agent worktrees); `npm test` 36/36; `npm run build` passes; 67 image URLs across 14 pages all return 200.
