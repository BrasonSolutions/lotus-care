import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { QuoteSection } from "@/components/quote-section";
import { CoverflowCarousel } from "@/components/coverflow-carousel";
import { TeamSection } from "@/components/team-section";
import { RecruitmentSection } from "@/components/recruitment-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { LotusBand } from "@/components/lotus-band";
import { SectionTitle } from "@/components/section-title";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/layout";
import { Button } from "@/components/button";
import { ValuesGrid } from "@/components/careers/values-grid";

import { contactInfo } from "@/data/navigation";
import { services, enhanceServices } from "@/data/services";
import { teamMembers, departments, boardMembers } from "@/data/team";
import { jobs } from "@/data/jobs";
import { homeQuote } from "@/data/testimonial";
import { whyUsValues } from "@/data/careers";

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

// Client-supplied photography, replacing the per-house shots this gallery used
// to derive from homes.ts. The files carry no house attribution, which suits a
// gallery that deliberately names no houses — so `alt` describes the scene.
// Interleaved exterior/interior so the run alternates buildings and rooms.
const homeGallerySlides = [
  { src: "/images/homes/gallery/exterior-1.webp", alt: "One of our homes seen from the driveway" },
  { src: "/images/homes/gallery/interior-1.webp", alt: "A bright sensory and activity room" },
  { src: "/images/homes/gallery/exterior-2.webp", alt: "Lawn and garden along the side of a home" },
  { src: "/images/homes/gallery/interior-2.webp", alt: "A playroom with a play tent and a bicycle" },
  { src: "/images/homes/gallery/exterior-3.webp", alt: "A home and its grounds from above" },
  { src: "/images/homes/gallery/interior-3.webp", alt: "A quiet lounge corner with armchairs and soft toys" },
  { src: "/images/homes/gallery/exterior-4.webp", alt: "A garden with a trampoline and swings" },
  { src: "/images/homes/gallery/interior-4.webp", alt: "Shelves of toys, books and games" },
  { src: "/images/homes/gallery/interior-5.webp", alt: "A bedroom decorated in purple" },
  { src: "/images/homes/gallery/interior-6.webp", alt: "A bedroom looking out over the garden" },
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
        <section id="homes" className="py-20 lg:py-28 bg-white">
          <Container>
            <SectionTitle
              title="Our Homes"
              subtitle="Our homes are designed around the people who live in them, creating welcoming spaces where everyone can feel comfortable, supported and at home."
            />
            <Reveal className="reveal-scale">
              <CoverflowCarousel
                slides={homeGallerySlides}
                label="Photos of our homes"
                cardWidth="clamp(220px, 32vw, 420px)"
              />
            </Reveal>
            <div className="text-center mt-8">
              <Button href="#contact" variant="outline" size="lg">
                Enquire About Our Homes
              </Button>
            </div>
          </Container>
        </section>
        <div aria-hidden="true">
          <LotusBand variant="teal" height={72} />
        </div>
        <TeamSection members={[...boardMembers, ...teamMembers]} departments={departments} />
        <div aria-hidden="true">
          <LotusBand variant="teal" height={72} />
        </div>
        <RecruitmentSection
          description={recruitmentDescription}
          note={recruitmentNote}
          jobs={jobs}
          ctas={recruitmentCtas}
        />
        <section className="py-16 sm:py-20 bg-white">
          <Container>
            <SectionTitle dmSans title="Our Vision & Values" />
            <ValuesGrid values={whyUsValues} />
          </Container>
        </section>
        <ContactSection contactInfo={contactInfo} />
      </main>
      <Footer quickLinks={quickLinks} />
    </>
  );
}
