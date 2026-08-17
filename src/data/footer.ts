import { services } from "./services";

export const quickLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Our Services", href: "/#services" },
  { label: "Our Homes", href: "/#homes" },
  { label: "Meet the Team", href: "/#team" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/#contact" },
];

// Derived from the homepage cards so the two can never drift apart again
// (issue #55 — footer was still listing services removed from "Our Services").
export const serviceNames = services.map((service) => service.title);
