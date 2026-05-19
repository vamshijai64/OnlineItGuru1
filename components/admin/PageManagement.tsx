"use client";

import { 
    Plus, 
    Loader2, 
    Layout, 
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

export default function PageManagement() {
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
        keywords: ""
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
        fetchContentList('pages', 1, 10);
    }, [fetchContentList]);

    const handlePageChange = (newPage: number) => {
        fetchContentList('pages', newPage, 10);
    };

    const handleOpenCreate = () => {
        const initialHtml = "<p>Write your page content here...</p>";
        setFormData({ title: "", slug: "", content: initialHtml, keywords: "" });
        editor?.commands.setContent(initialHtml);
        setViewState('create');
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item: any) => {
        setSelectedItem(item);
        const itemContent = item.content || "";
        setFormData({
            title: item.title || "",
            slug: item.slug || "",
            content: itemContent,
            keywords: item.keywords || ""
        });
        editor?.commands.setContent(itemContent);
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
        const res = await createContentItem('pages', formData);
        setIsSaving(false);
        if (res.success) {
            handleCloseForm();
            fetchContentList('pages', 1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleEdit = async () => {
        if (!selectedItem) return;
        setIsSaving(true);
        const res = await updateContentItem('pages', selectedItem.id, formData);
        setIsSaving(false);
        if (res.success) {
            handleCloseForm();
            fetchContentList('pages', 1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        setIsSaving(true);
        const res = await deleteContentItem('pages', selectedItem.id);
        setIsSaving(false);
        if (res.success) {
            setIsDeleteModalOpen(false);
            fetchContentList('pages', 1, 10);
        } else {
            alert(res.message);
        }
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pages</h1>
                    <p className="text-slate-500">Manage and publish static pages.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Page
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Pages</CardTitle>
                    <CardDescription>A list of all published and draft static pages.</CardDescription>
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
                                                        <Layout className="h-4 w-4 text-slate-600" />
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
                                                No pages found.
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
                            {viewState === 'create' ? 'Create New Page' : 'Edit Page'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            {viewState === 'create' ? 'Add a new static page to the platform.' : 'Modify existing page details.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto py-4 space-y-6">
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="font-semibold text-slate-700">Title</Label>
                                <Input id="title" className="h-11" value={formData.title} onChange={handleTitleChange} placeholder="e.g. About Us" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug" className="font-semibold text-slate-700">Slug</Label>
                                <Input id="slug" className="h-11 font-mono text-sm" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g. about-us" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="keywords" className="font-semibold text-slate-700">Keywords (Comma separated)</Label>
                                <Input id="keywords" className="h-11" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="about, company, team" />
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
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="outline" size="lg" onClick={handleCloseForm}>Cancel</Button>
                        <Button size="lg" onClick={viewState === 'create' ? handleCreate : handleEdit} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {viewState === 'create' ? 'Publish Page' : 'Save Changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Page</DialogTitle>
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
