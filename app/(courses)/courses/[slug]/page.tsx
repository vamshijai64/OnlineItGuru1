import { courses } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CourseBanner from "@/components/courses/CourseBanner";
import CourseSyllabus from "@/components/courses/CourseSyllabus";
import ToolsCovered from "@/components/courses/ToolsCovered";
import AnalyticsModule from "@/components/courses/AnalyticsModule";
import PlacementModule from "@/components/home/PlacementModule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const course = courses.find((c) => c.slug === slug);
    return {
        title: `${course?.title || "Course"} | EduSpring`,
        description: course?.description || "Explore our career-transforming courses.",
    };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = courses.find((c) => c.slug === slug);

    if (!course) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-16">
            <CourseBanner course={course} />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-16">

                        <section id="overview" className="space-y-6">
                            <h2 className="text-2xl font-bold font-outfit text-slate-900">Course Overview</h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-8">
                                <p>
                                    This intensive training program is designed to take you from a beginner to a job-ready professional.
                                    Developed by industry veterans, the curriculum covers everything from core fundamentals to advanced architectural patterns.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>Comprehensive curriculum with real-world case studies</li>
                                    <li>Hands-on projects to build your professional portfolio</li>
                                    <li>Personalized mentorship from industry experts</li>
                                    <li>Dedicated career support and placement assistance</li>
                                </ul>
                            </div>
                        </section>

                        <Tabs defaultValue="syllabus" className="w-full">
                            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-8 overflow-x-auto">
                                <TabsTrigger value="syllabus" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-8 py-4 font-bold">
                                    Syllabus
                                </TabsTrigger>
                                <TabsTrigger value="projects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-8 py-4 font-bold">
                                    Projects
                                </TabsTrigger>
                                <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-8 py-4 font-bold">
                                    Analytics
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="syllabus" className="mt-0">
                                <CourseSyllabus syllabus={course.syllabus} />
                            </TabsContent>

                            <TabsContent value="projects" className="mt-0">
                                <div className="p-8 border rounded-2xl bg-slate-50 text-center">
                                    <h3 className="text-lg font-bold mb-2">Build 5+ Industry Grade Projects</h3>
                                    <p className="text-slate-500">From concept to deployment, you&apos;ll build real-world applications that get you noticed by recruiters.</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="analytics" className="mt-0">
                                <AnalyticsModule />
                            </TabsContent>
                        </Tabs>

                        <ToolsCovered />

                        <section id="faq" className="space-y-6 border-t pt-12">
                            <h2 className="text-2xl font-bold font-outfit text-slate-900">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-white border rounded-xl">
                                    <p className="font-bold text-slate-900">Who is this course for?</p>
                                    <p className="text-slate-600 text-sm mt-2">Anyone looking to start or advance their career in this field. We start from basics and go all the way to advanced concepts.</p>
                                </div>
                                <div className="p-4 bg-white border rounded-xl">
                                    <p className="font-bold text-slate-900">Do you offer placement assistance?</p>
                                    <p className="text-slate-600 text-sm mt-2">Yes, our Hiring & Springs module provides 100% placement support, including resume building, mock interviews, and direct referrals.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="lg:block hidden">
                        <div className="sticky top-24 space-y-8">
                            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-4">Certification</h3>
                                <div className="h-40 w-full bg-indigo-200 rounded-lg flex items-center justify-center text-indigo-400 font-bold border-2 border-dashed border-indigo-300">
                                    Certificate Mockup
                                </div>
                                <p className="text-xs text-indigo-600 mt-4 text-center">Get industry-recognized certification upon completion.</p>
                            </div>

                            <div className="p-6 bg-slate-900 rounded-2xl text-white">
                                <h3 className="font-bold mb-4">Next Cohort</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Date</span>
                                        <span className="font-bold">March 15, 2026</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Capacity</span>
                                        <span className="font-bold">Last 5 Seats</span>
                                    </div>
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 mt-4">
                                        Book Seat
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <PlacementModule />
        </div>
    );
}
