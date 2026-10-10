import FAQSection from "@/components/modules/home/FAQSection";
import HeroSection from "@/components/modules/home/Hero";
import StatisticsSection from "@/components/modules/home/StatisticsSection";
import WhyChooseSection from "@/components/modules/home/WhyChooseSection";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <StatisticsSection />
      <WhyChooseSection />
      <FAQSection />
    </main>
  );
};

export default HomePage;
