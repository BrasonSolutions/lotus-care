import type { Testimonial } from "@/data/careers";
import { teamMembers } from "@/data/team";

function pickTeam(names: string[]) {
  return names.map((name) => {
    const member = teamMembers.find((m) => m.name === name);
    if (!member) throw new Error(`Unknown team member referenced in quality.ts: ${name}`);
    return { name: member.name, role: member.role, initials: member.initials, image: member.image };
  });
}

// Real staff, picked for genuine role overlap with each page's subject matter
// (not asserted committee members — see PR notes).
export const humanRightsTeam = pickTeam(["Louise Kidney", "Claire Maher"]);
export const mdtTeam = pickTeam(["Vaida Cheema", "Nadeeka Pathirana", "Tina Early"]);
export const safetyImprovementTeam = pickTeam(["Caithriona Lynch", "Louise Kidney"]);

export interface CycleStep {
  label: string;
  description: string;
}

export interface Spoke {
  label: string;
  description: string;
}

export interface ContentBlock {
  heading: string;
  intro?: string;
  body?: string;
  bullets?: string[];
}

// --- /quality hub landing page ---

export const qualityHub = {
  heroTitle: "Quality & Governance",
  heroSubtitle:
    "Our commitment to safe, rights-based, person-centred care — grounded in strong governance, oversight, and continuous improvement.",
  intro:
    "Quality and human rights sit at the centre of everything we do at Lotus Care. This section brings together the committees, teams, and standards that keep our care safe, accountable, and truly person-centred.",
};

export const hubCards = [
  {
    icon: "shield-check",
    title: "Human Rights Committee",
    description:
      "How we embed dignity, choice, and a rights-based approach across every service we provide.",
    href: "/quality/human-rights",
  },
  {
    icon: "user-group",
    title: "Multidisciplinary Team",
    description:
      "The clinical and therapeutic experts working alongside frontline staff to deliver holistic, coordinated care.",
    href: "/quality/mdt",
  },
  {
    icon: "chart-bar",
    title: "Quality, Safety & Continuous Improvement",
    description:
      "The governance and continuous-improvement culture that keeps standards high across every home.",
    href: "/quality/safety-improvement",
  },
];

// Anonymized per client decision — no name/initials attribution.
export const anonymizedTestimonial: Testimonial = {
  name: "A Lotus Care Resident",
  role: "",
  initials: "LC",
  quote:
    "They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
};

// --- /quality/human-rights ---

export const humanRightsFramework: CycleStep[] = [
  {
    label: "Human Rights Framework",
    description:
      "Ensures all services are grounded in human rights principles, dignity, and equal respect for every person.",
  },
  {
    label: "Rights in Action",
    description:
      "Delivers care in a way that protects rights, promotes autonomy, and supports meaningful daily living.",
  },
  {
    label: "Rights Oversight & Assurance",
    description:
      "Monitors practice, feedback, and outcomes to ensure rights are consistently upheld in everyday service delivery.",
  },
  {
    label: "Rights-Based Response",
    description:
      "Addresses concerns and gaps through clear actions that strengthen rights protection and reduce risk of harm.",
  },
  {
    label: "Rights Culture & Embedding Practice",
    description:
      "Promotes continuous learning to embed a strong culture of rights, respect, and person-centred practice.",
  },
];

