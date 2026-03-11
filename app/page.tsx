import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import HomesCarousel from "@/components/homes-carousel";
import TeamSection from "@/components/team-section";
import BoardSection from "@/components/board-section";
import RecruitmentSection from "@/components/recruitment-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <HomesCarousel />
        <TeamSection />
        <BoardSection />
        <RecruitmentSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
