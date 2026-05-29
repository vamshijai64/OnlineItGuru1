"use client";

import { useEffect } from "react";

import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CorporateTraining from "@/components/home/CorporateTraining";
import ExpertTrainers from "@/components/home/ExpertTrainers";
import PlacementModule from "@/components/home/PlacementModule";
import { useHomeStore } from "@/store/homeStore";
import LearningPath from "@/components/home/LearningPath";
import CTASection from "@/components/home/CTASection";
import HomeContact from "@/components/home/HomeContact";
import Testimonials from "@/components/home/Testimonials";

export default function HomePageClient() {
  const fetchAll = useHomeStore((state) => state.fetchAll);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <main className="min-h-screen">
      <Hero />
      <WhyChooseUs />
      <FeaturedCourses />
      <LearningPath />
      <CorporateTraining />
      <ExpertTrainers />
      <PlacementModule theme="light" />
      <Testimonials />
      <HomeContact />
      <CTASection />
    </main>
  );
}
