"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, LayoutDashboard, Edit, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    DialogFooter
} from "@/components/ui/dialog";
import { useAdminStore } from "@/store/adminStore";

const EMPTY_FORM = {
    title: "",
    slug: "",
    position: 0,
    image: "",
    description: "",
};

export default function CategoryManagement({ onViewCourses }: { onViewCourses?: (slug: string, title: string) => void }) {
    const {
        adminCategories,
        fetchCategories,
        createCategory,
        updateCategory,
        isLoading,
    } = useAdminStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Auto-generate slug from title (only in create mode)
    const handleTitleChange = (value: string) => {
        setForm(prev => ({
            ...prev,
            title: value,
            ...(!editingCategory ? {
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
            } : {})
        }));
    };

    const openCreate = () => {
        setEditingCategory(null);
        setForm({ ...EMPTY_FORM, position: adminCategories.length });
        setActionError(null);
        setActionSuccess(null);
        setIsDialogOpen(true);
    };

    const openEdit = (cat: any) => {
        setEditingCategory(cat);
        setForm({
            title: cat.title || "",
            slug: cat.slug || "",
            position: cat.position ?? 0,
            image: cat.image || "",
            description: cat.description || "",
        });
        setActionError(null);
        setActionSuccess(null);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        let res;
        if (editingCategory) {
            // PATCH — do NOT send categoryId, backend returns it as null
            res = await updateCategory(editingCategory.id, {
                title: form.title,
                slug: form.slug,
                position: Number(form.position),
                image: form.image || undefined,
                description: form.description || undefined,
            });
        } else {
            // POST
            res = await createCategory({
                title: form.title,
                slug: form.slug,
                position: Number(form.position),
                image: form.image || undefined,
                description: form.description || undefined,
                categoryId: null,
            });
        }

        setIsSubmitting(false);

        if (res.success) {
            setActionSuccess(editingCategory ? "Category updated successfully!" : "Category created successfully!");
            await fetchCategories();
            setTimeout(() => setIsDialogOpen(false), 1200);
        } else {
            setActionError(res.message || "Operation failed.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage and organize course categories.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 font-semibold" onClick={openCreate}>
                    <Plus className="h-4 w-4" />
                    New Category
                </Button>
            </div>

            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/60 border-b border-slate-100 px-6 py-4">
                    <CardTitle className="text-sm font-bold text-slate-800">All Categories</CardTitle>
                    <CardDescription className="text-xs text-slate-400 mt-0.5">A list of all training categories on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading && adminCategories.length === 0 ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/40">
                                <TableRow className="border-b border-slate-100">
                                    <TableHead className="font-semibold text-slate-600 text-xs py-3 px-6">Icon / Image</TableHead>
                                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Category Name</TableHead>
                                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Slug</TableHead>
                                    <TableHead className="font-semibold text-slate-600 text-xs py-3">Position</TableHead>
                                    <TableHead className="font-semibold text-slate-600 text-xs py-3 text-right px-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminCategories.map((cat: any) => (
                                    <TableRow key={cat.id} className="border-b border-slate-50 hover:bg-slate-50/30">
                                        <TableCell className="px-6 py-3">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold overflow-hidden">
                                                {cat.image && cat.image.startsWith("http") ? (
                                                    <img src={cat.image} alt={cat.title} className="h-full w-full object-cover rounded-lg" />
                                                ) : cat.image ? (
                                                    <i className={cat.image} title={cat.image} />
                                                ) : (
                                                    <LayoutDashboard className="h-5 w-5" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900 text-sm">{cat.title}</TableCell>
                                        <TableCell className="text-slate-500 text-xs font-mono">{cat.slug}</TableCell>
                                        <TableCell className="text-slate-600 text-sm font-semibold">{cat.position}</TableCell>
                                        <TableCell className="text-right px-6 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 px-2.5"
                                                    onClick={() => onViewCourses && onViewCourses(cat.slug, cat.title)}
                                                >
                                                    View Courses
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 border-slate-200"
                                                    onClick={() => openEdit(cat)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {adminCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-xs font-semibold">
                                            No categories found. Create one using the "New Category" button.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg w-[90vw] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-slate-900">
                            {editingCategory ? `Edit Category: ${editingCategory.title}` : "Create New Category"}
                        </DialogTitle>
                    </DialogHeader>

                    {actionError && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            {actionError}
                        </div>
                    )}
                    {actionSuccess && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs px-3 py-2 rounded-lg">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                            {actionSuccess}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 py-1">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Title <span className="text-red-500">*</span></Label>
                            <Input
                                value={form.title}
                                onChange={e => handleTitleChange(e.target.value)}
                                className="h-10 text-sm border-slate-200"
                                placeholder="e.g. Data Science"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Slug <span className="text-red-500">*</span></Label>
                            <Input
                                value={form.slug}
                                onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                className="h-10 text-xs font-mono border-slate-200"
                                placeholder="e.g. data-science"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Position</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.position}
                                    onChange={e => setForm(prev => ({ ...prev, position: Number(e.target.value) }))}
                                    className="h-10 text-sm border-slate-200"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Image / Icon class</Label>
                                <Input
                                    value={form.image}
                                    onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                                    className="h-10 text-xs border-slate-200"
                                    placeholder="URL or fa fa-icon"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Description</Label>
                            <Textarea
                                value={form.description}
                                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                className="text-xs border-slate-200 h-24 resize-none"
                                placeholder="Short description of this category..."
                            />
                        </div>

                        <DialogFooter className="pt-3 border-t border-slate-100">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 text-white font-bold px-5" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                {editingCategory ? "Save Changes" : "Create Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
