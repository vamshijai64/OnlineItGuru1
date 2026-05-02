"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useHomeStore } from "@/store/homeStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Users, Clock, BookOpen, Download, Phone,
  Mail, CheckCircle, ChevronRight, Play, Award,
  FileText, Layers, Monitor, Headphones, ArrowLeft, ArrowRight,
  Cloud, BarChart2, Database, Brain, Code2, PieChart,
  CircleDot, FolderKanban, Wrench, Layout, Shield,
  Bitcoin, Smartphone, Megaphone, Bot, X, Calendar, HelpCircle
} from "lucide-react";
import CourseDynamicSections from "@/components/courses/CourseDynamicSections";

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

// We need to import Cpu here as well for the iconMap
import { Cpu } from "lucide-react";

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
    return <CategoryView slug={slug} />;
  }

  return <CourseDetailView slug={slug} />;
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
const TABS = [
  { id: 'overview', label: 'Course Overview', icon: BookOpen },
  { id: 'syllabus', label: 'Course Syllabus', icon: FileText },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'training', label: 'Training Options', icon: Monitor },
  { id: 'batches', label: 'Upcoming Batches', icon: Calendar },
  { id: 'faq', label: "FAQ's", icon: HelpCircle },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'certification', label: 'Certification', icon: Award },
];

