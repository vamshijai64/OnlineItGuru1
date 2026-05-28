"use client";

import { Star, Award, Clock, Download, Laptop, Users, Share2, Heart, Play, Home, ChevronRight, Video, FileText, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseDetail } from "@/store/homeStore";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import EnrollModal from "./EnrollModal";

interface CourseBannerProps {
    course: CourseDetail;
}

export default function CourseBanner({ course }: CourseBannerProps) {
    const [showDemo, setShowDemo] = useState(false);
    const [showEnroll, setShowEnroll] = useState(false);

    // Stats mapping from API data
    const stats = [
        { icon: Clock, value: course.duration || "40+", label: "Hours" },
        { icon: Laptop, value: course.assignments ? `${course.assignments}` : "18", label: "Assignments" },
        { icon: Users, value: course.liveProjects ? `${course.liveProjects}` : "2", label: "Projects" },
    ];

    const price = Number(course.price).toLocaleString("en-IN");
    const originalPrice = Number(course.livePrice).toLocaleString("en-IN");
    const discount = Math.round((1 - Number(course.price) / Number(course.livePrice)) * 100);

    return (
        <section className="relative bg-[#020617] text-white pt-26 pb-10 lg:pb-12 overflow-hidden">
            {/* Background Atmosphere - Premium Dark Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large Background Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />

                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)]" />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs text-rose-300/60 mb-6">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <Home className="h-3 w-3" /> Home
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-white line-clamp-1 max-w-xs">{course.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ─── Left: Course Info ─── */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            {/* <Badge className="bg-pink-600 hover:bg-pink-700 text-white px-2.5 py-0.5 text-[10px] border-none shadow-[0_0_15px_rgba(219,39,119,0.3)]">
                                {course.category?.title || "Technology"}
                            </Badge> */}
                            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1">
                                {course.category?.title || "Technology"}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-outfit leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-white">
                                {course.title}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-base text-rose-100/70 leading-6 max-w-2xl font-medium">
                            {course.subtitle || course.description?.substring(0, 160) + "..."}
                        </p>

                        {/* Rating & Learners Badges */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                                <Users className="w-3.5 h-3.5 text-amber-400" />
                                {course.totalLearners?.toLocaleString() || "7,584"}+ Learners
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-full">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                {course.rating} ({course.totalReviews?.toLocaleString() || 0} Reviews)
                            </div>

                        </div>

                        {/* Stats Row & Watch Demo */}
                        <div className="flex flex-wrap items-center gap-40">
                            <div className="flex flex-wrap items-center gap-3">
                                {stats.map(({ icon: Icon, value, label }, i) => (
                                    <div key={i} className="flex items-center gap-3 px-5 py-3 bg-gradient-to-br from-[#1a2b4b] to-[#122244] border border-white/10 rounded-xl shadow-lg min-w-[120px]">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-semibold text-white leading-none">{value}</span>
                                            <span className="text-[10px] text-slate-400  tracking-widest font-bold mt-1">{label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={() => setShowDemo(true)}
                                    className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl hover:bg-white/20 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 animate-pulse" />
                                    <Play className="h-10 w-10 text-white fill-white group-hover:scale-110 transition-transform relative z-10" />
                                </button>
                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Watch Demo</span>
                            </div>
                        </div>

                        {/* Instructor Row */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-base font-extrabold shadow-lg ring-1 ring-indigo-400/30">
                                I
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-white">
                                    Taught by{" "}
                                    <span className="text-indigo-400 hover:underline cursor-pointer">ITGuru Expert</span>
                                </p>
                                <p className="text-[10px] text-slate-400">Senior Industry Professional</p>
                            </div>
                        </div>

                        {/* Actions at bottom left */}
                        <div className="flex items-center gap-2 pt-4">
                            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-5 border border-white/5 bg-white/5">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl px-4 py-5 border border-white/5 bg-white/5">
                                <Heart className="h-4 w-4" /> Wishlist
                            </Button>
                        </div>
                    </div>

                    {/* ─── Right: Desktop Enrollment Card (Compact Premium Dark) ─── */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 bg-[#0f172a]/80 backdrop-blur-xl text-white rounded-2xl p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group max-w-[290px] ml-auto">
                            {/* Premium Ribbon */}
                            <div className="absolute top-0 right-0">
                                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[8px] font-black px-6 py-1 rotate-45 translate-x-6 -translate-y-1 shadow-lg uppercase tracking-widest">
                                    Premium
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">Self-Paced Learning</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black font-outfit text-white">₹{price}</span>
                                        <span className="text-sm text-slate-500 line-through font-medium">₹{originalPrice}</span>
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => setShowEnroll(true)}
                                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs py-5 rounded-xl shadow-[0_10px_20px_-10px_rgba(236,72,153,0.4)] transition-all active:scale-[0.98] uppercase tracking-wider"
                                >
                                    Enroll Now
                                </Button>

                                <div className="pt-3 border-t border-white/5">
                                    <p className="text-[11px] font-bold text-slate-200 mb-3">Includes:</p>
                                    <ul className="space-y-2.5">
                                        {[
                                            { icon: Video, text: `${course.duration || "40"} hours high-quality video` },
                                            { icon: FileText, text: `${course.assignments || "2"} projects` },
                                            { icon: Download, text: `${course.sectionCount || "18"} downloadable resource` },
                                            { icon: Clock, text: "Lifetime access and 24x7 support" },
                                            { icon: Smartphone, text: "Access on your computer or mobile" },
                                            { icon: Award, text: "Get certificate on course completion" },
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs text-slate-300 font-medium group/item">
                                                <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center text-pink-400/80 group-hover/item:bg-pink-500/10 group-hover/item:text-pink-300 transition-colors">
                                                    <item.icon className="h-3 w-3" />
                                                </div>
                                                <span className="leading-normal">{item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button variant="outline" size="sm" className="w-full border-white/20 text-white font-bold py-4 hover:bg-white/10 rounded-xl transition-all text-[13px] bg-transparent">
                                    Get Free Trail
                                </Button>

                                <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500/50" />
                                    14-Day Guarantee
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ─── Mobile Enrollment Card (Premium Dark) ─── */}
                    <div className="lg:hidden">
                        <div className="bg-[#0f172a]/90 backdrop-blur-lg text-white rounded-2xl p-6 shadow-2xl border border-white/10">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-extrabold font-outfit text-white">
                                    ₹{price}
                                </span>
                                <span className="text-base text-slate-500 line-through">₹{originalPrice}</span>
                                <span className="text-sm font-bold text-pink-500">
                                    {discount}% OFF
                                </span>
                            </div>
                            <div className="space-y-3 mt-4">
                                <Button 
                                    onClick={() => setShowEnroll(true)}
                                    size="lg" 
                                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-base"
                                >
                                    ENROLL NOW
                                </Button>
                                <Button variant="outline" size="lg" className="w-full font-semibold border-white/10 text-white">
                                    Download Syllabus
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Modal */}
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
                                <div className="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center">
                                    <Play className="w-20 h-20 text-indigo-500 mb-6" />
                                    <h3 className="text-2xl font-bold">Demo Video Not Available</h3>
                                    <p className="text-gray-400 mt-2">Please contact support for a live demonstration of {course.title}.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <EnrollModal isOpen={showEnroll} onClose={() => setShowEnroll(false)} price={price} courseTitle={course.title} />
        </section>
    );
}
