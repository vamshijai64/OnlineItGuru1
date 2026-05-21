// "use client";

// import { BarChart2, TrendingUp, Zap, Layers } from "lucide-react";
// import { CourseDetail } from "@/store/homeStore";

// export default function ProjectsSection({ course }: { course: CourseDetail }) {
//     const projects = [
//         { title: "Real-Time Data Pipeline", desc: "Build an end-to-end ETL pipeline processing live data streams and visualizing insights.", tags: ["Backend", "Cloud"], icon: BarChart2, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
//         { title: "E-Commerce Analytics Dashboard", desc: "Design and deploy a full-featured sales analytics dashboard with real-time KPI tracking.", tags: ["Frontend", "API"], icon: TrendingUp, bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
//         { title: "AI Recommendation Engine", desc: "Train and deploy a collaborative filtering ML model for personalised product recommendations.", tags: ["ML", "Python"], icon: Zap, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
//         { title: "Cloud-Native Microservices", desc: "Architect, containerise and deploy microservices on Kubernetes with automated CI/CD pipelines.", tags: ["DevOps", "Docker"], icon: Layers, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
//     ];

//     return (
//         <div className="space-y-5">
//             <div className="mb-2">
//                 <h2 className="text-2xl font-bold text-slate-900 font-outfit">Industry-Grade Projects</h2>
//                 <p className="text-sm text-slate-500 mt-1">Build {course.liveProjects || "4+"} real-world projects to power your portfolio</p>
//             </div>
//             <div className="grid sm:grid-cols-2 gap-4">
//                 {projects.map((p, i) => {
//                     const Icon = p.icon;
//                     return (
//                         <div key={i} className={`rounded-2xl border p-6 hover:shadow-lg transition-all group cursor-pointer ${p.border} bg-white`}>
//                             <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${p.bg} ${p.text} group-hover:scale-110 transition-transform`}>
//                                 <Icon className="h-5 w-5" />
//                             </div>
//                             <h4 className="font-bold text-slate-900 mb-2">{p.title}</h4>
//                             <p className="text-sm text-slate-500 leading-6 mb-4">{p.desc}</p>
//                             <div className="flex gap-2 flex-wrap">
//                                 {p.tags.map((t) => (
//                                     <span key={t} className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.bg} ${p.text} border ${p.border}`}>{t}</span>
//                                 ))}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }



"use client";

import { BarChart2, TrendingUp, Zap, Layers, FolderGit2 } from "lucide-react";
import { CourseDetail, CourseSection } from "@/store/homeStore";

const iconMap = [BarChart2, TrendingUp, Zap, Layers];
const colorPresets = [
    { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
    { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" }
];

function parseSectionContent(sec: any) {
    if (!sec) return [];
    try {
        if (sec.content && sec.content.trim() !== "" && sec.content !== "[]") {
            return JSON.parse(sec.content);
        }
    } catch {}
    return [];
}

export default function ProjectsSection({ course, sections=[] }: { course: CourseDetail; sections: CourseSection[] }) {
    // Locate projects section block via title metadata matching
    const projectApiSection = sections.find(s => 
        s.view === 'title-description-card' || 
        s.title?.toLowerCase().includes('projects')
    );

    const dynamicProjects = parseSectionContent(projectApiSection);

    // Fallback default portfolio array if no entries are populated yet
    const fallbackProjects = [
        { itemTitle: "Real-Time Data Pipeline", itemDescription: "Build an end-to-end ETL pipeline processing live data streams and visualizing insights.", tags: "Backend|Cloud" },
        { itemTitle: "E-Commerce Analytics Dashboard", itemDescription: "Design and deploy a full-featured sales analytics dashboard with real-time KPI tracking.", tags: "Frontend|API" },
    ];

    const displayProjects = dynamicProjects.length > 0 ? dynamicProjects : fallbackProjects;

    return (
        <div className="space-y-5">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Industry-Grade Projects</h2>
                <p className="text-sm text-slate-500 mt-1">Build {course.liveProjects || displayProjects.length} real-world projects to power your portfolio</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                {displayProjects.map((p: any, i: number) => {
                    const ProjectIcon = iconMap[i % iconMap.length] || FolderGit2;
                    const stylePreset = colorPresets[i % colorPresets.length];
                    
                    const title = p.itemTitle || p.title || "Capstone Project";
                    const description = p.itemDescription || p.description || "";
                    const projectTags = p.tags ? String(p.tags).split('|') : ["Industry Case Study"];

                    return (
                        <div key={i} className={`rounded-2xl border p-6 hover:shadow-lg transition-all group cursor-pointer ${stylePreset.border} bg-white`}>
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${stylePreset.bg} ${stylePreset.text} group-hover:scale-110 transition-transform`}>
                                <ProjectIcon className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-2 text-sm">{title}</h4>
                            <p className="text-xs text-slate-500 leading-6 mb-4">{description}</p>
                            <div className="flex gap-2 flex-wrap">
                                {projectTags.map((tag: string) => (
                                    <span key={tag} className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${stylePreset.bg} ${stylePreset.text} border ${stylePreset.border}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}