function CourseDetailView({ slug }: { slug: string }) {
  const fetchCourseBySlug = useHomeStore((s) => s.fetchCourseBySlug);
  const fetchCourseSections = useHomeStore((s) => s.fetchCourseSections);
  const course = useHomeStore((s) => s.courseDetail);
  const loading = useHomeStore((s) => s.loading.courseDetail);

  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    fetchCourseBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (course?.id) {
      fetchCourseSections(course.id);
    }
  }, [course?.id]);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Increased offset for better visibility
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = TABS.map(tab => tab.id);
      const scrollPosition = window.scrollY + 160; // Offset for header + padding

      // Find the current section
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const element = document.getElementById(id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveTab(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const price = Number(course.price).toLocaleString('en-IN');
  const originalPrice = Number(course.livePrice).toLocaleString('en-IN');
  const discount = Math.round((1 - Number(course.price) / Number(course.livePrice)) * 100);

  const descWords = course.description?.split(' ') ?? [];
  const shortDesc = descWords.slice(0, 60).join(' ');
  const isLongDesc = descWords.length > 60;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Premium Hero Section */}
      <div className="relative bg-[#0f172a] pt-24 pb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-xs text-gray-400 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                <span className="text-indigo-400 font-medium truncate">{course.title}</span>
              </nav>

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  {course.category?.title}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {course.rating} ({course.totalReviews?.toLocaleString()} Reviews)
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-[1.1] tracking-tight">
                {course.title}
              </h1>
              
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
                {course.subtitle || "Master industry-standard tools and techniques with our comprehensive, expert-led training program designed for career success."}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{course.totalLearners?.toLocaleString()}+</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Learners</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{course.duration || '40+'} Hrs</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Duration</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">Verified</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">Certificate</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setShowDemo(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Demo
                </button>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full border border-white/10 transition-all text-sm">
                  Syllabus
                </button>
              </div>
            </div>

            {/* Sticky Pricing Card for Desktop */}
            <div className="hidden lg:block w-[280px] flex-shrink-0 sticky top-20">
              <EnrollmentCard 
                price={price} 
                originalPrice={originalPrice} 
                discount={discount} 
                course={course}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar Navigation */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1.5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">Navigation</p>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 translate-x-1"
                        : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-gray-400"}`} />
                    {tab.label}
                  </button>
                );
              })}
              
              <div className="mt-12 p-6 bg-indigo-900 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <p className="text-white font-bold mb-2 relative z-10">Need Assistance?</p>
                <p className="text-indigo-200 text-sm mb-4 relative z-10">Get expert guidance for your career path.</p>
                <button className="w-full py-3 bg-white text-indigo-900 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-colors relative z-10">
                  Talk to Expert
                </button>
              </div>
            </div>
          </aside>

          {/* Center Main Content */}
          <div className="flex-1 space-y-12">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Course Overview</h2>
              </div>
              
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="prose prose-indigo max-w-none">
                  <div className={`text-gray-600 leading-relaxed text-base ${!showFullDesc && isLongDesc ? "line-clamp-5" : ""}`}>
                    {course.description}
                  </div>
                  {isLongDesc && (
                    <button 
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="mt-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline"
                    >
                      {showFullDesc ? "Show Less" : "Read Full Description"}
                      <ChevronRight className={`w-4 h-4 transition-transform ${showFullDesc ? "rotate-90" : ""}`} />
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  {[
                    { title: "Hands-on Projects", desc: "Real-world projects", icon: Layers },
                    { title: "24/7 Support", desc: "Get help anytime", icon: Headphones },
                    { title: "Expert Trainers", desc: "Learn from veterans", icon: Users },
                    { title: "Flexible Learning", desc: "Self-paced & live", icon: Clock },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Syllabus Section */}
            <section id="syllabus" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Curriculum</h2>
              </div>
              <CourseDynamicSections />
            </section>

            {/* Projects Section */}
            <section id="projects" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Hands-on Projects</h2>
              </div>
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <p className="text-gray-500 mb-6 text-base">Work on real-world industry projects to build a professional portfolio.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-indigo-900 mb-1 text-sm">E-commerce App</h4>
                    <p className="text-xs text-slate-600">Build a full-scale platform with payment integration.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-indigo-900 mb-1 text-sm">Real-time Analytics</h4>
                    <p className="text-xs text-slate-600">Develop a dashboard with live data visualization.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Training Options Section */}
            <section id="training" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Training Options</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:border-indigo-200 transition-colors">
                  <h3 className="text-lg font-bold text-indigo-900 mb-3">Self-Paced</h3>
                  <ul className="space-y-2">
                    {["Video recordings", "Lifetime access", "24/7 support", "Quizzes"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm border-indigo-100 bg-indigo-50/30">
                  <h3 className="text-lg font-bold text-indigo-900 mb-3">Live Training</h3>
                  <ul className="space-y-2">
                    {["Interactive sessions", "Doubt clearing", "Mentorship", "Networking"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Batches Section */}
            <section id="batches" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Batches</h2>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Start Date</th>
                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Time</th>
                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Type</th>
                        <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { date: "May 15, 2026", time: "07:00 AM - 09:00 AM IST", type: "Weekday", status: "Open" },
                        { date: "May 20, 2026", time: "08:00 PM - 10:00 PM IST", type: "Weekend", status: "Filling Fast" },
                        { date: "June 05, 2026", time: "06:30 AM - 08:30 AM IST", type: "Weekday", status: "Upcoming" },
                      ].map((batch, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6 font-bold text-gray-900">{batch.date}</td>
                          <td className="px-8 py-6 text-gray-600 text-sm">{batch.time}</td>
                          <td className="px-8 py-6 text-gray-600 text-sm">{batch.type}</td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              batch.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              batch.status === 'Filling Fast' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-indigo-50 text-indigo-600 border border-indigo-100'
                            }`}>
                              {batch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Certification Section */}
            <section id="certification" className="scroll-mt-24">
               <div className="bg-[#0f172a] rounded-3xl p-6 md:p-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />
                 <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                   <div className="flex-1 text-center md:text-left">
                     <span className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4 block">Official Certification</span>
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Gain a Professional Certificate</h2>
                     <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                       Stand out to employers with a verified certificate from ITGuru. Showcase your skills and expertise to the world.
                     </p>
                     <ul className="space-y-4 mb-10 text-left inline-block">
                       {[
                         "Industry Recognized Certificate",
                         "Shareable on LinkedIn & Resumes",
                         "Verifiable Certificate ID",
                         "Lifetime Validity"
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-gray-300">
                           <CheckCircle className="w-5 h-5 text-emerald-500" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <div className="w-full md:w-[400px] flex-shrink-0 group">
                     <div className="relative p-2 bg-white/5 rounded-3xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                       <img 
                        src="https://onlineitguru.com/public/images/certificate.png" 
                        alt="Certification" 
                        className="w-full h-auto rounded-2xl"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&q=80";
                        }}
                       />
                     </div>
                   </div>
                 </div>
               </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
              </div>
              <div className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-center py-10">FAQ content will be dynamically loaded from sections.</p>
              </div>
            </section>

            {/* Review Section */}
            {course.reviews && course.reviews.length > 0 && (
              <section id="reviews" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {course.reviews.map((review: any) => (
                    <div key={review.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            {review.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{review.user_name}</h4>
                            <span className="text-sm text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed italic">"{review.review}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Pricing Card for Mobile (Bottom Fixed) */}
          <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
             <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-indigo-600 font-bold text-2xl">₹{price}</div>
                  <div className="text-gray-400 text-xs line-through">₹{originalPrice}</div>
                </div>
                <button className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 active:scale-95 transition-all">
                  Enroll Now
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Demo Modal Placeholder */}
      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowDemo(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
             >
               <button 
                 onClick={() => setShowDemo(false)}
                 className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-10 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
               {course.youtubeDemo ? (
                 <iframe 
                   className="w-full h-full"
                   src={`https://www.youtube.com/embed/${course.youtubeDemo}?autoplay=1`}
                   title="YouTube video player"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                 />
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-white">
                   <Play className="w-20 h-20 text-indigo-500 mb-6" />
                   <h3 className="text-2xl font-bold">Demo Video Not Available</h3>
                   <p className="text-gray-400 mt-2">Please contact support for a live demonstration.</p>
                 </div>
               )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Redesigned Sub-Components ─────────────────────────────────────────────────────

function EnrollmentCard({ price, originalPrice, discount, course }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-indigo-900/10 overflow-hidden group">
      <div className="relative h-24 overflow-hidden">
        <img 
          src={course.previewImage ? `http://13.233.34.177:3000/${course.previewImage}` : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <Play className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-[10px] tracking-wide">Preview</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl font-bold text-gray-900">₹{price}</span>
              <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
            </div>
            {discount > 0 && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                -{discount}% Off
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]">
            ENROLL NOW
          </button>
          <button className="w-full py-2.5 bg-white hover:bg-indigo-50 text-indigo-600 font-bold rounded-lg border border-indigo-600 text-xs transition-all active:scale-[0.98]">
            FREE DEMO
          </button>
        </div>

        <div className="space-y-1.5">
           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5 mb-1.5">Highlights:</p>
           {[
             { icon: Clock, text: `${course.duration || '40+'} Hours` },
             { icon: Layers, text: `${course.liveProjects || '2'} Projects` },
             { icon: Monitor, text: "LMS Access" },
             { icon: Award, text: "Certification" }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-2 text-gray-600 group/item">
               <item.icon className="w-3.5 h-3.5 text-indigo-400 group-hover/item:text-indigo-600 transition-colors" />
               <span className="text-[11px] font-medium">{item.text}</span>
             </div>
           ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight">Support</p>
                <a href="tel:+919550102466" className="text-xs font-bold text-gray-800 hover:text-indigo-600 tracking-tight">+91 9550102466</a>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ContactCard() {
  return (
    <div className="bg-indigo-600 rounded-[32px] p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <h3 className="text-xl font-bold mb-4 relative z-10">Limited Time Offer!</h3>
      <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed">
        Enroll in the next 24 hours and get a special bonus: <strong>1-on-1 Career Mentorship</strong> session with an industry expert.
      </p>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-bold">Limited Slots Available</span>
      </div>
      <button className="w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors relative z-10">
        Claim Offer Now
      </button>
    </div>
  );
}