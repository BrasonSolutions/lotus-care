export interface TeamMember {
  name: string;
  role: string;
  department: string;
  bio: string;
  initials: string;
}

export interface BoardMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export const departments = [
  "All",
  "Leadership",
  "Clinical",
  "Operations",
  "Support",
] as const;

export type Department = (typeof departments)[number];

export const teamMembers: TeamMember[] = [
  {
    name: "Sarah Mitchell",
    role: "Chief Executive Officer",
    department: "Leadership",
    bio: "Sarah brings over 20 years of experience in disability services, driving Lotus Care's vision of person-centred excellence. Her passion for inclusive communities shapes every aspect of our operations.",
    initials: "SM",
  },
  {
    name: "James Cooper",
    role: "Chief Operations Officer",
    department: "Leadership",
    bio: "James oversees the day-to-day operations across all Lotus Care homes, ensuring consistent quality and compliance while fostering a culture of continuous improvement.",
    initials: "JC",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Clinical Director",
    department: "Clinical",
    bio: "Dr. Sharma leads our clinical team with expertise in complex care, behavioural support, and therapeutic interventions. She ensures evidence-based practices underpin all our care delivery.",
    initials: "PS",
  },
  {
    name: "Michael Zhang",
    role: "Head of Allied Health",
    department: "Clinical",
    bio: "Michael coordinates our multi-disciplinary therapy services, including physiotherapy, occupational therapy, and speech pathology, to deliver integrated health outcomes.",
    initials: "MZ",
  },
  {
    name: "Emily Watson",
    role: "Behaviour Support Lead",
    department: "Clinical",
    bio: "Emily develops positive behaviour support plans and trains our team in trauma-informed approaches, creating safe and supportive environments for all residents.",
    initials: "EW",
  },
  {
    name: "David Okonkwo",
    role: "Operations Manager",
    department: "Operations",
    bio: "David manages rostering, compliance, and facility operations, ensuring every home runs smoothly and meets the highest standards of safety and quality.",
    initials: "DO",
  },
  {
    name: "Lisa Nguyen",
    role: "Quality & Compliance Manager",
    department: "Operations",
    bio: "Lisa drives our quality assurance framework, managing NDIS audits, incident reporting, and continuous improvement initiatives across all services.",
    initials: "LN",
  },
  {
    name: "Tom Hendricks",
    role: "HR & Recruitment Manager",
    department: "Operations",
    bio: "Tom leads our recruitment strategy and workforce development, attracting passionate professionals who share our commitment to exceptional care.",
    initials: "TH",
  },
  {
    name: "Rachel Kim",
    role: "Support Coordinator",
    department: "Support",
    bio: "Rachel works closely with participants and families to coordinate services, navigate NDIS plans, and ensure each person receives the support they need.",
    initials: "RK",
  },
  {
    name: "Ben Taylor",
    role: "Community Integration Lead",
    department: "Support",
    bio: "Ben creates pathways for residents to participate in community life, developing partnerships with local organisations, employers, and activity providers.",
    initials: "BT",
  },
  {
    name: "Anna Petrov",
    role: "Family Liaison Officer",
    department: "Support",
    bio: "Anna is the key point of contact for families, providing regular updates, addressing concerns, and ensuring open communication between families and care teams.",
    initials: "AP",
  },
];

export const boardMembers: BoardMember[] = [
  {
    name: "Margaret Lawson AM",
    role: "Chair of the Board",
    bio: "Margaret is a distinguished leader in the Australian disability sector with over 30 years of advocacy. She was awarded a Member of the Order of Australia for her services to people with disabilities.",
    initials: "ML",
  },
  {
    name: "Professor Robert Chen",
    role: "Deputy Chair",
    bio: "Professor Chen brings academic rigour and research expertise from his role at the University of Melbourne, where he leads the Disability and Inclusion Research Centre.",
    initials: "RC",
  },
  {
    name: "Catherine Moore",
    role: "Board Treasurer",
    bio: "Catherine is a chartered accountant and partner at a leading firm, contributing financial governance expertise to ensure Lotus Care's sustainable growth and fiscal responsibility.",
    initials: "CM",
  },
  {
    name: "Dr. Ahmed Hassan",
    role: "Board Member",
    bio: "Dr. Hassan is a respected psychiatrist specialising in intellectual disability mental health, providing clinical governance oversight and strategic health guidance.",
    initials: "AH",
  },
  {
    name: "Susan Clarke",
    role: "Board Member",
    bio: "Susan is a parent advocate and community leader whose lived experience as a carer brings an invaluable perspective to the board's decision-making.",
    initials: "SC",
  },
];
