import { useRef } from "react";
import { Hero } from "../components/Hero";
import { ServicesSection } from "../components/ServicesSection";
import { HowItWorks } from "../components/HowItWorks";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { EstimateCalculator } from "../components/EstimateCalculator";
import { PartnerSection } from "../components/PartnerSection";
import { ReviewsSection } from "../components/ReviewsSection";
export const HomePage = ({ onOpenInquiry, onOpenAuth }) => {
  const calculatorRef = useRef(null);
  const scrollToCalculator = () => {
    const el = document.getElementById("calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleSelectService = (serviceKey) => {
    onOpenInquiry({ serviceCategory: serviceKey });
  };
  const handleBookWithEstimate = (estimateDetails) => {
    onOpenInquiry(estimateDetails);
  };
  const handleJoinPartner = () => {
    onOpenAuth("register", "partner");
  };
  return <main>
      <Hero
    onOpenInquiry={onOpenInquiry}
    onScrollToCalculator={scrollToCalculator}
  />
      <ServicesSection onSelectService={handleSelectService} />
      <HowItWorks />
      <EstimateCalculator onBookWithEstimate={handleBookWithEstimate} />
      <WhyChooseUs />
      <ReviewsSection />
      <PartnerSection onJoinPartner={handleJoinPartner} />
    </main>;
};
