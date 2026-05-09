"use client";

import { useEffect, useRef, useState } from "react";
import {
    BookOpen, Layers, Video, Calendar, HelpCircle,
    Star, Award, ChevronRight, Lock, PlayCircle,
    CheckCircle2, Users, MapPin, Clock3,
    BarChart2, TrendingUp, Zap, MessageSquare,
    BadgeCheck, Phone, Download,
    Monitor,Layout, Target, ListChecks
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseDetail, CourseSection } from "@/store/homeStore";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface Props {
    course: CourseDetail;
    sections: CourseSection[];
}

const FIXED_NAV_ITEMS = [
    { id: "overview", label: "Course Overview", icon: Layout },
    { id: "objectives", label: "Course Objectives", icon: Target },
    { id: "syllabus", label: "Course Syllabus", icon: BookOpen },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "training-options", label: "Training Options", icon: Video },
    { id: "batches", label: "Upcoming Batches", icon: Calendar },
    { id: "faqs", label: "FAQ's", icon: HelpCircle },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "certification", label: "Certification", icon: Award },
];

// Helper to parse JSON content safely
function parseContent(contentStr: string) {
    try {
        return JSON.parse(contentStr);
    } catch (e) {
        return [];
    }
}

/* ─────────────── Section: Overview ─────────────── */
function OverviewSection({ course }: { course: CourseDetail }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Course Overview</h2>
            </div>
            <div className="relative">
                <div
                    className={cn(
                        "text-slate-600 leading-relaxed prose prose-slate max-w-none transition-all duration-500",
                        !isExpanded && "line-clamp-6"
                    )}
                    dangerouslySetInnerHTML={{ __html: course.description }}
                />
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                )}
            </div>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sky-500 font-bold text-sm hover:text-sky-600 transition-colors flex items-center gap-1 group"
            >
                {isExpanded ? "Read Less" : "Read More"}
                <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-90" : "")} />
            </button>
        </div>
    );
}

