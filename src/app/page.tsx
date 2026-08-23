import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { QuoteSection } from "@/components/quote-section";
import { HomesCarousel } from "@/components/homes-carousel";
import { HomesSplitRow } from "@/components/homes-split-row";
import { TeamSection } from "@/components/team-section";
import { BoardSection } from "@/components/board-section";
import { RecruitmentSection } from "@/components/recruitment-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { LotusBand } from "@/components/lotus-band";

import { contactInfo } from "@/data/navigation";
import { services } from "@/data/services";
import { homes } from "@/data/homes";
import { teamMembers, departments, boardMembers } from "@/data/team";
import { jobs } from "@/data/jobs";
import { homeQuote } from "@/data/testimonial";

const quickLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "Our Homes", href: "#homes" },
  { label: "Meet the Team", href: "#team" },
  { label: "Careers", href: "#careers" },
  { label: "Contact Us", href: "#contact" },
];

const aboutParagraphs = [
  "Lotus Care is a HIQA-registered provider committed to delivering exceptional residential care across the Midlands. Our network of twelve purpose-designed homes provides warm, supportive environments where individuals are empowered to thrive.",
  "We believe every person deserves to live a life of dignity, choice, and connection. Our dedicated team of professionals works alongside each participant to develop personalised support plans that reflect their unique goals, interests, and aspirations.",
  "Through our person-centred approach, multi-disciplinary expertise, and genuine commitment to community integration, we create pathways for individuals to build meaningful relationships, develop new skills, and participate fully in community life.",
];

const aboutStats = [
  { value: "12", label: "Care Homes" },
  { value: "200+", label: "Staff Members" },
  { value: "25+", label: "Lives Supported" },
  { value: "24/7", label: "Care Available" },
];

const recruitmentDescription = [
  "Are you passionate about making a real difference in people's lives? Lotus Care is always looking for compassionate, dedicated professionals to join our growing team.",
];

const recruitmentNote =
  "Competitive salaries, funded training, genuine career progression, and a culture built on respect and inclusion.";

const recruitmentCtas = [
  { label: "Explore All Roles", href: "/careers", variant: "primary" as const },
  { label: "Life at Lotus Care", href: "/careers/why-us", variant: "outline" as const },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <HeroSection
          title="Enhanced living"
          titleHighlight="empowering lives."
          subtitle="Providing quality respite and residential disability care services across the Midlands, supporting individuals to live their best lives with dignity and purpose."
        />
        <AboutSection
          title="About Lotus Care"
          subtitle="Dedicated to enhancing the lives of people with disabilities since our founding."
          paragraphs={aboutParagraphs}
          stats={aboutStats}
        />
        <ServicesSection services={services} />
        <QuoteSection quote={homeQuote} />
        <HomesCarousel homes={homes} />
        <HomesSplitRow />
        <div aria-hidden="true">
          <LotusBand variant="teal" height={72} />
        </div>
        <TeamSection members={teamMembers} departments={departments} />
        <BoardSection members={boardMembers} />
        <div aria-hidden="true">
          <LotusBand variant="purple" height={72} />
        </div>
        <RecruitmentSection
          description={recruitmentDescription}
          note={recruitmentNote}
          jobs={jobs}
          ctas={recruitmentCtas}
        />
        <ContactSection contactInfo={contactInfo} />
      </main>
      <Footer quickLinks={quickLinks} />
    </>
  );
}
