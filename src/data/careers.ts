export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  yearsAtCompany?: number;
}

export interface TrainingProgram {
  title: string;
  description: string;
  type: "mandatory" | "professional" | "leadership";
}

export interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

export const benefits: Benefit[] = [
  {
    icon: "currency-dollar",
    title: "Competitive Pay",
    description:
      "Market-leading salaries with annual pay reviews and incremental scale progression.",
  },
  {
    icon: "book-open",
    title: "Paid Training",
    description:
      "All mandatory and professional development training is fully funded and completed on company time.",
  },
  {
    icon: "calendar",
    title: "Generous Annual Leave",
    description:
      "Starting at 22 days per year, increasing with service — plus public holidays.",
  },
  {
    icon: "heart",
    title: "Wellbeing Support",
    description:
      "Access to our Employee Assistance Programme (EAP) offering confidential counselling and wellbeing resources.",
  },
  {
    icon: "chart-bar",
    title: "Career Progression",
    description:
      "Clear career pathways from Support Worker through to Senior Management, with internal promotion prioritised.",
  },
  {
    icon: "users",
    title: "Supportive Culture",
    description:
      "Regular supervision, peer support, and a management team that truly listens and invests in people.",
  },
  {
    icon: "map-pin",
    title: "Mileage Allowance",
    description:
      "Competitive mileage reimbursement for travel between sites and community activities.",
  },
  {
    icon: "academic-cap",
    title: "Further Education Support",
    description:
      "Study leave and financial support for staff pursuing relevant further education qualifications.",
  },
  {
    icon: "moon",
    title: "Enhanced Night Rates",
    description:
      "Premium rates for night shifts and sleep-ins, recognising the demands of 24/7 care.",
  },
  {
    icon: "home",
    title: "Stable Local Employment",
    description:
      "Permanent and part-time roles across multiple sites — work close to where you live.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Apply Online",
    description:
      "Browse our open roles and submit your CV and cover letter through our online application form. We review every application personally.",
  },
  {
    step: 2,
    title: "Screening Call",
    description:
      "If your application is shortlisted, our recruitment team will reach out to arrange a brief phone or video call to discuss your background and the role.",
  },
  {
    step: 3,
    title: "Interview",
    description:
      "Successful candidates are invited for a structured interview with the hiring manager. We focus on values, experience, and how you approach person-centred care.",
  },
  {
    step: 4,
    title: "Offer",
    description:
      "Once interviews are complete, we make a verbal offer followed by a formal contract of employment.",
  },
  {
    step: 5,
    title: "Pre-Employment Checks",
    description:
      "Garda Vetting, two professional references, and occupational health clearance are completed before your start date — we guide you through every step.",
  },
  {
    step: 6,
    title: "Start",
    description:
      "You begin a structured induction covering our values, safeguarding, and role-specific training alongside your new team.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Do I need a qualification to apply for a Support Worker role?",
    answer:
      "A QQI Level 5 in Social Care or Healthcare is strongly preferred, but we also welcome applications from candidates who are currently studying towards this. Equivalent international qualifications are considered on a case-by-case basis.",
  },
  {
    question: "Do I need a driving licence?",
    answer:
      "A full clean Irish driving licence is required for most of our direct care roles, as staff often support residents with community access. Some administration and clinical roles do not require a licence — this is stated in each job description.",
  },
  {
    question: "How long does the recruitment process take?",
    answer:
      "From application to offer typically takes 2–4 weeks. We aim to move quickly and keep you informed at every stage. Pre-employment checks (Garda Vetting, references) can take a further 1–3 weeks.",
  },
  {
    question: "What is Garda Vetting and how do I get it?",
    answer:
      "Garda Vetting is a background check required for all staff working with vulnerable persons in Ireland, processed through the National Vetting Bureau. We guide you through this process once an offer is made — there is no cost to you.",
  },
  {
    question: "What shifts are available?",
    answer:
      "Our homes operate 24/7, so we have a range of shift patterns including days, evenings, weekends, and sleepins. We aim to match rosters to your availability as much as possible and work collaboratively on scheduling.",
  },
  {
    question: "Do you offer part-time or casual roles?",
    answer:
      "Yes — we have full-time, part-time, and casual positions across our homes. Casual relief panel roles are particularly flexible, ideal for those who want to pick up shifts around other commitments.",
  },
  {
    question: "What training will I receive when I start?",
    answer:
      "All new staff complete a comprehensive induction programme covering our policies, values, safeguarding, medication management, manual handling, and role-specific training. Ongoing training is provided throughout your career with us.",
  },
  {
    question: "Can I apply if I am not from Ireland?",
    answer:
      "Yes — we welcome applications from candidates across the EU and beyond. You must have the right to work in Ireland, and international qualifications in care or nursing will be assessed for equivalence. We support skilled worker visa applications where applicable.",
  },
  {
    question: "I don't see a role that suits me — can I register my interest?",
    answer:
      "Absolutely. Use our Contact Recruitment page to send us your CV and tell us about the type of role you're looking for. We keep speculative applications on file and will contact you when a suitable vacancy arises.",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    role: "Residential Support Worker",
    initials: "SM",
    yearsAtCompany: 3,
    quote:
      "I came from a different sector and was nervous about the move into social care. The team at Lotus Care made me feel completely supported from day one. The training is excellent and I genuinely feel like I'm making a difference every single day.",
  },
  {
    name: "James O.",
    role: "Social Care Leader",
    initials: "JO",
    yearsAtCompany: 2,
    quote:
      "What makes Lotus Care different is the culture. Management actually listens. I've been able to implement real improvements in our home and I've seen the impact on residents' quality of life. That's why I do this work.",
  },
  {
    name: "Aoife N.",
    role: "Staff Nurse (RNID)",
    initials: "AN",
    yearsAtCompany: 4,
    quote:
      "The clinical support and the multidisciplinary team approach here is something special. I've grown more as a nurse in four years at Lotus Care than in my previous positions combined.",
  },
  {
    name: "Michael T.",
    role: "Night Support Worker",
    initials: "MT",
    yearsAtCompany: 1,
    quote:
      "I started on the relief panel while studying and they've been incredibly flexible around my schedule. I'm now completing my Level 6 with their support and hoping to move into a full-time role soon.",
  },
];

