"use client";

import { Star, Clock, Laptop, Users, Share2, Heart, Play, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseDetail } from "@/store/homeStore";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface CourseBannerProps {
    course: CourseDetail;
}

export default function CourseBanner({ course }: CourseBannerProps) {
    const [showDemo, setShowDemo] = useState(false);

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
        <section className="bg-gradient-to-br from-[#0b1a35] via-[#122244] to-[#0e1c38] text-white pt-24 pb-12 lg:pb-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-8">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <Home className="h-3.5 w-3.5" /> Home
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-slate-200 line-clamp-1 max-w-xs">{course.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* ─── Left: Course Info ─── */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1">
                                {course.category?.title || "Technology"}
                            </Badge>
                            <Badge variant="outline" className="text-slate-300 border-slate-500 px-3 py-1">
                                {course.sectionCount > 10 ? "Advanced" : "Beginner"}
                            </Badge>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-outfit leading-tight">
                            {course.title}
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-slate-300 leading-7 max-w-2xl">
                            {course.subtitle || course.description?.substring(0, 160) + "..."}
                        </p>

                        {/* Rating Row */}
                        <div className="flex flex-wrap items-center gap-5 py-4 px-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 w-fit">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(course.rating) ? "fill-current" : "fill-current opacity-30"}`} />
                                    ))}
                                </div>
                                <span className="font-bold text-white text-lg">{course.rating}</span>
                                <span className="text-sm text-slate-400">({course.totalReviews?.toLocaleString() || 0} reviews)</span>
                            </div>
                            <div className="h-4 w-px bg-slate-600 hidden sm:block" />
                            <button
                                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
                            >
                                View Reviews
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-0 border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm w-fit divide-x divide-white/10">
                            {stats.map(({ icon: Icon, value, label }, i) => (
                                <div key={i} className="flex flex-col items-center px-8 py-5 text-center">
                                    <Icon className="h-6 w-6 text-slate-400 mb-1" />
                                    <span className="text-2xl font-extrabold text-white">{value}</span>
                                    <span className="text-xs text-slate-400 mt-0.5 font-medium">{label}</span>
                                </div>
                            ))}
                            <div className="flex flex-col items-center px-8 py-5 text-center">
                                <button
                                    onClick={() => setShowDemo(true)}
                                    className="h-12 w-12 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors flex items-center justify-center shadow-lg group"
                                >
                                    <Play className="h-5 w-5 text-slate-900 fill-current group-hover:scale-110 transition-transform" />
                                </button>
                                <span className="text-xs text-slate-400 mt-2 font-medium">Watch Demo</span>
                            </div>
                        </div>

                        {/* Instructor Row */}
                        <div className="flex items-center gap-4 pt-2">
                            <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-extrabold shadow-lg ring-2 ring-indigo-400/30">
                                I
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">
                                    Taught by{" "}
                                    <span className="text-indigo-400 hover:underline cursor-pointer">ITGuru Expert</span>
                                </p>
                                <p className="text-xs text-slate-400">Senior Industry Professional</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white hover:bg-white/10">
                                    <Share2 className="h-4 w-4" /> Share
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white hover:bg-white/10">
                                    <Heart className="h-4 w-4" /> Wishlist
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ─── Right: Mobile Enrollment Card (hidden on lg, replaced by sidebar) ─── */}
                    <div className="lg:hidden">
                        <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-extrabold font-outfit">
                                    ₹{price}
                                </span>
                                <span className="text-base text-slate-400 line-through">₹{originalPrice}</span>
                                <span className="text-sm font-bold text-green-600">
                                    {discount}% OFF
                                </span>
                            </div>
                            <p className="text-xs text-red-500 font-semibold mb-4">⚡ Offer ends soon!</p>
                            <div className="space-y-3">
                                <Button size="lg" className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-base">
                                    GET FREE TRIAL
                                </Button>
                                <Button variant="outline" size="lg" className="w-full font-semibold">
                                    Download Syllabus
                                </Button>
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-4">✅ 14-Day Money-Back Guarantee</p>
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
        </section>
    );
}
