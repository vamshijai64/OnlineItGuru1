"use client";

import { MessageSquare, Loader2, Star, ChevronLeft, ChevronRight, Calendar, User, Plus, Edit, Trash2, ArrowLeft, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { useAdminStore } from "@/store/adminStore";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ReviewManagement() {
    const { 
        adminReviews, 
        reviewPagination, 
        fetchReviews, 
        createReviewItem, 
        updateReviewItem, 
        deleteReviewItem, 
        adminCourses,
        fetchAllCourses,
        adminUsers,
        fetchUsersList,
        isLoading 
    } = useAdminStore();

    const [viewState, setViewState] = useState<'list' | 'create' | 'edit'>('list');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        courseId: "",
        userId: "",
        userName: "",
        rating: 5,
        review: "",
        status: "approved"
    });

    useEffect(() => {
        fetchReviews(1, 12);
        if (!adminCourses || adminCourses.length === 0) {
            fetchAllCourses();
        }
        if (!adminUsers || adminUsers.length === 0) {
            fetchUsersList(1, 50);
        }
    }, []);

    const handlePageChange = (newPage: number) => {
        fetchReviews(newPage, 12);
    };

    const handleOpenCreate = () => {
        setFormData({
            courseId: adminCourses?.[0]?.id || "",
            userId: adminUsers?.[0]?.id || "",
            userName: adminUsers?.[0]?.name || adminUsers?.[0]?.firstName || "",
            rating: 5,
            review: "",
            status: "approved"
        });
        setViewState('create');
    };

    const handleOpenEdit = (review: any) => {
        setSelectedReview(review);
        setFormData({
            courseId: review.courseId || "",
            userId: review.userId || "",
            userName: review.userName || "",
            rating: Number(review.rating) || 5,
            review: review.review || "",
            status: review.status || "approved"
        });
        setViewState('edit');
    };

    const handleOpenDelete = (review: any) => {
        setSelectedReview(review);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = async () => {
        if (!formData.courseId) {
            alert("Please provide or select a Course ID");
            return;
        }
        setIsSaving(true);
        const res = await createReviewItem({
            ...formData,
            userId: formData.userId || "000fb070-5259-4fdb-b671-18315dcd8f83",
            rating: Number(formData.rating)
        });
        setIsSaving(false);
        if (res.success) {
            setViewState('list');
            fetchReviews(1, 12);
        } else {
            alert(res.message);
        }
    };

    const handleEdit = async () => {
        if (!selectedReview) return;
        if (!formData.courseId) {
            alert("Please provide or select a Course ID");
            return;
        }
        setIsSaving(true);
        const res = await updateReviewItem(selectedReview.id, {
            ...formData,
            userId: formData.userId || selectedReview.userId || "000fb070-5259-4fdb-b671-18315dcd8f83",
            rating: Number(formData.rating)
        });
        setIsSaving(false);
        if (res.success) {
            setViewState('list');
            fetchReviews(1, 12);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedReview) return;
        setIsSaving(true);
        const res = await deleteReviewItem(selectedReview.id);
        setIsSaving(false);
        if (res.success) {
            setIsDeleteModalOpen(false);
            fetchReviews(1, 12);
        } else {
            alert(res.message);
        }
    };

    const handleToggleStatus = async (id: string, newStatus: string, currentReview: any) => {
        setIsSaving(true);
        await updateReviewItem(id, {
            ...currentReview,
            status: newStatus
        });
        setIsSaving(false);
        fetchReviews(reviewPagination?.page || 1, 12);
    };

    if (viewState === 'create' || viewState === 'edit') {
        return (
            <div className="space-y-6 overflow-y-auto">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setViewState('list')}>
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {viewState === 'create' ? 'Add Student Review' : 'Edit Review'}
                        </h1>
                        <p className="text-slate-500">
                            {viewState === 'create' ? 'Manually insert feedback from a student.' : 'Modify rating, written feedback, or status.'}
                        </p>
                    </div>
                </div>

                <Card className="border-none shadow-sm w-full">
                    <CardContent className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Course Selection */}
                            <div className="grid gap-2 col-span-2">
                                <Label className="font-semibold text-slate-700">Course</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-11 justify-between font-normal text-left px-3 border-input bg-background hover:bg-slate-50"
                                        >
                                            <span className="truncate">
                                                {formData.courseId 
                                                    ? (adminCourses.find((c: any) => c.id === formData.courseId)?.title || selectedReview?.courseTitle || `Selected ID: ${formData.courseId}`)
                                                    : "-- Select a Course --"}
                                            </span>
                                            <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                                        {adminCourses.map((c: any) => (
                                            <DropdownMenuItem 
                                                key={c.id} 
                                                onClick={() => setFormData({ ...formData, courseId: c.id })}
                                                className="cursor-pointer py-2"
                                            >
                                                <span className="truncate">{c.title} {c.slug ? `(${c.slug})` : ''}</span>
                                            </DropdownMenuItem>
                                        ))}
                                        {formData.courseId && !adminCourses?.some((c: any) => c.id === formData.courseId) && (
                                            <DropdownMenuItem 
                                                onClick={() => {}}
                                                className="cursor-pointer py-2 font-bold text-indigo-600"
                                            >
                                                <span className="truncate">
                                                    {selectedReview?.courseTitle || selectedReview?.courseSlug || `Selected Course ID: ${formData.courseId}`}
                                                </span>
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Student / Reviewer Username */}
                            <div className="grid gap-2 col-span-2 md:col-span-1">
                                <Label htmlFor="userName" className="font-semibold text-slate-700">Student Username / Name</Label>
                                <Input 
                                    id="userName" 
                                    className="h-11" 
                                    value={formData.userName} 
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })} 
                                    placeholder="e.g. Rahul" 
                                />
                            </div>

                            {/* Rating */}
                            <div className="grid gap-2 col-span-2 md:col-span-1 w-full">
                                <Label className="font-semibold text-slate-700">Rating Stars</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-11 justify-between font-normal text-left px-3 border-input bg-background hover:bg-slate-50"
                                        >
                                            <span>
                                                {"⭐".repeat(formData.rating || 5)} ({(formData.rating || 5)} {(formData.rating || 5) === 1 ? "Star" : "Stars"})
                                            </span>
                                            <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                        {[5, 4, 3, 2, 1].map((stars) => (
                                            <DropdownMenuItem 
                                                key={stars} 
                                                onClick={() => setFormData({ ...formData, rating: stars })}
                                                className="cursor-pointer py-2"
                                            >
                                                {"⭐".repeat(stars)} ({stars} {stars === 1 ? "Star" : "Stars"})
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Review Content */}
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="review" className="font-semibold text-slate-700">Review Message</Label>
                                <Textarea 
                                    id="review" 
                                    className="min-h-[120px] p-4 bg-slate-50 leading-relaxed text-sm" 
                                    value={formData.review} 
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })} 
                                    placeholder="Write review commentary here..." 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
                            <Button variant="outline" size="lg" onClick={() => setViewState('list')}>Cancel</Button>
                            <Button 
                                size="lg" 
                                onClick={viewState === 'create' ? handleCreate : handleEdit} 
                                disabled={isSaving} 
                                className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {viewState === 'create' ? 'Save Review' : 'Update Review'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Reviews</h1>
                    <p className="text-slate-500">Monitor and manage course feedback from your learners.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    Add Review
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
                    <CardDescription>A complete list of course ratings and written feedback.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && !isSaving ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 font-bold text-slate-700">#</TableHead>
                                        <TableHead className="font-bold text-slate-700">course</TableHead>
                                        <TableHead className="font-bold text-slate-700">rating</TableHead>
                                        <TableHead className="font-bold text-slate-700 w-[300px]">review</TableHead>
                                        <TableHead className="font-bold text-slate-700 text-center">status</TableHead>
                                        <TableHead className="font-bold text-slate-700 text-right">actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminReviews.map((review, index) => (
                                        <TableRow key={review.id}>
                                            <TableCell className="font-bold text-slate-600">
                                                {reviewPagination ? (reviewPagination.page - 1) * 12 + index + 1 : index + 1}
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">
                                                {review.courseTitle || review.courseSlug || <span className="font-mono text-xs text-slate-400">{review.courseId}</span>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} 
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600 italic max-w-[300px] truncate" title={review.review}>
                                                "{review.review}"
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button 
                                                        onClick={() => handleToggleStatus(review.id, 'approved', review)}
                                                        title="Set Approved"
                                                        className={`p-1 rounded-full transition-colors ${review.status === 'approved' ? 'text-green-600 bg-green-50 font-bold ring-2 ring-green-600/20' : 'text-slate-300 hover:text-green-600'}`}
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleToggleStatus(review.id, 'rejected', review)}
                                                        title="Set Rejected"
                                                        className={`p-1 rounded-full transition-colors ${review.status === 'rejected' ? 'text-red-600 bg-red-50 font-bold ring-2 ring-red-600/20' : 'text-slate-300 hover:text-red-600'}`}
                                                    >
                                                        <XCircle className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button onClick={() => handleOpenEdit(review)} variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button onClick={() => handleOpenDelete(review)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {adminReviews.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                                No reviews found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {reviewPagination && reviewPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{reviewPagination.page}</span> of <span className="font-bold text-slate-900">{reviewPagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(reviewPagination.page - 1)}
                                            disabled={reviewPagination.page === 1}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(reviewPagination.page + 1)}
                                            disabled={reviewPagination.page === reviewPagination.totalPages}
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

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this review by <span className="font-bold text-slate-900">{selectedReview?.userName || 'Student'}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
