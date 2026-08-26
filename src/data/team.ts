export interface TeamMember {
  name: string;
  role: string;
  department: string;
  bio: string;
  initials: string;
  image?: string;
}

export const departments = [
  "Board",
  "Management",
  "Services",
  "Quality",
  "MDT",
  "People & Culture",
  "Finance",
  "Persons in Charge",
] as const;

export type Department = (typeof departments)[number];

export const teamMembers: TeamMember[] = [
  // Senior Management Team
  {
    name: "Mary Bardin",
    role: "Director of Services",
    department: "Management",
    bio: "Mary is a highly experienced senior health care professional, having worked in the Healthcare Sector for over 30 years, primarily in the provision of services for Children and Adults with Intellectual Disabilities, Community Care / Family Support, Older Persons, and People Living with Dementia.\n\nMary has held many senior leadership roles, including Care Director, Chief Executive Officer, Senior Services Manager of residential and day services for adults with intellectual disabilities at Sunbeam House Services and Operations Manager at the Alzheimer Society of Ireland. Mary has also worked within the Private Nursing Home Sector in Ireland and the UK, The Irish Wheelchair Association, Family Carers Ireland, St Michael's House, and the HSE Psychiatric / Intellectual Disability Services. Mary's reputation for delivering high quality person centred care will further enhance and support the Lotus Care team in meeting the organisations values & mission.",
    initials: "MB",
    image: "/images/staff/Mary-Bardin.png",
  },
  {
    name: "Patrick Troy",
    role: "Director of People & Culture",
    department: "Management",
    bio: "Patrick Troy is an accomplished HR professional with broad experience across multiple industries, including healthcare, consultancy services, construction, and manufacturing. He holds a Master's degree in Social and Organisational Psychology and is a Chartered Member of the Chartered Institute of Personnel and Development (CIPD).\n\nWith a strong belief in the power of people to drive organisational success, Patrick specialises in developing workplace cultures and systems that empower individuals and enhance engagement. His work has led to the design and implementation of award-winning, industry-first initiatives in talent development and organisational change. Passionate about unlocking potential at every level, Patrick brings a strategic and innovative approach to human resources that consistently delivers impact.",
    initials: "PT",
    image: "/images/staff/Patrick-Troy.png",
  },
  {
    name: "Alan Doyle",
    role: "Chief Financial Officer",
    department: "Management",
    bio: "",
    initials: "AD",
    image: "/images/staff/Alan-Doyle.png",
  },
  {
    name: "Danny Scally",
    role: "ADT Manager",
    department: "Management",
    bio: "Danny is a qualified Intellectual Disability Nurse working in the social care area for the past 13 years, primarily in the provision of Disability and Mental Health Services. Danny holds additional qualifications in People Management, Mental Health and a qualification in Train the Trainer which indicates his ongoing professional development.\n\nDanny has held various positions such as Clinical Nurse, Person in Charge, Admission, Discharge and Transition Manager, Operations Manager and Director of Operations in a leading Disability Service. Danny has played a pivotal role in service planning, coordination, and resource management. Demonstrating strong leadership, he collaborates with multidisciplinary teams and relevant agencies to ensure the welfare and progression of those under his care.",
    initials: "DS",
    image: "/images/staff/Danny-Scally.png",
  },
  {
    name: "Caíthríona Lynch",
    role: "Director of Quality Assurance",
    department: "Management",
    bio: "I am an experienced Social Care Worker with a passion for Human Rights and promoting high quality individualised supports. I have worked in the disability sector, starting in front line and working up to management roles, since 2017. During this time, I have led teams through change management processes, developed learning programs, led transitions, and supported people to achieve their individual goals through promotion of self-advocacy. My experience spans across residential, day service, respite and wrap around services.\n\nMy values and wealth of experience align strongly with Lotus Care's vision of empowering people to live as independently as possible in a high-quality, safe and person-centred service. I am committed to supporting and empowering staff teams to deliver consistent safe and effective services.",
    initials: "CL",
    image: "/images/staff/Caithriona-Lynch.jpg",
  },
  {
    name: "Nicki Cegielski Egan",
    role: "Finance Manager",
    department: "Management",
    bio: "Nicki has 17 years of experience in healthcare sector finance departments including accounts payable / receivable, payroll, budgets, forecasting, cash flow analysis and office management. Currently studying the CGMA Finance Leadership Program, and holds a BA Hons Degree from NUI Maynooth and a PG Diploma in Financial Management. Nicki is a member of the Irish Payroll Association and a Fellow Member of Accounting Technicians Ireland, and brings a wealth of knowledge and expertise to the role.",
    initials: "NE",
    image: "/images/staff/Nicki-Cegielski-Egan.webp",
  },
  // Senior Services Managers
  {
    name: "Claire Maher",
    role: "Senior Services Manager",
    department: "Services",
    bio: "I have worked within the disability sector for the past eight years, holding a variety of leadership roles, including Team Leader, Person in Charge of a high-support service, Dual Person in Charge, and Director of Operations, where I oversaw the day-to-day operations of seven Designated Centres.\n\nThroughout my career, I have gained extensive experience in operational management, governance, regulatory compliance, and staff leadership. I am passionate about ensuring that the people I support receive compassionate, person-centred care of the highest standard. I am committed to empowering each person to achieve their individual goals, and enjoy meaningful opportunities that reflect their unique needs, wishes, and aspirations.",
    initials: "CM",
    image: "/images/staff/Claire-Maher.png",
  },
  {
    name: "Emma Sweeney",
    role: "Senior Services Manager",
    department: "Services",
    bio: "Emma is an experienced Social Care Worker with 14 years of experience in the disability sector. She has a strong background in both frontline support and service management.\n\nShe's overseen multidisciplinary teams, coordinated individualised support plans, and ensured compliance within residential and respite services.\n\nHer leadership style is collaborative and empathetic, focused on empowering both staff and service owners. She is passionate about advocating for people with disabilities, improving service delivery, and fostering environments where individuals can thrive, grow, and live self-directed lives with dignity.",
    initials: "ES",
    image: "/images/staff/Emma-Sweeney.png",
  },
  // Quality Department
  {
    name: "Louise Kidney",
    role: "Quality Assurance Officer",
    department: "Quality",
    bio: "With a career spanning operational leadership, HR, governance, and frontline social care, Louise has gained a deep understanding of how quality and compliance come together in practice. She has held key roles including Person in Charge, Deputy Director of Operations, HR Generalist, and PIC Peer Mentor, and has been instrumental in establishing both Tusla and HIQA regulated residential centres from the ground up.\n\nLouise is known for her honest and straightforward approach, balanced with a genuine commitment to supporting and empowering staff. She brings strong knowledge, practical insight, and a clear focus on person-centred, safe, and consistent service delivery.",
    initials: "LK",
    image: "/images/staff/Louise-Kidney.png",
  },
  // Multi-disciplinary Team
  {
    name: "Vaida Cheema",
    role: "Therapies Lead",
    department: "MDT",
    bio: "Vaida has been working in healthcare for over 10 years primarily with children and young adults on the ASD spectrum and with adults living with acquired brain injuries.\n\nShe completed a Masters in Cognitive Science (Psychology Postgrad) from UCD in 2016. Vaida also obtained a degree in English Philology in 2003 in Lithuania where she worked as an EFL teacher in a secondary school prior to moving to Ireland in 2004.",
    initials: "VC",
    image: "/images/staff/Vaida-Cheema.png",
  },
  {
    name: "Nadeeka Pathirana",
    role: "Speech & Language Therapist",
    department: "MDT",
    bio: "Nadeeka worked as a SALT at the Sri Lankan Ministry of Health at Teaching hospital Peradeniya and Base Hospital Mahiyanganaya for over 11 years and recently volunteered as a SALT at the Bright Rainbow Day Care centre in Rwanda. She is also qualified with a master's degree in public health science and health Equality from the Institute of Medicine, Sahlgrenska University Hospital, University of Gothenburg, Sweden, for which she received the Swedish Institute Scholarship for Global Professionals in 2022.",
    initials: "NP",
    image: "/images/staff/Nadeeka-Pathirana.png",
  },
  {
    name: "Katie Kelly",
    role: "Behaviour Support Specialist",
    department: "MDT",
    bio: "Katie is a Behaviour Support Specialist with an academic background in psychology, holding a BA in Psychological Studies and an MA in Psychology. She is also a Graduate Member of the Psychological Society of Ireland (PSI). Katie has experience supporting children and adults with a range of complex needs across residential, clinical and community settings.\n\nKatie is passionate about person-centred, rights-based approaches to Positive Behaviour Support (PBS), with a particular interest in developing educational, independence and life-skills supports for individuals living in residential settings. She believes that supportive environments, alongside person-centred approaches, can create meaningful opportunities to develop communication, independence and practical life skills, ultimately enhancing autonomy, participation and overall quality of life.\n\nKatie is committed to ensuring that each service owner's voice, preferences and individual needs remain central to the support they receive.",
    initials: "KK",
    image: "/images/staff/Katie-Kelly.png",
  },
  {
    name: "Katjia Faria",
    role: "Occupational Therapist",
    department: "MDT",
    bio: "Katjia is an Occupational Therapist with a background in paediatric Occupational Therapy and Sensory Integration. She is passionate about supporting individuals to develop greater independence, participation and quality of life through meaningful, person-centred interventions.\n\nIn her role at Lotus Care, Katjia works across residential services supporting both children and adults with a range of needs, including intellectual disabilities, autism and sensory processing difficulties. She focuses on understanding each person's individual sensory, functional and environmental needs and works collaboratively with individuals, families and staff to develop practical strategies and supportive environments.\n\nKatjia is particularly passionate about sensory regulation, functional independence and empowering staff with the knowledge and tools to support individuals in their everyday lives.",
    initials: "KF",
    image: "/images/staff/Katjia-Faria.jpg",
  },
  // People & Culture Department
  {
    name: "Tomasz Perkowski",
    role: "Senior HR Business Partner",
    department: "People & Culture",
    bio: "Tomasz brings extensive national HR leadership experience, with a strong background in Irish and EU employment law and people management. Over the past decade, he has worked in healthcare, manufacturing, and professional services, supporting managers, guiding complex employee relations matters, and driving HR initiatives. Tomasz is also a published author in employment law and currently serves as a Peace Commissioner for Co. Westmeath. He is passionate about building positive workplace cultures and supporting organisations through change.",
    initials: "TP",
    image: "/images/staff/Tomasz-Perkowski.png",
  },
  {
    name: "Jess Dias",
    role: "Senior HR Generalist",
    department: "People & Culture",
    bio: "Jess is a people-focused HR professional with a Bachelor of Business and Associate CIPD membership. With experience working in the Athlone Chamber of Commerce, Jess has collaborated with a wide range of stakeholders to strengthen the local business community. She is passionate about building positive relationships, and finding practical solutions to workplace challenges. Known for her strong interpersonal skills and approachable style, Jess is committed to creating supportive workplaces where both people and organisations can thrive.",
    initials: "JD",
    image: "/images/staff/Jess-Dias.png",
  },
  {
    name: "Dale Cooper",
    role: "Training & Development Coordinator",
    department: "People & Culture",
    bio: "Dale joined Lotus Care in September 2024 and quickly became passionate about supporting staff development and maintaining high standards of care. In January 2025, Dale began becoming more involved in training, initially qualifying as a Manual Handling Instructor before progressing to complete Train the Trainer later that year.\n\nAs his involvement in learning and development grew, Dale officially took on the role of Training & Development Coordinator in November 2025. Since then, he has played an active role in developing and delivering training programmes, induction resources and professional development opportunities for staff across Lotus Care.\n\nDale is passionate about making learning practical, accessible and relevant to the day-to-day experiences of staff working in social care. His approach focuses on building confidence, encouraging professional curiosity and supporting staff to continually develop their knowledge and skills so that the people supported by Lotus Care receive the highest possible standard of person-centred care.",
    initials: "DC",
    image: "/images/staff/Dale-Cooper.jpeg",
  },
  {
    name: "Rianna Mannering",
    role: "Recruitment Specialist",
    department: "People & Culture",
    bio: "I completed my law degree in 2019 and spent 6 years travelling and working in Australia. My experience included working across Customer Service, Australian Immigration and in 2022 entered the Recruitment industry assisting law firms with hiring needs. 2025 brought me back home to Ireland to friends and family. In my spare time I enjoy walks with my 3 year old Golden Doodle who came all the way from Australia, I love travelling Ireland, camping and the occasional drink with family and friends.",
    initials: "RM",
  },
  // Finance Department
  {
    name: "Michelle Cushen",
    role: "Senior Payroll & Accounts Officer",
    department: "Finance",
    bio: "With over 20 years of extensive experience in administration, Michelle brings a wealth of knowledge and expertise to her role as Finance Administrator at Lotus Care Limited. Having pursued additional education in Financial Accounting and Human Resources through a higher certificate program, Michelle is well-equipped to navigate the complexities of finance administration. Michelle is deeply passionate about supporting individuals with intellectual disabilities and is excited to be a part of the Lotus Care team, where she can contribute to delivering invaluable services to this community.",
    initials: "MC",
    image: "/images/staff/Michelle-Cushen.webp",
  },
  // Persons in Charge
  {
    name: "Paula Lyons",
    role: "Person in Charge",
    department: "Persons in Charge",
    bio: "I have five years' experience in the social care sector where I have developed a broad range of experience across mainstream residential services, as well as supporting both adults and children with intellectual disabilities in residential settings.\n\nI graduated in 2021 with an Honours Degree in Applied Social Studies in Social Care and have further developed my professional skills through a Certificate in Supervisory Management and Team Leadership.\n\nI joined Lotus Care in 2024 as a Team Leader and progressed to the role of Person in Charge in October 2025. Throughout my career, I have been committed to promoting high-quality, person-centred care and supporting individuals to have choice, independence, dignity and meaningful opportunities in their everyday lives.\n\nI am passionate about ensuring that every service owner is supported to reach their full potential and that their individual strengths, needs, goals and aspirations remain at the centre of the support they receive. I believe in creating a positive, respectful and inclusive environment where service owners can feel valued, safe and empowered to achieve their goals.\n\nIn my role as Person in Charge, I am committed to leading a dedicated team, promoting high standards of care and supporting the continued development of a service where every individual can thrive.",
    initials: "PL",
  },
];

