"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Resource {
    id: string;
    title: string;
    slug: string;
    featureImage: string | null;
    publishedAt: string;
    type?: string;
}

interface Props {
    title: string;
    description: string;
    resources: Resource[];
    loading: boolean;
    fetchData: (page: number) => void;
    pagination?: {
        page: number;
        totalPages: number;
    };
    type: "blog" | "tutorial" | "interview-question";
}

export default function ResourceListing({
    title,
    description,
    resources,
    loading,
    fetchData,
    pagination,
    type
}: Props) {
    useEffect(() => {
        fetchData(1);
    }, []);

    const getLink = (slug: string) => {
        return `/${type === 'blog' ? 'blog' : type + 's'}/${slug}`;
    };

    return (
        <main className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold font-outfit text-slate-900 sm:text-5xl">{title}</h1>
                    <p className="mt-6 text-lg text-slate-600 leading-relaxed">{description}</p>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
                        ))}
                    </div>
                )}

                {!loading && resources.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No resources found.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Card className="overflow-hidden h-full border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                <Link href={getLink(item.slug)}>
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={item.featureImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80"}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-indigo-600 font-bold capitalize">{type.replace('-', ' ')}</Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pt-6">
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>5 min read</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-outfit group-hover:text-indigo-600 transition-colors leading-tight">
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mt-6 flex items-center text-indigo-600 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                                            Read More <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={pagination.page === 1}
                            onClick={() => {
                                fetchData(pagination.page - 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-10 h-10 p-0 rounded-xl"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                            {(() => {
                                const delta = 2;
                                const range = [];
                                for (
                                    let i = Math.max(1, pagination.page - delta);
                                    i <= Math.min(pagination.totalPages, pagination.page + delta);
                                    i++
                                ) {
                                    range.push(i);
                                }
                                return range.map((i) => (
                                    <Button
                                        key={i}
                                        variant={pagination.page === i ? "default" : "outline"}
                                        onClick={() => {
                                            fetchData(i);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 p-0 rounded-xl ${pagination.page === i ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" : ""}`}
                                    >
                                        {i}
                                    </Button>
                                ));
                            })()}
                        </div>

                        <Button
                            variant="outline"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => {
                                fetchData(pagination.page + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-10 h-10 p-0 rounded-xl"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
