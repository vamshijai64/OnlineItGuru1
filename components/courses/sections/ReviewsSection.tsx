"use client";

import { Star, MessageSquare } from "lucide-react";
import { CourseDetail } from "@/store/homeStore";

export default function ReviewsSection({ course }: { course: CourseDetail }) {
    const reviews = course.reviews && course.reviews.length > 0 ? course.reviews : [
        { user_name: "Priya Menon", role: "Software Engineer", created_at: "2026-02-10", rating: 5, review: "Top-notch course! Responsive mentors, practical projects. Got placed in 3 weeks after completion." },
        { user_name: "Arjun Reddy", role: "Data Analyst", created_at: "2026-01-15", rating: 5, review: "Curriculum is perfectly up-to-date. Live sessions were engaging and doubt resolution is lightning fast." },
    ];

    const GRAD = ["from-indigo-500 to-violet-600", "from-pink-500 to-rose-600", "from-amber-500 to-orange-600", "from-teal-500 to-emerald-600"];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Student Reviews</h2>
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
