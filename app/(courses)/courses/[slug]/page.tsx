"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useHomeStore } from "@/store/homeStore";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Users, Clock, BookOpen, ChevronRight, Award,
  FileText, Layers, Monitor, ArrowLeft, ArrowRight,
  Cloud, BarChart2, Database, Brain, Code2, PieChart,
  CircleDot, FolderKanban, Wrench, Layout, Shield,
  Bitcoin, Smartphone, Megaphone, Bot, Cpu
} from "lucide-react";

import CourseBanner from "@/components/courses/CourseBanner";
import CourseContentPanel from "@/components/courses/CourseContentPanel";
import PlacementModule from "@/components/home/PlacementModule";

// ── Icons for Category View ──────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
  'fa fa-soundcloud': Cloud,
  'fa fa-pie-chart': PieChart,
  'fa fa-user': Cpu,
  'fa fa-bar-chart-o': BarChart2,
  'fa fa-codepen': Code2,
  'fa fa-lightbulb-o': Brain,
  'fa fa-opera': CircleDot,
  'fa fa-file-text': FolderKanban,
  'fa fa-wrench': Wrench,
  'fa fa-code': Layout,
  'fa fa-database': Database,
  'fa fa-shield': Shield,
  'fa fa-bitcoin': Bitcoin,
  'fa fa-windows': Monitor,
  'fa fa-mobile-phone': Smartphone,
  'fa fa-bullhorn': Megaphone,
  'fa fa-magic': Bot,
};

export default function CoursesSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const fetchCategories = useHomeStore((s) => s.fetchCategories);
  const categories = useHomeStore((s) => s.categories);
  const loadingCategories = useHomeStore((s) => s.loading.categories);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

  // Determine if the current slug is a category
  const isCategory = categories.some((c) => c.slug === slug);

  if (loadingCategories && categories.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (isCategory) {
    return <CategoryView key={`cat-${slug}`} slug={slug} />;
  }

  return <CourseDetailView key={`course-${slug}`} slug={slug} />;
}

// ── View 1: Category Course Listing ──────────────────────────────────────────
function CategoryView({ slug }: { slug: string }) {
  const fetchCoursesByCategory = useHomeStore((s) => s.fetchCoursesByCategory);
  const categoryCoursesPage = useHomeStore((s) => s.categoryCoursesPage);
  const loading = useHomeStore((s) => s.loading.categoryCourses);
  const categories = useHomeStore((s) => s.categories);
  const [page, setPage] = useState(1);

  const currentCategory = categories.find((c) => c.slug === slug);

  useEffect(() => {
    fetchCoursesByCategory(slug, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug, page]);

  const courses = categoryCoursesPage?.items ?? [];
  const pagination = categoryCoursesPage?.pagination;

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
          </div>
          <div className="relative px-8 py-12 md:px-14 md:py-16">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-purple-400 font-medium">
                {currentCategory?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    {(() => {
                      if (!currentCategory) return <BookOpen className="w-6 h-6 text-purple-400" />;
                      const Icon = iconMap[currentCategory.image] ?? BookOpen;
                      return <Icon className="w-6 h-6 text-purple-400" />;
                    })()}
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {currentCategory?.title ?? slug}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {currentCategory?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Courses
                  </span>
                </h1>
                {currentCategory?.description && (
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  href={`/courses/${course.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-44 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                    <img
                      src={course.image ?? 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">{course.category}</span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{course.rating}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold text-gray-900">₹{course.price}</span>
                        <span className="ml-2 text-xs text-gray-400 line-through">₹{course.originalPrice}</span>
                      </div>
                      <span className="text-xs font-semibold text-purple-600 group-hover:underline">View Course</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No courses found in this category.</p>
            <Link href="/courses" className="text-purple-600 font-semibold hover:underline">Browse all courses</Link>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${p === page ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"}`}
                    >
                      {p}
                    </button>
                  );
                }
                if (Math.abs(p - page) === 2) return <span key={p} className="px-1 text-gray-400">…</span>;
                return null;
              })}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ── View 2: Course Detail ────────────────────────────────────────────────────
function CourseDetailView({ slug }: { slug: string }) {
  const fetchCourseBySlug = useHomeStore((s) => s.fetchCourseBySlug);
  const fetchCourseSections = useHomeStore((s) => s.fetchCourseSections);
  const course = useHomeStore((s) => s.courseDetail);
  const sections = useHomeStore((s) => s.courseSections);
  const loading = useHomeStore((s) => s.loading.courseDetail);

  useEffect(() => {
    // Only fetch if the current stored course doesn't match the slug
    if (!course || course.slug !== slug) {
      fetchCourseBySlug(slug);
    }
    // We only depend on slug here to avoid size-change errors during HMR
    // and because fetchCourseBySlug is stable.
  }, [slug]);

  useEffect(() => {
    // Only fetch sections if they don't belong to the current course or are empty
    if (course?.id && (sections.length === 0 || (sections[0].courseId || (sections[0] as any).course_id) !== course.id)) {
      fetchCourseSections(course.id);
    }
    // Only depend on course?.id to trigger the fetch
  }, [course?.id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Course Details...</p>
        </div>
      </div>
    );
  }

  if (!course) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <p className="text-gray-400">Course not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <CourseBanner course={course} />
      <CourseContentPanel course={course} sections={sections} />
      <PlacementModule />
    </div>
  );
}