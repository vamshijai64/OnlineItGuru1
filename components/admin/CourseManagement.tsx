"use client";

import { Plus, Loader2, ChevronLeft, ChevronRight, Search, Edit, Trash2, BookOpen } from "lucide-react";
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
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import CreateCourseForm from "./CreateCourseForm";
import { useAdminStore } from "@/store/adminStore";
import { useState, useEffect } from "react";
import { AdminCourse } from "@/lib/admin-api";

export default function CourseManagement({ onViewSections }: { onViewSections?: (id: string, title: string) => void }) {
    const { 
        adminCourses, 
        fetchAllCourses, 
        coursePagination, 
        isLoading, 
        adminCategories, 
        fetchCategories,
        fetchCourseById,
        deleteCourse,
        successMessage,
        error,
        clearMessages
    } = useAdminStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Search and Category Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
    
    // Edit state
    const [courseToEdit, setCourseToEdit] = useState<AdminCourse | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFetchingCourse, setIsFetchingCourse] = useState(false);

    // Delete state
    const [courseToDelete, setCourseToDelete] = useState<any | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Clear any stale global status messages when opening create or edit modal dialogs
    useEffect(() => {
        if (isCreateModalOpen || isEditModalOpen) {
            clearMessages();
        }
    }, [isCreateModalOpen, isEditModalOpen, clearMessages]);

    // Load categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Live search and filter debounced trigger
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAllCourses(1, 10, searchQuery, selectedCategorySlug);
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedCategorySlug, fetchAllCourses]);

    const handlePageChange = (newPage: number) => {
        fetchAllCourses(newPage, 10, searchQuery, selectedCategorySlug);
    };

    const handleOpenEdit = async (courseId: string) => {
        setIsFetchingCourse(true);
        const fullCourse = await fetchCourseById(courseId);
        setIsFetchingCourse(false);
        if (fullCourse) {
            setCourseToEdit(fullCourse);
            setIsEditModalOpen(true);
        }
    };

    const handleOpenDelete = (course: any) => {
        setCourseToDelete(course);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!courseToDelete) return;
        setIsDeleting(true);
        const res = await deleteCourse(courseToDelete.id);
        setIsDeleting(false);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setCourseToDelete(null);
            fetchAllCourses(1, 10, searchQuery, selectedCategorySlug);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-indigo-600" />
                        <span>Course Management</span>
                    </h1>
                    <p className="text-slate-500 text-sm">Manage, edit, and create new training programs.</p>
                </div>
                
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 h-10 px-4 font-semibold text-sm shadow-sm transition-all">
                            <Plus className="h-4 w-4" />
                            New Course
                        </Button>
                    </DialogTrigger>
                  <DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900">Create New Course</DialogTitle>
                            <DialogDescription className="text-slate-500 text-xs">
                                Fill in the details below to launch a new course or Master Program on the platform.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateCourseForm onSuccess={() => {
                            setIsCreateModalOpen(false);
                            fetchAllCourses(1, 10, searchQuery, selectedCategorySlug);
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Live Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg w-full sm:max-w-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by course title or keywords..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full text-slate-700"
                    />
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <select 
                        value={selectedCategorySlug} 
                        onChange={(e) => setSelectedCategorySlug(e.target.value)}
                        className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-full sm:w-48 font-medium text-slate-700 cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {adminCategories.map(cat => (
                            <option key={cat.id} value={cat.slug}>{cat.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Courses Table Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-slate-900">All Courses</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                        A list of all courses matching active filters.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                    {isLoading && !isDeleting ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-b border-slate-100">
                                            <TableHead className="font-semibold text-slate-700 px-6 py-4">Course Title</TableHead>
                                            <TableHead className="font-semibold text-slate-700 py-4">Type</TableHead>
                                            <TableHead className="font-semibold text-slate-700 py-4">Category</TableHead>
                                            <TableHead className="font-semibold text-slate-700 py-4">Self-Paced (₹)</TableHead>
                                            <TableHead className="font-semibold text-slate-700 py-4">Live Online (₹)</TableHead>
                                            <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
                                            <TableHead className="font-semibold text-slate-700 py-4">Learners</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-right px-6 py-4">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {adminCourses.map((course: any) => {
                                            const courseType = course.type || course.courseType || "Standard Course";
                                            const selfPrice = course.selfPacedPrice || course.price || "N/A";
                                            const livePrice = course.liveOnlinePrice || course.livePrice || "N/A";
                                            
                                            return (
                                                <TableRow key={course.id} className="hover:bg-slate-50/40 border-b border-slate-100 transition-colors">
                                                    <TableCell className="font-bold text-slate-900 px-6 py-4 max-w-[240px] truncate" title={course.title}>
                                                        {course.title}
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className={`font-semibold capitalize border-slate-200 text-xs px-2.5 py-0.5 rounded-full ${courseType === 'Master Program' ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-slate-600 bg-slate-50'}`}>
                                                            {courseType}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-slate-600 text-sm py-4">
                                                        {course.category?.title || 'Uncategorized'}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-slate-700 py-4">
                                                        {selfPrice !== 'N/A' ? `₹${selfPrice}` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-slate-700 py-4">
                                                        {livePrice !== 'N/A' ? `₹${livePrice}` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'} className={`capitalize px-2.5 py-0.5 text-[10px] rounded-full border-none font-bold ${course.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {course.status || 'draft'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-slate-700 text-sm py-4">
                                                        {course.totalLearners ?? 0}
                                                    </TableCell>
                                                    <TableCell className="text-right px-6 py-4">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="h-8 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-2.5"
                                                                onClick={() => onViewSections && onViewSections(course.id, course.title)}
                                                            >
                                                                Sections
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                title="Edit Course"
                                                                className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg"
                                                                onClick={() => handleOpenEdit(course.id)}
                                                                disabled={isFetchingCourse}
                                                            >
                                                                {isFetchingCourse ? <Loader2 className="h-3 w-3 animate-spin text-indigo-600" /> : <Edit className="h-4 w-4" />}
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                title="Delete Course"
                                                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                                                                onClick={() => handleOpenDelete(course)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {adminCourses.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={8} className="text-center py-20 text-slate-500 text-sm font-medium">
                                                    No courses found. Change filters or create a new course!
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {coursePagination && coursePagination.totalPages > 1 && (
                                <div className="flex items-center justify-between p-6 border-t border-slate-100 bg-white">
                                    <p className="text-xs text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{coursePagination.page}</span> of <span className="font-bold text-slate-900">{coursePagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(coursePagination.page - 1)}
                                            disabled={coursePagination.page === 1}
                                            className="gap-1 h-8 text-xs font-semibold"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                            Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(coursePagination.page + 1)}
                                            disabled={coursePagination.page === coursePagination.totalPages}
                                            className="gap-1 h-8 text-xs font-semibold"
                                        >
                                            Next
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Edit Modal Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
               <DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">Edit Course</DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Modify course information and advanced configurations below.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateCourseForm 
                        courseToEdit={courseToEdit}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            setCourseToEdit(null);
                            fetchAllCourses(coursePagination?.page || 1, 10, searchQuery, selectedCategorySlug);
                        }} 
                    />
                </DialogContent>
            </Dialog>

            {/* Double-Confirmation Delete Dialog */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Delete Course</DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Are you absolutely sure you want to delete <span className="font-bold text-slate-900">"{courseToDelete?.title}"</span>? 
                            This action is permanent and will delete all associated course mappings and data.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" className="h-10 text-xs font-semibold" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-red-600 hover:bg-red-700 text-white h-10 text-xs font-semibold" 
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : null}
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
