"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/data";
import { PhoneCall, Download, BadgeCheck } from "lucide-react";

interface CourseEnrollCardProps {
    course: Course;
}

export default function CourseEnrollCard({ course }: CourseEnrollCardProps) {
    const [hovered, setHovered] = useState(false);
    const discountPct = Math.round((1 - course.price / course.originalPrice) * 100);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Self-Paced Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Self-Paced Learning</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-white font-outfit">
                            ₹{course.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-base text-slate-400 line-through">₹{course.originalPrice.toLocaleString("en-IN")}</span>
                    </div>
                </div>
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Recommended
                </span>
            </div>

            {/* Discount badge */}
            <div className="px-6 pt-3 pb-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {discountPct}% OFF — Limited time offer!
                </span>
            </div>

            {/* CTA Buttons */}
            <div className="px-6 pb-5 space-y-3 pt-3">
                <Button
                    size="lg"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-base shadow-md hover:shadow-lg transition-all"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    {hovered ? "🚀 Enroll & Transform!" : "GET FREE TRIAL"}
                </Button>
                <Button variant="outline" size="lg" className="w-full gap-2 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                    <Download className="h-4 w-4" />
                    Download Syllabus
                </Button>
                <Button variant="ghost" size="lg" className="w-full gap-2 font-semibold text-indigo-600 hover:bg-indigo-50">
                    <PhoneCall className="h-4 w-4" />
                    Request a Callback
                </Button>
            </div>

            {/* Money back */}
            <p className="text-center text-xs text-slate-400 pb-5">
                ✅ 14-Day Money-Back Guarantee
            </p>
        </div>
    );
}
