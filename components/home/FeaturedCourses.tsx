


"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useHomeStore } from '@/store/homeStore';
import { Button } from '@/components/ui/button';
import HomeCourseCard from './HomeCourseCard';
import HomeCategoryFilter from './HomeCategoryFilter';

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full"
      >
        {badge}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 max-w-xl  mx-auto text-lg leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

export default function FeaturedCourses() {
  const {
    courses,
    categories,
    fetchCourses,
    fetchCategories,
    fetchCoursesByCategory,
    categoryCoursesPage,
    loading
  } = useHomeStore();

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (courses.length === 0) fetchCourses();
    if (categories.length === 0) fetchCategories();

    // Fetch courses for the selected category
    const categorySlug = selectedCategory === 'all' ? "" : selectedCategory;
    fetchCoursesByCategory(categorySlug, 1);
  }, [selectedCategory, fetchCourses, fetchCategories, fetchCoursesByCategory]);

  // If "all" is selected, we combine featured and some general courses
  // If a category is selected, we show what came back from the API
  const categoryItems = categoryCoursesPage?.items || [];

  let displayCourses = [];
  if (selectedCategory === 'all') {
    const featured = [...courses];
    categoryItems.forEach(gc => {
      if (featured.length < 6 && !featured.find(c => c.id === gc.id)) {
        featured.push(gc);
      }
    });
    displayCourses = featured.slice(0, 6);
  } else {
    // Show up to 6 from the selected category
    displayCourses = categoryItems.slice(0, 6);
  }

  return (
    <section className="relative py-24 px-6 bg-[#030303] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        <SectionHeader
          badge="Our Courses"
          title="Explore Our Popular Programs"
          subtitle="Industry-relevant curriculum designed in collaboration with leading tech companies."
        />

        <div className="mb-16">
          <HomeCategoryFilter
            categories={categories.slice(0, 5)}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <div key={`${selectedCategory}-${loading.categoryCourses}`} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {(loading.courses || loading.categoryCourses) ? (
              // Loading Skeletons
              [...Array(6)].map((_, i) => (
                <div key={`skeleton-${i}`} className="h-[420px] rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
              ))
            ) : (
              displayCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <HomeCourseCard
                    id={course.id}
                    title={course.title}
                    slug={course.slug}
                    category={course.category}
                    rating={course.rating}
                    reviews={course.totalReviews || 1200}
                    duration={course.duration}
                    students={course.students}
                    image={course.image}
                    delay={index}
                    isTrending={index === 0}
                    isNew={index === 2}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading.courses && displayCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No courses found in this category.</p>
            <Button
              variant="ghost"
              className="text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full hover:bg-purple-500/20 px-5 py-1.5 h-auto mt-4"
              onClick={() => setSelectedCategory('all')}
            >
              View all courses
            </Button>
          </motion.div>
        )}

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/courses">
            <Button
              className="px-8 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 font-bold text-base transition-all group border border-white/10"
            >
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

