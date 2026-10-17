import FAQSection from "@/components/modules/home/FAQSection";
import Feedback from "@/components/modules/home/Feedback";
import HeroSection from "@/components/modules/home/Hero";

import WhyChooseSection from "@/components/modules/home/WhyChooseSection";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <WhyChooseSection />
      <Feedback/>
      <FAQSection />
    </main>
  );
};

export default HomePage;
