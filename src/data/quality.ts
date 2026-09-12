import type { Testimonial } from "@/data/careers";
import type { TimelineStep } from "@/components/timeline";
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
export const safetyImprovementTeam = pickTeam(["Caíthríona Lynch", "Louise Kidney"]);

// MDT-page-only additions (2026-09-12) — deliberately NOT added to
// `teamMembers` in src/data/team.ts, which also feeds the site's "Meet the
// Team" sections (homepage, /careers). Constructed directly rather than via
// `pickTeam`, so they only ever appear on /quality/mdt.
const mdtOnlyMembers = [
  { name: "Dr Sara Tarr", role: "Psychologist", initials: "ST", image: "/images/staff/Sara-Tarr.jpg" },
  { name: "Sinead Cahillane", role: "Dietician", initials: "SC", image: "/images/staff/Sinead-Cahillane.png" },
];
export const mdtTeam = [
  ...pickTeam(["Vaida Cheema", "Nadeeka Pathirana", "Katjia Faria", "Katie Kelly"]),
  ...mdtOnlyMembers,
];

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
  /** Short tags shown as bubbles. When present, `bullets` is not rendered. */
  keywords?: string[];
}

export interface ModelOfCareSection {
  id: "curriculum" | "adt" | "human-rights";
  heading: string;
  intro: string;
}

/** A bullet reduced to its key word plus the sentence it came from, so long
 * lists read as cards rather than blocks of text (#91). */
