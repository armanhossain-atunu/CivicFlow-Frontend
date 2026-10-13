import FAQSection from "@/components/modules/home/FAQSection";
import HeroSection from "@/components/modules/home/Hero";

import WhyChooseSection from "@/components/modules/home/WhyChooseSection";

const HomePage = () => {
  return (
    <main>
      <HeroSection />

      <WhyChooseSection />
      <FAQSection />
    </main>
  );
};

export default HomePage;
