"use client";

import { useState, useEffect } from "react";
import { useHomeStore } from "@/store/homeStore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search, SlidersHorizontal, Star, Users, Clock, ArrowRight,
    BookOpen, LayoutGrid, ChevronRight, Filter, X,
    Cloud, BarChart2, Database, Brain, Code2, PieChart,
    CircleDot, FolderKanban, Wrench, Layout, Shield,
    Bitcoin, Monitor, Cpu, Smartphone, Megaphone, Bot
} from "lucide-react";

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

export default function CoursesPage() {
    const fetchCategories = useHomeStore((s) => s.fetchCategories);
    const categories = useHomeStore((s) => s.categories);
    const fetchCoursesByCategory = useHomeStore((s) => s.fetchCoursesByCategory);
    const categoryCoursesPage = useHomeStore((s) => s.categoryCoursesPage);
    const loading = useHomeStore((s) => s.loading.categoryCourses);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSlug, setSelectedSlug] = useState("all");
    const [page, setPage] = useState(1);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Load categories on mount
    useEffect(() => {
        if (categories.length === 0) fetchCategories();
    }, []);

    // Fetch courses when category or page changes
    useEffect(() => {
        if (selectedSlug === "all") {
            fetchCoursesByCategory("", page);
        } else {
            fetchCoursesByCategory(selectedSlug, page);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [selectedSlug, page]);

    const handleCategoryClick = (slug: string) => {
        setSelectedSlug(slug);
        setPage(1);
        setIsMobileFilterOpen(false);
    };

    const courses = categoryCoursesPage?.items ?? [];
    const pagination = categoryCoursesPage?.pagination;

    // Client-side search filter
    const filteredCourses = searchQuery.trim()
        ? courses.filter((c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : courses;

    const selectedCategory = categories.find((c) => c.slug === selectedSlug);

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#F8FAFC]">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                
                {/* ── Page Header ─────────────────────────────────────────────── */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Premium Courses</span>
                    </h1>
                    <p className="mt-2 text-slate-500 max-w-2xl">
                        Advance your career with industry-recognized certifications and expert-led training.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* ── Sidebar: Categories (Desktop) ─────────────────────────── */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <LayoutGrid className="w-4 h-4 text-purple-600" />
                                    Categories
                                </h2>
                            </div>
                            <div className="py-2">
                                <button
                                    onClick={() => handleCategoryClick("all")}
                                    className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                                        selectedSlug === "all"
                                            ? "bg-purple-50 text-purple-700 border-r-4 border-purple-600"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                                    All Courses
                                </button>
                                {categories.map((cat) => {
                                    const Icon = iconMap[cat.image] ?? BookOpen;
                                    const active = selectedSlug === cat.slug;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${
                                                active
                                                    ? "bg-purple-50 text-purple-700 border-r-4 border-purple-600"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-purple-600" : "text-slate-400"}`} />
                                            <span className="truncate">{cat.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* ── Main Content Area ──────────────────────────────────────── */}
                    <div className="flex-1">
                        
                        {/* Search & Mobile Filter Toggle */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by course name or category..."
                                    className="pl-11 h-12 bg-white border-slate-200 rounded-xl focus-visible:ring-purple-500 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button 
                                variant="outline" 
                                className="lg:hidden h-12 rounded-xl gap-2 border-slate-200"
                                onClick={() => setIsMobileFilterOpen(true)}
                            >
                                <Filter className="w-4 h-4" />
                                Categories
                            </Button>
                        </div>

                        {/* Active Filter Indicator & Results Count */}
                        {!loading && (
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Showing results for:</span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                                        {selectedSlug === "all" ? "All Courses" : selectedCategory?.title}
                                    </span>
                                </div>
                                {pagination && (
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        {pagination.total} Courses Found
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Loading Skeleton */}
                        {loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-sm" />
                                ))}
                            </div>
                        )}

                        {/* Course Grid */}
                        {!loading && filteredCourses.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredCourses.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 h-full"
                                        >
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                                <img
                                                    src={course.image ?? "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80"}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold rounded-lg shadow-sm uppercase tracking-wider">
                                                        {course.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-1">
                                                <h3 className="text-base font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
                                                    {course.title}
                                                </h3>

                                                {/* Stats */}
                                                <div className="flex items-center gap-4 text-[11px] text-slate-400 mb-5 mt-auto">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                        <span className="font-bold text-slate-700">{course.rating}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5" />
                                                        <span>{course.students.toLocaleString()} Learners</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-lg font-black text-slate-900">₹{course.price}</span>
                                                        <span className="ml-2 text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Empty state */}
                        {!loading && filteredCourses.length === 0 && (
                            <div className="py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-6">
                                    <Search className="h-8 w-8 text-slate-200" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">No matching courses</h3>
                                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                                    We couldn't find any courses matching your current search or filters.
                                </p>
                                <Button
                                    variant="link"
                                    className="mt-6 text-purple-600 font-bold"
                                    onClick={() => { setSearchQuery(""); handleCategoryClick("all"); }}
                                >
                                    Reset all filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-10 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30"
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center gap-1 mx-2">
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                                                        p === page
                                                            ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                                                            : "text-slate-500 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        }
                                        if (Math.abs(p - page) === 2) {
                                            return <span key={p} className="px-1 text-slate-300">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="h-10 rounded-xl border-slate-200 text-slate-600 disabled:opacity-30"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Filter Drawer (Overlay) ────────────────────────────── */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFilterOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white z-[70] shadow-2xl flex flex-col lg:hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Categories</h2>
                                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4">
                                <button
                                    onClick={() => handleCategoryClick("all")}
                                    className={`w-full flex items-center gap-4 px-6 py-4 text-base font-semibold transition-all ${
                                        selectedSlug === "all"
                                            ? "text-purple-600 bg-purple-50"
                                            : "text-slate-600"
                                    }`}
                                >
                                    <BookOpen className="w-5 h-5" />
                                    All Courses
                                </button>
                                {categories.map((cat) => {
                                    const Icon = iconMap[cat.image] ?? BookOpen;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat.slug)}
                                            className={`w-full flex items-center gap-4 px-6 py-4 text-base font-semibold transition-all ${
                                                selectedSlug === cat.slug
                                                    ? "text-purple-600 bg-purple-50 border-l-4 border-purple-600"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {cat.title}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="p-6 border-t border-slate-100">
                                <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold" onClick={() => setIsMobileFilterOpen(false)}>
                                    Show Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}