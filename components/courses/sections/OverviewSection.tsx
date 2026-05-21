"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CourseDetail, CourseSection } from "@/store/homeStore";

export default function OverviewSection({ course,section=[] }: { course: CourseDetail;section?:CourseSection[] }) {
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
