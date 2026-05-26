"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Twitter, Facebook, Linkedin, Copy, Eye, Check, ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { useHomeStore, Blog } from "@/store/homeStore";
import { Button } from "@/components/ui/button";

// ─── Categories Configuration (for matching category breadcrumbs & promos) ───
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

function getBlogCategoryName(blog: any): string {
    const title = (blog.title || "").toLowerCase();
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

// ─── Course Promo Configuration Map ───
const getPromoConfig = (category: string) => {
    if (category === "Data Science & Business Analytics") {
        return {
            title: "Data Scientist",
            duration: "11 months",
            bullets: [
                "Earn an industry-recognized Data Science Master's certificate from Simplilearn",
                "Learn through an American curriculum covering Python, SQL, advanced statistics, ML, DL and more"
            ],
            stats: [
                { value: "28%", label: "Annual Job Growth By 2026" },
                { value: "11.5 M", label: "Projected New Jobs For Data Science By 2026" }
            ],
            courseLink: "/courses/data-science-master-program"
        };
    } else if (category === "AI & Machine Learning") {
        return {
            title: "AI & Machine Learning Engineer",
            duration: "12 months",
            bullets: [
                "Earn an industry-recognized AI Master's certificate from Simplilearn",
                "Master Deep Learning, NLP, Computer Vision, Generative AI, LLMs and prompt engineering"
            ],
            stats: [
                { value: "35%", label: "Growth in AI Roles Globally" },
                { value: "1.2 M", label: "New Jobs Expected By 2026" }
            ],
            courseLink: "/courses/artificial-intelligence"
        };
    } else if (category === "Cloud Computing" || category === "DevOps") {
        return {
            title: "Cloud & DevOps Architect",
            duration: "9 months",
            bullets: [
                "Master AWS, Azure, GCP, and Kubernetes cloud infrastructure orchestration",
                "Design fully automated CI/CD pipelines with Terraform, Ansible, Docker & Jenkins"
            ],
            stats: [
                { value: "45%", label: "Increase in Cloud Infrastructure Demand" },
                { value: "100K+", label: "Active Openings Worldwide" }
            ],
            courseLink: "/courses/cloud-computing"
        };
    } else {
        return {
            title: "Full Stack Software Developer",
            duration: "10 months",
            bullets: [
                "Master React, Next.js, Node.js, databases, and full stack systems architecture",
                "Build a production-ready portfolio of 10+ web apps with 1-on-1 mentorship"
            ],
            stats: [
                { value: "24%", label: "Job Growth in Software Roles" },
                { value: "200+", label: "Hiring Partner Sprints" }
            ],
            courseLink: "/courses"
        };
    }
};

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
    const author = post.title.toLowerCase().includes("generative") ? "Aditya Kumar" : "OnlineITGuru Expert";
    const views = post.title.toLowerCase().includes("generative") ? "239,571" : "185,420";
    const promo = getPromoConfig(categoryName);

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

            {/* ── Three Column Layout ── */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 flex gap-8 items-start">
                
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

                {/* 2. Center Column: Blog Details & Content */}
                <article className="flex-grow max-w-3xl bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-10 shadow-sm overflow-hidden">
                    
                    {/* Header */}
                    <div className="space-y-4 mb-6">
                        <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border border-indigo-200/60 font-bold text-xs uppercase px-3 py-1">
                            {categoryName}
                        </Badge>
                        <h1 className="text-2xl sm:text-4xl font-extrabold font-outfit text-slate-950 leading-snug">
                            {post.title}
                        </h1>

                        {/* Author & Meta row */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs">
                                    {author.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">By {author}</p>
                                    <p className="text-xs text-slate-400">
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
                                    <span className="text-xs font-semibold text-slate-500">Share This Article:</span>
                                    <button 
                                        onClick={copyToClipboard}
                                        title="Copy Link"
                                        className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors border border-slate-150"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                    {copied && <span className="text-xs font-semibold text-green-600 animate-pulse">Copied!</span>}
                                </div>

                                {/* Eye Views Count */}
                                <div className="flex items-center gap-1.5 text-slate-500">
                                    <Eye className="h-4 w-4" />
                                    <span className="text-xs font-bold font-inter">{views}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Image */}
                    {post.featureImage && (
                        <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-sm">
                            <img
                                src={post.featureImage.startsWith('http') ? post.featureImage : `http://13.233.34.177:3000/${post.featureImage}`}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Blog Content HTML */}
                    <div 
                        className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-inter 
                                   prose-headings:font-outfit prose-headings:text-slate-900 prose-headings:font-bold 
                                   prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                   prose-p:mb-5 prose-p:leading-8 prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                   prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5 prose-li:mb-2"
                        dangerouslySetInnerHTML={{ __html: processedContent || "<p><i>Content loading...</i></p>" }}
                    />

                    {/* ── Inline "Become a Professional" Course Promotion Banner ── */}
                    <div className="mt-12 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8">
                        <h3 className="text-xl font-bold font-outfit text-slate-950 mb-2">
                            Become a {categoryName} Professional
                        </h3>
                        
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {promo.stats.map((stat, i) => (
                                <div key={i}>
                                    <p className="text-xl sm:text-2xl font-extrabold text-blue-700 font-outfit">{stat.value}</p>
                                    <p className="text-xs text-slate-500 font-semibold leading-tight">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Promo Program Card */}
                        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between mb-6">
                            <div className="flex gap-4 items-start">
                                <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-extrabold flex-shrink-0 text-sm">
                                    ITG
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-900">{promo.title}</h4>
                                    <ul className="space-y-1.5">
                                        {promo.bullets.map((bullet, idx) => (
                                            <li key={idx} className="flex gap-2 text-xs text-slate-500 leading-normal items-start">
                                                <Check className="h-3.5 w-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                                    📅 {promo.duration}
                                </span>
                                <Link href={promo.courseLink} className="w-full">
                                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 shadow-md shadow-blue-100">
                                        View Program
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div className="space-y-4 pt-4 border-t border-slate-200/60">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Here's what learners are saying regarding our programs:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Student" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">A. Anthony Davis</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Software Engineer</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        "OnlineITGuru has one of the best programs online to earn real-world skills that are in demand. The LMS was excellent."
                                    </p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Student" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Wendy Kurniawan</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Assistant Director, ACT Gov</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        "The courses comprehensive structure covered essential topics. The career support helped me secure a data role."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Banner Footer CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200/60">
                            <span className="text-xs font-bold text-slate-800">Not sure what you're looking for?</span>
                            <Link href="/courses">
                                <Button variant="outline" className="text-xs font-bold border-blue-600 text-blue-600 hover:bg-blue-50/50">
                                    View all Related Programs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </article>

                {/* 3. Right Column: Sticky Certifications Sidebar */}
                <aside className="w-80 flex-shrink-0 hidden lg:block sticky top-28 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-950">
                            Get Affiliated Certifications
                        </h3>
                        <p className="text-[11px] text-slate-400 font-semibold leading-snug mt-0.5">
                            With Live Class Programs
                        </p>
                    </div>

                    <div className="border border-slate-200/60 rounded-xl p-4 space-y-4 bg-slate-50/40">
                        <div className="flex gap-3 items-center">
                            <div className="h-8 w-8 bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center rounded-lg text-xs">
                                IT
                            </div>
                            <h4 className="text-xs font-bold text-slate-950 leading-tight">
                                {promo.title}
                            </h4>
                        </div>

                        <ul className="space-y-2">
                            {promo.bullets.map((bullet, idx) => (
                                <li key={idx} className="flex gap-2 text-[11px] text-slate-500 leading-relaxed items-start">
                                    <Check className="h-3.5 w-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-200/60 text-[11px] font-bold text-slate-400">
                            <span>📅 {promo.duration}</span>
                            <Link href={promo.courseLink}>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3.5 py-1.5 h-auto shadow-md shadow-blue-100">
                                    View Program
                                </Button>
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}