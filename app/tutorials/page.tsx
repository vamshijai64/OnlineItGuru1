"use client";

import React, { useEffect, useState } from "react";
import { useHomeStore, Blog } from "@/store/homeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Search, ChevronLeft, ChevronRight, ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
    { name: "Data Science & Business Analytics", keywords: ["data", "analytics", "power bi", "bi", "microstrategy", "micro strategy", "finance", "fiance", "statistics", "tableau"] },
    { name: "AI & Machine Learning", keywords: ["ai", "artificial intelligence", "machine learning", "generative", "genai", "deep learning", "nlp", "neural"] },
    { name: "Project Management", keywords: ["project management", "pmp", "pm", "agile", "scrum", "kanban"] },
    { name: "Cyber Security", keywords: ["security", "cyber", "penetration", "hacking", "firewall", "auth"] },
    { name: "Cloud Computing", keywords: ["cloud", "gcp", "gce", "gke", "aws", "azure", "kubernetes", "docker"] },
    { name: "DevOps", keywords: ["devops", "ci/cd", "terraform", "ansible", "jenkins", "pipeline"] },
    { name: "Business and Leadership", keywords: ["business", "leadership", "workday", "hr", "career"] },
    { name: "Quality Management", keywords: ["quality", "qa", "testing", "selenium", "manual testing"] },
    { name: "Software Development", keywords: ["python", "programming", "coding", "pega", "mulesoft", "api", "software", "development", "java", "javascript", "react", "nextjs"] },
    { name: "Agile and Scrum", keywords: ["scrum", "agile"] },
    { name: "IT Service and Architecture", keywords: ["itil", "architecture", "togaf", "service management"] },
    { name: "Digital Marketing", keywords: ["marketing", "seo", "sem", "social media", "adwords"] },
    { name: "Big Data", keywords: ["big data", "hadoop", "spark", "hive", "kafka", "cassandra"] }
];

function getTutorialCategory(tutorial: Blog): string {
    const title = tutorial.title.toLowerCase();
    const keywords = (tutorial.keywords || "").toLowerCase();
    const titleCombined = `${title} ${keywords}`;

    for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => titleCombined.includes(kw))) {
            return cat.name;
        }
    }

    const contentText = (tutorial.content || "").toLowerCase().substring(0, 1000);
    for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => contentText.includes(kw))) {
            return cat.name;
        }
    }

    return "Software Development"; 
}

