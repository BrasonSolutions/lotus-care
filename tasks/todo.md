# Task: Centralize Navbar + Footer default content

## Context
`Navbar` and `Footer` currently require `navItems`/`contactInfo` and
`quickLinks`/`serviceNames`/`contactInfo` respectively as mandatory props.
All 3 render sites (`src/app/page.tsx`, `src/app/careers/layout.tsx`,
`src/app/quality/layout.tsx`) import `navItems`/`contactInfo` from
`@/data/navigation` and pass them through identically — pure duplication,
no page currently overrides them. Same pattern for `Footer`'s
`serviceNames` (identical in all 3 places) and `quickLinks` (identical
between careers/quality; home page's version differs because its links
are page-relative anchors like `#about` instead of `/#about`).

Goal: give both components sane defaults, importable directly inside the
component, while still allowing an explicit prop to override per page.

## Plan

### Navbar (`src/components/navbar/Navbar.tsx`)
- [x] Make `navItems` and `contactInfo` optional in `NavbarProps`.
- [x] Import `navItems`/`contactInfo` from `@/data/navigation` inside
      `Navbar.tsx` and use as default parameter values.
- [x] `src/app/page.tsx`: drop `navItems`/`contactInfo` props on `<Navbar>`
      (keep the `@/data/navigation` import — `contactInfo` is still used
      by `<ContactSection>` and `<Footer>` on that page).
- [x] `src/app/careers/layout.tsx`: drop `navItems`/`contactInfo` props on
      `<Navbar>`, keep `solidWhenTop`.
- [x] `src/app/quality/layout.tsx`: same as careers.

### Footer (`src/components/footer/Footer.tsx`)
- [x] Create `src/data/footer.ts` exporting:
      - `serviceNames: string[]` — the shared array (identical everywhere today).
      - `quickLinks: { label: string; href: string }[]` — the "subpage"
        variant (`/#about`, `/#services`, ..., `/careers`, `/#contact`),
        since it's correct for any page other than the homepage itself
        and is already used by 2 of the 3 call sites.
- [x] Make `quickLinks`, `serviceNames`, and `contactInfo` optional in
      `FooterProps`; default `quickLinks`/`serviceNames` from
      `@/data/footer`, default `contactInfo` from `@/data/navigation`.
- [x] `src/app/careers/layout.tsx`: delete local `quickLinks`/`serviceNames`
      consts, call `<Footer />` with no props (all defaults apply).
- [x] `src/app/quality/layout.tsx`: same as careers.
- [x] `src/app/page.tsx`: delete local `serviceNames` const (identical to
      new default); keep local `quickLinks` const (anchor-relative,
      unique to this page) and pass it explicitly as an override:
      `<Footer quickLinks={quickLinks} />`.

### Verification
- [x] `npm run lint` clean.
- [x] `npx tsc --noEmit` clean.
- [x] `npm run build` — compiles, all 22 routes statically generate.

## Non-goals
- Not touching `careers-subnav.tsx` / `quality-subnav.tsx`.
- Not restyling or adding new nav items — pure de-duplication.

## Review

Implemented exactly as planned, no deviations:
- `Navbar` and `Footer` now default `navItems`/`contactInfo`/`quickLinks`/
  `serviceNames` from `@/data/navigation` and the new `@/data/footer`,
  via default parameter values, so any future page renders `<Navbar />`
  / `<Footer />` with zero props and still gets the standard site nav/footer.
- Overriding still works exactly as a normal prop — proven by the home
  page, which passes its own anchor-relative `quickLinks` override for
  `<Footer>` while using every other default.
- `src/app/careers/layout.tsx` and `src/app/quality/layout.tsx` lost their
  duplicated `quickLinks`/`serviceNames` consts and unused `navItems`/
  `contactInfo` imports entirely — both now render `<Navbar solidWhenTop />`
  and `<Footer />`.
- Lint, typecheck, and `next build` all pass clean.
