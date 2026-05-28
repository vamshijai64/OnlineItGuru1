"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useHomeStore, Blog } from "@/store/homeStore";

// ─── Categories Configuration (for matching category breadcrumbs) ───
const CATEGORIES = [
    { name: "Data Science & Business Analytics", keywords: ["data", "analytics", "power bi", "bi", "microstrategy", "micro strategy", "finance", "fiance", "statistics", "tableau"] },
    { name: "AI & Machine Learning", keywords: ["ai", "artificial intelligence", "machine learning", "generative", "genai", "deep learning", "nlp", "neural"] },
    { name: "Project Management", keywords: ["project management", "pmp", "pm", "agile", "scrum", "kanban"] },
    { name: "Cyber Security", keywords: ["security", "cyber", "penetration", "hacking", "firewall", "auth"] },
    { name: "Cloud Computing", keywords: ["cloud", "gcp", "gce", "gke", "aws", "azure", "kubernetes", "docker"] },
    { name: "DevOps", keywords: ["devops", "ci/cd", "terraform", "ansible", "jenkins", "pipeline"] },
    { name: "Business and Leadership", keywords: ["business", "leadership", "workday", "hr", "career"] },
    { name: "Quality Management", keywords: ["quality", "qa", "testing", "selenium", "manual testing"] },
    { name: "Software Development", keywords: ["python", "programming", "coding", "pega", "mulesoft", "api", "software", "development", "java", "javascript", "react", "nextjs"] },
    { name: "Agile and Scrum", keywords: ["scrum", "agile"] },
    { name: "IT Service and Architecture", keywords: ["itil", "architecture", "togaf", "service management"] },
    { name: "Digital Marketing", keywords: ["marketing", "seo", "sem", "social media", "adwords"] },
    { name: "Big Data", keywords: ["big data", "hadoop", "spark", "hive", "kafka", "cassandra"] }
];

function getBlogCategoryName(blog: Blog): string {
    const title = blog.title.toLowerCase();
    const keywords = (blog.keywords || "").toLowerCase();
    const titleCombined = `${title} ${keywords}`;

    // 1. Prioritize Title & Keywords match
    for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => titleCombined.includes(kw))) {
            return cat.name;
        }
    }

    // 2. Fallback: Search the content body
    const contentText = (blog.content || "").toLowerCase().substring(0, 1000);
    for (const cat of CATEGORIES) {
        if (cat.keywords.some(kw => contentText.includes(kw))) {
            return cat.name;
        }
    }

    return "Software Development"; // fallback
}

interface Props {
    slug: string;
    type: "blog" | "tutorial" | "interview-question";
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export default function ResourceDetail({ slug, type }: Props) {
    const fetchResourceBySlug = useHomeStore((s) => s.fetchResourceBySlug);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState<TocItem[]>([]);
    const [processedContent, setProcessedContent] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await fetchResourceBySlug(type === 'blog' ? 'blogs' : type + 's', slug);
            setPost(data);
            setLoading(false);
        };
        load();
    }, [slug, type]);

    // Parse headers on client-side to generate TOC dynamic links
    useEffect(() => {
        if (post && post.content) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(post.content, "text/html");
            const headings = doc.querySelectorAll("h2, h3, h4, h5, h6");
            const tocList: TocItem[] = [];

            headings.forEach((heading, idx) => {
                const id = `heading-${idx}`;
                heading.setAttribute("id", id);
                let level = 2;
                if (heading.tagName === "H3") level = 3;
                else if (heading.tagName === "H4") level = 4;
                else if (heading.tagName === "H5") level = 5;
                else if (heading.tagName === "H6") level = 6;

                const text = (heading.textContent || "").trim();
                if (text) {
                    tocList.push({
                        id,
                        text,
                        level
                    });
                }
            });

            setToc(tocList);
            setProcessedContent(doc.body.innerHTML);
        } else if (post) {
            setProcessedContent(post.content || "");
        }
    }, [post]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 text-center bg-slate-50">
                <h1 className="text-2xl font-bold">Resource not found</h1>
                <Link href={`/${type === 'blog' ? 'blog' : type + 's'}`} className="text-indigo-600 hover:underline mt-4 inline-block">
                    Back to list
                </Link>
            </div>
        );
    }

    const categoryName = getBlogCategoryName(post);

    return (
        <main className="min-h-screen pt-32 pb-24 bg-slate-50">
            {/* ── Breadcrumbs Navigation Bar ── */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8">
                <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <Link 
                        href={type === 'blog' ? '/blog' : type === 'tutorial' ? '/tutorials' : '/interview-questions'} 
                        className="hover:text-indigo-600 transition-colors capitalize"
                    >
                        {type === 'blog' ? 'Resources' : type.replace('-', ' ') + 's'}
                    </Link>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-400 truncate max-w-[200px] sm:max-w-none">{categoryName}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                    <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">{post.title}</span>
                </nav>
            </div>

            {/* ── Two Column Layout ── */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 flex gap-8 items-start justify-center">
                
                {/* 1. Left Column: Sticky Table of Contents */}
                {toc.length > 0 && (
                    <aside className="w-60 flex-shrink-0 hidden xl:block sticky top-28 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-950 mb-4 border-b border-slate-100 pb-2">
                            Table of Contents
                        </h3>
                        <nav className="space-y-2.5">
                            {toc.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        const el = document.getElementById(item.id);
                                        if (el) {
                                            const yOffset = -100; 
                                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                        }
                                    }}
                                    className={`block text-left text-[13px] leading-relaxed transition-colors font-medium ${
                                        item.level === 3 
                                            ? "pl-4 text-slate-500 hover:text-indigo-600" 
                                            : item.level === 4
                                            ? "pl-6 text-slate-400 hover:text-indigo-600 text-xs"
                                            : item.level >= 5
                                            ? "pl-8 text-slate-400 hover:text-indigo-600 text-xs font-normal"
                                            : "text-slate-700 hover:text-indigo-600"
                                    }`}
                                >
                                    {item.text}
                                </button>
                            ))}
                        </nav>
                    </aside>
                )}

                {/* 2. Main Column: Details & Content */}
                <article className="flex-grow max-w-4xl bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-10 shadow-sm overflow-hidden">
                    
                    {/* Header */}
                    <div className="space-y-4 mb-6">
                        <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border border-indigo-200/60 font-bold text-xs uppercase px-3 py-1">
                            {categoryName}
                        </Badge>
                        <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-slate-950 leading-snug">
                            {post.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-sm">
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Last updated on {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Share / Copy */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-500">Copy Link:</span>
                                    <button 
                                        onClick={copyToClipboard}
                                        title="Copy Link"
                                        className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors border border-slate-150"
                                    >
                                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Image */}
                    {post.featureImage && (
                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 bg-slate-100 border border-slate-200/60">
                            <img 
                                src={post.featureImage} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content HTML */}
                    <div 
                        className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-inter 
                                   prose-headings:font-outfit prose-headings:text-slate-900 prose-headings:font-bold 
                                   prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                   prose-p:mb-5 prose-p:leading-8 prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                   prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5 prose-li:mb-2"
                        dangerouslySetInnerHTML={{ __html: processedContent || "<p><i>Content loading...</i></p>" }}
                    />
                </article>
            </div>
        </main>
    );
}