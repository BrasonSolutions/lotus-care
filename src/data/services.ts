export interface Service {
  title: string;
  description: string;
  icon: string;
  hasImage?: boolean;
  href?: string;
}

/* The two services Lotus Care actually delivers (issue #90).
   Copy is a draft written from the site's existing residential/respite
   language — client wording still pending, see #62/#88. Both entries live
   here so they can be swapped without touching any component. */
export const services: Service[] = [
  {
    title: "Residential Disability Services for Adults & Children",
    description:
      "Full-time, person-centred support in our purpose-designed homes across the Midlands, where adults and children with intellectual and physical disabilities are supported to live their best lives.",
    icon: "home",
    hasImage: true,
  },
  {
    title: "Non-Residential Respite for Adults & Children",
    description:
      "Planned short breaks that give families time to rest, while adults and children enjoy safe, sociable and fully supported time away from home.",
    icon: "heart",
    hasImage: true,
  },
];

/* What sits behind those services — the expertise, framework and governance
   that shape how they are delivered. Split out of `services` by issue #90. */
export const enhanceServices: Service[] = [
  {
    title: "MDT Pathways",
    description:
      "Our Multi-Disciplinary Team works collaboratively to create holistic care pathways, integrating therapy, health, and wellbeing supports.",
    icon: "users",
    href: "/quality/mdt",
  },
  {
    title: "Model of Care",
    description:
      "A person-centred, rights-based framework that puts dignity, choice, and autonomy at the heart of every interaction — overseen by our Human Rights Committee.",
    icon: "shield",
    href: "/quality/model-of-care",
  },
  {
    title: "Quality, Safety & Continuous Improvement",
    description:
      "Board-level governance and a culture of continuous improvement that keeps standards high and safe across every home we run.",
    icon: "chart-bar",
    href: "/quality/safety-improvement",
  },
];
