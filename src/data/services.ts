export interface Service {
  title: string;
  description: string;
  icon: string;
  hasImage?: boolean;
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
  },
  {
    title: "Model of Care",
    description:
      "A person-centred framework that guides every interaction, ensuring consistent, high-quality support aligned with individual goals.",
    icon: "shield",
  },
  {
    title: "Person Centred Planning",
    description:
      "Empowering each individual to direct their own support plan, focusing on their strengths, preferences, and aspirations.",
    icon: "target",
  },
  {
    title: "Community Integration",
    description:
      "Facilitating meaningful participation in community life through social activities, volunteering, education, and employment opportunities.",
    icon: "globe",
  },
];
