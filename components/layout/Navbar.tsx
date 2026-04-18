"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    GraduationCap, Menu, X, ChevronDown, ChevronRight,
    LogOut, User, Code2, BarChart2, Palette, Megaphone,
    Briefcase, Database, Cloud, Shield, Cpu, ArrowRight,
    Star, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";

/* ─── Mega Menu Data ─────────────────────────────────────────── */
const COURSE_CATEGORIES = [
    {
        label: "Development",
        icon: Code2,
        courses: [
            { name: "Full-Stack Web Development", slug: "full-stack-web-development", duration: "6 Months", rating: 4.8 },
            { name: "React & Next.js Mastery", slug: "full-stack-web-development", duration: "3 Months", rating: 4.7 },
            { name: "Python Programming", slug: "full-stack-web-development", duration: "4 Months", rating: 4.6 },
        ],
    },
    {
        label: "Data Science",
        icon: BarChart2,
        courses: [
            { name: "Data Science & ML with Python", slug: "data-science-machine-learning", duration: "8 Months", rating: 4.9 },
            { name: "Power BI & Tableau", slug: "data-science-machine-learning", duration: "2 Months", rating: 4.7 },
            { name: "Data Engineering", slug: "data-science-machine-learning", duration: "5 Months", rating: 4.6 },
        ],
    },
    {
        label: "Design",
        icon: Palette,
        courses: [
            { name: "UI/UX Design Masterclass", slug: "ui-ux-design-masterclass", duration: "4 Months", rating: 4.7 },
            { name: "Figma for Professionals", slug: "ui-ux-design-masterclass", duration: "2 Months", rating: 4.5 },
        ],
    },
    {
        label: "Cloud & DevOps",
        icon: Cloud,
        courses: [
            { name: "AWS Solutions Architect", slug: "full-stack-web-development", duration: "3 Months", rating: 4.8 },
            { name: "Docker & Kubernetes", slug: "full-stack-web-development", duration: "2 Months", rating: 4.7 },
        ],
    },
];

const QUICK_LINKS = [
    { label: "All Courses", href: "/courses", icon: GraduationCap },
    { label: "Business", href: "/courses", icon: Briefcase },
    { label: "Cybersecurity", href: "/courses", icon: Shield },
    { label: "AI & ML", href: "/courses", icon: Cpu },
    { label: "Database", href: "/courses", icon: Database },
    { label: "Marketing", href: "/courses", icon: Megaphone },
];

/* ─── Mega Dropdown Component ────────────────────────────────── */
function CoursesMegaMenu({ onClose }: { onClose: () => void }) {
    const [activeCategory, setActiveCategory] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[900px] max-w-[96vw] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
        >
            <div className="flex">
                {/* ── Col 1: Category tabs ── */}
                <div className="w-52 flex-shrink-0 bg-slate-50 border-r border-slate-100 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-5 mb-3">
                        Categories
                    </p>
                    {COURSE_CATEGORIES.map((cat, i) => {
                        const Icon = cat.icon;
                        const active = activeCategory === i;
                        return (
                            <button
                                key={cat.label}
                                onMouseEnter={() => setActiveCategory(i)}
                                onClick={() => setActiveCategory(i)}
                                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all group ${active ? "bg-white text-indigo-700 border-r-2 border-indigo-600 shadow-sm" : "text-slate-600 hover:text-indigo-600 hover:bg-white/60"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} />
                                {cat.label}
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
                        {COURSE_CATEGORIES[activeCategory].label} Courses
                    </p>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-1"
                        >
                            {COURSE_CATEGORIES[activeCategory].courses.map((course) => (
                                <Link
                                    key={course.slug + course.name}
                                    href={`/courses/${course.slug}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 group transition-all"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                            {course.name}
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
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <Link
                        href="/courses"
                        onClick={onClose}
                        className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
                    >
                        View all {COURSE_CATEGORIES[activeCategory].label} courses
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* ── Col 3: Featured promo card ── */}
                <div className="w-60 flex-shrink-0 border-l border-slate-100 p-5 bg-gradient-to-b from-indigo-50 to-white flex flex-col">
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
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex gap-6">
                {["Contact Us", "Corporate Training", "Become an Instructor"].map((item) => (
                    <Link
                        key={item}
                        href="/courses"
                        onClick={onClose}
                        className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        {item}
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}

/* ─── Main Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
    const courseMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Close dropdown when clicking outside */
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (courseMenuRef.current && !courseMenuRef.current.contains(e.target as Node)) {
                setIsCourseMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    /* Close dropdown on route change */
    useEffect(() => { setIsCourseMenuOpen(false); setIsMobileMenuOpen(false); }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const isActive = (href: string) => pathname === href;

    // On the home page the hero is dark — allow transparent-to-solid transition.
    // On ALL other pages the background is light, so keep navbar always solid dark
    // so white text stays readable regardless of scroll position.
    const isHomePage = pathname === "/";
    const navBg = isScrolled || !isHomePage
        ? "bg-gray-950 shadow-lg shadow-black/20"
        : "bg-transparent";

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Online<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">ItGuru</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors ${isActive("/") ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Home
                        </Link>

                        {/* Courses with mega menu */}
                        <div ref={courseMenuRef} className="relative">
                            <button
                                onClick={() => setIsCourseMenuOpen((v) => !v)}
                                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isCourseMenuOpen || isActive("/courses") ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                Courses
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isCourseMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isCourseMenuOpen && (
                                    <CoursesMegaMenu onClose={() => setIsCourseMenuOpen(false)} />
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href="/blog"
                            className={`text-sm font-medium transition-colors ${isActive("/blog") ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/contact"
                            className={`text-sm font-medium transition-colors ${isActive("/contact") ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span>{user.name || user.email.split("@")[0]}</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-400 hover:bg-white/5"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/20">
                                        Get Started <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-gray-950/97 backdrop-blur-xl border-t border-white/10 overflow-y-auto max-h-[80vh]"
                    >
                        <div className="container mx-auto px-6 py-6 space-y-5">
                            {["Home", "Blog", "Contact"].map((item) => (
                                <Link
                                    key={item}
                                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-lg font-medium text-gray-400 hover:text-white py-1"
                                >
                                    {item}
                                </Link>
                            ))}

                            {/* Mobile Courses Section */}
                            <div>
                                <p className="text-lg font-medium text-white mb-3">Courses</p>
                                {COURSE_CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    return (
                                        <div key={cat.label} className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon className="h-4 w-4 text-indigo-400" />
                                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{cat.label}</p>
                                            </div>
                                            <div className="pl-6 space-y-2">
                                                {cat.courses.map((course) => (
                                                    <Link
                                                        key={course.name}
                                                        href={`/courses/${course.slug}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
                                                    >
                                                        {course.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                <Link
                                    href="/courses"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 mt-2"
                                >
                                    Browse all courses <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="pt-4 border-t border-white/10 space-y-3">
                                {user ? (
                                    <>
                                        <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Profile</Button>
                                        </Link>
                                        <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full bg-red-600/20 text-red-400 hover:bg-red-600/30">
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Login</Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