export const humanRightsContent = {
  intro: [
    "At Lotus Care, we are committed to delivering services that are firmly grounded in a human rights-based approach, where dignity, respect, equality, and autonomy are central to every aspect of care and support. We recognise that high-quality care is not only about safety and wellbeing, but also about the active protection, promotion, and realisation of each person's fundamental rights. These rights are not optional or secondary considerations; they are the foundation of how we work.",
    "Lotus Care's Human Rights Committee plays a key role in strengthening this commitment across all our services. It ensures that human rights principles are consistently embedded in practice, decision-making, and governance, and that the people we support are empowered to live lives of choice, control, and inclusion.",
  ],
  purpose: {
    heading: "Purpose of the Committee",
    intro:
      "The Committee provides independent oversight, guidance, and assurance to ensure that the rights of the children and adults we support are respected, upheld, and actively realised in practice:",
    bullets: [
      "Promote a rights-based and person-centred approach across all services",
      "Strengthen dignity, autonomy, and supported decision-making in daily practice",
      "Safeguard against unnecessary or disproportionate restrictions of liberty or choice, ensuring least restrictive practice",
      "Identify, review, and respond to potential rights restrictions, risks, or inequalities",
      "Support continuous improvement in the realisation of human rights in practice and outcomes",
      "Ensure alignment with national legislation, HIQA standards, and international human rights frameworks, including the UNCRPD",
    ],
  } satisfies ContentBlock,
  approach: {
    heading: "Our Approach",
    bullets: [
      "Voice, choice, and control: ensuring meaningful participation in decisions that affect daily life",
      "Supported decision-making and legal capacity, respecting each person's right to make choices with appropriate supports",
      "Dignity of risk, balancing safety with the right to live a full and meaningful life",
      "Equality, fairness, and non-discrimination in all aspects of care and support",
      "Safeguarding and protection from harm, delivered through a rights-based lens",
      "Transparent and accountable decision-making at all levels",
    ],
  } satisfies ContentBlock,
  champions: {
    heading: "Human Rights Champions",
    intro:
      "Each centre has a dedicated Human Rights Champion translating rights-based principles into everyday practice locally:",
    bullets: [
      "Supporting staff to embed rights-based practice in daily work",
      "Promoting awareness of dignity, choice, and least restrictive practice",
      "Identifying and escalating potential rights concerns or restrictions",
      "Reinforcing a culture of reflection, accountability, and respect",
      "Acting as a link between frontline services and the Human Rights Committee",
    ],
  } satisfies ContentBlock,
  governance: {
    heading: "Governance & Oversight",
    body: "The Committee operates within Lotus Care's wider governance framework, working closely with safeguarding, quality, and clinical governance structures, and provides assurance to senior leadership and the Board.",
  } satisfies ContentBlock,
  culture: {
    heading: "Culture of Rights-Based Practice",
    body: "Human rights are a core professional responsibility and daily practice expectation, not a policy requirement.",
  } satisfies ContentBlock,
};

// --- /quality/mdt ---

export const mdtCore = {
  label: "Person-Centred Care & Outcomes",
  subtext: "Integrated clinical and therapeutic support enabling safe, holistic care",
};

export const mdtSpokes: Spoke[] = [
  {
    label: "Occupational Therapy",
    description: "Supports independence, functional ability, and daily living skills.",
  },
  {
    label: "Behaviour Support",
    description: "Promotes positive behaviour support and proactive intervention planning.",
  },
  {
    label: "Nursing",
    description: "Provides clinical oversight, health monitoring, and coordinated care support.",
  },
  {
    label: "General Practitioner",
    description: "Ensures medical oversight, diagnosis support, and integrated healthcare coordination.",
  },
  {
    label: "Psychology",
    description: "Supports emotional wellbeing, assessment, and therapeutic intervention.",
  },
  {
    label: "Speech & Language Therapy",
    description: "Enhances communication, understanding, and expressive abilities.",
  },
  {
    label: "Play Therapy",
    description: "Supports emotional expression, trauma-informed care, and developmental engagement.",
  },
  {
    label: "Dietician/Nutrition",
    description:
      "Promotes nutritional wellbeing, safe eating support, and individualised dietary planning to enhance health outcomes.",
  },
];

