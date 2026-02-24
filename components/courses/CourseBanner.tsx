"use client";

import { Star, Clock, Laptop, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/lib/data";

interface CourseBannerProps {
    course: Course;
}

export default function CourseBanner({ course }: CourseBannerProps) {
    return (
        <section className="bg-slate-900 text-white py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-indigo-600 hover:bg-indigo-700">{course.category}</Badge>
                            <Badge variant="outline" className="text-white border-white/20">{course.level}</Badge>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-outfit">
                            {course.title}
                        </h1>

                        <p className="text-lg text-slate-300 leading-8 max-w-2xl">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="h-5 w-5 fill-current" />
                                <span className="font-bold text-white">{course.rating}</span>
                                <span className="text-sm text-slate-400">({course.reviewsCount} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Clock className="h-5 w-5" />
                                <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Laptop className="h-5 w-5" />
                                <span>{course.mode}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-700 overflow-hidden">
                                {/* Instructor image placeholder */}
                                <div className="h-full w-full flex items-center justify-center text-xs font-bold text-slate-400">
                                    {course.instructor.name.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Taught by {course.instructor.name}</p>
                                <p className="text-xs text-slate-400">{course.instructor.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:mt-0 mt-8">
                        <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-xl border border-slate-100 text-slate-900">
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold font-outfit">${course.price}</span>
                                    <span className="text-lg text-slate-400 line-through">${course.originalPrice}</span>
                                    <span className="text-sm font-semibold text-green-600">50% OFF</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">Enrollment ends soon!</p>
                            </div>

                            <div className="space-y-3">
                                <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg font-bold">
                                    Enroll Now
                                </Button>
                                <Button variant="outline" size="lg" className="w-full">
                                    Free Preview
                                </Button>
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-4">
                                14-Day Money-Back Guarantee
                            </p>

                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between">
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Share2 className="h-4 w-4" /> Share
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Heart className="h-4 w-4" /> Wishlist
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
