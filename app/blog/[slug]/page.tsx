import { blogPosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Twitter, Facebook, Linkedin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);
    return {
        title: `${post?.title || "Blog"} | EduSpring`,
        description: post?.excerpt || "Read our latest insights on technology and education.",
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen pt-32 pb-24 bg-white">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>

                <Badge className="bg-indigo-600 mb-6 font-bold">{post.category}</Badge>

                <h1 className="text-3xl sm:text-5xl font-bold font-outfit text-slate-900 leading-tight mb-8">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between py-6 border-y border-slate-100 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{post.author}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1 font-medium"><Calendar className="h-3 w-3" /> {post.date}</span>
                                <span className="flex items-center gap-1 font-medium"><Clock className="h-3 w-3" /> {post.readTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Twitter className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Facebook className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><Linkedin className="h-4 w-4" /></Button>
                    </div>
                </div>

                <div className="aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-indigo-100/50">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed font-inter">
                    <p className="text-xl font-medium text-slate-900 mb-8 leading-snug">
                        {post.excerpt}
                    </p>
                    <div className="space-y-6">
                        <p>
                            The field of education is undergoing a seismic shift. As we navigate through 2026, Artificial Intelligence has transitioned from a futuristic concept to a fundamental pillar of modern learning environments. This transformation is not just about automation; it's about personalization, accessibility, and the empowerment of both students and educators.
                        </p>
                        <h2 className="text-2xl font-bold font-outfit text-slate-900 mt-12 mb-4">Personalized Learning Paths</h2>
                        <p>
                            One of the most significant impacts of AI is its ability to create hyper-personalized learning experiences. Traditional "one-size-fits-all" approaches are being replaced by adaptive systems that analyze a student's strengths, weaknesses, and learning pace in real-time.
                        </p>
                        <blockquote className="border-l-4 border-indigo-600 pl-6 my-8 italic text-slate-900 font-medium text-xl">
                            "AI doesn't replace teachers; it provides them with the tools to become more effective mentors by offloading routine tasks and providing deep insights into student progress."
                        </blockquote>
                        <p>
                            Furthermore, AI is breaking down geographical and socio-economic barriers. Virtual tutors available 24/7 and AI-driven translation tools are making high-quality education accessible to millions who previously lacked such opportunities.
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-12 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-3xl p-10 text-center">
                        <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-4">Subscribe to our Newsletter</h3>
                        <p className="text-slate-600 mb-8 max-w-sm mx-auto">Get the latest insights delivered straight to your inbox monthly.</p>
                        <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="flex-grow h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
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
