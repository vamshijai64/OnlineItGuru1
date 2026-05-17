"use client";

import { Award, BadgeCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseDetail } from "@/store/homeStore";

export default function CertificationSection({ course }: { course: CourseDetail }) {
    const highlights = [
        "Globally recognised & industry-validated",
        "Digital certificate with unique verification ID",
        "Share directly to LinkedIn with one click",
        "Recognised by 500+ hiring partners",
        "Lifetime validity — never expires",
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Course Certification</h2>
                <p className="text-sm text-slate-500 mt-1">Earn a credential that gets you noticed</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 aspect-[4/3] flex flex-col items-center justify-center p-8 shadow-inner">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent opacity-60" />
                    <Award className="h-16 w-16 text-indigo-500 mb-4 drop-shadow-lg z-10" />
                    <div className="text-center z-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-1">Certificate of Completion</p>
                        <p className="text-lg font-extrabold text-slate-800 font-outfit leading-tight">{course.title}</p>
                        <div className="mt-3 h-px w-28 bg-indigo-300 mx-auto" />
                        <p className="text-xs text-slate-500 mt-2">Issued by <span className="font-bold text-indigo-600">OnlineITGuru</span></p>
                        <div className="flex gap-1 mt-3 justify-center">
                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-yellow-400 fill-current" />)}
                        </div>
                    </div>
                </div>
                <div className="space-y-5">
                    <ul className="space-y-3">
                        {highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                <BadgeCheck className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                {h}
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm font-bold text-amber-800">🏢 Recognised by 500+ Companies</p>
                        <p className="text-xs text-amber-700 mt-1">TCS, Wipro, Infosys, Cognizant, Accenture & more.</p>
                    </div>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 py-5">
                        <Award className="h-4 w-4" /> Get Certified — Enroll Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
