"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Laptop } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/lib/data";

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
    return (
        <Card className="overflow-hidden group flex flex-col h-full border-slate-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md">
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-indigo-600 hover:bg-indigo-700">{course.category}</Badge>
                </div>
                <div
                    className="w-full h-full bg-slate-100 animate-pulse group-hover:scale-105 transition-transform duration-500"
                    style={{
                        backgroundImage: `url(${course.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            </div>

            <CardHeader className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-bold text-slate-700">{course.rating}</span>
                    <span className="text-xs text-slate-400">({course.reviewsCount} reviews)</span>
                </div>
                <Link href={`/courses/${course.slug}`}>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 font-outfit">
                        {course.title}
                    </h3>
                </Link>
            </CardHeader>

            <CardContent className="p-4 pt-0 flex-grow">
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                        <Laptop className="h-4 w-4" />
                        {course.mode}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-slate-50 mt-auto flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">${course.price}</span>
                    <span className="text-xs text-slate-400 line-through">${course.originalPrice}</span>
                </div>
                <Link href={`/courses/${course.slug}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                        View Course
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