export const boardMembers: TeamMember[] = [
  {
    name: "Tony O'Brien",
    role: "Chairman",
    department: "Board",
    bio: "Tony is the former Director General of Ireland's Health Service Executive (HSE), responsible for the country's healthcare and social services. He was previously Chief Advisor to the HSE on implementing the National Cancer Control Strategy and Chairman of the National Cancer Registry Board. He was the founding CEO of the National Screening Service. He is Adjunct Associate Professor with Trinity College Dublin School of Medicine lecturing on health strategy. Tony serves on a number of health sector related boards in Ireland and internationally and is a Chartered Director.",
    initials: "TO",
    image: "/images/staff/Tony-OBrien.webp",
  },
  {
    name: "David Corboy",
    role: "CEO",
    department: "Board",
    bio: "David Corboy has 20 years experience in the private healthcare sector. Over this time David has overseen the delivery of services to vulnerable adults and has built a reputation for compliance in all areas of regulated services. David has vast experience in understanding the regulatory aspects that come with providing social care in Ireland.",
    initials: "DC",
    image: "/images/staff/David-Corboy.png",
  },
  {
    name: "Madeline Corboy",
    role: "CEO",
    department: "Board",
    bio: "Madeline Corboy is an NMBI registered nurse. Madeline is an Intellectual disability trained Nurse with 25 years of experience working with Children & Adults in various different settings. Madeline has a passion for delivering the highest standards of care in particular focusing on socialisation and inclusion as part of the overall care and wellbeing of each service user. Madeline has a strong track record in developing structures which delivers person centred care that ensures each person can reach their individual potential and goals.",
    initials: "MC",
    image: "/images/staff/Madeline-Corboy.jpg",
  },
  {
    name: "Brendan O'Sullivan",
    role: "Board Member",
    department: "Board",
    bio: "Brendan brings extensive expertise to the board of Lotus Care, with a background in property, banking and finance law. Qualifying as a solicitor in 2010, he has served as Corporate Counsel for national and international entities, gaining significant experience in legal, compliance and financial management. Following on from a successful legal career, Brendan now represents and manages direct equity investments for family offices, offering strategic oversight to drive sustainable growth.",
    initials: "BO",
    image: "/images/staff/Brendan-OSullivan.webp",
  },
  {
    name: "Louise Nieman",
    role: "Board Member",
    department: "Board",
    bio: "Louise Niemann is a seasoned financial executive with over 25 years of experience in leading financial operations and building high-performance teams. She has a proven track record of executing sustainable growth strategies that prioritize excellent customer and client outcomes.\n\nLouise's career includes notable positions at Deloitte, JP Morgan, and New Look PLC. At The City Bin Co, a private equity-backed business, she served as CFO and played a pivotal role in its successful acquisition by a competitor in 2023.\n\nLouise holds an MBA from London Business School and is a qualified Chartered Accountant.",
    initials: "LN",
    image: "/images/staff/Louise-Niemann.webp",
  },
];
