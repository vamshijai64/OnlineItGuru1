// "use client";

// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
// import { CourseSection } from "@/store/homeStore";
// function parseContent(contentStr: string, fallbackTitle: string) {
//     if (!contentStr || contentStr.trim() === "" || contentStr === "[]") return [];
    
//     try {
//         // Attempt clean standard JSON array parse
//         const parsed = JSON.parse(contentStr);
//         if (Array.isArray(parsed)) return parsed;
//     } catch (e) {
//         // Fallback Strategy: Strip bracket wrappers from malformed inputs like [wdwqdwqdwqdwq]
//         const rawText = contentStr.replace(/[\[\]"]/g, "").trim();
//         if (rawText) {
//             return [{
//                 itemTitle: fallbackTitle,
//                 itemDescription: rawText
//             }];
//         }
//     }
//     return [];
// }

// export default function ObjectivesSection({ sections }: { sections: CourseSection[] } }) {
//    const section = sections.find(s => 
//         s.title?.toLowerCase().includes('objectives') || 
//         s.view === 'title-description'
//     );
//     if (!section) return null;
//     const items = section ? parseContent(section.content, section.title) : [];

//     // if (items.length === 0) return null;
//     // If parsing yields nothing, render the fallback text instead of hiding the block
//     const finalDisplayItems = items.length > 0 ? items : [{
//         itemTitle: section.title || "Objectives Overview",
//         itemDescription: typeof section.content === 'string' ? section.content.replace(/[\[\]]/g, "") : "Content description pending update."
//     }];

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-bold text-slate-900 font-outfit">{section?.title || "Course Objectives"}</h2>
//             <Accordion type="single" collapsible className="space-y-3">
//                 {items.map((item: any, i: number) => (
//                     <AccordionItem key={i} value={`obj-${i}`}
//                         className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
//                         <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800">
//                             {item.itemTitle}
//                         </AccordionTrigger>
//                         <AccordionContent className="pb-4 text-slate-600 leading-7">
//                             <div dangerouslySetInnerHTML={{ __html: item.itemDescription }} />
//                         </AccordionContent>
//                     </AccordionItem>
//                 ))}
//             </Accordion>
//         </div>
//     );
// }


"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CourseSection } from "@/store/homeStore";

function parseContent(contentStr: string) {
    if (!contentStr || contentStr === "[]") return [];
    try {
        return JSON.parse(contentStr);
    } catch (e) {
        const cleanStr = contentStr.replace(/[\[\]"]/g, "").trim();
        if (cleanStr) return [{ itemTitle: "Overview Focus", itemDescription: cleanStr }];
        return [];
    }
}

export default function ObjectivesSection({ sections }: { sections: CourseSection[] }) {
    // Safely locate section references using flexible title strings checks
    const section = sections?.find(s => 
        s.title?.toLowerCase().includes('objective') || 
        s.view === 'title-description'
    );

    if (!section) return null;

    const items = parseContent(section.content);
    if (items.length === 0) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">
                {section.title || "Course Objectives"}
            </h2>
            <Accordion type="single" collapsible className="space-y-3" defaultValue="obj-0">
                {items.map((item: any, i: number) => {
                    // Safe fallbacks to unblock structural variations from admin forms builder
                    const headingText = item.itemTitle || item.title || item.undefined || "Objective Details";
                    const descriptiveText = item.itemDescription || item.description || "";

                    return (
                        <AccordionItem key={i} value={`obj-${i}`}
                            className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                            <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800">
                                {headingText}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 text-slate-600 leading-7">
                                <div dangerouslySetInnerHTML={{ __html: descriptiveText }} />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}