import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CorporateTraining from "@/components/home/CorporateTraining";
import ExpertTrainers from "@/components/home/ExpertTrainers";
import PlacementModule from "@/components/home/PlacementModule";

export default function Home() {
  return (
    <main className="min-h-screen pt-16">
      <Hero />
      <WhyChooseUs />
      <FeaturedCourses />
      <CorporateTraining />
      <ExpertTrainers />
      <PlacementModule />
    </main>
  );
}
