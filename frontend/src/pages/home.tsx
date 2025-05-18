import FAQsection from "../components/home/faq";
import FeatureSection from "../components/home/feature-section";
import HeroSection from "../components/home/hero";
import PricingSection from "../components/home/pricing-section";
import TestimonialSection from "../components/home/testimonial-section";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <PricingSection />
      <FAQsection />
    </div>
  );
};

export default HomePage;
