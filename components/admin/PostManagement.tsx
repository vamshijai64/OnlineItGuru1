"use client";

import { 
    Plus, 
    Loader2, 
    FileText, 
    ChevronLeft, 
    ChevronRight, 
    Calendar, 
    Edit, 
    Trash2, 
    ArrowLeft, 
    Bold, 
    Italic, 
    Strikethrough, 
    Link as LinkIcon, 
    Image as ImageIcon, 
    List, 
    ListOrdered, 
    Undo, 
    Redo
} from "lucide-react";
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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function PostManagement() {
    const { 
        adminContent, 
        contentPagination, 
        fetchContentList, 
        createContentItem, 
        updateContentItem, 
        deleteContentItem, 
        isLoading,
        adminCategories,
        fetchCategories
    } = useAdminStore();
    
    const [viewState, setViewState] = useState<'list' | 'create' | 'edit'>('list');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        featureImage: "",
        categoryId: "",
        keywords: "",
        publishedAt: ""
    });

    // Initialize Tiptap Editor instance
    const editor = useEditor({
        extensions: [StarterKit],
        content: formData.content,
        editorProps: {
            attributes: {
                class: 'min-h-[420px] w-full border-none focus-visible:ring-0 rounded-none p-5 text-sm text-slate-800 font-sans leading-relaxed outline-none prose max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
    });

    // Update editor content when formData.content is populated externally (e.g. edit mode initialization)
    useEffect(() => {
        if (editor && formData.content !== undefined) {
            const currentContent = editor.getHTML();
            if (formData.content !== currentContent && !editor.isFocused) {
                editor.commands.setContent(formData.content);
            }
        }
    }, [editor, formData.content]);

    useEffect(() => {
        fetchContentList('posts', 1, 10);
        if (adminCategories.length === 0) {
            fetchCategories();
        }
    }, [fetchContentList, fetchCategories, adminCategories.length]);

    const handlePageChange = (newPage: number) => {
        fetchContentList('posts', newPage, 10);
    };

    const handleOpenCreate = () => {
        const defaultDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const initialHtml = "<p>Write your blog content here...</p>";
        setFormData({ 
            title: "", 
            slug: "", 
            content: initialHtml, 
            featureImage: "", 
            categoryId: adminCategories?.[0]?.id || "",
            keywords: "",
            publishedAt: defaultDate
        });
        editor?.commands.setContent(initialHtml);
        setViewState('create');
    };

    const handleOpenEdit = (post: any) => {
        setSelectedPost(post);
        const postContent = post.content || "";
        setFormData({
            title: post.title || "",
            slug: post.slug || "",
            content: postContent,
            featureImage: post.featureImage || "",
            categoryId: post.categoryId || "",
            keywords: post.keywords || "",
            publishedAt: post.publishedAt || ""
        });
        editor?.commands.setContent(postContent);
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

    // Helper for direct file inputs to set placeholder mock URL
    const handleImageUploadSimulate = () => {
        const sampleUrls = [
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
            "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        ];
        const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
        setFormData(prev => ({ ...prev, featureImage: randomUrl }));
    };

    // Helper to auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setFormData(prev => ({ ...prev, title, slug }));
    };

    // Render Form View for Create/Edit matching screenshot fidelity
    if (viewState === 'create' || viewState === 'edit') {
        return (
            <div className="space-y-6 pb-12">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <Button variant="ghost" size="icon" onClick={() => setViewState('list')} className="rounded-full hover:bg-slate-100">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">{viewState === 'create' ? 'Create Post' : 'Edit Post'}</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-6">
                    {/* Top form fields */}
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Title</Label>
                            <Input 
                                id="title" 
                                className="h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-lg text-sm" 
                                value={formData.title} 
                                onChange={handleTitleChange} 
                                placeholder="Finance and supply chain meet ServiceNow workflows" 
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</Label>
                            <Input 
                                id="slug" 
                                className="h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-lg text-sm" 
                                value={formData.slug} 
                                onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                                placeholder="finance-and-supply-chain-meet-servicenow-workflows" 
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Feature Image</Label>
                            <div 
                                onClick={handleImageUploadSimulate}
                                className="w-full h-12 bg-slate-100/80 hover:bg-slate-100 border border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <p className="text-xs text-slate-500 font-medium">
                                    Drop file here or <span className="text-blue-600 underline font-semibold">click to upload</span>
                                </p>
                            </div>
                            {formData.featureImage && (
                                <div className="flex items-center gap-2 mt-1">
                                    <Input 
                                        className="h-8 text-xs font-mono text-slate-500 bg-slate-50" 
                                        value={formData.featureImage} 
                                        onChange={(e) => setFormData({...formData, featureImage: e.target.value})} 
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="categoryId" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</Label>
                                <select 
                                    id="categoryId" 
                                    value={formData.categoryId} 
                                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500 text-slate-700"
                                >
                                    <option value="">Select Category</option>
                                    {adminCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="publishedAt" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Published At</Label>
                                <Input 
                                    id="publishedAt" 
                                    className="h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-lg text-sm font-mono" 
                                    value={formData.publishedAt} 
                                    onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} 
                                    placeholder="2026-05-11 10:00:00" 
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="keywords" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Keywords</Label>
                            <Input 
                                id="keywords" 
                                className="h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-lg text-sm" 
                                value={formData.keywords} 
                                onChange={(e) => setFormData({...formData, keywords: e.target.value})} 
                                placeholder="Keywords" 
                            />
                        </div>

                        {/* Custom Embedded Rich Text Editor using Tiptap */}
                        <div className="grid gap-2 pt-2">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Content</Label>
                            
                            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm">
                                {/* Menu Bar */}
                                <div className="flex items-center gap-4 px-3 py-1.5 border-b border-slate-200 bg-slate-50 text-[13px] text-slate-600 select-none overflow-x-auto">
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">File</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">Edit</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">View</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">Insert</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">Format</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">Tools</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">Table</span>
                                    <span className="hover:text-slate-900 cursor-pointer py-0.5">Help</span>
                                </div>

                                {/* Actions Toolbar Row */}
                                <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-slate-200 bg-white">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100" 
                                        onClick={() => editor?.chain().focus().undo().run()} 
                                        disabled={!editor?.can().undo()}
                                        title="Undo"
                                    >
                                        <Undo className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100" 
                                        onClick={() => editor?.chain().focus().redo().run()} 
                                        disabled={!editor?.can().redo()}
                                        title="Redo"
                                    >
                                        <Redo className="h-3.5 w-3.5" />
                                    </Button>
                                    
                                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                                    
                                    <select 
                                        className="h-7 text-xs bg-transparent border-none outline-none font-medium text-slate-700 cursor-pointer px-1.5 hover:bg-slate-50 rounded"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'p') {
                                                editor?.chain().focus().setParagraph().run();
                                            } else if (val.startsWith('h')) {
                                                const level = parseInt(val.charAt(1)) as any;
                                                editor?.chain().focus().toggleHeading({ level }).run();
                                            }
                                        }}
                                        value={
                                            editor?.isActive('heading', { level: 1 }) ? 'h1' :
                                            editor?.isActive('heading', { level: 2 }) ? 'h2' :
                                            editor?.isActive('heading', { level: 3 }) ? 'h3' : 'p'
                                        }
                                    >
                                        <option value="p">Paragraph</option>
                                        <option value="h1">Heading 1</option>
                                        <option value="h2">Heading 2</option>
                                        <option value="h3">Heading 3</option>
                                    </select>

                                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded font-bold ${editor?.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                        onClick={() => editor?.chain().focus().toggleBold().run()} 
                                        title="Bold"
                                    >
                                        <Bold className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded italic ${editor?.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                        onClick={() => editor?.chain().focus().toggleItalic().run()} 
                                        title="Italic"
                                    >
                                        <Italic className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded line-through ${editor?.isActive('strike') ? 'bg-slate-200 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                        onClick={() => editor?.chain().focus().toggleStrike().run()} 
                                        title="Strikethrough"
                                    >
                                        <Strikethrough className="h-3.5 w-3.5" />
                                    </Button>

                                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded ${editor?.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`} 
                                        onClick={() => editor?.chain().focus().toggleBulletList().run()} 
                                        title="Bullet List"
                                    >
                                        <List className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded ${editor?.isActive('orderedList') ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`} 
                                        onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
                                        title="Numbered List"
                                    >
                                        <ListOrdered className="h-3.5 w-3.5" />
                                    </Button>

                                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100" 
                                        onClick={() => {
                                            const url = window.prompt('Enter link URL:');
                                            if (url) {
                                                editor?.commands.insertContent(`<a href="${url}" target="_blank">${url}</a>`);
                                            }
                                        }} 
                                        title="Insert Link"
                                    >
                                        <LinkIcon className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100" 
                                        onClick={() => {
                                            const url = window.prompt('Enter image URL:');
                                            if (url) {
                                                editor?.commands.insertContent(`<img src="${url}" alt="image" />`);
                                            }
                                        }} 
                                        title="Insert Image"
                                    >
                                        <ImageIcon className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                {/* Actual Tiptap Rich Text Editor Content Viewport */}
                                <EditorContent editor={editor} className="w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Save and Cancel strip perfectly matching screenshot buttons */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <Button 
                            type="button"
                            size="sm" 
                            onClick={() => setViewState('list')}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-5 h-9 rounded"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button"
                            size="sm" 
                            onClick={viewState === 'create' ? handleCreate : handleEdit} 
                            disabled={isSaving} 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 h-9 rounded"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save
                        </Button>
                    </div>
                </div>
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

