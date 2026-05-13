"use client";

import { Plus, Loader2, FileText, ChevronLeft, ChevronRight, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
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

export default function PostManagement() {
    const { adminContent, contentPagination, fetchContentList, createContentItem, updateContentItem, deleteContentItem, isLoading } = useAdminStore();
    
    const [viewState, setViewState] = useState<'list' | 'create' | 'edit'>('list');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        featureImage: "",
        keywords: ""
    });

    useEffect(() => {
        fetchContentList('posts', 1, 10);
    }, [fetchContentList]);

    const handlePageChange = (newPage: number) => {
        fetchContentList('posts', newPage, 10);
    };

    const handleOpenCreate = () => {
        setFormData({ title: "", slug: "", content: "", featureImage: "", keywords: "" });
        setViewState('create');
    };

    const handleOpenEdit = (post: any) => {
        setSelectedPost(post);
        setFormData({
            title: post.title || "",
            slug: post.slug || "",
            content: post.content || "",
            featureImage: post.featureImage || "",
            keywords: post.keywords || ""
        });
        setViewState('edit');
    };

    const handleOpenDelete = (post: any) => {
        setSelectedPost(post);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = async () => {
        setIsSaving(true);
        const res = await createContentItem('posts', formData);
        setIsSaving(false);
        if (res.success) {
            setViewState('list');
            fetchContentList('posts', 1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleEdit = async () => {
        if (!selectedPost) return;
        setIsSaving(true);
        const res = await updateContentItem('posts', selectedPost.id, formData);
        setIsSaving(false);
        if (res.success) {
            setViewState('list');
            fetchContentList('posts', 1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedPost) return;
        setIsSaving(true);
        const res = await deleteContentItem('posts', selectedPost.id);
        setIsSaving(false);
        if (res.success) {
            setIsDeleteModalOpen(false);
            fetchContentList('posts', 1, 10);
        } else {
            alert(res.message);
        }
    };

    // Render Form View for Create/Edit
    if (viewState === 'create' || viewState === 'edit') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setViewState('list')}>
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{viewState === 'create' ? 'Create New Post' : 'Edit Post'}</h1>
                        <p className="text-slate-500">{viewState === 'create' ? 'Add a new blog post to the platform.' : 'Modify existing post details.'}</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm max-w-4xl">
                    <CardContent className="p-8 space-y-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="font-semibold text-slate-700">Title</Label>
                                <Input id="title" className="h-11" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Introduction to Python" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="font-semibold text-slate-700">Slug</Label>
                                <Input id="slug" className="h-11 font-mono text-sm" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g. intro-to-python" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="featureImage" className="font-semibold text-slate-700">Feature Image URL</Label>
                                <Input id="featureImage" className="h-11" value={formData.featureImage} onChange={(e) => setFormData({...formData, featureImage: e.target.value})} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="keywords" className="font-semibold text-slate-700">Keywords (Comma separated)</Label>
                                <Input id="keywords" className="h-11" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="python, tutorial, programming" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content" className="font-semibold text-slate-700">HTML Content</Label>
                                <Textarea id="content" className="min-h-[400px] font-mono text-sm leading-relaxed p-4 bg-slate-50" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="<p>Write your post content here...</p>" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
                            <Button variant="outline" size="lg" onClick={() => setViewState('list')}>Cancel</Button>
                            <Button size="lg" onClick={viewState === 'create' ? handleCreate : handleEdit} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {viewState === 'create' ? 'Publish Post' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Render List View
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Posts (Blogs)</h1>
                    <p className="text-slate-500">Manage and publish blog posts.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Post
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Posts</CardTitle>
                    <CardDescription>A list of all published and draft posts.</CardDescription>
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
                                        <TableHead>Title</TableHead>
                                        <TableHead>Published Date</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminContent.map((q) => (
                                        <TableRow key={q.id}>
                                            <TableCell className="font-bold text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-100 p-2 rounded-lg">
                                                        <FileText className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    {q.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {q.publishedAt ? new Date(q.publishedAt).toLocaleDateString() : 'Draft'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-400 font-mono">{q.slug}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-2">
                                                <Button onClick={() => handleOpenEdit(q)} variant="ghost" size="sm" className="text-indigo-600">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => handleOpenDelete(q)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {adminContent.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                                No posts found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination Controls */}
                            {contentPagination && contentPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{contentPagination.page}</span> of <span className="font-bold text-slate-900">{contentPagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(contentPagination.page - 1)}
                                            disabled={contentPagination.page === 1}
                                            className="gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(contentPagination.page + 1)}
                                            disabled={contentPagination.page === contentPagination.totalPages}
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

            {/* Delete Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-slate-900">{selectedPost?.title}</span>? This action cannot be undone.
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
