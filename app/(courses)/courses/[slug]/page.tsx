// // import { courses } from "@/lib/data";
// // import { notFound } from "next/navigation";
// // import { Metadata } from "next";
// // import CourseBanner from "@/components/courses/CourseBanner";
// // import CourseContentPanel from "@/components/courses/CourseContentPanel";
// // import PlacementModule from "@/components/home/PlacementModule";

// // export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
// //     const { slug } = await params;
// //     const course = courses.find((c) => c.slug === slug);
// //     return {
// //         title: `${course?.title || "Course"} | OnlineITGuru`,
// //         description: course?.description || "Explore our career-transforming courses.",
// //     };
// // }

// // export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
// //     const { slug } = await params;
// //     const course = courses.find((c) => c.slug === slug);

// //     if (!course) {
// //         notFound();
// //     }

// //     return (
// //         <div className="min-h-screen bg-slate-50">
// //             {/* Hero Banner */}
// //             <CourseBanner course={course} />

// //             {/* CareStack-style Left Nav + Right Content Panel */}
// //             <CourseContentPanel course={course} />

// //             <PlacementModule />
// //         </div>
// //     );
// // }


// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useHomeStore } from "@/store/homeStore";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//     Star, Users, Clock, ChevronRight, ArrowLeft, ArrowRight, BookOpen,
//     Cloud, BarChart2, Database, Brain, Code2, PieChart,
//     CircleDot, FolderKanban, Wrench, Layout, Shield,
//     Bitcoin, Monitor, Cpu, Smartphone, Megaphone, Bot
// } from "lucide-react";

// const iconMap: Record<string, React.ElementType> = {
//     'fa fa-soundcloud': Cloud,
//     'fa fa-pie-chart': PieChart,
//     'fa fa-user': Cpu,
//     'fa fa-bar-chart-o': BarChart2,
//     'fa fa-codepen': Code2,
//     'fa fa-lightbulb-o': Brain,
//     'fa fa-opera': CircleDot,
//     'fa fa-file-text': FolderKanban,
//     'fa fa-wrench': Wrench,
//     'fa fa-code': Layout,
//     'fa fa-database': Database,
//     'fa fa-shield': Shield,
//     'fa fa-bitcoin': Bitcoin,
//     'fa fa-windows': Monitor,
//     'fa fa-mobile-phone': Smartphone,
//     'fa fa-bullhorn': Megaphone,
//     'fa fa-magic': Bot,
// };

// export default function CategoryCoursesPage() {
//     const params = useParams();
//     const slug = (params?.slug as string) || "";

//     const fetchCoursesByCategory = useHomeStore((s) => s.fetchCoursesByCategory);
//     const categoryCoursesPage = useHomeStore((s) => s.categoryCoursesPage);
//     const loading = useHomeStore((s) => s.loading.categoryCourses);
//     const categories = useHomeStore((s) => s.categories);
//     const fetchCategories = useHomeStore((s) => s.fetchCategories);

//     const [page, setPage] = useState(1);

//     const currentCategory = categories.find((c) => c.slug === slug);

//     useEffect(() => {
//         // Always fetch both — ensures category name is available even on direct URL visit
//         fetchCategories();
//         fetchCoursesByCategory(slug, page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     }, [slug]);                             // ← runs when slug changes

//     useEffect(() => {
//         if (page > 1) {
//             fetchCoursesByCategory(slug, page);
//             window.scrollTo({ top: 0, behavior: "smooth" });
//         }
//     }, [page]);

//     const courses = categoryCoursesPage?.items ?? [];
//     const pagination = categoryCoursesPage?.pagination;

//     return (
//         <main className="min-h-screen pt-24 pb-16 bg-gray-50">
//             <div className="container mx-auto max-w-6xl px-6">

//                 {/* ── Hero Banner ───────────────────────────────────────────────── */}
//                 <div className="relative overflow-hidden rounded-3xl mb-10 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">

//                     {/* Background decorative elements */}
//                     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                         <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
//                         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl" />
//                         <div
//                             className="absolute inset-0 opacity-[0.04]"
//                             style={{
//                                 backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
//                                   linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
//                                 backgroundSize: '40px 40px',
//                             }}
//                         />
//                     </div>

//                     <div className="relative px-8 py-12 md:px-14 md:py-16">

//                         {/* Breadcrumb */}
//                         <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
//                             <Link href="/" className="hover:text-white transition-colors">Home</Link>
//                             <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
//                             <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
//                             <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
//                             <span className="text-purple-400 font-medium">
//                                 {currentCategory?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
//                             </span>
//                         </div>

//                         <div className="flex flex-col md:flex-row md:items-center gap-8">

//                             {/* Left content */}
//                             <div className="flex-1">

