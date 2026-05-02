"use client"

import { useEffect } from "react";

import Hero from "@/components/home/Hero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CorporateTraining from "@/components/home/CorporateTraining";
import ExpertTrainers from "@/components/home/ExpertTrainers";
import PlacementModule from "@/components/home/PlacementModule";
import { useHomeStore } from "@/store/homeStore";
import MasterPrograms from "@/components/home/MasterPrograms";
import LatestBlogs from "@/components/home/LatestBlogs";
import InterviewQuestions from "@/components/home/InterviewQuestions";
import LatestTutorials from "@/components/home/LatestTutorials";
import LearningPath from "@/components/home/LearningPath";
import CTASection from "@/components/home/CTASection";
import HomeContact from "@/components/home/HomeContact";
import HomeFAQ from "@/components/home/HomeFAQ";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
 const fetchAll = useHomeStore((state) => state.fetchAll);

   useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  console.log("course",fetchAll)
  return (
    <main className="min-h-screen">
     <Hero />
      <WhyChooseUs />
      <FeaturedCourses />
      <LearningPath />
      <MasterPrograms />     
      <CorporateTraining />
      <LatestTutorials />
      <ExpertTrainers />
      <LatestBlogs />     
      <InterviewQuestions />    
      <PlacementModule />
      <Testimonials />
      <HomeFAQ />
      <HomeContact />
      <CTASection />
    </main>
  );
}
