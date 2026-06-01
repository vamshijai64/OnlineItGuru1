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
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Indent,
    Outdent,
    HelpCircle,
    X,
    ChevronDown,
    Palette,
    PaintBucket,
    Type,
    Baseline,
    Underline as LucideUnderline
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
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import SEOForm from "./SEOForm";

export default function PageManagement() {
    const { 
        adminContent, 
        contentPagination, 
        fetchContentList, 
        createContentItem, 
        updateContentItem, 
        deleteContentItem, 
        isLoading
    } = useAdminStore();
    
    const [viewState, setViewState] = useState<'list' | 'create' | 'edit'>('list');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeMainTab, setActiveMainTab] = useState<'general' | 'seo'>('general');

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        keywords: "",
        publishedAt: ""
    });

    // Dropdown open state
    const [activeDropdown, setActiveDropdown] = useState<'format' | 'color' | 'highlight' | 'file' | 'edit' | 'view' | 'insert' | 'formatMenu' | 'tools' | 'table' | 'help' | null>(null);

    // Link modal states
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkData, setLinkData] = useState({
        url: "",
        text: "",
        title: "",
        target: "_self"
    });

    // Source code modal states
    const [sourceModalOpen, setSourceModalOpen] = useState(false);
    const [sourceHtml, setSourceHtml] = useState("");

    // Word count modal states
    const [wordCountModalOpen, setWordCountModalOpen] = useState(false);

    // Help modal states
    const [helpModalOpen, setHelpModalOpen] = useState(false);

    // Image modal states
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageData, setImageData] = useState({
        src: "",
        alt: "",
        width: "",
        height: "",
        lockAspectRatio: true
    });

    const textColors = [
        { name: 'Black', value: '#000000' },
        { name: 'Red', value: '#e03e2d' },
        { name: 'Orange', value: '#e5893d' },
        { name: 'Yellow', value: '#f1c40f' },
        { name: 'Green', value: '#2dc26b' },
        { name: 'Blue', value: '#3598db' },
        { name: 'Purple', value: '#9b59b6' },
        { name: 'Grey', value: '#7e8c8d' },
        { name: 'Light Red', value: '#f8a5c2' },
        { name: 'Light Blue', value: '#85e7ff' },
        { name: 'White', value: '#ffffff' }
    ];

    const highlightColors = [
        { name: 'Yellow', value: '#f1c40f' },
        { name: 'Green', value: '#2dc26b' },
        { name: 'Blue', value: '#3598db' },
        { name: 'Pink', value: '#f8a5c2' },
        { name: 'Grey', value: '#7e8c8d' },
        { name: 'Light Green', value: '#2befb3' },
        { name: 'Light Yellow', value: '#fff4a3' }
    ];

    // Initialize Tiptap Editor instance
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                },
            }).extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        title: {
                            default: null,
                        },
                    };
                },
            }),
            TiptapImage.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        width: {
                            default: null,
                            renderHTML: attributes => {
                                if (!attributes.width) return {};
                                return { width: attributes.width };
                            }
                        },
                        height: {
                            default: null,
                            renderHTML: attributes => {
                                if (!attributes.height) return {};
                                return { height: attributes.height };
                            }
                        }
                    };
                }
            }),
        ],
        content: formData.content,
        editorProps: {
            attributes: {
                class: 'min-h-[420px] w-full border-none focus-visible:ring-0 rounded-none p-5 text-sm text-slate-800 font-sans leading-relaxed outline-none prose max-w-none',
            },
            handlePaste(view, event) {
                const text = event.clipboardData?.getData('text/plain')?.trim();
                if (text) {
                    const isImageUrl = (
                        (text.startsWith('http://') || text.startsWith('https://')) &&
                        /\.(jpeg|jpg|gif|png|webp|svg)/i.test(text)
                    ) || text.startsWith('data:image/');

                    if (isImageUrl && view.state.schema.nodes.image) {
                        const node = view.state.schema.nodes.image.create({ src: text });
                        const transaction = view.state.tr.replaceSelectionWith(node);
                        view.dispatch(transaction);
                        return true; // Prevents default text paste action
                    }
                }
                return false;
            }
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

    const handleOpenLinkModal = () => {
        if (!editor) return;
        const currentLinkAttrs = editor.getAttributes('link');
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');

        setLinkData({
            url: currentLinkAttrs.href || "",
            text: selectedText || currentLinkAttrs.text || "",
            title: currentLinkAttrs.title || "",
            target: currentLinkAttrs.target === '_blank' ? '_blank' : '_self'
        });
        setLinkModalOpen(true);
    };

    const handleSaveLink = () => {
        if (!editor) return;
        
        if (!linkData.url) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            setLinkModalOpen(false);
            return;
        }

        // Normalize URL if it lacks a protocol prefix (e.g. www.google.com or google.com or amazon)
        let normalizedUrl = linkData.url.trim();
        if (normalizedUrl && !/^([a-z0-9+.-]+):/i.test(normalizedUrl) && !normalizedUrl.startsWith('/') && !normalizedUrl.startsWith('#')) {
            if (!normalizedUrl.includes('.')) {
                normalizedUrl = normalizedUrl + '.com';
            }
            normalizedUrl = 'https://' + normalizedUrl;
        }

        const targetAttr = linkData.target === '_blank' ? '_blank' : undefined;
        const { from, to } = editor.state.selection;
        const hasSelection = from !== to;

        if (hasSelection) {
            editor.chain().focus().extendMarkRange('link').setLink({
                href: normalizedUrl,
                target: targetAttr,
                title: linkData.title || undefined
            }).run();
        } else {
            const textToInsert = linkData.text || linkData.url;
            editor.chain().focus().insertContent(`<a href="${normalizedUrl}" target="${linkData.target}" title="${linkData.title || ''}">${textToInsert}</a>`).run();
        }
        setLinkModalOpen(false);
    };

    // When src changes, load image to detect original dimensions
    useEffect(() => {
        if (!imageData.src) return;
        const img = new Image();
        img.onload = () => {
            setImageData(prev => ({
                ...prev,
                width: prev.width || img.width.toString(),
                height: prev.height || img.height.toString()
            }));
        };
        img.src = imageData.src;
    }, [imageData.src]);

    const handleWidthChange = (val: string) => {
        setImageData(prev => {
            const widthNum = parseFloat(val);
            if (prev.lockAspectRatio && !isNaN(widthNum) && prev.width && prev.height) {
                const w = parseFloat(prev.width);
                const h = parseFloat(prev.height);
                if (w > 0) {
                    const ratio = h / w;
                    return {
                        ...prev,
                        width: val,
                        height: Math.round(widthNum * ratio).toString()
                    };
                }
            }
            return { ...prev, width: val };
        });
    };

    const handleHeightChange = (val: string) => {
        setImageData(prev => {
            const heightNum = parseFloat(val);
            if (prev.lockAspectRatio && !isNaN(heightNum) && prev.width && prev.height) {
                const w = parseFloat(prev.width);
                const h = parseFloat(prev.height);
                if (h > 0) {
                    const ratio = w / h;
                    return {
                        ...prev,
                        height: val,
                        width: Math.round(heightNum * ratio).toString()
                    };
                }
            }
            return { ...prev, height: val };
        });
    };

    const handleInsertImagePrompt = () => {
        if (!editor) return;
        const currentImageAttrs = editor.getAttributes('image');
        setImageData({
            src: currentImageAttrs.src || "",
            alt: currentImageAttrs.alt || "",
            width: currentImageAttrs.width || "",
            height: currentImageAttrs.height || "",
            lockAspectRatio: true
        });
        setImageModalOpen(true);
    };

    const handleSaveImage = () => {
        if (!editor) return;
        if (!imageData.src) {
            setImageModalOpen(false);
            return;
        }

        if (editor.isActive('image')) {
            editor.chain().focus().updateAttributes('image', {
                src: imageData.src,
                alt: imageData.alt || undefined,
                width: imageData.width || undefined,
                height: imageData.height || undefined
            }).run();
        } else {
            editor.chain().focus().setImage({
                src: imageData.src,
                alt: imageData.alt || undefined,
                title: imageData.alt || undefined,
            }).run();
            if (imageData.width || imageData.height) {
                editor.chain().focus().updateAttributes('image', {
                    width: imageData.width || undefined,
                    height: imageData.height || undefined
                }).run();
            }
        }
        setImageModalOpen(false);
    };

    const handleOpenSourceModal = () => {
        if (!editor) return;
        setSourceHtml(editor.getHTML());
        setSourceModalOpen(true);
    };

    const handleSaveSource = () => {
        if (!editor) return;
        editor.commands.setContent(sourceHtml);
        setSourceModalOpen(false);
    };

    const handleOpenWordCountModal = () => {
        setWordCountModalOpen(true);
    };

    const getWordCountStats = () => {
        if (!editor) return { words: 0, characters: 0, paragraphs: 0 };
        const text = editor.getText();
        const html = editor.getHTML();
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const paragraphs = (html.match(/<p>/g) || []).length || 1;
        return { words, characters, paragraphs };
    };

    const handleIndent = () => {
        if (editor?.isActive('bulletList') || editor?.isActive('orderedList')) {
            editor.chain().focus().sinkListItem('listItem').run();
        }
    };

    const handleOutdent = () => {
        if (editor?.isActive('bulletList') || editor?.isActive('orderedList')) {
            editor.chain().focus().liftListItem('listItem').run();
        }
    };

    useEffect(() => {
        fetchContentList('pages', 1, 10);
    }, [fetchContentList]);

    const handlePageChange = (newPage: number) => {
        fetchContentList('pages', newPage, 10);
    };

    const formatDateTimeForMySQL = (dateStr: string | null | undefined): string => {
        if (!dateStr) return "";
        
        const trimmed = dateStr.trim();

        // 1. If already YYYY-MM-DD HH:MM:SS, return directly
        const mysqlDateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (mysqlDateRegex.test(trimmed)) {
            return trimmed;
        }

        // 2. If YYYY-MM-DD HH:MM, append seconds
        const mysqlDateRegexNoSeconds = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
        if (mysqlDateRegexNoSeconds.test(trimmed)) {
            return `${trimmed}:00`;
        }

        // 3. If YYYY-MM-DD, append time
        const mysqlDateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (mysqlDateOnlyRegex.test(trimmed)) {
            return `${trimmed} 00:00:00`;
        }

        // 4. If ISO string with T, slice and replace to keep exact numbers
        if (trimmed.includes('T')) {
            const formatted = trimmed.replace('T', ' ').slice(0, 19);
            if (mysqlDateRegex.test(formatted)) {
                return formatted;
            }
        }

        // Fallback for custom text formats (uses local date getters to prevent timezone shifts)
        try {
            const date = new Date(trimmed);
            if (isNaN(date.getTime())) return trimmed;
            
            const pad = (n: number) => n.toString().padStart(2, '0');
            const yyyy = date.getFullYear();
            const mm = pad(date.getMonth() + 1);
            const dd = pad(date.getDate());
            const hh = pad(date.getHours());
            const min = pad(date.getMinutes());
            const ss = pad(date.getSeconds());
            return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
        } catch (e) {
            return trimmed;
        }
    };

    const handleOpenCreate = () => {
        const defaultDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const initialHtml = "<p>Write your page content here...</p>";
        setFormData({ 
            title: "", 
            slug: "", 
            content: initialHtml, 
            keywords: "",
            publishedAt: defaultDate
        });
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
            keywords: item.keywords || "",
            publishedAt: formatDateTimeForMySQL(item.publishedAt)
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
        setActiveMainTab('general');
    };

    const handleCreate = async () => {
        setIsSaving(true);
        const submissionData = {
            ...formData,
            publishedAt: formatDateTimeForMySQL(formData.publishedAt)
        };
        const res = await createContentItem('pages', submissionData);
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
        const submissionData = {
            ...formData,
            publishedAt: formatDateTimeForMySQL(formData.publishedAt)
        };
        const res = await updateContentItem('pages', selectedItem.id, submissionData);
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

    const menus = [
        { 
            label: 'File', 
            id: 'file' as const,
            items: [
                { label: 'New document', action: () => { editor?.commands.clearContent(); } },
                { label: 'Print', action: () => { window.print(); } }
            ]
        },
        { 
            label: 'Edit', 
            id: 'edit' as const,
            items: [
                { label: 'Undo', action: () => { editor?.chain().focus().undo().run(); }, disabled: () => !editor?.can().undo() },
                { label: 'Redo', action: () => { editor?.chain().focus().redo().run(); }, disabled: () => !editor?.can().redo() },
                { label: 'Select all', action: () => { editor?.chain().focus().selectAll().run(); } }
            ]
        },
        { 
            label: 'View', 
            id: 'view' as const,
            items: [
                { label: 'Show/Hide Menu', action: () => {} }
            ]
        },
        { 
            label: 'Insert', 
            id: 'insert' as const,
            items: [
                { label: 'Link...', action: () => handleOpenLinkModal() },
                { label: 'Image...', action: () => handleInsertImagePrompt() },
                { label: 'Horizontal line', action: () => { editor?.chain().focus().setHorizontalRule().run(); } }
            ]
        },
        { 
            label: 'Format', 
            id: 'formatMenu' as const,
            items: [
                { label: 'Bold', action: () => { editor?.chain().focus().toggleBold().run(); } },
                { label: 'Italic', action: () => { editor?.chain().focus().toggleItalic().run(); } },
                { label: 'Underline', action: () => { editor?.chain().focus().toggleUnderline().run(); } },
                { label: 'Strikethrough', action: () => { editor?.chain().focus().toggleStrike().run(); } },
                { label: 'Clear formatting', action: () => { editor?.chain().focus().clearNodes().unsetAllMarks().run(); } }
            ]
        },
        { 
            label: 'Tools', 
            id: 'tools' as const,
            items: [
                { label: 'Source code', action: () => handleOpenSourceModal() },
                { label: 'Word count', action: () => handleOpenWordCountModal() }
            ]
        },
        { 
            label: 'Help', 
            id: 'help' as const,
            items: [
                { label: 'Help & Shortcuts', action: () => setHelpModalOpen(true) }
            ]
        }
    ];

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
                        <DialogTitle className="text-xl font-bold text-slate-900 flex justify-between items-center pr-6">
                            <span>{viewState === 'create' ? 'Create New Page' : 'Edit Page'}</span>
                            <div className="flex space-x-1 bg-slate-100/80 p-1 rounded-xl w-fit font-normal">
                                <button
                                    type="button"
                                    onClick={() => setActiveMainTab("general")}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeMainTab === "general"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    General Info
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveMainTab("seo")}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                                        activeMainTab === "seo"
                                            ? "bg-white text-indigo-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-900"
                                    }`}
                                >
                                    SEO Settings
                                </button>
                            </div>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            {viewState === 'create' ? 'Add a new static page to the platform.' : 'Modify existing page details.'}
                        </DialogDescription>
                    </DialogHeader>

                    {activeMainTab === "general" ? (
                        <>

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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="keywords" className="font-semibold text-slate-700">Keywords (Comma separated)</Label>
                                    <Input id="keywords" className="h-11" value={formData.keywords} onChange={(e) => setFormData({...formData, keywords: e.target.value})} placeholder="about, company, team" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="publishedAt" className="font-semibold text-slate-700">Published At</Label>
                                    <Input id="publishedAt" className="h-11 font-mono text-sm" value={formData.publishedAt} onChange={(e) => setFormData({...formData, publishedAt: e.target.value})} placeholder="2026-05-11 10:00:00" />
                                </div>
                            </div>
                            
                            {/* Custom Embedded Rich Text Editor using Tiptap */}
                            <div className="grid gap-2 pt-2">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Content</Label>
                                
                                <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
                                    {/* Menu Bar */}
                                    <div className="flex items-center gap-4 px-3 py-1.5 border-b border-slate-200 bg-slate-50 text-[13px] text-slate-600 select-none overflow-x-auto relative z-30">
                                        {menus.map((menu) => (
                                            <div key={menu.id} className="relative">
                                                <button
                                                    type="button"
                                                    className={`hover:text-slate-900 hover:bg-slate-200/60 px-2 py-0.5 rounded cursor-pointer transition-colors ${activeDropdown === menu.id ? 'bg-slate-200/80 text-slate-950' : ''}`}
                                                    onClick={() => setActiveDropdown(activeDropdown === menu.id ? null : menu.id)}
                                                >
                                                    {menu.label}
                                                </button>
                                                {activeDropdown === menu.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                                        <div className="absolute left-0 mt-1.5 w-44 rounded bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 border border-slate-200">
                                                            {menu.items.map((item, index) => {
                                                                const isDisabled = (item as any).disabled ? (item as any).disabled() : false;
                                                                return (
                                                                    <button
                                                                        key={index}
                                                                        type="button"
                                                                        disabled={isDisabled}
                                                                        className={`w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent flex justify-between items-center`}
                                                                        onClick={() => {
                                                                            item.action();
                                                                            setActiveDropdown(null);
                                                                        }}
                                                                    >
                                                                        {item.label}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions Toolbar Row */}
                                    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-slate-200 bg-white relative z-20">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50" 
                                            onClick={() => editor?.chain().focus().undo().run()} 
                                            disabled={!editor?.can().undo()}
                                            title="Undo (Ctrl+Z)"
                                        >
                                            <Undo className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50" 
                                            onClick={() => editor?.chain().focus().redo().run()} 
                                            disabled={!editor?.can().redo()}
                                            title="Redo (Ctrl+Y)"
                                        >
                                            <Redo className="h-3.5 w-3.5" />
                                        </Button>
                                        
                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                                        
                                        {/* Format Dropdown */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="flex items-center gap-1 h-7 text-xs bg-transparent hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all font-medium text-slate-700 cursor-pointer px-2 rounded"
                                                onClick={() => setActiveDropdown(activeDropdown === 'format' ? null : 'format')}
                                            >
                                                <span>
                                                    {editor?.isActive('heading', { level: 1 }) ? 'Heading 1' :
                                                     editor?.isActive('heading', { level: 2 }) ? 'Heading 2' :
                                                     editor?.isActive('heading', { level: 3 }) ? 'Heading 3' :
                                                     editor?.isActive('heading', { level: 4 }) ? 'Heading 4' :
                                                     editor?.isActive('heading', { level: 5 }) ? 'Heading 5' :
                                                     editor?.isActive('heading', { level: 6 }) ? 'Heading 6' :
                                                     editor?.isActive('codeBlock') ? 'Preformatted' : 'Paragraph'}
                                                </span>
                                                <ChevronDown className="h-3 w-3 text-slate-500" />
                                            </button>

                                            {activeDropdown === 'format' && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                                    <div className="absolute left-0 mt-1 w-36 rounded bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 border border-slate-200">
                                                        {[
                                                            { label: 'Paragraph', action: () => editor?.chain().focus().setParagraph().run() },
                                                            { label: 'Heading 1', action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
                                                            { label: 'Heading 2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
                                                            { label: 'Heading 3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
                                                            { label: 'Heading 4', action: () => editor?.chain().focus().toggleHeading({ level: 4 }).run() },
                                                            { label: 'Heading 5', action: () => editor?.chain().focus().toggleHeading({ level: 5 }).run() },
                                                            { label: 'Heading 6', action: () => editor?.chain().focus().toggleHeading({ level: 6 }).run() },
                                                            { label: 'Preformatted', action: () => editor?.chain().focus().toggleCodeBlock().run() }
                                                        ].map((item, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                                                                onClick={() => {
                                                                    item.action();
                                                                    setActiveDropdown(null);
                                                                }}
                                                            >
                                                                {item.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded font-bold ${editor?.isActive('bold') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().toggleBold().run()} 
                                            title="Bold (Ctrl+B)"
                                        >
                                            <Bold className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded italic ${editor?.isActive('italic') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().toggleItalic().run()} 
                                            title="Italic (Ctrl+I)"
                                        >
                                            <Italic className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive('underline') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().toggleUnderline().run()} 
                                            title="Underline (Ctrl+U)"
                                        >
                                            <LucideUnderline className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded line-through ${editor?.isActive('strike') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().toggleStrike().run()} 
                                            title="Strikethrough (Ctrl+Shift+X)"
                                        >
                                            <Strikethrough className="h-3.5 w-3.5" />
                                        </Button>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        {/* Text Color Picker */}
                                        <div className="relative">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className={`h-7 w-7 rounded ${activeDropdown === 'color' ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`}
                                                onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                                                title="Text Color"
                                            >
                                                <div className="flex flex-col items-center justify-center relative">
                                                    <Type className="h-3.5 w-3.5" />
                                                    <div className="absolute bottom-[-2px] h-[3px] w-4 rounded-sm bg-slate-900" style={{ backgroundColor: editor?.getAttributes('textStyle').color || '#000000' }} />
                                                </div>
                                            </Button>
                                            {activeDropdown === 'color' && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                                    <div className="absolute left-0 mt-1 p-2 rounded bg-white shadow-lg ring-1 ring-black/5 z-50 border border-slate-200 w-44">
                                                        <div className="grid grid-cols-5 gap-1.5 pb-2">
                                                            {textColors.map((color) => (
                                                                <button
                                                                    key={color.value}
                                                                    type="button"
                                                                    className="w-5 h-5 rounded border border-slate-200 hover:scale-110 transition-transform cursor-pointer shadow-sm"
                                                                    style={{ backgroundColor: color.value }}
                                                                    title={color.name}
                                                                    onClick={() => {
                                                                        editor?.chain().focus().setColor(color.value).run();
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="border-t border-slate-100 pt-1.5 flex justify-center">
                                                            <button
                                                                type="button"
                                                                className="text-[10px] text-slate-500 hover:text-slate-950 font-semibold uppercase tracking-wider cursor-pointer"
                                                                onClick={() => {
                                                                    editor?.chain().focus().unsetColor().run();
                                                                    setActiveDropdown(null);
                                                                }}
                                                            >
                                                                Reset Color
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Highlight Color Picker */}
                                        <div className="relative">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className={`h-7 w-7 rounded ${activeDropdown === 'highlight' ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`}
                                                onClick={() => setActiveDropdown(activeDropdown === 'highlight' ? null : 'highlight')}
                                                title="Highlight Color"
                                            >
                                                <div className="flex flex-col items-center justify-center relative">
                                                    <PaintBucket className="h-3.5 w-3.5" />
                                                    <div className="absolute bottom-[-2px] h-[3px] w-4 rounded-sm bg-yellow-400" />
                                                </div>
                                            </Button>
                                            {activeDropdown === 'highlight' && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                                                    <div className="absolute left-0 mt-1 p-2 rounded bg-white shadow-lg ring-1 ring-black/5 z-50 border border-slate-200 w-44">
                                                        <div className="grid grid-cols-5 gap-1.5 pb-2">
                                                            {highlightColors.map((color) => (
                                                                <button
                                                                    key={color.value}
                                                                    type="button"
                                                                    className="w-5 h-5 rounded border border-slate-200 hover:scale-110 transition-transform cursor-pointer shadow-sm"
                                                                    style={{ backgroundColor: color.value }}
                                                                    title={color.name}
                                                                    onClick={() => {
                                                                        editor?.chain().focus().setHighlight({ color: color.value }).run();
                                                                        setActiveDropdown(null);
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="border-t border-slate-100 pt-1.5 flex justify-center">
                                                            <button
                                                                type="button"
                                                                className="text-[10px] text-slate-500 hover:text-slate-950 font-semibold uppercase tracking-wider cursor-pointer"
                                                                onClick={() => {
                                                                    editor?.chain().focus().unsetHighlight().run();
                                                                    setActiveDropdown(null);
                                                                }}
                                                            >
                                                                Reset Highlight
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        {/* Alignments */}
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().setTextAlign('left').run()} 
                                            title="Align Left"
                                        >
                                            <AlignLeft className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().setTextAlign('center').run()} 
                                            title="Align Center"
                                        >
                                            <AlignCenter className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().setTextAlign('right').run()} 
                                            title="Align Right"
                                        >
                                            <AlignRight className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive({ textAlign: 'justify' }) ? 'bg-slate-100' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().setTextAlign('justify').run()} 
                                            title="Justify"
                                        >
                                            <AlignJustify className="h-3.5 w-3.5" />
                                        </Button>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        {/* Lists & Indents */}
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive('bulletList') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().toggleBulletList().run()} 
                                            title="Bullet List (Ctrl+Shift+8)"
                                        >
                                            <List className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className={`h-7 w-7 rounded ${editor?.isActive('orderedList') ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-100'}`} 
                                            onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
                                            title="Numbered List (Ctrl+Shift+7)"
                                        >
                                            <ListOrdered className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-40" 
                                            onClick={handleOutdent} 
                                            disabled={!(editor?.isActive('bulletList') || editor?.isActive('orderedList'))}
                                            title="Decrease Indent"
                                        >
                                            <Outdent className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-700 hover:bg-slate-100 disabled:opacity-40" 
                                            onClick={handleIndent} 
                                            disabled={!(editor?.isActive('bulletList') || editor?.isActive('orderedList'))}
                                            title="Increase Indent"
                                        >
                                            <Indent className="h-3.5 w-3.5" />
                                        </Button>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        {/* Miscellaneous Insert */}
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-700 hover:bg-slate-100" 
                                            onClick={handleOpenLinkModal} 
                                            title="Insert Link..."
                                        >
                                            <LinkIcon className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-700 hover:bg-slate-100" 
                                            onClick={handleInsertImagePrompt} 
                                            title="Insert Image..."
                                        >
                                            <ImageIcon className="h-3.5 w-3.5" />
                                        </Button>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        {/* Clear formatting */}
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-700 hover:bg-slate-100" 
                                            onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} 
                                            title="Clear Formatting"
                                        >
                                            <Baseline className="h-3.5 w-3.5" />
                                        </Button>

                                        <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                                        {/* Help dialog trigger */}
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 rounded text-slate-500 hover:bg-slate-100" 
                                            onClick={() => setHelpModalOpen(true)} 
                                            title="Help & Shortcuts"
                                        >
                                            <HelpCircle className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>

                                    {/* Actual Tiptap Rich Text Editor Content Viewport */}
                                    <div className="editor-viewport overflow-y-auto max-h-[450px]">
                                        <EditorContent editor={editor} className="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Button 
                            type="button"
                            size="sm" 
                            onClick={handleCloseForm}
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
                        </>
                    ) : (
                        <div className="flex-1 overflow-auto py-4 pr-2 custom-scrollbar">
                            <SEOForm
                                objectType="App\\StaticPage"
                                objectId={selectedItem?.id}
                                defaultPath={`/p/${formData.slug}`}
                                defaultTitle={formData.title}
                                defaultDescription={formData.content}
                                onSaveSuccess={handleCloseForm}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Modal */}
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

            {/* Insert/Edit Link Modal */}
            <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
                <DialogContent className="max-w-[450px] p-6 rounded-lg bg-white shadow-xl border border-slate-200 z-[9999]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
                        <DialogTitle className="text-lg font-semibold text-slate-900">Insert/Edit Link</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="link-url" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">URL</Label>
                            <Input 
                                id="link-url" 
                                className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm" 
                                value={linkData.url} 
                                onChange={(e) => setLinkData(prev => ({ ...prev, url: e.target.value }))} 
                                placeholder="https://example.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="link-text" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Text to display</Label>
                            <Input 
                                id="link-text" 
                                className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm" 
                                value={linkData.text} 
                                onChange={(e) => setLinkData(prev => ({ ...prev, text: e.target.value }))} 
                                placeholder="Text to show"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="link-title" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</Label>
                            <Input 
                                id="link-title" 
                                className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm" 
                                value={linkData.title} 
                                onChange={(e) => setLinkData(prev => ({ ...prev, title: e.target.value }))} 
                                placeholder="Link title (tooltip)"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="link-target" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open link in...</Label>
                            <select 
                                id="link-target"
                                className="w-full h-9 rounded border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 text-slate-700"
                                value={linkData.target}
                                onChange={(e) => setLinkData(prev => ({ ...prev, target: e.target.value }))}
                            >
                                <option value="_self">Current window</option>
                                <option value="_blank">New window</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                        <Button 
                            type="button" 
                            variant="secondary"
                            className="h-9 text-slate-600 px-4 rounded text-xs font-semibold"
                            onClick={() => setLinkModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded text-xs font-semibold"
                            onClick={handleSaveLink}
                        >
                            Save Link
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Source Html Editor Modal */}
            <Dialog open={sourceModalOpen} onOpenChange={setSourceModalOpen}>
                <DialogContent className="max-w-[700px] w-[90vw] p-6 rounded-lg bg-white shadow-xl border border-slate-200 z-[9999]">
                    <DialogHeader className="border-b border-slate-100 pb-3">
                        <DialogTitle className="text-lg font-semibold text-slate-900">HTML Source Code</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <textarea
                            className="w-full h-[320px] font-mono text-xs p-4 bg-slate-900 text-emerald-400 border border-slate-950 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 leading-normal resize-none"
                            value={sourceHtml}
                            onChange={(e) => setSourceHtml(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                        <Button 
                            type="button" 
                            variant="secondary"
                            className="h-9 text-slate-600 px-4 rounded text-xs font-semibold"
                            onClick={() => setSourceModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded text-xs font-semibold"
                            onClick={handleSaveSource}
                        >
                            Save HTML
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Word Count Stats Modal */}
            <Dialog open={wordCountModalOpen} onOpenChange={setWordCountModalOpen}>
                <DialogContent className="max-w-[360px] p-6 rounded-lg bg-white shadow-xl border border-slate-200 z-[9999]">
                    <DialogHeader className="border-b border-slate-100 pb-3">
                        <DialogTitle className="text-lg font-semibold text-slate-900">Document Statistics</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-3.5 text-sm text-slate-600">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                            <span className="font-medium">Words:</span>
                            <span className="font-bold text-slate-900 font-mono">{getWordCountStats().words}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                            <span className="font-medium">Characters:</span>
                            <span className="font-bold text-slate-900 font-mono">{getWordCountStats().characters}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="font-medium">Paragraphs:</span>
                            <span className="font-bold text-slate-900 font-mono">{getWordCountStats().paragraphs}</span>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
                        <Button 
                            type="button" 
                            className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold"
                            onClick={() => setWordCountModalOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Help & Shortcuts Modal */}
            <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
                <DialogContent className="max-w-[500px] p-6 rounded-lg bg-white shadow-xl border border-slate-200 z-[9999] max-h-[80vh] overflow-y-auto">
                    <DialogHeader className="border-b border-slate-100 pb-3">
                        <DialogTitle className="text-lg font-semibold text-slate-900">Help & Editor Shortcuts</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-5 text-xs text-slate-600">
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Keyboard Shortcuts</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span>Bold</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + B</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Italic</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + I</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Underline</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + U</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Strikethrough</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + Shift + X</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Bullet List</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + Shift + 8</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Numbered List</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + Shift + 7</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Undo</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + Z</kbd>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Redo</span>
                                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold">Ctrl + Y</kbd>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <h4 className="font-bold text-slate-900 text-sm mb-2 font-sans">Editor Features</h4>
                            <p className="leading-relaxed">
                                This editor supports markdown-like syntax triggers. You can type <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[11px] border border-slate-100 font-semibold">#</code> followed by a space to create a Heading 1, <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[11px] border border-slate-100 font-semibold">*</code> to start a bullet list, or <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[11px] border border-slate-100 font-semibold">1.</code> to start an ordered list.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="border-t border-slate-100 pt-4 mt-2">
                        <Button 
                            type="button" 
                            className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold"
                            onClick={() => setHelpModalOpen(false)}
                        >
                            Close Help
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Insert/Edit Image Modal */}
            <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
                <DialogContent className="max-w-[450px] p-6 rounded-lg bg-white shadow-xl border border-slate-200 z-[9999]">
                    <DialogHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
                        <DialogTitle className="text-lg font-semibold text-slate-900">Insert/Edit Image</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="image-src" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</Label>
                            <Input 
                                id="image-src" 
                                className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm" 
                                value={imageData.src} 
                                onChange={(e) => setImageData(prev => ({ ...prev, src: e.target.value }))} 
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="image-alt" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alternative description</Label>
                            <Input 
                                id="image-alt" 
                                className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm" 
                                value={imageData.alt} 
                                onChange={(e) => setImageData(prev => ({ ...prev, alt: e.target.value }))} 
                                placeholder="Alternative description"
                            />
                        </div>

                        <div className="flex gap-4 items-end">
                            <div className="space-y-1.5 flex-1">
                                <Label htmlFor="image-width" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Width</Label>
                                <Input 
                                    id="image-width" 
                                    className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm font-mono" 
                                    value={imageData.width} 
                                    onChange={(e) => handleWidthChange(e.target.value)} 
                                    placeholder="Auto"
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center pb-1 cursor-pointer" onClick={() => setImageData(prev => ({ ...prev, lockAspectRatio: !prev.lockAspectRatio }))}>
                                <div className={`p-1.5 rounded border ${imageData.lockAspectRatio ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`} title={imageData.lockAspectRatio ? "Constrain proportions" : "Do not constrain proportions"}>
                                    {imageData.lockAspectRatio ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5 flex-1">
                                <Label htmlFor="image-height" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Height</Label>
                                <Input 
                                    id="image-height" 
                                    className="h-9 border-slate-200 focus-visible:ring-indigo-500 rounded text-sm font-mono" 
                                    value={imageData.height} 
                                    onChange={(e) => handleHeightChange(e.target.value)} 
                                    placeholder="Auto"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
                        <Button 
                            type="button" 
                            variant="secondary"
                            className="h-9 text-slate-600 px-4 rounded text-xs font-semibold"
                            onClick={() => setImageModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded text-xs font-semibold"
                            onClick={handleSaveImage}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Custom Link & Image Style Injectors */}
            <style jsx global>{`
                .ProseMirror {
                    outline: none !important;
                    min-height: 420px;
                }
                .ProseMirror a {
                    color: #2563eb !important;
                    text-decoration: underline !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                }
                .ProseMirror img {
                    display: block;
                    max-width: 100%;
                    margin: 1.5rem auto;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
