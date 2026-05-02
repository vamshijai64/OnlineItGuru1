"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cloud, BarChart2, GitMerge, Database, Brain, Code2,
    PieChart, CircleDot, FolderKanban, Wrench, Layout,
    HardDrive, Shield, Bitcoin, Monitor, Cpu, Smartphone,
    Megaphone, Bot, ChevronRight, BookOpen, Clock, Star, ArrowRight
} from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';
import { Button } from "@/components/ui/button";

// ─── FA icon class → Lucide icon map ─────────────────────────────────────────
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

const DEFAULT_ICON = BookOpen;

const QUICK_LINKS = [
    { label: "All Courses", href: "/courses" },
    { label: "Free Tutorials", href: "/blog" },
    { label: "Interview Questions", href: "/blog" },
    { label: "Practice Tests", href: "/blog" },
];

interface Props {
    onClose: () => void;
}

export default function CourseMegaMenu({ onClose }: Props) {
   const categories             = useHomeStore((state) => state.categories);
  const fetchCoursesByCategory = useHomeStore((state) => state.fetchCoursesByCategory);  // ← add this
  const categoryCoursesPage    = useHomeStore((state) => state.categoryCoursesPage);      // ← add this
  const loading                = useHomeStore((state) => state.loading.categories);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategory = categories?.[activeIndex];
    
    // Filter courses that belong to the active category
     const categoryCourses = categoryCoursesPage?.items?.slice(0, 5) ?? [];
     useEffect(() => {
    if (activeCategory?.slug) {
      fetchCoursesByCategory(activeCategory.slug, 1);
    }
  }, [activeCategory?.slug]);
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[1000px] max-w-[96vw] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
            onMouseLeave={onClose}
        >
            <div className="flex">
                {/* ── Col 1: Category tabs ── */}
                <div className="w-60 flex-shrink-0 bg-slate-50 border-r border-slate-100 py-5 overflow-y-auto max-h-[500px]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-5 mb-3">
                        Categories
                    </p>
                    
                    {loading && (
                        <div className="space-y-2 px-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-10 rounded-lg bg-slate-200 animate-pulse" />
                            ))}
                        </div>
                    )}

                    {!loading && categories?.map((cat, i) => {
                        const Icon = iconMap[cat.image] ?? DEFAULT_ICON;
                        const active = activeIndex === i;
                        return (
                            <button
                                key={cat.id}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => setActiveIndex(i)}
                                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all group ${active ? "bg-white text-indigo-700 border-r-2 border-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600 hover:bg-white/60"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} />
                                <span className="truncate">{cat.title}</span>
                                <ChevronRight className={`ml-auto h-3.5 w-3.5 ${active ? "text-indigo-400" : "text-slate-300"}`} />
                            </button>
                        );
                    })}

                    <div className="mx-5 mt-4 pt-4 border-t border-slate-200">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Explore</p>
                        {QUICK_LINKS.slice(1).map(({ label, href }) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={onClose}
                                className="block text-xs text-slate-500 hover:text-indigo-600 py-1.5 transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Col 2: Courses for active category ── */}
                <div className="flex-1 py-5 px-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        {activeCategory?.title || "Loading..."} Courses
                    </p>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-1"
                        >
                            {categoryCourses.length > 0 ? (
                                categoryCourses.map((course) => (
                                    <Link
                                        key={course.id}
                                       href={`/courses/${course.slug}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 group transition-all"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                                {course.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <Clock className="h-3 w-3" />{course.duration}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                                                    <Star className="h-3 w-3 fill-current" />{course.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                    </Link>
                                ))
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-sm text-slate-400">No featured courses in this category yet.</p>
                                    <Link href="/courses" onClick={onClose} className="text-xs text-indigo-500 hover:underline mt-2 inline-block">
                                        Browse all courses
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {activeCategory && (
                        <Link
                            href={`/courses/${activeCategory.slug}`}
                            onClick={onClose}
                            className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
                        >
                            View all {activeCategory.title} courses
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* ── Col 3: Featured promo card ── */}
                <div className="w-64 flex-shrink-0 border-l border-slate-100 p-5 bg-gradient-to-b from-indigo-50 to-white flex flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-3">Why OnlineITGuru</p>
                    <div className="flex-1 space-y-4">
                        <div className="rounded-xl bg-white shadow-sm border border-indigo-100 p-4">
                            <p className="font-bold text-slate-900 text-sm leading-snug mb-1">
                                Transform your career with industry-expert training
                            </p>
                            <p className="text-xs text-slate-500 leading-5">
                                Live sessions, real projects, and 100% placement support.
                            </p>
                        </div>
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { val: "50K+", label: "Learners" },
                                { val: "200+", label: "Courses" },
                                { val: "98%", label: "Placement" },
                                { val: "4.8★", label: "Rating" },
                            ].map(({ val, label }) => (
                                <div key={label} className="bg-white rounded-lg border border-slate-100 p-2.5 text-center shadow-sm">
                                    <p className="text-base font-extrabold text-indigo-700">{val}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* CTA */}
                    <Link href="/courses" onClick={onClose}>
                        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-sm">
                            Browse All Courses
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/courses" onClick={onClose} className="block text-center text-xs text-indigo-500 hover:underline mt-2">
                        Free demo available →
                    </Link>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-6">
                    {["Contact Us", "Corporate Training", "Become an Instructor"].map((item) => (
                        <Link
                            key={item}
                            href="/contact"
                            onClick={onClose}
                            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resources:</span>
                    <div className="flex gap-5">
                        {[
                            { label: "Blogs", href: "/blog" },
                            { label: "Tutorials", href: "/tutorials" },
                            { label: "Interview Questions", href: "/interview-questions" }
                        ].map((res) => (
                            <Link
                                key={res.label}
                                href={res.href}
                                onClick={onClose}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                {res.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}