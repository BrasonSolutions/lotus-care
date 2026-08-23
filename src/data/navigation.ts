import { homes } from "./homes";

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export const navItems: NavItem[] = [
  { label: "About Us", href: "/#about" },
  { label: "Our Services", href: "/#services" },
  {
    label: "Our Homes",
    href: "/#homes",
    viewAllHref: "/#homes",
    viewAllLabel: "View All Homes",
    // Derived from homes.ts so the dropdown can't drift from the carousel.
    children: homes.map((home) => ({ label: home.name, href: "/#homes" })),
  },
  { label: "Our Team", href: "/#team" },
  {
    label: "Careers",
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
  {
    label: "Quality & Governance",
    href: "/quality",
    viewAllHref: "/quality",
    viewAllLabel: "Overview",
    children: [
      { label: "Human Rights Committee", href: "/quality/human-rights" },
      { label: "Multidisciplinary Team", href: "/quality/mdt" },
      { label: "Quality, Safety & Improvement", href: "/quality/safety-improvement" },
    ],
  },
  { label: "Have Your Say", href: "/#contact" },
];

export const contactInfo = {
  phone: "057 910 7107",
  email: "info@lotuscare.ie",
  address: "Head Office: Suite 204, Birr Technology Park, St Brendans Park, Birr, Co Offaly, R51 E891",
};
