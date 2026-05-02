"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { useAdminStore } from "@/store/adminStore";
import { useEffect } from "react";

export default function CategoryCourses({ categorySlug, categoryTitle, onBack, onViewSections }: { categorySlug: string, categoryTitle: string, onBack: () => void, onViewSections?: (id: string, title: string) => void }) {
    const { categoryCourses, fetchCoursesByCategory, isLoading } = useAdminStore();

    useEffect(() => {
        if (categorySlug) {
            fetchCoursesByCategory(categorySlug);
        }
    }, [categorySlug, fetchCoursesByCategory]);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Courses in {categoryTitle}</h1>
                    <p className="text-slate-500">Manage courses belonging to this specific category.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Category Courses</CardTitle>
                    <CardDescription>All active and drafted courses under {categoryTitle}.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Title</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Learners</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categoryCourses.map((course: any) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-bold text-slate-900">{course.title}</TableCell>
                                        <TableCell>₹{course.livePrice}</TableCell>
                                        <TableCell>
                                            <Badge variant={course.status === 'active' ? 'default' : 'outline'} className="capitalize">
                                                {course.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{course.totalLearners}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="mr-2"
                                                onClick={() => onViewSections && onViewSections(course.id, course.title)}
                                            >
                                                View Sections
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categoryCourses.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                            No courses found in this category.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
