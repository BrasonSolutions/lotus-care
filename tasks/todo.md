# fix/client-review-feedback-round-4

Spec: client feedback round 4 (approved plan, 2026-10-22). Earlier content is in git history.

## Checklist
- [x] T1 Safety page: imagery 7 in first photo, imagery 4 in wide banner (new filenames)
- [x] T2 TeamStrip one column below sm (MDT + Safety)
- [x] T3 OccupopJobCard links to applyUrl in new tab
- [x] T4a fetchLiveJobs cached 1h via Workers Cache API (+ tests)
- [x] T4b Open Roles + homepage stream with JobCardSkeletons (no CLS)
- [x] Verify: tsc, eslint, tests, build, browser measurements

## Task 1: Quality, Safety & Improvement photos
`src/app/quality/safety-improvement/page.tsx`
- First photo (line ~40, `aspect-[4/3]`, `sizes="(min-width: 768px) 40vw, 100vw"`):
  `stock/team-review.webp` becomes **Possible imagery 7**, saved as `public/images/stock/safety-intro.webp`
  (webp q≈85, no upscaling, strip metadata). Check its 4:3 crop by eye, since `object-cover`
  trims the sides of the 1.86:1 source.
- Wide banner (line ~107, `aspect-[21/9]`): `stock/governance-review.webp` becomes
  **Possible imagery 4**, saved as `public/images/stock/safety-banner.webp` (1920w, q≈80). This
  photo is also the `/quality` hero; the repeat is accepted.
- New filenames, so no browser serves a cached old image. The old files stay as they are.

## Task 2: Team list is a single column on mobile
**Cause:** `src/components/quality/team-strip/TeamStrip.tsx` uses `flex flex-wrap gap-6` with
content-width items. On a ~358px phone, two people share a row only when both role lines
are short, which gives the ragged one-or-two-column mix.
**Fix:** `flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6`. This gives one person per row below
640px and keeps the current wrap layout from `sm` up. `TeamStrip` is used on both
`/quality/mdt` and `/quality/safety-improvement`, and both get the fix (same bug on both).