export default function TutorialsListing() {
    const { tutorialsPage, loading, fetchPublicTutorials } = useHomeStore();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchPublicTutorials(1, 100);
    }, [fetchPublicTutorials]);

    const allTutorials = tutorialsPage?.items || [];

    const filteredTutorials = allTutorials.filter((tutorial) => {
        const matchesCategory = selectedCategory ? getTutorialCategory(tutorial) === selectedCategory : true;
        const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (tutorial.keywords || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const tutorialsByCategory = CATEGORIES.reduce((acc, cat) => {
        const tutorialsInCat = allTutorials.filter(tutorial => getTutorialCategory(tutorial) === cat.name && 
            (tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (tutorial.keywords || "").toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (tutorialsInCat.length > 0) {
            acc[cat.name] = tutorialsInCat;
        }
        return acc;
    }, {} as Record<string, Blog[]>);

    const categoryCounts = CATEGORIES.reduce((acc, cat) => {
        const count = allTutorials.filter(tutorial => getTutorialCategory(tutorial) === cat.name).length;
        acc[cat.name] = count;
        return acc;
    }, {} as Record<string, number>);

    const totalAllCount = allTutorials.length;

    const totalPages = Math.ceil(filteredTutorials.length / itemsPerPage);
    const paginatedTutorials = filteredTutorials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, searchQuery]);

    return (
        <main className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold font-outfit text-slate-900 tracking-tight">
                            Free Tutorials
                        </h1>
                        <p className="mt-2 text-slate-600">
                            Learn new skills with our comprehensive, expert-led tutorials on the latest technologies.
                        </p>
                    </div>

               
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tutorials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {loading.tutorials && allTutorials.length === 0 ? (
               
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-72 flex-shrink-0 space-y-3">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-10 rounded-xl bg-slate-200 animate-pulse" />
                            ))}
                        </div>
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                        <aside className="w-full lg:w-72 flex-shrink-0 bg-white rounded-2xl border border-slate-200/60 p-4 lg:sticky lg:top-28 shadow-sm">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-3">
                                Categories
                            </h2>
                            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 pb-2 lg:pb-0 scrollbar-none">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap lg:w-full ${
                                        selectedCategory === null
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                            : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <span>All Categories</span>
                                    <span className={`text-[10px] ml-2 px-2 py-0.5 rounded-full font-bold ${selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {totalAllCount}
                                    </span>
                                </button>

                                {CATEGORIES.map((cat) => {
                                    const count = categoryCounts[cat.name] || 0;
                                    // Only show categories that have tutorials matching them to keep UI clean
                                    if (count === 0) return null;

                                    return (
                                        <button
                                            key={cat.name}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`flex items-center justify-between px-3 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap lg:w-full ${
                                                selectedCategory === cat.name
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            <span className="truncate max-w-[200px] lg:max-w-none">{cat.name}</span>
                                            <span className={`text-[10px] ml-2 px-2 py-0.5 rounded-full font-bold ${selectedCategory === cat.name ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        {/* ── Right Content Area ── */}
                        <div className="flex-grow w-full">
                            <AnimatePresence mode="wait">
                                {selectedCategory === null ? (
                                    // 1. Stacked View
                                    <motion.div
                                        key="stacked"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-12"
                                    >
                                        {Object.keys(tutorialsByCategory).length === 0 ? (
                                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
                                                <p className="text-slate-500">No matching tutorials found.</p>
                                            </div>
                                        ) : (
                                            CATEGORIES.map((cat) => {
                                                const tutorials = tutorialsByCategory[cat.name] || [];
                                                if (tutorials.length === 0) return null;

                                                return (
                                                    <div key={cat.name} className="space-y-6">
                                                        {/* Category Row Header */}
                                                        <div className="flex justify-between items-end border-b border-slate-200/60 pb-3">
                                                            <div className="flex items-center gap-2">
                                                                <h2 className="text-xl font-bold font-outfit text-slate-900">
                                                                    {cat.name}
                                                                </h2>
                                                                <span className="text-xs font-semibold text-slate-400 font-inter bg-slate-100 px-2 py-0.5 rounded-full">
                                                                    {categoryCounts[cat.name] || 0}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => setSelectedCategory(cat.name)}
                                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
                                                            >
                                                                View All
                                                            </button>
                                                        </div>

                                                        {/* Category Tutorials Cards (Up to 3) */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                            {tutorials.slice(0, 3).map((tutorial) => (
                                                                <TutorialCard key={tutorial.id} tutorial={tutorial} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </motion.div>
                                ) : (
                                    // 2. Filtered View with Pagination
                                    <motion.div
                                        key="filtered"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-8"
                                    >
                                        {/* Back Navigation Bar */}
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
                                            <button
                                                onClick={() => setSelectedCategory(null)}
                                                className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group"
                                            >
                                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                                                Back to Categories
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-bold font-outfit text-slate-900">
                                                    {selectedCategory}
                                                </h2>
                                                <span className="text-xs font-semibold text-slate-400 font-inter bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {filteredTutorials.length}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Cards Grid */}
                                        {paginatedTutorials.length === 0 ? (
                                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
                                                <p className="text-slate-500">No tutorials found in this category.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                {paginatedTutorials.map((tutorial) => (
                                                    <TutorialCard key={tutorial.id} tutorial={tutorial} />
                                                ))}
                                            </div>
                                        )}

                                        {/* Pagination Controls */}
                                        {totalPages > 1 && (
                                            <div className="mt-12 flex justify-center items-center gap-2 pt-6 border-t border-slate-200/60">
                                                <Button
                                                    variant="outline"
                                                    disabled={currentPage === 1}
                                                    onClick={() => {
                                                        setCurrentPage(prev => Math.max(1, prev - 1));
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="w-10 h-10 p-0 rounded-xl"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>

                                                <div className="flex items-center gap-2">
                                                    {[...Array(totalPages)].map((_, i) => {
                                                        const pageNum = i + 1;
                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                onClick={() => {
                                                                    setCurrentPage(pageNum);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                                className={`w-10 h-10 p-0 rounded-xl ${
                                                                    currentPage === pageNum
                                                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100 border-none"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => {
                                                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="w-10 h-10 p-0 rounded-xl"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

// ─── TutorialCard Sub-Component ───
function TutorialCard({ tutorial }: { tutorial: Blog }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md hover:border-slate-300/80 transition-all group"
        >
            <Link href={`/tutorials/${tutorial.slug}`} className="flex flex-col h-full">
                {/* Card Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={tutorial.featureImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80"}
                        alt={tutorial.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-grow p-5 justify-between">
                    <h3 className="text-base font-bold font-outfit text-slate-800 leading-snug group-hover:text-blue-600 transition-colors mb-4 line-clamp-3">
                        {tutorial.title}
                    </h3>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold font-inter border border-slate-200 text-slate-500 bg-slate-50">
                            Tutorial
                        </span>
                        <span className="text-[11px] font-semibold font-inter text-slate-400">
                            {new Date(tutorial.publishedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
