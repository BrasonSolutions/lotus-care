export type JobDepartment =
  | "residential-support"
  | "nursing"
  | "management"
  | "clinical"
  | "admin";

export type JobType = "full-time" | "part-time" | "casual";

export interface JobRole {
  slug: string;
  title: string;
  department: JobDepartment;
  location: string;
  type: JobType;
  shortDescription: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  featured?: boolean;
}

export const departmentLabels: Record<JobDepartment, string> = {
  "residential-support": "Residential Support",
  nursing: "Nursing",
  management: "Management",
  clinical: "Clinical",
  admin: "Administration",
};

export const jobs: JobRole[] = [
  {
    slug: "residential-support-worker",
    title: "Residential Support Worker",
    department: "residential-support",
    location: "Various Homes, Ireland",
    type: "full-time",
    shortDescription:
      "Support adults with intellectual disabilities to live fulfilling, independent lives in our residential homes.",
    description:
      "As a Residential Support Worker at Lotus Care, you will be part of a dedicated team providing person-centred support to adults with intellectual disabilities. You will assist residents with daily living activities, community participation, and personal development — helping each individual thrive in a safe, nurturing environment.",
    responsibilities: [
      "Provide personalised support aligned with each resident's care plan",
      "Assist with daily living activities including personal care, meals, and household tasks",
      "Facilitate community access, social activities, and recreation",
      "Maintain accurate and up-to-date documentation and records",
      "Participate in team meetings, supervision sessions, and training",
      "Uphold HIQA standards and Lotus Care's policies at all times",
      "Support residents to advocate for themselves and exercise choice",
    ],
    requirements: [
      "QQI Level 5 or 6 in Social Care, Health & Social Care, or equivalent",
      "Full clean Irish driving licence",
      "Garda Vetting clearance (or willingness to obtain)",
      "Experience supporting adults with intellectual disabilities is an advantage",
      "Strong communication, empathy, and teamwork skills",
      "Flexible availability including evenings, weekends, and sleep-ins",
    ],
    featured: true,
  },
  {
    slug: "social-care-leader",
    title: "Social Care Leader",
    department: "residential-support",
    location: "Midlands, Ireland",
    type: "full-time",
    shortDescription:
      "Lead a residential team and act as Person in Charge, ensuring quality, compliance, and person-centred care.",
    description:
      "The Social Care Leader plays a pivotal role in one of our residential homes, acting as Person in Charge and leading a team of Support Workers. You will be responsible for the day-to-day operations of the home, ensuring compliance with HIQA regulations, and championing the rights and wellbeing of residents.",
    responsibilities: [
      "Act as Person in Charge and fulfil regulatory responsibilities",
      "Lead, supervise, and support the residential team",
      "Develop and review individual support plans for each resident",
      "Ensure compliance with HIQA National Standards and relevant legislation",
      "Manage rosters, staffing, and day-to-day operational matters",
      "Liaise with families, multidisciplinary teams, and external agencies",
      "Conduct risk assessments and implement safeguarding measures",
    ],
    requirements: [
      "QQI Level 7 or above in Social Care, Nursing, or related field",
      "Minimum 3 years' experience in disability services, at least 1 in a supervisory role",
      "HIQA compliance knowledge and experience as Person in Charge is highly desirable",
      "Full clean Irish driving licence",
      "Excellent leadership, communication, and problem-solving skills",
    ],
    featured: true,
  },
  {
    slug: "staff-nurse-intellectual-disability",
    title: "Staff Nurse — Intellectual Disability",
    department: "nursing",
    location: "Various Homes, Ireland",
    type: "full-time",
    shortDescription:
      "Registered ID Nurse providing clinical support, health monitoring, and care planning across our residential network.",
    description:
      "Lotus Care is seeking a Registered Intellectual Disability Nurse (RNID) to provide clinical leadership and nursing support across our residential homes. You will work collaboratively with care staff and multidisciplinary professionals to ensure the highest standards of health and wellbeing for all residents.",
    responsibilities: [
      "Conduct health assessments and develop individual nursing care plans",
      "Administer medications and carry out clinical procedures safely",
      "Monitor and respond to changes in residents' health status",
      "Provide clinical guidance and mentorship to support staff",
      "Liaise with GPs, consultants, and allied health professionals",
      "Maintain accurate nursing records in line with NMBI standards",
      "Contribute to quality improvement and compliance activities",
    ],
    requirements: [
      "Current NMBI registration as a Registered Nurse (RNID or RNMH preferred)",
      "Experience working in intellectual disability or similar setting",
      "Strong clinical assessment and documentation skills",
      "Commitment to person-centred, rights-based care",
      "Full clean Irish driving licence",
    ],
    featured: true,
  },
  {
    slug: "senior-services-manager",
    title: "Senior Services Manager",
    department: "management",
    location: "Midlands / Leinster, Ireland",
    type: "full-time",
    shortDescription:
      "Provide operational leadership across a cluster of homes, ensuring quality outcomes for residents and staff.",
    description:
      "As a Senior Services Manager, you will oversee a number of Lotus Care's residential homes, providing strategic and operational leadership. You will support home managers, drive quality improvement, and ensure regulatory compliance while championing the values that define Lotus Care.",
    responsibilities: [
      "Provide leadership and support to Social Care Leaders across multiple homes",
      "Drive compliance with HIQA standards and regulatory requirements",
      "Manage budgets, resources, and staffing across your portfolio",
      "Engage with families, external agencies, and regulatory bodies",
      "Lead quality improvement initiatives and service development",
      "Conduct audits and oversee risk management processes",
    ],
    requirements: [
      "Degree in Social Care, Nursing, Social Work, or related discipline",
      "Minimum 5 years' senior management experience in disability services",
      "Demonstrated knowledge of HIQA and regulatory frameworks",
      "Strong strategic planning and people management skills",
      "Full clean Irish driving licence",
    ],
  },
  {
    slug: "hr-generalist",
    title: "HR Generalist",
    department: "admin",
    location: "Head Office, Athlone",
    type: "full-time",
    shortDescription:
      "Support the People & Culture team across the full employee lifecycle in a growing social care organisation.",
    description:
      "We are looking for a motivated HR Generalist to join our People & Culture team. You will provide support across recruitment, onboarding, employee relations, and HR administration — helping us build a great place to work for over 150 staff across Ireland.",
    responsibilities: [
      "Support recruitment campaigns from job posting through to offer",
      "Coordinate onboarding and induction programmes for new starters",
      "Handle HR queries and provide guidance to managers on HR matters",
      "Maintain accurate employee records in our HR system",
      "Assist with HR projects including policy review and engagement surveys",
      "Support compliance with employment legislation and internal procedures",
    ],
    requirements: [
      "Degree in HR, Business, or related discipline",
      "CIPD membership (or in progress) desirable",
      "1–3 years' HR experience, ideally in a multi-site organisation",
      "Strong organisational and communication skills",
      "Proficiency in Microsoft Office; HRIS experience is an advantage",
    ],
  },
  {
    slug: "speech-language-therapist",
    title: "Speech & Language Therapist",
    department: "clinical",
    location: "Various Sites, Ireland",
    type: "part-time",
    shortDescription:
      "Provide specialist speech and language therapy to adults with intellectual disabilities across Lotus Care's homes.",
    description:
      "Lotus Care is expanding its multidisciplinary clinical team. We are seeking a Speech & Language Therapist to assess and support adults with intellectual disabilities, working collaboratively with our care teams, families, and external professionals.",
    responsibilities: [
      "Conduct communication assessments and develop individual therapy plans",
      "Deliver one-to-one and group therapy sessions in home settings",
      "Develop AAC (augmentative and alternative communication) strategies",
      "Provide training and resources to care staff and families",
      "Contribute to multidisciplinary team meetings and care plan reviews",
      "Maintain clinical records and produce assessment reports",
    ],
    requirements: [
      "Degree in Speech & Language Therapy recognised by CORU",
      "Current CORU registration",
      "Experience with adults with intellectual disabilities preferred",
      "Strong collaborative and interpersonal skills",
      "Commitment to evidence-based, person-centred practice",
    ],
  },
  {
    slug: "night-support-worker",
    title: "Night Support Worker",
    department: "residential-support",
    location: "Various Homes, Ireland",
    type: "casual",
    shortDescription:
      "Provide overnight support and safety monitoring to residents in our residential homes.",
    description:
      "Night Support Workers play a vital role in keeping our residents safe and comfortable overnight. You will provide quiet, non-intrusive support, respond to resident needs as they arise, and maintain detailed handover notes for the morning team.",
    responsibilities: [
      "Carry out regular welfare checks throughout the night",
      "Respond calmly to any resident needs or incidents",
      "Maintain a safe and secure home environment",
      "Complete accurate handover documentation",
      "Support residents with personal care as required",
    ],
    requirements: [
      "QQI Level 5 in Social Care, Healthcare or related field (or working towards)",
      "Previous experience in a care or support setting is desirable",
      "Reliable, calm, and attentive manner",
      "Garda Vetting clearance required",
      "Flexible availability for night shifts",
    ],
  },
];
