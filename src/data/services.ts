export interface Service {
  title: string;
  description: string;
  icon: string;
  hasImage?: boolean;
  href?: string;
}

export const services: Service[] = [
  {
    title: "Community Residential Living",
    description:
      "Supporting individuals to live fulfilling lives in comfortable, home-like environments with 24/7 personalised care and support.",
    icon: "home",
    hasImage: true,
  },
  {
    title: "Residential Respite Care",
    description:
      "Short-term accommodation providing quality care and engaging activities, giving families peace of mind and participants new experiences.",
    icon: "heart",
    hasImage: true,
  },
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
  {
    title: "Community Integration",
    description:
      "Facilitating meaningful participation in community life through social activities, volunteering, education, and employment opportunities.",
    icon: "globe",
  },
];