export const trainingPrograms: TrainingProgram[] = [
  {
    title: "Induction & Orientation",
    description:
      "A structured first week covering Lotus Care's values, HIQA standards, safeguarding, and your home's procedures.",
    type: "mandatory",
  },
  {
    title: "Manual Handling",
    description:
      "Accredited manual handling training covering safe techniques for supporting residents with mobility needs.",
    type: "mandatory",
  },
  {
    title: "Medication Management",
    description:
      "QQI-aligned medication administration training for all staff involved in supporting residents with medication.",
    type: "mandatory",
  },
  {
    title: "Safeguarding & Vulnerable Adults",
    description:
      "Training on identifying, reporting, and responding to safeguarding concerns in line with Irish legislation.",
    type: "mandatory",
  },
  {
    title: "Person-Centred Planning",
    description:
      "Practical skills for developing and implementing individual support plans that reflect each resident's goals.",
    type: "professional",
  },
  {
    title: "Positive Behaviour Support",
    description:
      "Understanding behaviours of concern and implementing proactive, person-centred support strategies.",
    type: "professional",
  },
  {
    title: "QQI Programmes",
    description:
      "Funding and study leave for QQI Level 5, 6, and 7 programmes in Social Care and related disciplines.",
    type: "professional",
  },
  {
    title: "Leadership & Management Development",
    description:
      "A blended development programme for aspiring and current Team Leaders covering operations, HR, and regulatory management.",
    type: "leadership",
  },
];

export const companyValues: CompanyValue[] = [
  {
    title: "Person-Centred",
    description:
      "Every decision starts with the individual. We support people to live on their own terms, in their own way.",
    icon: "user-circle",
  },
  {
    title: "Compassionate",
    description:
      "We lead with empathy and kindness — towards residents, families, and each other.",
    icon: "heart",
  },
  {
    title: "Accountable",
    description:
      "We hold ourselves to the highest standards of quality and compliance, always transparent and honest.",
    icon: "shield-check",
  },
  {
    title: "Inclusive",
    description:
      "We champion diversity in our teams and actively support social inclusion for every person we support.",
    icon: "user-group",
  },
];

export interface StatItem {
  label: string;
  value: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface VideoTestimonial {
  name: string;
  role: string;
  poster: string;
  /** Absent until real footage is provided. */
  videoSrc?: string;
  /** Absent until a real .vtt captions file is provided. */
  captionsSrc?: string;
}

export const employerStats: StatItem[] = [
  { label: "Staff retention rate", value: "87%" },
  { label: "Internal promotions per year", value: "40%" },
  { label: "Average tenure", value: "4+ yrs" },
  { label: "Staff recommend Lotus Care", value: "9/10" },
];

export const cultureGalleryImages: GalleryImage[] = [
  {
    src: "/images/stock/team-meeting.jpg",
    alt: "Lotus Care staff gathered for a team meeting",
    caption: "Weekly team catch-ups",
  },
  {
    src: "/images/stock/warm-home.jpg",
    alt: "A warmly furnished Lotus Care residential home living room",
    caption: "Homes designed to feel like home",
  },
  {
    src: "/images/stock/dignity-activity.jpg",
    alt: "Staff member supporting a resident during a group activity",
    caption: "Person-centred activities",
  },
  {
    src: "/images/stock/clinical-consultation.jpg",
    alt: "Staff nurse in a clinical consultation with a colleague",
    caption: "Strong clinical support",
  },
];

export const videoTestimonials: VideoTestimonial[] = [
  { name: "Sarah M.", role: "Residential Support Worker", poster: "/images/stock/dignity-activity.jpg" },
  { name: "James O.", role: "Social Care Leader", poster: "/images/stock/team-meeting.jpg" },
  { name: "Aoife N.", role: "Staff Nurse (RNID)", poster: "/images/stock/clinical-consultation.jpg" },
];
