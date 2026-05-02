"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    GraduationCap, Menu, X, ChevronDown, ChevronRight,
    LogOut, User, Code2, BarChart2, Palette, Megaphone,
    Briefcase, Database, Cloud, Shield, Cpu, ArrowRight,
    Star, Clock, PieChart, Brain, CircleDot, FolderKanban,
    TestTube, Layout, Bitcoin, Monitor, Smartphone, Bot,
    BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useRouter, usePathname } from "next/navigation";
import CourseMegaMenu from "../CourseMegaMenu";
import { useHomeStore } from "@/store/homeStore";


const iconMap: Record<string, React.ElementType> = {
  'fa fa-soundcloud':   Cloud,
  'fa fa-pie-chart':    PieChart,
  'fa fa-user':         Cpu,
  'fa fa-bar-chart-o':  BarChart2,
  'fa fa-codepen':      Code2,
  'fa fa-lightbulb-o':  Brain,
  'fa fa-opera':        CircleDot,
  'fa fa-file-text':    FolderKanban,
  'fa fa-wrench':       TestTube,
  'fa fa-code':         Layout,
  'fa fa-database':     Database,
  'fa fa-shield':       Shield,
  'fa fa-bitcoin':      Bitcoin,
  'fa fa-windows':      Monitor,
  'fa fa-mobile-phone': Smartphone,
  'fa fa-bullhorn':     Megaphone,
  'fa fa-magic':        Bot,
};
/* ─── Main Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
    const { user, logout } = useAuthStore();
    const fetchCategories = useHomeStore((state) => state.fetchCategories);
    const categories = useHomeStore((state) => state.categories);

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

    useEffect(() => {
        if (categories && categories.length === 0) {
            fetchCategories();
        }
    }, []);
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
        ? "bg-gray-950/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
        : "bg-transparent backdrop-blur-[2px]";

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-purple-500/30">
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
                            className={`relative text-sm font-medium transition-colors py-2 group ${isActive("/") ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Home
                            <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full ${isActive("/") ? "w-full" : ""}`} />
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
                                    <CourseMegaMenu onClose={() => setIsCourseMenuOpen(false)} />
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            href="/contact"
                            className={`relative text-sm font-medium transition-colors py-2 group ${isActive("/contact") ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Contact
                            <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full ${isActive("/contact") ? "w-full" : ""}`} />
                        </Link>
                        {user?.roles?.includes("admin") && (
                            <Link
                                href="/admin"
                                className={`text-sm font-bold transition-colors ${isActive("/admin") ? "text-indigo-400" : "text-indigo-400/80 hover:text-indigo-400"}`}
                            >
                                Admin Panel
                            </Link>
                        )}
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
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border border-white/20 shadow-lg shadow-purple-500/20 rounded-full">
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
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 space-y-5">
                            {["Home", "Contact"].map((item) => (
                                <Link
                                    key={item}
                                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-lg font-medium text-gray-400 hover:text-white py-1"
                                >
                                    {item}
                                </Link>
                            ))}
                            {user?.roles?.includes("admin") && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-lg font-bold text-indigo-400 hover:text-indigo-300 py-1"
                                >
                                    Admin Panel
                                </Link>
                            )}

                            {/* Mobile Resources Section */}
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-lg font-medium text-white mb-3">Resources</p>
                                <div className="space-y-2">
                                    {[
                                        { label: "Blog", href: "/blog" },
                                        { label: "Tutorials", href: "/tutorials" },
                                        { label: "Interview Questions", href: "/interview-questions" }
                                    ].map((res) => (
                                        <Link
                                            key={res.label}
                                            href={res.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-sm text-gray-400 hover:text-white py-1"
                                        >
                                            {res.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Courses Section */}
                            <div className="pt-2 border-t border-white/10">
                                <p className="text-lg font-medium text-white mb-3">Courses</p>
                                {categories?.map((cat) => {
                                    const Icon = iconMap[cat.image] ?? BookOpen;
                                    return (
                                        <div key={cat.id} className="mb-2">
                                            <Link
                                                href={`/courses/${cat.slug}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                            >
                                                <Icon className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                                                <span>{cat.title}</span>
                                            </Link>
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