//                                 {/* Category icon + badge */}
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
//                                         {(() => {
//                                             if (!currentCategory) return <BookOpen className="w-6 h-6 text-purple-400" />;
//                                             const Icon = iconMap[currentCategory.image] ?? BookOpen;
//                                             return <Icon className="w-6 h-6 text-purple-400" />;
//                                         })()}
//                                     </div>
//                                     <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-full uppercase tracking-wider">
//                                         {currentCategory?.title ?? slug}
//                                     </span>
//                                 </div>

//                                 {/* Title */}
//                                 <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
//                                    {currentCategory?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}{" "}                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
//                                         Courses
//                                     </span>
//                                 </h1>

//                                 {/* Description */}
//                                 {currentCategory?.description && (
//                                     <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3">
//                                         {currentCategory.description}
//                                     </p>
//                                 )}

//                                 {/* Stats row */}
//                                 {pagination && (
//                                     <div className="flex flex-wrap items-center gap-6 mt-6">
//                                         <div className="flex items-center gap-2 text-sm">
//                                             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
//                                                 <BookOpen className="w-4 h-4 text-purple-400" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-white font-bold">{pagination.total}+</p>
//                                                 <p className="text-gray-500 text-xs">Courses</p>
//                                             </div>
//                                         </div>
//                                         <div className="w-px h-8 bg-white/10" />
//                                         <div className="flex items-center gap-2 text-sm">
//                                             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
//                                                 <Users className="w-4 h-4 text-blue-400" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-white font-bold">15,000+</p>
//                                                 <p className="text-gray-500 text-xs">Learners</p>
//                                             </div>
//                                         </div>
//                                         <div className="w-px h-8 bg-white/10" />
//                                         <div className="flex items-center gap-2 text-sm">
//                                             <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
//                                                 <Star className="w-4 h-4 text-yellow-400" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-white font-bold">4.8/5</p>
//                                                 <p className="text-gray-500 text-xs">Avg Rating</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Right: CTA card */}
//                             <div className="flex-shrink-0 w-full md:w-64 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
//                                 <p className="text-white font-semibold mb-1">Start Learning Today</p>
//                                 <p className="text-gray-400 text-xs mb-4">Get certified with industry experts</p>
//                                 <Link
//                                     href="/courses"
//                                     className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition mb-3"
//                                 >
//                                     Browse All Courses <ChevronRight className="w-4 h-4" />
//                                 </Link>
//                                 <Link
//                                     href="/contact"
//                                     className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-white/20 text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/10 transition"
//                                 >
//                                     Talk to an Expert
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Results count ─────────────────────────────────────────────── */}
//                 {pagination && !loading && (
//                     <p className="text-sm text-gray-400 mb-6">
//                         Showing <span className="font-semibold text-gray-700">{courses.length}</span> of{" "}
//                         <span className="font-semibold text-gray-700">{pagination.total}</span> courses
//                     </p>
//                 )}

//                 {/* ── Loading Skeleton ───────────────────────────────────────────── */}
//                 {loading && (
//                     <div className="grid md:grid-cols-3 gap-6">
//                         {[...Array(6)].map((_, i) => (
//                             <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-gray-100" />
//                         ))}
//                     </div>
//                 )}

//                 {/* ── Courses Grid ───────────────────────────────────────────────── */}
//                 {!loading && courses.length > 0 && (
//                     <div className="grid md:grid-cols-3 gap-6">
//                         {courses.map((course, index) => (
//                             <motion.div
//                                 key={course.id}
//                                 initial={{ opacity: 0, y: 30 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.4, delay: index * 0.05 }}
//                             >
//                                 <Link
//                                     href={`/course/${course.slug}`}
//                                     className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300"
//                                 >
//                                     {/* Thumbnail */}
//                                     <div className="h-44 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
//                                         <img
//                                             src={course.image ?? 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80'}
//                                             alt={course.title}
//                                             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                                         />
//                                     </div>

//                                     {/* Content */}
//                                     <div className="p-5">
//                                         <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
//                                             {course.category}
//                                         </span>
//                                         <h3 className="text-sm font-bold text-gray-900 mt-1 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
//                                             {course.title}
//                                         </h3>

//                                         {/* Meta */}
//                                         <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
//                                             <span className="flex items-center gap-1">
//                                                 <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
//                                                 {course.rating}
//                                             </span>
//                                             <span className="flex items-center gap-1">
//                                                 <Users className="w-3.5 h-3.5" />
//                                                 {course.students.toLocaleString()}
//                                             </span>
//                                             <span className="flex items-center gap-1">
//                                                 <Clock className="w-3.5 h-3.5" />
//                                                 {course.duration}
//                                             </span>
//                                         </div>