/* ─────────────── Section: Objectives ─────────────── */
function ObjectivesSection({ sections }: { sections: CourseSection[] }) {
    const section = sections.find(s => s.title.toLowerCase().includes('objectives'));
    const items = section ? parseContent(section.content) : [];

    if (items.length === 0) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">{section?.title || "Course Objectives"}</h2>
            <Accordion type="single" collapsible className="space-y-3">
                {items.map((item: any, i: number) => (
                    <AccordionItem key={i} value={`obj-${i}`}
                        className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800">
                            {item.itemTitle}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-slate-600 leading-7">
                            <div dangerouslySetInnerHTML={{ __html: item.itemDescription }} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

/* ─────────────── Section: Syllabus (Dynamic from API) ─────────────── */
function SyllabusSection({ course, sections }: { course: CourseDetail; sections: CourseSection[] }) {
    // Find the specific syllabus section from API
    const syllabusApiSection = sections.find(s =>
        s.view === 'title-rich-description' ||
        s.title.toLowerCase().includes('syllabus')
    );

    const dynamicModules = syllabusApiSection ? parseContent(syllabusApiSection.content) : [];

    // If no dynamic sections, use mock data
    const displayModules = dynamicModules.length > 0 ? dynamicModules : [
        { itemTitle: "Module 1: Fundamentals & Core Concepts", itemDescription: "<ul><li>Introduction & Environment Setup</li><li>Core Architecture & Patterns</li><li>Advanced Concepts Deep Dive</li></ul>" },
        { itemTitle: "Module 2: Hands-On Implementation", itemDescription: "<ul><li>Real Project Setup</li><li>Building Key Features</li><li>Testing & Debugging</li></ul>" },
    ];

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-outfit">Course Syllabus</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {displayModules.length} modules · {course.duration || "40+ Hours"}
                    </p>
                </div>
               
            </div>
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
                {displayModules.map((mod: any, i: number) => (
                    <AccordionItem key={i} value={`item-${i}`}
                        className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4 gap-3">
                            <div className="flex items-center gap-3 text-left">
                                <span className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="font-semibold text-slate-800">{mod.itemTitle}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-10">
                            {(() => {
                                // Extract list items from HTML string
                                const lessons = mod.itemDescription?.match(/<li>(.*?)<\/li>/g)?.map((l: string) => l.replace(/<\/?li>/g, '')) || [];
                                
                                if (lessons.length > 0) {
                                    return (
                                        <ul className="space-y-3">
                                            {lessons.map((lesson: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 group">
                                                    <PlayCircle className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 mt-0.5" />
                                                    <span dangerouslySetInnerHTML={{ __html: lesson }} />
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                
                                // Fallback for non-list HTML
                                return (
                                    <div
                                        className="prose prose-sm max-w-none text-slate-600"
                                        dangerouslySetInnerHTML={{ __html: mod.itemDescription }}
                                    />
                                );
                            })()}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

/* ─────────────── Section: Projects ─────────────── */
function ProjectsSection({ course }: { course: CourseDetail }) {
    const projects = [
        { title: "Real-Time Data Pipeline", desc: "Build an end-to-end ETL pipeline processing live data streams and visualizing insights.", tags: ["Backend", "Cloud"], icon: BarChart2, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
        { title: "E-Commerce Analytics Dashboard", desc: "Design and deploy a full-featured sales analytics dashboard with real-time KPI tracking.", tags: ["Frontend", "API"], icon: TrendingUp, bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
        { title: "AI Recommendation Engine", desc: "Train and deploy a collaborative filtering ML model for personalised product recommendations.", tags: ["ML", "Python"], icon: Zap, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
        { title: "Cloud-Native Microservices", desc: "Architect, containerise and deploy microservices on Kubernetes with automated CI/CD pipelines.", tags: ["DevOps", "Docker"], icon: Layers, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    ];

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Industry-Grade Projects</h2>
                <p className="text-sm text-slate-500 mt-1">Build {course.liveProjects || "4+"} real-world projects to power your portfolio</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                {projects.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <div key={i} className={`rounded-2xl border p-6 hover:shadow-lg transition-all group cursor-pointer ${p.border} bg-white`}>
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${p.bg} ${p.text} group-hover:scale-110 transition-transform`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2">{p.title}</h4>
                            <p className="text-sm text-slate-500 leading-6 mb-4">{p.desc}</p>
                            <div className="flex gap-2 flex-wrap">
                                {p.tags.map((t) => (
                                    <span key={t} className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border}`}>{t}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────── Section: Training Options (Dynamic) ─────────────── */
function TrainingSection({ course, sections }: { course: CourseDetail; sections: CourseSection[] }) {
    const trainingSection = sections.find(s => s.view === 'rich-text-card-list');
    const dynamicItems = trainingSection ? parseContent(trainingSection.content) : [];
    const priceNum = Number(course.price);

    // Standard fallback options
    const standardOptions = [
        {
            title: "Self-Paced Online", sub: "Learn at your own speed",
            price: `₹${priceNum.toLocaleString("en-IN")}`, badge: "Most Popular", badgeColor: "bg-indigo-600",
            features: ["Lifetime video access", "24×7 chat support", "Projects & assignments", "Completion certificate"],
            cta: "Enroll Now", ctaClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
        },
        {
            title: "Live Online Training", sub: "Instructor-led live sessions",
            price: `₹${(priceNum + 5000).toLocaleString("en-IN")}`, badge: "Recommended", badgeColor: "bg-emerald-600",
            features: ["Weekend & weekday batches", "Real-time Q&A", "1-on-1 code reviews", "Job placement support"],
            cta: "Book Free Demo", ctaClass: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
        },
        {
            title: "Corporate Training", sub: "Customized team programs",
            price: "Custom", badge: "Enterprise", badgeColor: "bg-slate-800",
            features: ["Custom curriculum", "Dedicated trainer", "On-site or virtual", "Progress analytics"],
            cta: "Get a Quote", ctaClass: "border-2 border-slate-700 text-slate-700 hover:bg-slate-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Training Options</h2>
                <p className="text-sm text-slate-500 mt-1">Choose the mode that fits your schedule and goals</p>
            </div>

            {dynamicItems.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {dynamicItems.map((item: any, i: number) => (
                        <div key={i} className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-500 overflow-hidden flex flex-col">
                            {/* Accent Header */}
                            <div className={`h-1.5 w-full ${i === 0 ? 'bg-indigo-600' : 'bg-emerald-600'}`} />
                            
                            <div className="p-8 flex-1">
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${i === 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {item.flag || (i === 0 ? "Preferred" : "For Business")}
                                    </div>
                                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {i === 0 ? <Users className="h-5 w-5 text-indigo-600" /> : <Monitor className="h-5 w-5 text-emerald-600" />}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-4 font-outfit">
                                    {i === 0 ? "Individual Training" : "Corporate Training"}
                                </h3>

                                <div 
                                    className="text-slate-600 text-sm leading-relaxed prose prose-sm max-w-none 
                                    [&_ul]:list-none [&_ul]:space-y-4 [&_ul]:m-0 [&_ul]:p-0
                                    [&_li]:relative [&_li]:pl-7
                                    [&_li::before]:content-[''] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:top-1 
                                    [&_li::before]:h-4 [&_li::before]:w-4 [&_li::before]:bg-indigo-50 [&_li::before]:rounded-full
                                    [&_li::after]:content-['✓'] [&_li::after]:absolute [&_li::after]:left-1 [&_li::after]:top-0 
                                    [&_li::after]:text-[10px] [&_li::after]:font-bold [&_li::after]:text-indigo-600
                                    [&_strong]:text-slate-900 [&_strong]:font-bold"
                                    dangerouslySetInnerHTML={{ __html: item.htmlText }} 
                                />
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <Button className={`w-full py-6 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] ${i === 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-emerald-200'}`}>
                                    {i === 0 ? "Enroll Now" : "Request a Quote"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid sm:grid-cols-3 gap-5">
                    {standardOptions.map((opt, i) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col overflow-hidden">
                            <div className="p-5 flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{opt.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">{opt.sub}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${opt.badgeColor}`}>{opt.badge}</span>
                                </div>
                                <p className="text-2xl font-extrabold text-slate-900">{opt.price}</p>
                                <ul className="space-y-2.5">
                                    {opt.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                                            <CheckCircle2 className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-5 pt-0">
                                <Button className={`w-full font-bold ${opt.ctaClass}`}>{opt.cta}</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─────────────── Section: Upcoming Batches (Dynamic) ─────────────── */
function BatchesSection({ sections }: { sections: CourseSection[] }) {
    const batchSection = sections.find(s => s.view === 'schedule-card-list');
    const dynamicBatches = batchSection ? parseContent(batchSection.content) : [];

    const mockBatches = [
        { date: "May 15, 2026", type: "Weekday", time: "7:00 AM – 9:00 AM IST", seats: 5, mode: "Online", status: "Filling Fast" },
        { date: "May 22, 2026", type: "Weekend", time: "10:00 AM – 1:00 PM IST", seats: 12, mode: "Hybrid", status: "Open" },
    ];

    const statusStyle: Record<string, string> = {
        "Filling Fast": "bg-red-100 text-red-700",
        "Open": "bg-green-100 text-green-700",
        "Upcoming": "bg-indigo-100 text-indigo-700",
    };

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Upcoming Batches</h2>
                <p className="text-sm text-slate-500 mt-1">Register early to lock in the best price</p>
            </div>
            <div className="space-y-4">
                {dynamicBatches.length > 0 ? (
                    dynamicBatches.map((b: any, i: number) => {
                        const dateObj = new Date(b.date);
                        const isInvalidDate = isNaN(dateObj.getTime());
                        const displayMonth = isInvalidDate ? "TBA" : dateObj.toLocaleString('en-US', { month: 'short' });
                        const displayDay = isInvalidDate ? "" : dateObj.getDate();

                        return (
                            <div key={i} className="group flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex-wrap md:flex-nowrap">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center flex-shrink-0 border border-indigo-100 shadow-inner group-hover:from-indigo-600 group-hover:to-indigo-500 transition-colors duration-500">
                                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-tighter group-hover:text-indigo-100">
                                        {b.week_label || "Batch"}
                                    </span>
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="text-sm font-bold text-indigo-600 group-hover:text-white">{displayMonth}</span>
                                        <span className="text-2xl font-black text-indigo-800 group-hover:text-white">{displayDay}</span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <span className="text-lg font-bold text-slate-900">{b.date || "Date TBA"}</span>
                                        <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            Open for Enrollment
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-slate-500 flex-wrap">
                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                            <Clock3 className="h-4 w-4 text-indigo-400" />
                                            <span className="font-medium text-slate-700">{b.time || "Timings TBA"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                            <span className="font-medium">Live Online Class</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 ml-auto w-full md:w-auto mt-4 md:mt-0">
                                    <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-6 rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                                        Enroll Now
                                    </Button>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Users className="h-3 w-3" /> Limited Seats Left
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    mockBatches.map((b, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all flex-wrap">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex flex-col items-center justify-center flex-shrink-0 border border-indigo-100">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase">{b.date.split(" ")[0]}</span>
                                <span className="text-2xl font-extrabold text-indigo-700">{b.date.split(" ")[1].replace(",", "")}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-bold text-slate-900">{b.type} Batch</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle[b.status]}`}>{b.status}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                                    <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{b.time}</span>
                                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{b.mode}</span>
                                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{b.seats} seats left</span>
                                </div>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex-shrink-0">
                                Register
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/* ─────────────── Section: FAQs ─────────────── */
function FaqSection({ course, sections }: { course: CourseDetail; sections: CourseSection[] }) {
    const faqSection = sections.find(s => s.title.toLowerCase().includes('faq'));
    const dynamicFaqs = faqSection ? parseContent(faqSection.content) : [];

    const faqs = dynamicFaqs.length > 0 ? dynamicFaqs.map((f: any) => ({ q: f.itemTitle, a: f.itemDescription })) : [
        { q: "Who is this course for?", a: "Anyone looking to start or advance their career. We go from complete basics to advanced real-world applications." },
        { q: "Do you offer placement assistance?", a: "Yes — 100% placement support including resume building, mock interviews, and direct recruiter referrals." },
        { q: "How long is the course access?", a: "You get lifetime access to all videos, resources, and future updates — even after course completion." },
        { q: "Is there a money-back guarantee?", a: "Absolutely. We offer a 14-day, no-questions-asked refund if you're not satisfied." },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Frequently Asked Questions</h2>
                <p className="text-sm text-slate-500 mt-1">Quick answers to common questions</p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq: any, i: number) => (
                    <AccordionItem key={i} value={`faq-${i}`}
                        className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800 gap-3">
                            <span className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                                {faq.q}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-9 text-slate-600 leading-7">
                            <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

/* ─────────────── Section: Reviews ─────────────── */
function ReviewsSection({ course }: { course: CourseDetail }) {
    const reviews = course.reviews && course.reviews.length > 0 ? course.reviews : [
        { user_name: "Priya Menon", role: "Software Engineer", created_at: "2026-02-10", rating: 5, review: "Top-notch course! Responsive mentors, practical projects. Got placed in 3 weeks after completion." },
        { user_name: "Arjun Reddy", role: "Data Analyst", created_at: "2026-01-15", rating: 5, review: "Curriculum is perfectly up-to-date. Live sessions were engaging and doubt resolution is lightning fast." },
    ];

    const GRAD = ["from-indigo-500 to-violet-600", "from-pink-500 to-rose-600", "from-amber-500 to-orange-600", "from-teal-500 to-emerald-600"];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Student Reviews</h2>
                {/* Rating summary */}
                <div className="flex items-center gap-6 mt-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-center flex-shrink-0">
                        <p className="text-5xl font-extrabold text-slate-900">{course.rating}</p>
                        <div className="flex text-yellow-400 mt-1 justify-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-current" : "fill-current opacity-25"}`} />)}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Course Rating</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
                            return (
                                <div key={star} className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="w-3 text-right">{star}</span>
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                                        <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-6">{pct}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                {reviews.map((r, i) => (
                    <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                        <div className="flex items-start justify-between mb-3 gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${GRAD[i % GRAD.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                    {r.user_name?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{r.user_name || "Anonymous"}</p>
                                    <p className="text-xs text-slate-500">{r.role || "Verified Student"}</p>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="flex text-yellow-400 justify-end">
                                    {[...Array(r.rating || 5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recently"}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-6 flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-indigo-300 flex-shrink-0 mt-0.5" />
                            {r.review}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────── Section: Certification ─────────────── */
function CertificationSection({ course }: { course: CourseDetail }) {
    const highlights = [
        "Globally recognised & industry-validated",
        "Digital certificate with unique verification ID",
        "Share directly to LinkedIn with one click",
        "Recognised by 500+ hiring partners",
        "Lifetime validity — never expires",
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Course Certification</h2>
                <p className="text-sm text-slate-500 mt-1">Earn a credential that gets you noticed</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                {/* Mockup */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 aspect-[4/3] flex flex-col items-center justify-center p-8 shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent opacity-60" />
                    <Award className="h-16 w-16 text-indigo-500 mb-4 drop-shadow-lg z-10" />
                    <div className="text-center z-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Certificate of Completion</p>
                        <p className="text-lg font-extrabold text-slate-800 font-outfit leading-tight">{course.title}</p>
                        <div className="mt-3 h-px w-28 bg-indigo-300 mx-auto" />
                        <p className="text-xs text-slate-500 mt-2">Issued by <span className="font-bold text-indigo-600">OnlineITGuru</span></p>
                        <div className="flex gap-1 mt-3 justify-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-current" />)}
                        </div>
                    </div>
                </div>
                {/* Details */}
                <div className="space-y-5">
                    <ul className="space-y-3">
                        {highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                <BadgeCheck className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                {h}
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm font-bold text-amber-800">🏢 Recognised by 500+ Companies</p>
                        <p className="text-xs text-amber-700 mt-1">TCS, Wipro, Infosys, Cognizant, Accenture & more.</p>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 py-5">
                        <Award className="h-4 w-4" /> Get Certified — Enroll Now
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   MAIN PANEL — scroll-spy + smooth scroll
═══════════════════════════════════════════════ */
export default function CourseContentPanel({ course, sections }: Props) {
    const [activeId, setActiveId] = useState("overview");
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter nav items based on availability of reviews or other dynamic content
    const navItems = FIXED_NAV_ITEMS;

    /* ── Scroll-spy via IntersectionObserver ── */
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        navItems.forEach(({ id }) => {
            const el = sectionRefs.current[id];
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
                { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [navItems]);

    /* ── Smooth scroll on nav click ── */
    const scrollTo = (id: string) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        const offset = 120; // navbar + sticky nav height
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
    };

    const priceNum = Number(course.price);
    const originalPriceNum = Number(course.livePrice);

    return (
        <section className="bg-white border-t border-slate-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex gap-0 lg:gap-12 relative">

                    {/* ─── LEFT: Sticky Sidebar ─── */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-20 py-10">
                            {/* Nav list */}
                            <nav className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                                <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Course Content</p>
                                </div>
                                <ul className="divide-y divide-slate-100">
                                    {navItems.map(({ id, label, icon: Icon }) => {
                                        const active = activeId === id;
                                        return (
                                            <li key={id} className="relative">
                                                {active && (
                                                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                                                )}
                                                <button
                                                    onClick={() => scrollTo(id)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3.5 px-5 py-4 text-sm font-semibold transition-all duration-200 group",
                                                        active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                                    )}
                                                >
                                                    <Icon className={cn("h-4 w-4 flex-shrink-0 transition-colors", active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500")} />
                                                    <span className="text-left">{label}</span>
                                                    <ChevronRight className={cn("ml-auto h-4 w-4 transition-all flex-shrink-0", active ? "text-indigo-500 translate-x-0.5" : "text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5")} />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            {/* Quick enroll CTA */}
                            <div className="mt-6 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f1f45] to-[#1a3270] text-white p-6 shadow-xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Limited Offer</p>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-3xl font-extrabold font-outfit">₹{priceNum.toLocaleString("en-IN")}</span>
                                    <span className="text-sm text-slate-400 line-through">₹{originalPriceNum.toLocaleString("en-IN")}</span>
                                </div>
                                <p className="text-xs text-indigo-300 mb-4">⚡ Offer ends soon</p>
                                <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold shadow-lg">
                                    Enroll Now
                                </Button>
                                <div className="mt-4 flex gap-2">
                                    <Button variant="ghost" size="sm" className="flex-1 text-indigo-300 hover:text-white hover:bg-white/10 gap-1 text-xs">
                                        <Phone className="h-3 w-3" /> Call Us
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex-1 text-indigo-300 hover:text-white hover:bg-white/10 gap-1 text-xs">
                                        <Download className="h-3 w-3" /> Syllabus
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ─── RIGHT: Scrollable Sections ─── */}
                    <div ref={containerRef} className="flex-1 min-w-0 py-10 space-y-0">
                        {navItems.map(({ id }, idx) => (
                            <section
                                key={id}
                                id={id}
                                ref={(el) => { sectionRefs.current[id] = el; }}
                                className={cn(
                                    "scroll-section pb-20",
                                    idx < navItems.length - 1 ? "border-b border-slate-100 mb-10" : ""
                                )}
                            >
                                {id === "overview" && <OverviewSection course={course} />}
                                {id === "objectives" && <ObjectivesSection sections={sections} />}
                                {id === "syllabus" && <SyllabusSection course={course} sections={sections} />}
                                {id === "projects" && <ProjectsSection course={course} />}
                                {id === "training-options" && <TrainingSection course={course} sections={sections} />}
                                {id === "batches" && <BatchesSection sections={sections} />}
                                {id === "faqs" && <FaqSection course={course} sections={sections} />}
                                {id === "reviews" && <ReviewsSection course={course} />}
                                {id === "certification" && <CertificationSection course={course} />}
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile bottom tab bar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 shadow-lg">
                <div className="flex items-center overflow-x-auto no-scrollbar">
                    {navItems.map(({ id, label, icon: Icon }) => {
                        const active = activeId === id;
                        return (
                            <button
                                key={id}
                                onClick={() => scrollTo(id)}
                                className={cn(
                                    "flex flex-col items-center gap-0.5 px-4 py-3 text-[10px] font-semibold flex-shrink-0 transition-colors",
                                    active ? "text-indigo-600 border-t-2 border-indigo-600" : "text-slate-400 border-t-2 border-transparent"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="whitespace-nowrap">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
