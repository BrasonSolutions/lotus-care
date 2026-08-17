export interface Service {
  title: string;
  description: string;
  icon: string;
  hasImage?: boolean;
  href?: string;
}

export const services: Service[] = [
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
    href: "/quality/human-rights",
  },
  {
    title: "Quality, Safety & Continuous Improvement",
    description:
      "Board-level governance and a culture of continuous improvement that keeps standards high and safe across every home we run.",
    icon: "chart-bar",
    href: "/quality/safety-improvement",
  },
];