//                                         {/* Price */}
//                                         <div className="flex items-center justify-between">
//                                             <div>
//                                                 <span className="text-base font-bold text-gray-900">₹{course.price}</span>
//                                                 <span className="ml-2 text-xs text-gray-400 line-through">₹{course.originalPrice}</span>
//                                             </div>
//                                             <span className="text-xs font-semibold text-purple-600 group-hover:underline">
//                                                 View Course
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </Link>
//                             </motion.div>
//                         ))}
//                     </div>
//                 )}

//                 {/* ── Empty ─────────────────────────────────────────────────────── */}
//                 {!loading && courses.length === 0 && (
//                     <div className="text-center py-20">
//                         <p className="text-gray-400 text-lg mb-4">No courses found in this category.</p>
//                         <Link href="/courses" className="text-purple-600 font-semibold hover:underline">
//                             Browse all courses
//                         </Link>
//                     </div>
//                 )}

//                 {/* ── Pagination ─────────────────────────────────────────────────── */}
//                 {!loading && pagination && pagination.totalPages > 1 && (
//                     <div className="flex items-center justify-center gap-3 mt-12">
//                         <button
//                             onClick={() => setPage((p) => Math.max(1, p - 1))}
//                             disabled={page === 1}
//                             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
//                         >
//                             <ArrowLeft className="w-4 h-4" /> Previous
//                         </button>

//                         <div className="flex items-center gap-1">
//                             {[...Array(pagination.totalPages)].map((_, i) => {
//                                 const p = i + 1;
//                                 if (p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1) {
//                                     return (
//                                         <button
//                                             key={p}
//                                             onClick={() => setPage(p)}
//                                             className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${p === page
//                                                     ? "bg-purple-600 text-white"
//                                                     : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
//                                                 }`}
//                                         >
//                                             {p}
//                                         </button>
//                                     );
//                                 }
//                                 if (Math.abs(p - page) === 2) {
//                                     return <span key={p} className="px-1 text-gray-400">…</span>;
//                                 }
//                                 return null;
//                             })}
//                         </div>

//                         <button
//                             onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
//                             disabled={page === pagination.totalPages}
//                             className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-purple-300 hover:text-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
//                         >
//                             Next <ArrowRight className="w-4 h-4" />
//                         </button>
//                     </div>
//                 )}

//             </div>
//         </main>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useHomeStore } from "@/store/homeStore";
import Link from "next/link";
import {
  Star, Users, Clock, BookOpen, Download, Phone,
  Mail, CheckCircle, ChevronRight, Play, Award,
  FileText, Layers, Monitor, Headphones
} from "lucide-react";

const TABS = ["Course Syllabus", "Projects", "Training Options", "Upcoming Batches", "FAQ's", "Reviews", "Certification"];

