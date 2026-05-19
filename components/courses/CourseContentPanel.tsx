"use client";

import { useEffect, useRef, useState } from "react";
import {
    BookOpen, Layers, Video, Calendar, HelpCircle,
    Star, Award, ChevronRight, Lock, PlayCircle,
    CheckCircle2, Users, MapPin, Clock3,
    BarChart2, TrendingUp, Zap, MessageSquare,
    BadgeCheck, Phone, Download,
    Monitor, Layout, Target, ListChecks, Briefcase
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

// ── Section Components ──────────────────────────────────────────────────────
import OverviewSection from "./sections/OverviewSection";
import SyllabusSection from "./sections/SyllabusSection";
import ProjectsSection from "./sections/ProjectsSection";
import EnrollmentSection from "./sections/EnrollmentSection";
import FaqSection from "./sections/FaqSection";
import ReviewsSection from "./sections/ReviewsSection";
import CertificationSection from "./sections/CertificationSection";
import SkillsAndTools from "./sections/SkillsAndTools";
import HiringSprints from "./sections/HiringSprints";
import JobOutlook from "./sections/JobOutlook";
import ObjectivesSection from "./sections/ObjectivesSection";

interface Props {
    course: CourseDetail;
    sections: CourseSection[];
}

const FIXED_NAV_ITEMS = [
    { id: "overview", label: "Course Overview", icon: Layout },
    { id: "objectives", label: "Course Objectives", icon: Target },
    { id: "syllabus", label: "Course Syllabus", icon: BookOpen },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "enrollment", label: "Enrollment Options", icon: Calendar },
    { id: "faqs", label: "FAQ's", icon: HelpCircle },
    { id: "reviews", label: "Reviews", icon: Star },
     { id: "skills", label: "Skills & Tools", icon: ListChecks },
    { id: "outlook", label: "Job Outlook", icon: TrendingUp },
    { id: "hiring", label: "Hiring Sprints", icon: Briefcase },
    { id: "certification", label: "Certification", icon: Award },
];

/* ═══════════════════════════════════════════════
   MAIN PANEL — scroll-spy + smooth scroll
   Refactored to use individual section components
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
                            <nav className="rounded-lg  overflow-hidden shadow-sm bg-white">

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
                                {id === "skills" && <SkillsAndTools />}
                                {id === "outlook" && <JobOutlook />}
                                {id === "hiring" && <HiringSprints course={course} />}
                                {id === "objectives" && <ObjectivesSection sections={sections} />}
                                {id === "syllabus" && <SyllabusSection course={course} sections={sections} />}
                                {id === "projects" && <ProjectsSection course={course} />}
                                {id === "enrollment" && <EnrollmentSection course={course} sections={sections} />}
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
