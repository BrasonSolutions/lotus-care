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
    icon: "moon",
    title: "Premiums for Unsocial Hours",
    description:
      "Enhanced pay for night and weekend hours, recognising the flexibility required to provide 24/7 care.",
  },
  {
    icon: "user-group",
    title: "Refer a Friend Scheme",
    description:
      "Great people know other great people. We recognise colleagues who refer talented people to join Lotus Care, with the opportunity to earn up to €750.",
  },
  {
    icon: "academic-cap",
    title: "Education Support",
    description:
      "We support your continued learning and development, with financial or non-financial assistance available on a case-by-case basis.",
  },
  {
    icon: "sparkles",
    title: "Employee of the Month",
    description:
      "We celebrate colleagues who go above and beyond with our Employee of the Month award, recognising the people who make a difference every day.",
  },
  {
    icon: "users",
    title: "Company Events",
    description:
      "Work should be enjoyable too. Our Engagement Committee creates opportunities throughout the year to connect and have fun together.",
  },
  {
    icon: "clock",
    title: "Long Service Awards",
    description:
      "We value commitment and loyalty, recognising colleagues who reach important milestones in their journey with Lotus Care.",
  },
  {
    icon: "gift",
    title: "Milestone Recognition",
    description:
      "We celebrate the personal milestones that matter to our people, recognising and sharing special moments along the way.",
  },
  {
    icon: "heart",
    title: "Wellbeing Support",
    description:
      "Your wellbeing matters to us. From our Employee Assistance Programme to mental health workshops and other supports, we're here to support you both in and outside of work.",
  },
  {
    icon: "tag",
    title: "Discounts",
    description:
      "Enjoy access to a range of exclusive discounts and savings available to Lotus Care employees.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Apply Online",
    description:
      "Browse our open roles and submit your CV through our online application form. We personally review every application.",
  },
  {
    step: 2,
    title: "Screening Call",
    description:
      "Our Recruitment Team will contact you within 24-48 hours for a brief call to discuss your background and experience.",
  },
  {
    step: 3,
    title: "Interview",
    description:
      "Successful candidates are invited to a Microsoft Teams interview to discuss their experience and knowledge.",
  },
  {
    step: 4,
    title: "Your Offer",
    description:
      "Successful candidates receive a verbal offer, followed by a formal Job Offer Letter confirming the details of your new role.",
  },
  {
    step: 5,
    title: "Pre-Employment/Onboarding Checks",
    description:
      "We'll guide you through Garda vetting, reference checks and required documentation, ensuring everything is ready for your start with us.",
  },
  {
    step: 6,
    title: "In-Person Training",
    description:
      "Before you start, you'll complete paid mandatory training including CPI, First Aid and Medication Administration, helping you feel confident in your role.",
  },
  {
    step: 7,
    title: "Start Your Journey",
    description:
      "Your Lotus Care journey begins with a structured induction and shadow shifts, giving you the support and confidence to settle into your role.",
  },
];

export const faqs: FAQ[] = [
  {
    question: "Do I need a qualification to apply?",
    answer:
      "A QQI Level 5 qualification in Social Care or Healthcare, or equivalent, is strongly preferred. We also welcome candidates currently studying towards their qualification. International qualifications are considered on a case-by-case basis.",
  },
  {
    question: "Do I need a driving licence?",
    answer:
      "Yes. A full Irish driving licence is required for our roles, as our teams support Service Owners with community access. If you have completed lessons and are awaiting your driving test, we welcome your application.",
  },
  {
    question: "Do you provide sponsorship?",
    answer:
      "We may provide employment permit sponsorship to eligible candidates already living in Ireland, considered on a case-by-case basis.",
  },
  {
    question: "Can I apply if I am not in Ireland?",
    answer:
      "Lotus Care currently only accepts applications from candidates who have the right to work in Ireland and meet all other essential role requirements.",
  },
  {
    question: "Can I apply if I only have experience in home care or nursing homes?",
    answer:
      "Absolutely. We welcome candidates with healthcare and caring experience. Your transferable skills can be valuable in social care, and if you're caring and empathetic, you could be a great fit.",
  },
  {
    question: "Do I have to travel from home to home?",
    answer:
      "No. At Lotus Care, you'll have a set work location. With residential centres across the country, you'll be based at one designated location most of the time.",
  },
  {
    question: "What does a typical day look like?",
    answer:
      "Frontline staff work an average of 42 hours per week across 12-hour shifts. Your day may include supporting Service Owners with routines, school, community access and independent living.",
  },
  {
    question: "How long does the recruitment process take?",
    answer:
      "From application to offer typically takes 1-2 weeks. We aim to move quickly and keep you informed. Pre-employment checks and training can take a further 3–4 weeks at minimum.",
  },
  {
    question: "Do you offer part-time roles?",
    answer:
      "We currently don't offer part-time roles. However, our Relief positions provide flexibility, making them ideal for those looking to work around other commitments. You may work between multiple centres.",
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

// "Our Vision & Values" — /careers/why-us only. A distinct set from
// `companyValues` above (that one's flagged in docs/build-plan.md as
// deferred/placeholder content pending client revision, used only on the
// /careers hub page — left untouched, out of scope here).
export const whyUsValues: CompanyValue[] = [
  {
    title: "Respect",
    description: "We will uphold the dignity of every person.",
    icon: "user-circle",
  },
  {
    title: "Compassion",
    description: "We will interact with each person in a caring and compassionate manner.",
    icon: "heart",
  },
  {
    title: "Quality",
    description:
      "Committed to the highest quality care and full accountability, backed by strong governance and open to learning",
    icon: "shield-check",
  },
  {
    title: "Hope",
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
