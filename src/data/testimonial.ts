// Issue #55/#80/#89. Quote source: "JW My Journey" doc, client Drive. Attribution decided 2026-08-29 (spec §7.2).
export interface QuoteEntry {
  quote: string;
  name: string;
  date: string;
}

export interface HomeQuote extends QuoteEntry {
  eyebrow: string;
  heading: string;
  subtext: string;
}

// Attribution parts, defined once — `homeQuote.name` derives from these.
const jwAttribution = { initials: "JW", role: "Service Owner" };

export const homeQuote: HomeQuote = {
  eyebrow: "People of Lotus",
  heading: "Real voices. Real fulfilment.",
  subtext: "Our service owners are the heart of everything we do.",
  quote:
    "When I first moved to Pine Lodge with Lotus Care, I was nervous because everything was new to me. I left my family behind and didn't know anybody. The staff were kind, friendly, and caring and gave me their time, sitting and talking to me. They really wanted to get to know me. They helped me settle into my new home. They listened to me and supported me with the things that were important to me. They helped me fill my day as my whole routine what I was used to had all changed. They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
  name: `${jwAttribution.initials}, ${jwAttribution.role}`,
  date: "With Lotus Care since 2018",
};

export interface ServiceOwnerTestimonial extends HomeQuote {
  slug: string;
  initials: string;
  role: string;
  /** Long-form content; absent today (Assumption 7.3) — detail page renders a stated fallback. */
  body?: string;
}

// Single source for `/testimonials`, its detail pages, and the home band.
export const serviceOwnerTestimonials: ServiceOwnerTestimonial[] = [
  { ...homeQuote, ...jwAttribution, slug: "jw" },
];

// /careers/why-us's quote section — the site's original "Hear it from our
// own" copy (kept here since `homeQuote` above now carries the homepage's
// newer "Real voices" revision). Same JW quote text, "Administrator" /
// "10th June 2026" attribution as given in this page's Figma export.
export const careersHearQuote: HomeQuote = {
  eyebrow: "People of Lotus",
  heading: "Hear it from our own.",
  subtext: "Our colleagues are the drive of everything we work for.",
  quote:
    "When I first moved to Pine Lodge with Lotus Care, I was nervous because everything was new to me. I left my family behind and didn't know anybody. The staff were kind, friendly, and caring and gave me their time, sitting and talking to me. They really wanted to get to know me. They helped me settle into my new home. They listened to me and supported me with the things that were important to me. They helped me fill my day as my whole routine what I was used to had all changed. They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
  name: "Administrator",
  date: "10th June 2026",
};

// #80's second Figma variant — purple band, two testimonials side by side.
// Attribution/dates as given in the design; swap in real names if/when the
// client supplies them.
export const teamTestimonials: [QuoteEntry, QuoteEntry] = [
  {
    quote:
      "I have had the pleasure of working alongside this care company and have consistently been impressed by the high standard of support provided to individuals with additional needs. The team is compassionate, dedicated, and genuinely committed to promoting independence, dignity, and wellbeing for every person they support.",
    name: "Team Leader",
    date: "10th June 2026",
  },
  {
    quote:
      "I have been working in Social Care for many years and joined Lotus Care over two years ago. From the beginning, I have felt supported both professionally and personally. The company has helped me progress in my career and has always been flexible when I needed support to balance my home life and work commitments.",
    name: "Person in Charge",
    date: "9th June 2026",
  },
];
