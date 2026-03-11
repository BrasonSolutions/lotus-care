export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  {
    label: "Our Homes",
    href: "#homes",
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
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
];

export const contactInfo = {
  phone: "+61 3 9000 0000",
  email: "info@lotuscare.com.au",
  address: "Melbourne, Victoria, Australia",
};
