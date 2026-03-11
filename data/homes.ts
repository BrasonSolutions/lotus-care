export interface Home {
  name: string;
  shortDescription: string;
  fullDescription: string;
  capacity: number;
  features: string[];
  color: string;
}

export const homes: Home[] = [
  {
    name: "Amethyst House",
    shortDescription:
      "A warm, welcoming home specialising in high-support residential care.",
    fullDescription:
      "Amethyst House provides a nurturing environment for individuals requiring high levels of support. With dedicated staff available around the clock, residents enjoy personalised care plans, sensory spaces, and a beautiful garden setting that promotes wellbeing and connection.",
    capacity: 5,
    features: [
      "24/7 nursing support",
      "Sensory room",
      "Accessible gardens",
      "Activity program",
    ],
    color: "#9b59b6",
  },
  {
    name: "Beryl House",
    shortDescription:
      "Focused on independent living skills and community participation.",
    fullDescription:
      "Beryl House supports individuals working towards greater independence. Our team assists with daily living skills, community access, and social connections, creating a stepping stone towards more autonomous living while maintaining a safe, supportive home base.",
    capacity: 4,
    features: [
      "Life skills training",
      "Community access program",
      "Individual goal tracking",
      "Modern kitchen facilities",
    ],
    color: "#2ecc71",
  },
  {
    name: "Citrine House",
    shortDescription:
      "A vibrant respite home offering short-term stays and engaging programs.",
    fullDescription:
      "Citrine House is our dedicated respite facility, providing short-term accommodation in a bright, engaging environment. Guests enjoy a varied activity program, home-cooked meals, and the opportunity to build friendships while their families take a well-deserved break.",
    capacity: 6,
    features: [
      "Flexible stay options",
      "Recreation room",
      "Structured activities",
      "Family-style dining",
    ],
    color: "#f1c40f",
  },
  {
    name: "Diamond House",
    shortDescription:
      "Specialised support for individuals with complex care needs.",
    fullDescription:
      "Diamond House caters to individuals with complex medical and behavioural support needs. Our highly trained team delivers specialised care within a calm, structured environment, incorporating therapeutic approaches and assistive technology to maximise quality of life.",
    capacity: 4,
    features: [
      "Specialist nursing",
      "Assistive technology",
      "Therapeutic programs",
      "Low-stimulus spaces",
    ],
    color: "#3498db",
  },
  {
    name: "Emerald House",
    shortDescription:
      "A nature-focused home with expansive outdoor spaces and activities.",
    fullDescription:
      "Emerald House is set on spacious grounds with gardens, walking paths, and outdoor activity areas. Residents enjoy horticultural therapy, pet interactions, and nature-based wellbeing programs alongside comprehensive residential support in a peaceful setting.",
    capacity: 5,
    features: [
      "Horticultural therapy",
      "Pet therapy program",
      "Nature walks",
      "Outdoor recreation",
    ],
    color: "#27ae60",
  },
  {
    name: "Fluorite House",
    shortDescription: "Creative arts and expression-focused residential care.",
    fullDescription:
      "Fluorite House integrates creative arts into daily life, offering music, visual arts, and performing arts programs. Residents are encouraged to explore their creative potential as a pathway to self-expression, confidence building, and social connection.",
    capacity: 5,
    features: [
      "Art studio",
      "Music room",
      "Creative workshops",
      "Exhibition space",
    ],
    color: "#e74c3c",
  },
  {
    name: "Garnet House",
    shortDescription:
      "Supporting young adults transitioning to independent living.",
    fullDescription:
      "Garnet House is designed for young adults ready to develop their independence. With a focus on life skills, employment readiness, and social development, our team provides graduated support that empowers residents to confidently plan their future.",
    capacity: 4,
    features: [
      "Employment pathways",
      "Life skills coaching",
      "Social programs",
      "Transition planning",
    ],
    color: "#c0392b",
  },
  {
    name: "Heliodor House",
    shortDescription:
      "A bright, modern home emphasising health and active living.",
    fullDescription:
      "Heliodor House promotes an active, healthy lifestyle with fitness programs, nutritional planning, and wellness activities. The modern, light-filled home creates an uplifting atmosphere where residents are supported to achieve their personal health and wellbeing goals.",
    capacity: 5,
    features: [
      "Fitness program",
      "Nutrition planning",
      "Wellness activities",
      "Modern amenities",
    ],
    color: "#f39c12",
  },
];
