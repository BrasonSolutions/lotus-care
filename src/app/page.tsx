import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { QuoteSection } from "@/components/quote-section";
import { HomesCarousel } from "@/components/homes-carousel";
import { HomesSplitRow } from "@/components/homes-split-row";
import { TeamSection } from "@/components/team-section";
import { RecruitmentSection } from "@/components/recruitment-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { LotusBand } from "@/components/lotus-band";

import { contactInfo } from "@/data/navigation";
import { services, enhanceServices } from "@/data/services";
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
  "Established in 2022, Lotus Care provides residential and non-residential respite services for children and adults whom we call our Service Owners. Lotus Care focuses on creating environments where Service Owners can feel at home, build relationships and have greater choice and independence in their everyday lives.",
  "Our approach is rooted in dignity, human rights and person-centred care. We take the time to understand each person as an individual, their ambitions and the things that matter most to them, and work alongside the service owner, their families, other stakeholders and our teams to provide the right support. Lotus Care offer a wide range of supports through our dedicated care teams and multidisciplinary teams.",
  "Lotus Care has continued to grow and our focus has remained the same, putting Service Owners first. We are committed to creating more exceptional places and opportunities for the people we support, while building a workplace where our teams can grow, develop and be proud of the difference they make.",
];

const aboutStats = [
  { value: "12", label: "Care Homes" },
  { value: "200+", label: "Staff Members" },
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
          subtitle="As an award-winning care provider, Lotus Care is committed to the highest standards of care excellence, delivered with pride, compassion, and support to enhance the quality of lives of people with additional needs."
        />
        <AboutSection
          title="About Lotus Care"
          subtitle="Dedicated to enhancing the lives of people with disabilities since our founding."
          paragraphs={aboutParagraphs}
          stats={aboutStats}
        />
        <ServicesSection
          groups={[
            {
              title: "Our Services",
              subtitle:
                "Comprehensive disability support services designed around each individual's needs and aspirations.",
              services,
            },
            {
              id: "how-we-enhance",
              title: "How We Enhance Our Services",
              subtitle:
                "The multidisciplinary expertise, model of care and governance that sit behind every service we deliver.",
              services: enhanceServices,
            },
          ]}
        />
        <QuoteSection
          quote={homeQuote}
          ctaHref="/quality/model-of-care#testimonials"
          ctaLabel="Read More Testimonials"
        />
        <HomesCarousel homes={homes} />
        <HomesSplitRow />
        <div aria-hidden="true">
          <LotusBand variant="teal" height={72} />
        </div>
        <TeamSection members={[...boardMembers, ...teamMembers]} departments={departments} />
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
