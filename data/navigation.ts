export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export const navItems: NavItem[] = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  {
    label: "Our Homes",
    href: "#homes",
    viewAllHref: "#homes",
    viewAllLabel: "View All Homes",
    children: [
      { label: "Amethyst House", href: "#homes" },
      { label: "Beryl House", href: "#homes" },
      { label: "Citrine House", href: "#homes" },
      { label: "Diamond House", href: "#homes" },
      { label: "Emerald House", href: "#homes" },
      { label: "Fluorite House", href: "#homes" },
      { label: "Garnet House", href: "#homes" },
      { label: "Heliodor House", href: "#homes" },
    ],
  },
  { label: "Our Team", href: "#team" },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Open Roles", href: "/careers/open-roles" },
      { label: "Why Work With Us", href: "/careers/why-us" },
      { label: "Benefits", href: "/careers/benefits" },
      { label: "Training & Development", href: "/careers/training" },
      { label: "How We Hire", href: "/careers/how-we-hire" },
      { label: "Contact Recruitment", href: "/careers/contact" },
    ],
  },
  { label: "Contact", href: "#contact" },
];

export const contactInfo = {
  phone: "+61 3 9000 0000",
  email: "info@lotuscare.com.au",
  address: "Melbourne, Victoria, Australia",
};
