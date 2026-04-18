"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, FileText, Lock } from "lucide-react";

interface SyllabusModule {
    title: string;
    lessons: string[];
}

interface CourseSyllabusProps {
    syllabus: SyllabusModule[];
}

export default function CourseSyllabus({ syllabus }: CourseSyllabusProps) {
    if (!syllabus || syllabus.length === 0) {
        return (
            <div className="py-12 text-center text-slate-500">
                Syllabus details are being updated. Check back soon!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-6">Course Syllabus</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
                {syllabus.map((module, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-4 bg-white shadow-sm overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4">
                            <span className="text-left font-semibold text-slate-800">{module.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                            <ul className="space-y-3">
                                {module.lessons.map((lesson, lIndex) => (
                                    <li key={lIndex} className="flex items-center justify-between text-slate-600 text-sm py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle className="h-4 w-4 text-indigo-500" />
                                            {lesson}
                                        </div>
                                        {lIndex > 0 ? (
                                            <Lock className="h-3 w-3 text-slate-400" />
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Preview</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
