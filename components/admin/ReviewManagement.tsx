"use client";

import { MessageSquare, Loader2, Star, ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";
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

export default function ReviewManagement() {
    const { adminReviews, reviewPagination, fetchReviews, isLoading } = useAdminStore();

    const handlePageChange = (newPage: number) => {
        fetchReviews(newPage);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Reviews</h1>
                    <p className="text-slate-500">Monitor and manage course feedback from your learners.</p>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Reviews</CardTitle>
                    <CardDescription>A complete list of course ratings and written feedback.</CardDescription>
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
                                        <TableHead>Course</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead className="w-[300px]">Review</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminReviews.map((review) => (
                                        <TableRow key={review.id}>
                                            <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">
                                                {review.courseTitle}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    <span className="text-sm">{review.userName || 'Student'}</span>
                                                </div>
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
                                            <TableCell className="text-sm text-slate-500 italic">
                                                "{review.review}"
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="text-red-600 font-bold">Delete</Button>
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
        </div>
    );
}
