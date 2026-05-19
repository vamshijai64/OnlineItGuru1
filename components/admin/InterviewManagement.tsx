"use client";

import { Plus, Loader2, HelpCircle, ChevronLeft, ChevronRight, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
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

export default function InterviewManagement() {
    const { adminContent, contentPagination, fetchContentList, createContentItem, updateContentItem, deleteContentItem, isLoading } = useAdminStore();
    
    const [viewState, setViewState] = useState<'list' | 'create' | 'edit'>('list');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        featureImage: "",
        keywords: ""
    });

    useEffect(() => {
        fetchContentList('interview-questions', 1, 10);
    }, [fetchContentList]);

    const handlePageChange = (newPage: number) => {
        fetchContentList('interview-questions', newPage, 10);
    };

    const handleOpenCreate = () => {
        setFormData({ title: "", slug: "", content: "", featureImage: "", keywords: "" });
        setViewState('create');
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            title: item.title || "",
            slug: item.slug || "",
            content: item.content || "",
            featureImage: item.featureImage || "",
            keywords: item.keywords || ""
        });
        setViewState('edit');
        setIsFormOpen(true);
    };

    const handleOpenDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setViewState('list');
    };

    const handleCreate = async () => {
        setIsSaving(true);
        const res = await createContentItem('interview-questions', formData);
        setIsSaving(false);
        if (res.success) {
            handleCloseForm();
            fetchContentList('interview-questions', 1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleEdit = async () => {
        if (!selectedItem) return;
        setIsSaving(true);
        const res = await updateContentItem('interview-questions', selectedItem.id, formData);
        setIsSaving(false);
        if (res.success) {
            handleCloseForm();
            fetchContentList('interview-questions', 1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setIsSaving(true);
        const res = await deleteContentItem('interview-questions', selectedItem.id);
        setIsSaving(false);
        if (res.success) {
            setIsDeleteModalOpen(false);
            fetchContentList('interview-questions', 1, 10);
        } else {
            alert(res.message);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Interview Questions</h1>
                    <p className="text-slate-500">Manage and publish interview questions.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Question
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Interview Questions</CardTitle>
                    <CardDescription>A list of all published and draft questions.</CardDescription>
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
                                    {adminContent.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-bold text-slate-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-100 p-2 rounded-lg">
                                                        <HelpCircle className="h-4 w-4 text-slate-600" />
                                                    </div>
                                                    {item.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Draft'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-400 font-mono">{item.slug}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-2">
                                                <Button onClick={() => handleOpenEdit(item)} variant="ghost" size="sm" className="text-indigo-600">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => handleOpenDelete(item)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {adminContent.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                                No interview questions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

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
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(contentPagination.page + 1)}
                                            disabled={contentPagination.page === contentPagination.totalPages}
                                        >
                                            Next <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Modal Dialog */}
            <Dialog open={isFormOpen} onOpenChange={(open) => { if(!open) handleCloseForm(); }}>
                <DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {viewState === 'create' ? 'Create Interview Question' : 'Edit Interview Question'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            {viewState === 'create' ? 'Add a new interview question to the platform.' : 'Modify existing question details.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto py-4 space-y-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="font-semibold text-slate-700">Title</Label>
                                <Input id="title" className="h-11" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Explain React Lifecycle" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="font-semibold text-slate-700">Slug</Label>
                                <Input id="slug" className="h-11 font-mono text-sm" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g. explain-react-lifecycle" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="featureImage" className="font-semibold text-slate-700">Feature Image URL</Label>
                                <Input id="featureImage" className="h-11" value={formData.featureImage} onChange={(e) => setFormData({...formData, featureImage: e.target.value})} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="keywords" className="font-semibold text-slate-700">Keywords (Comma separated)</Label>
                                <Input id="keywords" className="h-11" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="react, interview, concepts" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content" className="font-semibold text-slate-700">HTML Content</Label>
                                <Textarea id="content" className="min-h-[300px] font-mono text-sm leading-relaxed p-4 bg-slate-50 flex-1" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="<p>Write your question and answer content here...</p>" />
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="outline" onClick={handleCloseForm}>Cancel</Button>
                        <Button onClick={viewState === 'create' ? handleCreate : handleEdit} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {viewState === 'create' ? 'Publish Question' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Question</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-slate-900">{selectedItem?.title}</span>? This action cannot be undone.
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
