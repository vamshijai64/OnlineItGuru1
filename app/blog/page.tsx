"use client";

import { blogPosts } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogListing() {
    return (
        <main className="min-h-screen pt-32 pb-24 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold font-outfit text-slate-900 sm:text-5xl"> Insights & Resources </h1>
                    <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                        Stay updated with the latest trends in technology, career growth, and educational innovation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden h-full border-none shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-indigo-600 font-bold">{post.category}</Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pt-6">
                                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{post.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-xl font-outfit group-hover:text-indigo-600 transition-colors leading-tight">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-6 flex items-center text-indigo-600 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
                                            Read More <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