export const mdtContent = {
  intro: [
    "At Lotus Care, we recognise that delivering high-quality, person-centred support requires a collaborative and holistic approach. Our Internal Multidisciplinary Team (MDT) brings together a range of clinical and therapeutic expertise to ensure that the needs of each child and adult we support are understood, planned for, and responded to in a coordinated way. Our MDT model strengthens decision-making, enhances consistency of care, and ensures that each person benefits from the right expertise at the right time.",
    "Our internal MDT is made up of experienced professionals across Occupational Therapy, Behaviour Support, Nursing, General Practitioner (GP) input, Psychology, Speech and Language Therapy, Play Therapy, and Dietician/Nutrition. This integrated team works alongside frontline staff and management to support holistic, needs-led care planning and delivery.",
  ],
  approach: {
    heading: "Our Approach",
    bullets: [
      "Comprehensive assessment of individual needs",
      "Joint formulation and shared care planning",
      "Evidence-based therapeutic and clinical interventions",
      "Consistent review and adaptation of supports",
      "Embedding therapeutic guidance into everyday practice",
    ],
  } satisfies ContentBlock,
  partnership: {
    heading: "Working in Partnership with Teams",
    body: "The MDT works closely with frontline staff, educators, service managers, and families to ensure recommendations are practical, achievable, and fully embedded into daily routines and environments.",
  } satisfies ContentBlock,
  governance: {
    heading: "Governance, Quality & Outcomes",
    intro:
      "The MDT plays a key role in supporting quality, safeguarding, and clinical governance across Lotus Care, contributing to:",
    bullets: [
      "Improved outcomes",
      "Early identification of emerging needs and risks",
      "Consistent evidence-informed decision-making",
      "Continuous improvement",
    ],
  } satisfies ContentBlock,
  commitment: {
    heading: "Our Commitment",
    body: "Integrated, person-centred, proactive, coordinated, and responsive care.",
  } satisfies ContentBlock,
};

// --- /quality/safety-improvement ---

export const qualitySafetyCycle: CycleStep[] = [
  {
    label: "Directions and Standards",
    description:
      "Define clear expectations, priorities, and safe standards that guide all care and decision-making.",
  },
  {
    label: "Service Delivery & Practice",
    description:
      "Ensures safe, consistent, and person-centred delivery of care across all services.",
  },
  {
    label: "Performance & Insight",
    description:
      "Uses data, feedback, and oversight to understand quality, safety, and meaningful outcomes in real time.",
  },
  {
    label: "Improvement & Action",
    description:
      "Transforms insight into action by addressing gaps, strengthening systems, and preventing recurrence.",
  },
  {
    label: "Learning & Excellence",
    description:
      "Embeds learning across Lotus Care to continuously raise standards and improve outcomes.",
  },
];

export const qualitySafetyContent = {
  intro: [
    "At Lotus Care, quality and safety define how we think, lead, and deliver services. They are not functions within the organisation; they are the foundation of our culture and the standard by which we measure ourselves. We are committed to delivering safe, person-centred services that are grounded in HIQA standards, strengthened by strong governance, and driven by a relentless focus on better outcomes for the children and adults we support.",
  ],
  commitment: {
    heading: "Our Quality Commitment",
    intro:
      "High-quality care happens when people are supported to succeed, systems are clear, and learning is continuous. We focus on:",
    bullets: [
      "Enabling teams to deliver consistently high standards of care",
      "Removing barriers that impact service delivery and outcomes",
      "Strengthening clarity, accountability, and day-to-day effectiveness",
      "Embedding a culture of learning, reflection, and improvement",
      "Ensuring the voice and experience of the people we support is central",
    ],
  } satisfies ContentBlock,
  governance: {
    heading: "Governance & Assurance",
    body: "Quality and safety are overseen at Board level through the Quality & Safety Subcommittee, chaired and supported by senior leadership, with a clear line of sight from frontline practice to Board assurance.",
  } satisfies ContentBlock,
  improvement: {
    heading: "Continuous Improvement in Action",
    body: "We take a proactive, data-informed approach; where gaps or risks are identified, we act quickly and collaboratively to understand root causes, strengthen practice, and prevent recurrence. Insights from audits, feedback, and performance data guide targeted improvements in training, systems, and operational practice.",
  } satisfies ContentBlock,
  broaderView: {
    heading: "A Broader View of Quality",
    body: "We see quality as a dynamic system shaped by internal practice and external factors — regulation, risk, operational complexity, and sustainability — strengthening resilience and consistency.",
  } satisfies ContentBlock,
  culture: {
    heading: "Our Culture",
    body: "Quality is defined by mindset and behaviour, not compliance alone.",
  } satisfies ContentBlock,
};
