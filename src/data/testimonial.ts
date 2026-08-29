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
    "When I first moved to my first home with Lotus Care, I was nervous because everything was new to me. I left my family behind and didn't know anybody. The staff were kind, friendly, and caring and gave me their time, sitting and talking to me. They really wanted to get to know me. They helped me settle into my new home. They listened to me and supported me with the things that were important to me. They helped me fill my day as my whole routine what I was used to had all changed. They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
  name: `${jwAttribution.initials}, ${jwAttribution.role}`,
  date: "With Lotus Care since 2018",
};

export interface ServiceOwnerTestimonial extends HomeQuote {
  slug: string;
  initials: string;
  role: string;
  // Headline of the written piece, shown on the detail page.
  title?: string;
  // Continues after `quote`, which is the piece's opening paragraph.
  body?: string[];
}

// Single source for `/testimonials`, its detail pages, and the home band.
export const serviceOwnerTestimonials: ServiceOwnerTestimonial[] = [
  {
    ...homeQuote,
    ...jwAttribution,
    slug: "jw",
    title: "My Journey with Lotus Care",
    body: [
      "When I first moved to my first home with Lotus Care, I was nervous because everything was new to me. I left my family behind and didn’t know anybody. The staff were kind, friendly, and caring and gave me their time, sitting and talking to me. They really wanted to get to know me. They helped me settle into my new home. They listened to me and supported me with the things that were important to me. They helped me fill my day as my whole routine what I was used to had all changed. They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
      "Living in my first home helped me so much, I came as a young boy. I became more confident in myself and started doing more things for myself where I didn’t need staff to help me. For example, I learned how to prepare meals, like pasta, carbonara and spaghetti bolognese. I learned how to do household chores and do them properly like making my bed, changing the bed clothes and using the washing machine. The staff always encouraged me and helped me when I needed support especially on hard days. They would sit with me and really listen and offer me some suggestions to help make me feel better.",
      "Staff were always there to help me make up my own mind for hard decisions. They would list me the good and the not so good options to a decision and this always helped me to make a good decision and make my own decision.",
      "They praise me when I achieve things, like my graduation from secondary school, getting my leaving cert results, my 18th birthday, which made me feel proud knowing I can achieve my dreams.",
      "When it was my time to move to my adult home, cause I was 18 years old and couldn’t stay in my first home, the staff helped me get ready for the move. Moving to a new home was a big step for me, I was very happy there but I was now an adult, not a boy but a man. Everyone supported me and it was easier because I knew staff already. They helped me visit my new home, supported me to help decorate my room and bathroom with what I wanted and looking back it was much easier than I thought it would be. Getting to know the new staff and moving into an adult house make me feel nervous but excited at the same time. I was ready for the move, and I felt safe which was important to me.",
      "The staff also helped me build my confidence by encouraging me to take part in the community. At first, I was nervous about meeting new people and trying new things, but with help from them, I became more comfortable about doing new things. I now enjoy going to football training, swimming, traveling on the train back and forth to college, meeting friends, and socialising in the community. This has helped me feel more confident and be like all other teenagers.",
      "I enjoy living in my adult home. I like spending time with the people I live with and getting out into the community. I enjoy going to my activities, meeting people, and trying new things. The staff help me when I need support, but they also encourage me to do as much as I can for myself. This helps me with my confidence but also helps me believe in myself because I know now I can do these things myself. I even take care of my own money now, doing my receipts and do my saving and all that myself. There has been lots of fun along the way both in my first home and in my adult home. Staff are great fun and always up for a laugh, a kick about, board games, a sing song, listen to some music or watch some tv with me.",
      "We have also had great holidays away with my fellow house mates in Lotus. We all went on a week away where we did lots of new things such as canoeing, wind sailing and going on the amusements. I really enjoyed the evening BBQ’s, we sang, danced and basically just had a great laugh.",
      "Lotus likes to celebrate, we have had lots of parties and meet ups with staff and SO. Sports Day, BBQ Days, Emerald Park Days, Birthday Parties, Graduation Days, Christmas Parties, any excuse for a party. I always make a banoffee pie for any parties we have in Lotus Care. It is my speciality; everyone loves to see me coming with one. I enjoy hearing how delicious it is.",
      "My biggest goal is coming up soon, where I will be moving to supported living. I will have my own apartment and staff will support me but much less than now. I feel I am ready to make this move. I have learned so much and I know I have more to learn but I am excited and would like to live on my own now. I hope to move back to my home County which will be great for me. I am so grateful to Lotus Care for helping me through the years and helping me become the man I am today. I will truly miss the staff and SO and I will keep in touch, the staff mean so much to me, and I will never forget that.",
    ],
  },
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
    "When I first moved to my first home with Lotus Care, I was nervous because everything was new to me. I left my family behind and didn't know anybody. The staff were kind, friendly, and caring and gave me their time, sitting and talking to me. They really wanted to get to know me. They helped me settle into my new home. They listened to me and supported me with the things that were important to me. They helped me fill my day as my whole routine what I was used to had all changed. They encouraged me to make choices about my day-to-day life, and made sure I felt a part of my home.",
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
