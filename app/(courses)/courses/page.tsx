"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomeStore } from '@/store/homeStore';
import HomeCourseCard from '@/components/home/HomeCourseCard';
import HomeCategoryFilter from '@/components/home/HomeCategoryFilter';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SectionHeader({ badge, title, subtitle }: { badge: string; title: React.ReactNode; subtitle: React.ReactNode }) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block px-6 py-2 mb-6 text-sm font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/30 rounded-full shadow-lg"
      >
        {badge}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight font-outfit"
      >
        Explore Our <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">Popular Programs</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

export default function CoursesPage() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (courses.length === 0) fetchCourses();
    if (categories.length === 0) fetchCategories();
  }, [courses.length, categories.length, fetchCourses, fetchCategories]);

  useEffect(() => {
    const categorySlug = selectedCategory === 'all' ? "" : selectedCategory;
    fetchCoursesByCategory(categorySlug, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, page, fetchCoursesByCategory]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1); // Reset to first page on category change
  };

  const categoryItems = categoryCoursesPage?.items || [];

  let displayCourses = [];
  if (selectedCategory === 'all') {
    // Combine featured courses with whatever is in the cudssdrrent page
    const featured = [...courses];
    categoryItems.forEach(gc => {
      if (!featured.find(c => c.id === gc.id)) {
        featured.push(gc);
      }
    });
    displayCourses = featured;
  } else {
    displayCourses = categoryItems;
  }

  const pagination = categoryCoursesPage?.pagination;

  // Client-side search filter
  const filteredCourses = searchQuery.trim()
    ? displayCourses.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : displayCourses;

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Hero Banner Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-white/5">
        {/* Background Atmosphere - Intensified Purple & Blue Mix */}
        <div className="absolute top-[10%] left-[30%] -translate-x-1/2 w-[700px] h-[500px] bg-purple-700/25 rounded-full blur-[140px] animate-pulse mix-blend-screen" />
        <div className="absolute top-[15%] right-[30%] translate-x-1/2 w-[700px] h-[500px] bg-blue-700/20 rounded-full blur-[140px] animate-pulse mix-blend-screen" style={{ animationDelay: '1s' }} />
        
        {/* 4 Corners Dark Mixed Colors */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-900/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[80px]" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <SectionHeader
            badge="Course Catalog"
            title={<>Master <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">In-Demand Skills</span></>}
            subtitle="Industry-relevant curriculum designed in collaboration with leading tech companies to accelerate your career."
          />

          {/* Search Box in Hero */}
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="Search for courses, tools, or categories..."
                className="w-full h-16 pl-16 pr-8 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg backdrop-blur-xl shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Discovery Section - Light Theme */}
      <section className="py-20 px-6 relative bg-[#f8fafc]">
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <HomeCategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              variant="grid"
              lightMode={true}
            />
          </motion.div>

        <div key={`${selectedCategory}-${loading.categoryCourses}-${page}`} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {(loading.courses || loading.categoryCourses) ? (
              // Loading Skeletons
              [...Array(6)].map((_, i) => (
                <div key={`skeleton-${i}`} className="h-[420px] rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
              ))
            ) : (
              filteredCourses.map((course, index) => (
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
                    isTrending={index === 0 && page === 1}
                    isNew={index === 2 && page === 1}
                    lightMode={true}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200"
          >
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No matching courses</h3>
            <p className="text-slate-500 text-lg mb-8">We couldn't find any courses matching your search criteria.</p>
            <Button
              className="rounded-xl px-8 h-12 bg-slate-900 text-white hover:bg-slate-800 font-bold"
              onClick={() => { setSelectedCategory('all'); setSearchQuery(""); }}
            >
              Clear all filters
            </Button>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-20">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-12 px-6 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50 disabled:opacity-30 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${p === page
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                      : "text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="h-12 px-6 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50 disabled:opacity-30 shadow-sm"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  </div>
);
}