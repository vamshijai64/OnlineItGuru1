"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomeStore } from '@/store/homeStore';
import HomeCourseCard from '@/components/home/HomeCourseCard';
import HomeCategoryFilter from '@/components/home/HomeCategoryFilter';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.2em] text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full uppercase"
      >
        {badge}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
      >
        {title}
        
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
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
    <div className="min-h-screen bg-[#030303] text-white pt-32 pb-24 px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto max-w-7xl relative z-10">
        <SectionHeader
          badge="Course Catalog"
          title="Explore Our Popular Programs"
          subtitle="Industry-relevant curriculum designed in collaboration with leading tech companies to accelerate your career."
        />

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-20 space-y-8">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search for courses, tools, or categories..."
              className="w-full h-16 pl-16 pr-8 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <HomeCategoryFilter
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              variant="grid"
            />
          </motion.div>
        </div>

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
            className="text-center py-32 bg-white/5 rounded-3xl border border-dashed border-white/10"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No matching courses</h3>
            <p className="text-gray-500 text-lg mb-8">We couldn't find any courses matching your search criteria.</p>
            <Button
              className="rounded-xl px-8 h-12 bg-white text-black hover:bg-gray-200 font-bold"
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
              className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
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
                      : "text-gray-500 hover:bg-white/5 hover:text-white"
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
              className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}