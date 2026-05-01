"use client";

import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import CreateCourseForm from "./CreateCourseForm";
import { useAdminStore } from "@/store/adminStore";
import { useState } from "react";

export default function CourseManagement({ onViewSections }: { onViewSections?: (id: string, title: string) => void }) {
    const { adminCourses, fetchAllCourses, coursePagination, isLoading } = useAdminStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handlePageChange = (newPage: number) => {
        fetchAllCourses(newPage);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
                    <p className="text-slate-500">Manage, edit, and create new training programs.</p>
                </div>
                
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <Plus className="h-4 w-4" />
                            New Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>Create New Course</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to launch a new course on the platform.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateCourseForm onSuccess={() => {
                            setIsCreateModalOpen(false);
                            fetchAllCourses();
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Courses</CardTitle>
                    <CardDescription>A list of all courses currently on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Course Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Learners</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminCourses.map((course: any) => (
                                        <TableRow key={course.id}>
                                            <TableCell className="font-bold text-slate-900">{course.title}</TableCell>
                                            <TableCell>{course.category?.title || 'Uncategorized'}</TableCell>
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
                                    {adminCourses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                                No courses found. Create your first course!
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {coursePagination && coursePagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{coursePagination.page}</span> of <span className="font-bold text-slate-900">{coursePagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(coursePagination.page - 1)}
                                            disabled={coursePagination.page === 1}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(coursePagination.page + 1)}
                                            disabled={coursePagination.page === coursePagination.totalPages}
                                            className="gap-1"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
