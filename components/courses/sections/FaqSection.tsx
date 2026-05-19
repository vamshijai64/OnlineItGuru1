"use client";

import { HelpCircle } from "lucide-react";
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

export default function FaqSection({ course, sections }: { course: CourseDetail; sections: CourseSection[] }) {
    const faqSection = sections.find(s => s.title.toLowerCase().includes('faq'));
    const rawFaqs = parseSectionContent(faqSection);
    // Filter out uninitialized or empty FAQs
    const dynamicFaqs = rawFaqs.filter((f: any) => {
        if (!f) return false;
        const q = f.itemTitle || f.title;
        const a = f.itemDescription || f.description;
        return (q && String(q).trim() !== "") || (a && String(a).trim() !== "");
    });

    const faqs = dynamicFaqs.length > 0 ? dynamicFaqs.map((f: any) => ({ q: f.itemTitle || f.title, a: f.itemDescription || f.description })) : [
        { q: "Who is this course for?", a: "Anyone looking to start or advance their career. We go from complete basics to advanced real-world applications." },
        { q: "Do you offer placement assistance?", a: "Yes — 100% placement support including resume building, mock interviews, and direct recruiter referrals." },
        { q: "How long is the course access?", a: "You get lifetime access to all videos, resources, and future updates — even after course completion." },
        { q: "Is there a money-back guarantee?", a: "Absolutely. We offer a 14-day, no-questions-asked refund if you're not satisfied." },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Frequently Asked Questions</h2>
                <p className="text-sm text-slate-500 mt-1">Quick answers to common questions</p>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq: any, i: number) => (
                    <AccordionItem key={i} value={`faq-${i}`}
                        className="border border-slate-200 rounded-2xl px-5 bg-white shadow-sm hover:border-indigo-200 transition-colors overflow-hidden">
                        <AccordionTrigger className="hover:no-underline py-4 text-left font-semibold text-slate-800 gap-3">
                            <span className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                                {faq.q}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-9 text-slate-600 leading-7">
                            <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