export default function CourseDetailPage() {
  const params            = useParams();
  const slug              = params.slug as string;
  const fetchCourseBySlug = useHomeStore((s) => s.fetchCourseBySlug);
  const course            = useHomeStore((s) => s.courseDetail);
  const loading           = useHomeStore((s) => s.loading.courseDetail);

  const [activeTab, setActiveTab]       = useState("Course Syllabus");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showDemo, setShowDemo]         = useState(false);

  useEffect(() => {
    fetchCourseBySlug(slug);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-4">
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!course) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <p className="text-gray-400">Course not found.</p>
    </div>
  );

  const price         = Number(course.price).toLocaleString('en-IN');
  const originalPrice = Number(course.livePrice).toLocaleString('en-IN');
  const discount      = Math.round((1 - Number(course.price) / Number(course.livePrice)) * 100);

  const descWords  = course.description?.split(' ') ?? [];
  const shortDesc  = descWords.slice(0, 60).join(' ');
  const isLongDesc = descWords.length > 60;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left — info */}
            <div className="flex-1">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-5 flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                <Link href={`/courses/${course.category?.slug}`} className="hover:text-white transition-colors">
                  {course.category?.title}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                <span className="text-gray-300 truncate max-w-xs">{course.title}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {course.title}
              </h1>

              {/* Subtitle */}
              {course.subtitle && (
                <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl">
                  {course.subtitle}
                </p>
              )}

              {/* Rating row */}
              <div className="flex items-center gap-2 mb-8 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                  <span className="text-white font-bold">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">({course.totalReviews?.toLocaleString()}+)</span>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/10 text-gray-300 text-sm">
                  {course.totalLearners?.toLocaleString()}+ Learners
                </div>
                <button className="px-4 py-2 bg-white/10 rounded-full border border-white/10 text-gray-300 text-sm hover:bg-white/20 transition">
                  View Reviews
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-0 divide-x divide-white/10">
                {[
                  { icon: Clock,    value: course.duration ?? '—', label: 'Hours' },
                  { icon: FileText, value: course.assignments,     label: 'Assignments' },
                  { icon: Layers,   value: course.liveProjects,    label: 'Projects' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col items-center px-8 py-3 first:pl-0">
                    <Icon className="w-7 h-7 text-white mb-1" />
                    <span className="text-3xl font-bold text-white">{value}</span>
                    <span className="text-gray-400 text-sm">{label}</span>
                  </div>
                ))}

                {course.youtubeDemo && (
                  <div className="flex flex-col items-center px-8 py-3">
                    <button
                      onClick={() => setShowDemo(true)}
                      className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    >
                      <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
                    </button>
                    <span className="text-gray-400 text-sm mt-1">Watch Demo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Pricing card (desktop) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <PricingCard price={price} originalPrice={originalPrice} discount={discount}
                resources={course.resources} liveProjects={course.liveProjects}
                duration={course.duration} assignments={course.assignments} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main content */}
          <div className="flex-1 space-y-10">

            {/* Overview */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 pb-2 border-b-2 border-purple-600 inline-block mb-4">
                Course Overview
              </h2>
              <div className="text-gray-600 text-sm leading-relaxed">
                <p>{showFullDesc ? course.description : shortDesc}{isLongDesc && !showFullDesc && '...'}</p>
                {isLongDesc && (
                  <button onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-blue-600 font-semibold mt-2 text-sm hover:underline">
                    {showFullDesc ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            </section>

            {/* Objectives */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 pb-2 border-b-2 border-purple-600 inline-block mb-4">
                {course.title} Objectives
              </h2>
              <ul className="space-y-3">
                {[
                  `Understand core concepts of ${course.title}`,
                  `Work on ${course.liveProjects} real-world projects`,
                  `Complete ${course.assignments} hands-on assignments`,
                  'Get industry-recognized certification',
                  'Receive 100% placement assistance',
                  `Access ${course.resources} downloadable resources`,
                ].map((obj, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Mobile pricing card */}
          <div className="lg:hidden">
            <PricingCard price={price} originalPrice={originalPrice} discount={discount}
              resources={course.resources} liveProjects={course.liveProjects}
              duration={course.duration} assignments={course.assignments} />
          </div>

          {/* Desktop sidebar — contact card only */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-4">
            <ContactCard />
          </div>
        </div>
      </div>

      {/* ── YouTube Modal ─────────────────────────────────────────── */}
      {showDemo && course.youtubeDemo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowDemo(false)}>
          <div className="w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://www.youtube.com/embed/${course.youtubeDemo}?autoplay=1`}
              className="w-full h-full rounded-2xl"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pricing Card ──────────────────────────────────────────────────────────────
function PricingCard({ price, originalPrice, discount, resources, liveProjects, duration, assignments }:
  { price: string; originalPrice: string; discount: number; resources: number; liveProjects: string; duration: string | null; assignments: number; }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Self-Paced Learning</span>
        <span className="px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">Recommended</span>
      </div>
      <div className="p-5">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-4xl font-bold text-gray-900">₹{price}</span>
          <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
          {discount > 0 && <span className="text-sm font-bold text-green-600">{discount}% OFF</span>}
        </div>
        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition mb-3 text-sm">
          GET FREE TRIAL
        </button>
        <button className="w-full py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold rounded-xl transition text-sm">
          Enroll Now
        </button>
        <div className="border-t border-gray-100 my-4" />
        <p className="text-sm font-bold text-gray-800 mb-3">This course includes</p>
        <ul className="space-y-2.5">
          {[
            { icon: Monitor,    text: `${duration ?? '—'} hours high-quality video` },
            { icon: Layers,     text: `${liveProjects} projects` },
            { icon: Download,   text: `${resources} downloadable resources` },
            { icon: Headphones, text: 'Lifetime access and 24x7 support' },
            { icon: BookOpen,   text: 'Access on your computer or mobile' },
            { icon: Award,      text: 'Get certificate on course completion' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-xs text-gray-600">
              <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />{text}
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-100 my-4" />
        <button className="w-full py-2.5 border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2">
          <Download className="w-4 h-4" /> Download Syllabus
        </button>
      </div>
    </div>
  );
}

// ── Contact Card ──────────────────────────────────────────────────────────────
function ContactCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm font-bold text-gray-800 mb-3">Contact Us</p>
      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-1">
          <a href="tel:+919550102466" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition">
            <Phone className="w-4 h-4 text-blue-500" />+91 955 010 2466
          </a>
          <a href="mailto:info@onlineitguru.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition">
            <Mail className="w-4 h-4 text-blue-500" />info@onlineitguru.com
          </a>
          <p className="text-xs text-gray-400 pl-6">(24/7 support)</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Headphones className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
}