import { courses } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import CourseBanner from "@/components/courses/CourseBanner";
import CourseContentPanel from "@/components/courses/CourseContentPanel";
import PlacementModule from "@/components/home/PlacementModule";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const course = courses.find((c) => c.slug === slug);
    return {
        title: `${course?.title || "Course"} | OnlineITGuru`,
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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Banner */}
            <CourseBanner course={course} />

            {/* CareStack-style Left Nav + Right Content Panel */}
            <CourseContentPanel course={course} />

            <PlacementModule />
        </div>
    );
}
