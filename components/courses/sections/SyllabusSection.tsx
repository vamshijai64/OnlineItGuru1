"use client";

import { PlayCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
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

export default function SyllabusSection({ course, sections }: { course: CourseDetail; sections: CourseSection[] }) {
    // Find the specific syllabus section from API
    const syllabusApiSection = sections.find(s =>
        s.view === 'title-rich-description' ||
        s.title.toLowerCase().includes('syllabus')
    );

    const rawModules = parseSectionContent(syllabusApiSection);
    // Filter out uninitialized or placeholder modules
    const dynamicModules = rawModules.filter((mod: any) => {
        if (!mod) return false;
        const title = mod.itemTitle || mod.title;
        const desc = mod.itemDescription || mod.description;
        return (title && String(title).trim() !== "") || (desc && String(desc).trim() !== "");
    });

    // If no dynamic sections, use mock data
    const displayModules = dynamicModules.length > 0 ? dynamicModules : [
        { itemTitle: "Module 1: Fundamentals & Core Concepts", itemDescription: "<ul><li>Introduction & Environment Setup</li><li>Core Architecture & Patterns</li><li>Advanced Concepts Deep Dive</li></ul>" },
        { itemTitle: "Module 2: Hands-On Implementation", itemDescription: "<ul><li>Real Project Setup</li><li>Building Key Features</li><li>Testing & Debugging</li></ul>" },
    ];

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-outfit">Course Syllabus</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {displayModules.length} modules · {course.duration || "40+ Hours"}
                    </p>
                </div>
            </div>
            <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
                {displayModules.map((mod: any, i: number) => (
                    <AccordionItem key={i} value={`item-${i}`}
                        className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4 gap-3">
                            <div className="flex items-center gap-3 text-left">
                                <span className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className="font-semibold text-slate-800">{mod.itemTitle}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-10">
                            {(() => {
                                const lessons = mod.itemDescription?.match(/<li>(.*?)<\/li>/g)?.map((l: string) => l.replace(/<\/?li>/g, '')) || [];
                                if (lessons.length > 0) {
                                    return (
                                        <ul className="space-y-3">
                                            {lessons.map((lesson: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 group">
                                                    <PlayCircle className="h-4 w-4 text-indigo-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 mt-0.5" />
                                                    <span dangerouslySetInnerHTML={{ __html: lesson }} />
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                return (
                                    <div
                                        className="prose prose-sm max-w-none text-slate-600"
                                        dangerouslySetInnerHTML={{ __html: mod.itemDescription }}
                                    />
                                );
                            })()}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
