export interface Service {
  title: string;
  description: string;
  icon: string;
  hasImage?: boolean;
  href?: string;
}

/* The three services Lotus Care actually delivers (issue #118 — splits
   the former single Residential card into Children's/Adults' cards and
   refreshes the Respite copy; supersedes #90's two-card version). Copy
   is client-supplied via #118; the Respite entry is still marked as a
   draft pending Trevor's revision — see the card in tasks/todo.md. All
   entries live here so they can be swapped without touching any
   component. */
export const services: Service[] = [
  {
    title: "Children's Residential Services",
    description:
      "Safe, nurturing and individualised care — children are supported within a structured, caring environment that promotes development, positive relationships, education, community participation and increasing independence.",
    icon: "home",
    hasImage: true,
  },
  {
    title: "Adults Residential Services",
    description:
      "Supporting choice, independence and quality of life — individualised residential support enables adults to build skills, exercise choice, participate in their communities and work towards personally meaningful goals.",
    icon: "home",
    hasImage: true,
  },
  {
    title: "Non-Residential/Outreach",
    description:
      "Daytime support for children and adults, giving families a break and giving the person a day filled with activities, friends and time out in the community.",
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
