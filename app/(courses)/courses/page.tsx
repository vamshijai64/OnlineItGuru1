"use client";

import { useState } from "react";
import { courses } from "@/lib/data";
import CourseCard from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Development", "Data Science", "Design", "Marketing", "Business"];

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredCourses = courses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-outfit">
                            Master Your Future with Our Courses
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            Browse through our comprehensive range of industry-aligned training programs.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search courses..."
                                className="pl-10 h-11"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "ghost"}
                                    size="sm"
                                    className={`rounded-full px-5 ${selectedCategory === category ? "bg-indigo-600 hover:bg-indigo-700" : "text-slate-600"}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>

                        <Button variant="outline" className="gap-2 h-11 w-full lg:w-auto">
                            <SlidersHorizontal className="h-4 w-4" />
                            More Filters
                        </Button>
                    </div>

                    {/* Course Grid */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-semibold text-slate-500">
                                Found <span className="text-slate-900">{filteredCourses.length}</span> courses
                            </p>
                        </div>

                        {filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
                                    <Search className="h-6 w-6 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No courses found</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
                                <Button
                                    variant="link"
                                    className="mt-4 text-indigo-600 font-bold"
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
