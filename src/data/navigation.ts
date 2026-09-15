export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  viewAllHref?: string;
  viewAllLabel?: string;
  // When true, the top-level label itself navigates to `href` *and* opens
  // the children flyout — instead of the flyout-only toggle button every
  // other dropdown item uses. Opt-in per item so this doesn't change
  // existing dropdowns (e.g. "Join Our Team").
  clickable?: boolean;
}

export const navItems: NavItem[] = [
  { label: "About Us", href: "/#about" },
  {
    label: "Our Services",
    href: "/#services",
    clickable: true,
    children: [
      { label: "Model of Care", href: "/quality/model-of-care" },
      { label: "Multidisciplinary Team", href: "/quality/mdt" },
      { label: "Quality, Safety & Improvement", href: "/quality/safety-improvement" },
    ],
  },
  { label: "Our Homes", href: "/#homes" },
  { label: "Our Team", href: "/#team" },
  {
    label: "Join Our Team",
    href: "/careers",
    // No viewAllHref/viewAllLabel — the hub page stays in the codebase
    // (per docs/build-plan.md, its "Our Values" section is placeholder
    // content pending client revision) but isn't linked from the nav for
    // now; /careers itself also redirects, see src/app/careers/page.tsx.
    children: [
      { label: "Open Roles", href: "/careers/open-roles" },
      { label: "Why Work With Us", href: "/careers/why-us" },
      { label: "Benefits", href: "/careers/benefits" },
      { label: "How We Hire", href: "/careers/how-we-hire" },
      { label: "Contact Recruitment", href: "/careers/contact" },
    ],
  },
  { label: "Have Your Say", href: "/#contact" },
];

/* Real profiles, supplied by the client 2026-09-15. Not discoverable from
   lotuscare.ie — its own social icons render with no href at all. */
export const socialLinks = [
  { name: "facebook", href: "https://www.facebook.com/p/Lotus-Care-61569929131161/" },
  { name: "instagram", href: "https://www.instagram.com/lotus_care_enhancedliving/" },
  { name: "linkedin", href: "https://www.linkedin.com/company/lotus-care-services/" },
] as const;

export const contactInfo = {
  phone: "057 910 7107",
  /* Referrals route through ADT, so the ADT lead's mobile is published on the
     referrals page alongside the office line. */
  referralsMobile: "086 822 8942",
  referralsMobileContact: "Danny Scally",
  email: "info@lotuscare.ie",
  address: "Head Office: Suite 204, Birr Technology Park, St Brendans Park, Birr, Co Offaly, R42 XH39",
};
