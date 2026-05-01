"use client";

import { useHomeStore, CourseSection } from "@/store/homeStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, PlayCircle, BookOpen, Star, HelpCircle, FileText, Layout, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper to parse JSON content safely
function parseContent(contentStr: string) {
    try {
        return JSON.parse(contentStr);
    } catch (e) {
        return [];
    }
}

export default function CourseDynamicSections() {
    const sections = useHomeStore((s) => s.courseSections);
    const loading = useHomeStore((s) => s.loading.courseSections);

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 bg-gray-200 rounded-2xl w-full" />
                ))}
            </div>
        );
    }

    if (!sections || sections.length === 0) {
        return null;
    }

    // Sort sections by position
    const sortedSections = [...sections].sort((a, b) => a.position - b.position);

    return (
        <div className="space-y-12">
            {sortedSections.map((section) => (
                <section key={section.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-outfit pb-2 border-b-2 border-purple-100 inline-block">
                        {section.title}
                    </h2>
                    <SectionRenderer section={section} />
                </section>
            ))}
        </div>
    );
}

function SectionRenderer({ section }: { section: CourseSection }) {
    const items = parseContent(section.content);

    if (!items || items.length === 0) return null;

    switch (section.view) {
        case "title-description":
            return <TitleDescriptionView items={items} />;
        case "title-description-with-icon":
            return <TitleDescriptionWithIconView items={items} />;
        case "schedule-card-list":
            return <ScheduleCardListView items={items} />;
        case "rich-text-card-list":
            return <RichTextCardListView items={items} />;
        // Add more views here if needed based on API
        default:
            return <TitleDescriptionView items={items} />;
    }
}

function TitleDescriptionView({ items }: { items: any[] }) {
    return (
        <Accordion type="single" collapsible className="space-y-3 w-full">
            {items.map((item, index) => (
                <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="border border-slate-200 rounded-xl px-5 bg-white shadow-sm overflow-hidden"
                >
                    <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800">
                        {item.itemTitle}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-slate-600 leading-relaxed">
                        <div 
                            className="prose prose-sm max-w-none text-slate-600 marker:text-slate-400"
                            dangerouslySetInnerHTML={{ __html: item.itemDescription }} 
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

function TitleDescriptionWithIconView({ items }: { items: any[] }) {
    return (
        <div className="grid sm:grid-cols-2 gap-5 w-full">
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4"
                >
                    <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100 text-purple-600">
                        {item.icon ? (
                            <i className={cn(item.icon, "text-lg")} aria-hidden="true"></i>
                        ) : (
                            <CheckCircle2 className="h-5 w-5" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-2">{item.itemTitle}</h4>
                        <div 
                            className="prose prose-sm max-w-none text-slate-500 marker:text-slate-400 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: item.itemDescription }} 
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ScheduleCardListView({ items }: { items: any[] }) {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-start gap-4"
                >
                    <div className="flex justify-between w-full items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                            {item.week_label}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-slate-800">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="font-bold">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium">{item.time}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function RichTextCardListView({ items }: { items: any[] }) {
    const colorMap = [
        {
            flagBg: "bg-blue-500",
            title: "LIVE ONLINE TRAINING",
            btnText: "Get Schedule",
            btnClass: "bg-red-50 text-red-600 hover:bg-red-100",
        },
        {
            flagBg: "bg-sky-500",
            title: "CORPORATE TRAINING",
            btnText: "Explore Business Plans",
            btnClass: "bg-sky-50 text-sky-600 hover:bg-sky-100",
        }
    ];

    return (
        <div className="grid md:grid-cols-2 gap-8 w-full">
            {items.map((item, index) => {
                const style = colorMap[index % colorMap.length];
                
                return (
                    <div 
                        key={index} 
                        className="bg-white rounded-sm border border-slate-200 shadow-sm flex flex-col relative"
                    >
                        <div className={`absolute top-0 left-0 px-4 py-1.5 text-sm font-semibold text-white ${style.flagBg}`}>
                            {item.flag}
                        </div>
                        <div className="p-8 pt-16 flex-1">
                            <h3 className="text-xl font-normal text-center text-slate-600 mb-8 uppercase tracking-wide">
                                {style.title}
                            </h3>
                            <div 
                                className="text-slate-800 text-sm leading-relaxed [&_ul]:list-none [&_ul]:space-y-4 [&_li]:relative [&_li]:pl-5 [&_li::before]:content-['>'] [&_li::before]:absolute [&_li::before]:left-0 [&_li::before]:text-sky-500 [&_li::before]:font-bold"
                                dangerouslySetInnerHTML={{ __html: item.htmlText }} 
                            />
                        </div>
                        <div className="p-8 pt-0 mt-auto flex justify-center">
                            <button className={`w-3/4 py-3 font-medium text-sm transition-colors ${style.btnClass}`}>
                                {style.btnText}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
