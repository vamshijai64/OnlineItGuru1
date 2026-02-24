"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/lib/data";

const levelColors: Record<string, string> = {
    Beginner: "bg-green-50 text-green-700 border-green-200",
    Intermediate: "bg-blue-50 text-blue-700 border-blue-200",
    Advanced: "bg-purple-50 text-purple-700 border-purple-200",
};

const modeColors: Record<string, string> = {
    Online: "bg-cyan-50 text-cyan-700",
    Classroom: "bg-amber-50 text-amber-700",
    Hybrid: "bg-indigo-50 text-indigo-700",
};

export default function FeaturedCourses() {
    const featured = courses.slice(0, 6);

    if (featured.length === 0) return null;

    return (
        <section className="py-24 bg-[#f8f9fc]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14"
                >
                    <div>
                        <span className="text-[#e94560] text-sm font-semibold uppercase tracking-wider">Our Courses</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 font-outfit">
                            Explore Top Programs
                        </h2>
                        <p className="mt-3 text-slate-500 max-w-lg leading-relaxed">
                            Handpicked courses designed to fast-track your career in technology.
                        </p>
                    </div>
                    <Link href="/courses">
                        <Button variant="outline" className="mt-4 sm:mt-0 rounded-xl border-slate-300 hover:border-[#e94560] hover:text-[#e94560] group px-6">
                            View All Courses
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {featured.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link
                                href={`/courses/${course.slug}`}
                                className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 h-full"
                            >
                                <div className="relative overflow-hidden h-52">
                                    <div
                                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500 bg-slate-100"
                                        style={{ backgroundImage: `url(${course.image})` }}
                                    />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <Badge className={`${levelColors[course.level] || levelColors.Beginner} border text-[10px] font-bold uppercase tracking-wider`}>
                                            {course.level}
                                        </Badge>
                                    </div>
                                    {course.mode && (
                                        <Badge className={`absolute top-3 right-3 ${modeColors[course.mode]} text-[10px] font-bold uppercase tracking-wider border-none`}>
                                            {course.mode}
                                        </Badge>
                                    )}
                                </div>
                                <div className="p-6">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">
                                        {course.category}
                                    </p>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#e94560] transition-colors line-clamp-1 font-outfit">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{course.description}</p>

                                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-slate-700">{course.rating}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {course.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3.5 h-3.5" />
                                            {course.reviewsCount}+ Learners
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-5">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-slate-900 font-outfit">₹{course.price.toLocaleString()}</span>
                                            <span className="text-sm text-slate-400 line-through">₹{course.originalPrice.toLocaleString()}</span>
                                        </div>
                                        <span className="text-[#e94560] text-sm font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
