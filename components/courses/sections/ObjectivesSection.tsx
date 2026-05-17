"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CourseSection } from "@/store/homeStore";

function parseContent(contentStr: string) {
    try {
        return JSON.parse(contentStr);
    } catch (e) {
        return [];
    }
}

export default function ObjectivesSection({ sections }: { sections: CourseSection[] }) {
    const section = sections.find(s => s.title.toLowerCase().includes('objectives'));
    const items = section ? parseContent(section.content) : [];

    if (items.length === 0) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">{section?.title || "Course Objectives"}</h2>
            <Accordion type="single" collapsible className="space-y-3">
                {items.map((item: any, i: number) => (
                    <AccordionItem key={i} value={`obj-${i}`}
                        className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800">
                            {item.itemTitle}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-slate-600 leading-7">
                            <div dangerouslySetInnerHTML={{ __html: item.itemDescription }} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
