"use client";

import { Calendar, Clock3, Zap, CheckCircle2, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseDetail, CourseSection } from "@/store/homeStore";

// Helper to parse JSON content safely with global section fallback
function parseSectionContent(sec: any) {
    if (!sec) return [];
    let content = [];
    try {
        if (sec.content && sec.content.trim() !== "" && sec.content !== "[]") {
            content = JSON.parse(sec.content);
        }
    } catch {}
    if ((!Array.isArray(content) || content.length === 0) && sec.section?.content) {
        try {
            content = JSON.parse(sec.section.content);
        } catch {}
    }
    return Array.isArray(content) ? content : [];
}

export default function EnrollmentSection({ course, sections }: { course: CourseDetail; sections: CourseSection[] }) {
    const batchSection = sections.find(s => s.view === 'schedule-card-list' || s.title.toLowerCase().includes('batch'));
    const rawBatches = parseSectionContent(batchSection);
    // Filter out uninitialized or placeholder batches
    const dynamicBatches = rawBatches.filter((b: any) => {
        if (!b) return false;
        return (b.date && String(b.date).trim() !== "") || (b.time && String(b.time).trim() !== "");
    });

    const mockBatches = [
        { date: "May 15, 2026", type: "Weekday", time: "7:00 AM – 9:00 AM IST", seats: 5, mode: "Online", status: "Filling Fast" },
        { date: "May 22, 2026", type: "Weekend", time: "10:00 AM – 1:00 PM IST", seats: 12, mode: "Hybrid", status: "Open" },
    ];

    const displayBatches = dynamicBatches.length > 0 ? dynamicBatches : mockBatches;
    const price = Number(course.price).toLocaleString("en-IN");
    const originalPrice = Number(course.livePrice).toLocaleString("en-IN");

    return (
        <div className="space-y-10">
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 font-outfit">Individual Training</h2>
                    <p className="text-sm text-slate-500 mt-1">Join a live cohort and learn with experts</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100/50 transition-colors" />
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg">Next Cohorts</h3>
                            </div>
                            <div className="space-y-4">
                                {displayBatches.slice(0, 2).map((b: any, i: number) => (
                                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-white hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">COHORT 0{i + 1}</span>
                                                <span className="text-lg font-extrabold text-slate-900">{b.date || "Date TBA"}</span>
                                            </div>
                                            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                {b.status || "Open"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Clock3 className="h-4 w-4 text-indigo-400" />
                                            <span className="font-semibold">{b.time || "Timings TBA"}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t border-slate-100 mt-2">
                                <Button variant="outline" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold py-5 rounded-xl transition-all active:scale-95">
                                    Select Schedule & Enroll
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#0f1f45] to-[#1a3270] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100/50 flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap className="h-32 w-32 rotate-12" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                                    Best Value
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-outfit">Complete Live Program</h3>
                            <p className="text-indigo-200/80 text-sm mb-8 leading-relaxed max-w-xs">
                                Full access to live training, real-world projects, and lifetime support.
                            </p>
                            <div className="flex items-baseline gap-3 mb-8">
                                <span className="text-4xl font-black font-outfit text-white">₹{price}</span>
                                <span className="text-xl text-indigo-300/40 line-through font-medium">₹{originalPrice}</span>
                            </div>
                            <Button className="w-full bg-white hover:bg-indigo-50 text-indigo-950 font-black text-base py-7 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-wider">
                                ENROLL NOW
                            </Button>
                            <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Live Training</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Certifications</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden border border-white/10">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Users className="h-40 w-40" />
                </div>
                <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-3xl font-bold font-outfit mb-4">Corporate Training</h2>
                        <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                            Upskill your team with customized training programs tailored to your company's specific needs and goals.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {["Customized Curriculum", "Flexible Scheduling", "Group Discounts", "Post-Training Support"].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                        <MessageSquare className="h-12 w-12 text-indigo-400 mb-4" />
                        <h4 className="text-xl font-bold mb-2">Need a custom plan?</h4>
                        <p className="text-slate-400 text-sm text-center mb-8">Our learning experts will help you design the perfect training roadmap for your organization.</p>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-6 rounded-xl">
                            Request a Quote
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