export interface Keyword {
  term: string;
  description: string;
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
    title: "Model of Care",
    description:
      "How we structure daily life, transitions, rights, and safeguarding across every service we provide.",
    href: "/quality/model-of-care",
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

export const qualityFoundationPrinciples: string[] = [
  "Least restrictive practice",
  "Dignity of risk",
  "Supported decision-making",
];

// Anonymized per client decision — no name/initials attribution.
export const anonymizedTestimonial: Testimonial = {
  name: "A Lotus Care Resident",
  role: "",
  initials: "LC",
  quote:
    "They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
};

// --- /quality/model-of-care ---

export const humanRightsFramework: CycleStep[] = [
  {
    label: "Human Rights Framework",
    description: "Grounding our services in dignity, human rights and equal respect.",
  },
  {
    label: "Rights in Action",
    description:
      "Protecting rights, promoting autonomy and supporting meaningful daily living.",
  },
  {
    label: "Oversight & Assurance",
    description: "Reviewing practice, feedback and outcomes to ensure rights are upheld.",
  },
  {
    label: "Rights-Based Response",
    description:
      "Responding to concerns with actions that strengthen rights protection.",
  },
  {
    label: "Embedding Practice",
    description: "Building a culture of learning, respect and person-centred practice.",
  },
];

/** The three Model of Care sections in page order (#91). Safeguarding was
 * removed per #117 — its messaging now lives in Human Rights' "Safeguarding
 * from Harm" approach item instead. */
export const modelOfCareSections = [
  {
    id: "curriculum",
    icon: "clock",
    summary: "Every hour of the day planned to build skills, independence, and wellbeing.",
    image: "/images/stock/learning-through-play.jpg",
    label: "24-Hour Curriculum",
    heading: "The 24-Hour Curriculum",
    intro:
      "A structured approach to daily living where every part of the day — routines, activities, education, and rest — is planned to build skills, independence, and wellbeing.",
    provisional: false,
  },
  {
    id: "adt",
    icon: "home",
    summary: "Consistent, well-communicated moves into, through, and on from our services.",
    image: "/images/stock/assessment-session.jpg",
    label: "ADT",
    heading: "Admissions, Discharges & Transitions",
    intro:
      "How we plan and support each person's move into, through, and on from our services, so that every transition is consistent, well-communicated, and centred on the person.",
    provisional: false,
  },
  {
    id: "human-rights",
    icon: "user-circle",
    summary: "Dignity, respect, equality, and autonomy at the centre of every decision.",
    image: "/images/stock/guided-choice.jpg",
    label: "Human Rights",
    heading: "Human Rights",
    intro:
      "A rights-based approach where dignity, respect, equality, and autonomy are central to every aspect of care and support.",
    provisional: false,
  },
];

export const curriculumContent = {
  subtitle: "Learning doesn't stop when the school day ends",
  intro: [
    "At Lotus Care, everyday routines, activities and experiences create opportunities for service owners to build skills, confidence and independence.",
    "Our 24-hour curriculum is an MDT-led approach which seizes on all opportunities for learning by ensuring residential staff are skilled to implement structured, individualised education programmes. It complements formal education and other learning opportunities, helping skills be developed and reinforced.",
  ],
  keywords: [
    {
      term: "Everyday Opportunities",
      description:
        "Daily routines and meaningful activities provide natural opportunities to practise and develop social, emotional, behavioural and practical skills.",
    },
    {
      term: "Building Independence",
      description:
        "We focus on building confidence and skills at each person's own pace, supporting service owners to make choices and take greater ownership of their lives.",
    },
    {
      term: "Learning Together",
      description:
        "Residential teams work alongside families, educators, therapists and the wider multidisciplinary team to provide consistent, person-centred support.",
    },
  ] satisfies Keyword[],
};

export const adtContent = {
  subtitle: "A caring start",
  intro:
    "Our admissions process makes sure every placement starts with a deep understanding of the person – and a clear plan for their future.",
  steps: [
    {
      number: 1,
      title: "Referrals & Initial Needs Assessment",
      description:
        "Referrals are reviewed through an Initial Needs Assessment to identify the service owner's needs, risks, strengths and assessment requirements.",
    },
    {
      number: 2,
      title: "ADT Committee",
      description:
        "All referrals are considered by the Admission, Discharge & Transitions Committee prior to admission. The referring agent can select from a menu of clinical and multidisciplinary assessments.",
    },
    {
      // Draft copy — the source issue duplicated step 4's description onto
      // this step. Resolved 2026-09-09 (user confirmed): this description is
      // drafted, not verbatim client text, pending client sign-off. Flag any
      // change here to the client before treating it as final.
      number: 3,
      title: "12-Week Person-Centred Assessment",
      description:
        "Over the 12 weeks, the multidisciplinary team carries out the agreed assessments — observing daily life and gathering clinical, social care and health information to build a full picture of the person's needs, strengths and preferences.",
    },
    {
      number: 4,
      title: "Report & Recommendations",
      description:
        "A comprehensive assessment report is completed at the end of the 12 weeks, incorporating clinical findings, social care observations and physical health needs, with clear recommendations for ongoing and/or future care and support.",
    },
  ] satisfies TimelineStep[],
  specialties: [
    "ASD",
    "ADHD",
    "Developmental Trauma",
    "Attachment Difficulties",
    "Personality Disorder",
    "Acquired Brain Injury (ABI)",
    "Physical Health Needs",
  ],
};

export const humanRightsContent = {
  // Issue #120's subtitle — sits alongside the (pre-existing, kept as-is)
  // intro paragraphs below.
  subtitle: "Rights at the heart of care",
  intro: [
    "At Lotus Care, we are committed to delivering services that are firmly grounded in a human rights-based approach, where dignity, respect, equality, and autonomy are central to every aspect of care and support. We recognise that high-quality care is not only about safety and wellbeing, but also about the active protection, promotion, and realisation of each person's fundamental rights. These rights are not optional or secondary considerations; they are the foundation of how we work.",
    "Lotus Care's Human Rights Committee plays a key role in strengthening this commitment across all our services. It ensures that human rights principles are consistently embedded in practice, decision-making, and governance, and that the people we support are empowered to live lives of choice, control, and inclusion.",
  ],
  // "Purpose of the Committee" (+ its 6 keywords) removed per client
  // confirmation — it predated issue #120 (traced to #91/#112, the original
  // standalone Human Rights page) and isn't part of any current ticket.
  approach: {
    heading: "Our Approach",
    intro:
      "Six commitments that shape how a rights-based approach shows up in everyday practice.",
  } satisfies ContentBlock,
  approachKeywords: [
    {
      term: "Voice, Choice & Control",
      description: "Meaningful participation in the decisions that affect daily life.",
    },
    {
      term: "Supported Decision-Making",
      description:
        "Respecting each person's legal capacity and right to make choices with the right supports.",
    },
    {
      term: "Dignity of Risk",
      description: "Balancing safety with the right to live a full and meaningful life.",
    },
    {
      term: "Equality & Fairness",
      description: "Non-discrimination in all aspects of care and support.",
    },
    {
      term: "Safeguarding from Harm",
      description: "Safeguarding delivered through a rights-based lens.",
    },
    {
      term: "Open & Accountable",
      description: "Transparent and accountable decision-making at all levels.",
    },
  ] satisfies Keyword[],
  // "Human Rights Champions" (+ its focus areas/responsibilities) and the
  // "Governance & Oversight"/"Culture of Rights-Based Practice" cards were
  // removed — same reasoning throughout: this predates issue #120, isn't
  // backed by any current ticket, and the client confirmed none of it is
  // wanted.
};

// --- /quality/mdt ---

export const mdtCore = {
  label: "Person-Centred Care & Outcomes",
  subtext: "Integrated clinical and therapeutic support enabling safe, holistic care",
};

// #92 — 6 of 8 descriptions updated per the client's follow-up comment
// (2026-09-12); GP and Play Therapy weren't given new copy, left unchanged.
// Order preserved exactly — it drives HubAndSpoke's radial angles, and the
// diagram itself must not visually change.
export const mdtSpokes: Spoke[] = [
  {
    label: "Occupational Therapy",
    description:
      "Supports independence, daily living skills, functional participation, and sensory regulation to enhance quality of life and wellbeing.",
  },
  {
    label: "Behaviour Support",
    description:
      "Behaviour support promotes positive behaviour while respecting each person's human rights and independence, staff support and proactive intervention",
  },
  {
    label: "Nursing",
    // "person-centred" per house style (Irish/British spelling, used
    // everywhere else on the site) — the client's supplied text used the
    // American "person-centered"; normalised the same way #120's "Right-based
    // response" casing was normalised, not a content change.
    description:
      "Nursing support provides clinical expertise and person-centred guidance, promoting safe, high-quality care while supporting health, wellbeing, dignity, independence and positive outcomes.",
  },
  {
    label: "General Practitioner",
    description: "Ensures medical oversight, diagnosis support, and integrated healthcare coordination.",
  },
  {
    label: "Psychology",
    description:
      "Dr Sara offers Psychological consultation, to support staff teams and professionals working with children who have mental health needs by giving them time to understand them through a psychological informed lens.",
  },
  {
    label: "Speech & Language Therapy",
    description:
      "Promoting safe eating, drinking and swallowing, equal access and opportunities for effective communication, and for education to improve health, wellbeing and quality of life.",
  },
  {
    label: "Play Therapy",
    description: "Supports emotional expression, trauma-informed care, and developmental engagement.",
  },
  {
    label: "Dietician/Nutrition",
    description:
      "Supporting people to enjoy a healthy and balanced diet while promoting choice, independence and quality of life, with individualised support for their nutritional and hydration needs.",
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
  // No longer its own section on the page — folded into the closing
  // CareersCTAStrip's body copy instead, rather than giving one sentence its
  // own throwaway section. Kept here since it's real content.
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