## Task 3: Job cards open Occupop directly
`src/components/careers/job-card/OccupopJobCard.tsx:~11`: the button `href` changes from
`/careers/jobs/${job.slug}` to `job.applyUrl` (Occupop's public job page, e.g.
`api.occupop.com/shared/job/…`, which shows the full description and the Apply button). Add
`target="_blank" rel="noopener noreferrer"`, matching the existing `ApplyPanel` in
`careers/jobs/[slug]/page.tsx:87`. Label: "View Role" stays, with the new-tab cue
handled however `Button` already does it, or a visually-hidden "(opens in a new tab)".
- This applies to both the Open Roles grid and the homepage "Join our Team" cards (same component).
- Keep `/careers/jobs/[slug]`. It still powers the sitemap and the JobPosting schema
  (Google for Jobs, PR #152). It just isn't linked from the cards any more.

## Task 4: Open Roles is slow
**Measured (live):** `/careers/open-roles` 2.8 s and `/careers/jobs/[slug]` 2.9 s before the first
byte, and `/` (homepage) 3.4 s, against **0.17 s** for static `/careers/benefits` from the same Worker.
**Root cause:** `fetchPage()` (`src/lib/occupop.ts:183`) calls the Occupop API **uncached on
every request** (a single page, 12 jobs), and every Occupop-backed page `await`s it before
sending any HTML. The homepage regression came from PR #153, which added this fetch to `/`.

**Fix (two parts):**
1. **Cache, 1 hour:** in `fetchLiveJobs()`, wrap the fetch in the Workers Cache API
   (`caches.default`, which needs no new Cloudflare binding). Store the raw jobs JSON under a
   synthetic key URL (no token in the key) with `Cache-Control: max-age=3600`. On a miss or any
   cache error, fall back to the direct fetch. When `caches` is undefined (local `next dev`),
   skip the cache. Caching is per Cloudflare data centre, so the first visitor per hour per
   region pays the ~2.5 s. Update the stale "KV cache is the upgrade path" comment.
2. **Stream with placeholder cards:** so even an uncached visit shows the page instantly.
   - `careers/open-roles/page.tsx`: move `fetchLiveJobs()` into an async `<LiveRoles />` server
     component wrapped in `<Suspense fallback={<JobCardSkeletons count={6} />}>`. The hero,
     breadcrumb and "Don't see the right role?" render immediately.
   - Homepage: `RecruitmentSection` (client) takes a `roles` slot (`ReactNode`) instead of `jobs`.
     `page.tsx` passes `<Suspense fallback={<JobCardSkeletons count={3} />}><HomeRoles /></Suspense>`,
     and the error/empty/3-card logic moves into `HomeRoles`. Update the Storybook story to match.
   - New `JobCardSkeletons`: same size and grid as `OccupopJobCard`, so there's no layout shift
     when real cards arrive. Use `animate-pulse` (already covered by the global
     `prefers-reduced-motion` rule in `globals.css:403`) and `aria-busy`/`sr-only` "Loading roles…".
- Add a unit test in `src/lib/occupop.test.ts`: with a stubbed `caches.default`, a second
  `fetchLiveJobs()` call is served from the cache (fetch called once). A cache that throws
  falls back to fetch.

---

## Verification
- `npx tsc --noEmit`, eslint on changed files, `npm test` (existing 36 + new cache tests), `npm run build`.
- Dev server: the Safety page shows the two new photos (check crop and sharpness at 1440 and 390);
  the MDT and Safety team lists are one column at 390px and wrap at ≥640px (measured with
  `getBoundingClientRect`, so every item has the same x at 390); job card buttons have
  `href` = Occupop URL and open a new tab.
- Streaming: the Open Roles HTML shell arrives before the cards. Check that skeleton→cards
  causes no layout shift (CLS ≈ 0 via `PerformanceObserver`).
- After merge, on the live site: re-time `/careers/open-roles` and `/` (first hit ≈ old, repeat
  hits ≈ static-page speed), and confirm cards still link to Occupop.
- Start `npm run dev` and leave it running for review when the PR opens.

---

## Review (2026-10-22)

- **T1:** Safety page intro uses imagery 7 (`stock/safety-intro.webp`, native 755px; slightly soft at 656px on desktop, as agreed). Banner uses imagery 4 (`stock/safety-banner.webp`), pre-cropped to 21:9 with the band biased upward, because the centred crop cut the adults' faces off.
- **T2:** `TeamStrip` is `flex-col` below `sm`. Measured at 390px: MDT 8/8 and Safety 2/2 items share x=16, one per row. At 1024 the wrap layout is unchanged. All avatars load.
- **T3:** `OccupopJobCard` links to `job.applyUrl` in a new tab, with "(opens Occupop in a new tab)" for screen readers. `/careers/jobs/[slug]` is kept for the sitemap and JobPosting schema.
- **T4 root cause (measured live):** an uncached Occupop call on every request (open-roles 2.8 s, `/` 3.4 s, job page 2.9 s, vs static 0.17 s). Fix:
  - Workers Cache API, 1 hour, synthetic key with no token, errors fall through to a live fetch. Covered by 3 new tests (written first, then made to pass).
  - Open Roles and the homepage stream their roles behind `JobCardSkeletons`. The dev HTML shows the "Loading roles…" shell before the resolved content.
  - Skeleton heights were measured against real fixture cards: 270 = 270px at 1280, and 910 vs 915px for the 3-card column at 390.
- **Caveats:**
  - The Cache API is per Cloudflare data centre and only works on the custom domain (not `*.workers.dev`).
  - The first visit per hour per region still waits ~2.5 s, but now behind placeholder cards.
  - Live speed can only be confirmed after deploy.
- **Verification:** tsc, eslint (changed files), `npm test` 39/39, `npm run build` all clean.
- **Also checked:** the site icon from the previous commit matches the official `Logomark - Colour.svg` (RMSE 0.5%).
