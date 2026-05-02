"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Twitter, Facebook, Linkedin } from "lucide-react";
import Link from "next/link";
import { useHomeStore } from "@/store/homeStore";
import { Button } from "@/components/ui/button";

interface Props {
    slug: string;
    type: "blog" | "tutorial" | "interview-question";
}

export default function ResourceDetail({ slug, type }: Props) {
    const fetchResourceBySlug = useHomeStore((s) => s.fetchResourceBySlug);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchResourceBySlug(type === 'blog' ? 'blogs' : type + 's', slug);
            setPost(data);
            setLoading(false);
        };
        load();
    }, [slug, type]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h1 className="text-2xl font-bold">Resource not found</h1>
                <Link href={`/${type === 'blog' ? 'blog' : type + 's'}`} className="text-indigo-600 hover:underline mt-4 inline-block">
                    Back to list
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen pt-32 pb-24 bg-white">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <Link
                    href={`/${type === 'blog' ? 'blog' : type + 's'}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to {type.replace('-', ' ')}s
                </Link>

                <Badge className="bg-indigo-600 mb-6 font-bold capitalize">{type.replace('-', ' ')}</Badge>

                <h1 className="text-3xl sm:text-5xl font-bold font-outfit text-slate-900 leading-tight mb-8">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                           IT
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">OnlineITGuru Expert</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1 font-medium"><Calendar className="h-3 w-3" /> {new Date(post.publishedAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 font-medium"><Clock className="h-3 w-3" /> 5 min read</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Twitter className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Facebook className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Linkedin className="h-4 w-4" /></Button>
                    </div>
                </div>

                {post.featureImage && (
                    <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-indigo-100/50">
                        <img
                            src={post.featureImage.startsWith('http') ? post.featureImage : `http://13.233.34.177:3000/${post.featureImage}`}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div 
                    className="prose prose-lg max-w-none text-slate-600 leading-relaxed font-inter"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-16 pt-12 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-3xl p-10 text-center">
                        <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-4">Subscribe to our Newsletter</h3>
                        <p className="text-slate-600 mb-8 max-w-sm mx-auto">Get the latest tech updates delivered straight to your inbox.</p>
                        <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="flex-grow h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-sm"
                                required
                            />
                            <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-100">Join Now</Button>
                        </form>
                    </div>
                </div>
            </div>
        </article>
    );
}
