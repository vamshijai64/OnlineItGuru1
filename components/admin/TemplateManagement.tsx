"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { 
    Loader2, 
    LayoutTemplate, 
    Edit, 
    ArrowUp, 
    ArrowDown, 
    Trash2, 
    Plus, 
    Folder, 
    Settings, 
    CheckCircle2, 
    AlertCircle, 
    FileJson,
    Search,
    BookOpen
} from "lucide-react";
import { CourseTemplateItem } from "@/lib/admin-api";
import CreateCourseForm from "./CreateCourseForm";

// Dynamic Client-side UUID generator
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Section presets that administrators can add dynamically to the template
const SECTION_PRESETS = [
    {
        title: "Objectives",
        code: "com.sadguru.TitleDescription",
        view: "title-description",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    },
    {
        title: "Key Features",
        code: "com.sadguru.TitleDescriptionWithIcon",
        view: "title-description-with-icon",
        fields: '[{"label":"Icon","name":"icon","type":"select","sourceType":"api","apiUrl":"font-awesome-icons"},{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    },
    {
        title: "Course Syllabus",
        code: "com.sadguru.TitleWithRichDescription",
        view: "title-rich-description",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"richText"}]'
    },
    {
        title: "Projects",
        code: "com.sadguru.TitleDescription",
        view: "title-description-card",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    },
    {
        title: "Training Options",
        code: "com.sadguru.RichTextCardList",
        view: "rich-text-card-list",
        fields: '[{"label":"Flag","name":"flag","type":"text"},{"label":"Html Text","name":"htmlText","type":"richText"}]'
    },
    {
        title: "Upcoming Batches",
        code: "com.sadguru.ScheduleCardList",
        view: "schedule-card-list",
        fields: '[{"label":"Date","name":"date","type":"date"},{"label":"Time","name":"time","type":"text"},{"label":"Week Label","name":"week_label","type":"text"}]'
    },
    {
        title: "FAQ'S",
        code: "com.sadguru.TitleDescription",
        view: "title-description-with-arrow-icon",
        fields: '[{"label":"Item Title","name":"itemTitle","type":"text"},{"label":"Item Description","name":"itemDescription","type":"textarea"}]'
    }
];

export default function TemplateManagement() {
    const { 
        adminCourseTemplates, 
        fetchCourseTemplates, 
        fetchCourseTemplateById,
        updateCourseTemplate,
        createCourseTemplate,
        deleteCourseTemplate,
        adminCategories,
        fetchCategories,
        adminSections,
        fetchSections,
        isLoading,
        error,
        successMessage,
        clearMessages
    } = useAdminStore();

    // Search and Pagination States
    const [searchQuery, setSearchQuery] = useState("");
    const [typedSearch, setTypedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Editor modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<CourseTemplateItem | null>(null);
    const [editForm, setEditForm] = useState<{
        title: string;
        courseDetails: {
            category_id: string;
            description: string;
            duration: string;
            live_projects: string;
            training_format: string;
            price: string;
        };
        courseSections: any[];
    }>({
        title: "",
        courseDetails: {
            category_id: "",
            description: "",
            duration: "",
            live_projects: "",
            training_format: "",
            price: ""
        },
        courseSections: []
    });

    // Create Course modal states (for prefilled course creation flow)
    const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
    const [selectedPrefillTemplate, setSelectedPrefillTemplate] = useState<CourseTemplateItem | null>(null);

    // Inner section content sub-editor states
    const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
    const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
    const [parsedContentRows, setParsedContentRows] = useState<any[]>([]);

    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCourseTemplates();
        fetchCategories();
        fetchSections();
    }, [fetchCourseTemplates, fetchCategories, fetchSections]);

    // Handle Search filter execution
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(typedSearch);
        setCurrentPage(1);
    };

    // Filtered & Paginated Templates
    const filteredTemplates = adminCourseTemplates.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredTemplates.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    // Initialize creation form
    const handleOpenCreate = () => {
        setActionError(null);
        setActionSuccess(null);
        clearMessages();
        setEditingTemplate(null);
        setEditForm({
            title: "",
            courseDetails: {
                category_id: "",
                description: "",
                duration: "",
                live_projects: "",
                training_format: "",
                price: ""
            },
            courseSections: []
        });
        setIsEditModalOpen(true);
    };

    // Fetch and initialize editor form
    const handleOpenEdit = async (id: string) => {
        setActionError(null);
        setActionSuccess(null);
        clearMessages();

        const fullTemplate = await fetchCourseTemplateById(id);
        if (fullTemplate) {
            setEditingTemplate(fullTemplate);
            
            // Map the parsed JSON safely
            const details = fullTemplate.data?.courseDetails || {};
            const sections = fullTemplate.data?.courseSections || [];

            const mappedSections = sections.map((sec: any) => {
                const sId = sec.section_id || sec.sectionId || sec.section?.id || sec.section?.section_id;
                const instId = sec.id || generateUUID();
                
                // Find matching definition to restore allowed views list
                const matchingDef = adminSections.find(s => s.id === sId || s.code === sec.section?.code) || 
                                    SECTION_PRESETS.find(p => p.code === sec.section?.code);
                const allowedViews = matchingDef ? ((matchingDef as any).views || (matchingDef as any).view || "") : "";

                return {
                    ...sec,
                    id: instId,
                    instanceId: instId,
                    section_id: sId,
                    sectionId: sId,
                    section: sec.section ? {
                        ...sec.section,
                        id: sId,
                        section_id: sId,
                        views: sec.section.views || allowedViews
                    } : {
                        id: sId,
                        section_id: sId,
                        views: allowedViews
                    }
                };
            });

            setEditForm({
                title: fullTemplate.title || "",
                courseDetails: {
                    category_id: details.category_id || "",
                    description: details.description || "",
                    duration: details.duration || "",
                    live_projects: details.live_projects || "",
                    training_format: details.training_format || "",
                    price: details.price || ""
                },
                courseSections: [...mappedSections].sort((a, b) => a.position - b.position)
            });
            setIsEditModalOpen(true);
        }
    };

    // Delete template handler
    const handleDeleteTemplate = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            const res = await deleteCourseTemplate(id);
            if (res.success) {
                fetchCourseTemplates();
            } else {
                alert(res.message || "Failed to delete template");
            }
        }
    };

    // Prefilled Course creation popup trigger
    const handleCreateCourseClick = (template: CourseTemplateItem) => {
        setSelectedPrefillTemplate(template);
        setIsCreateCourseOpen(true);
    };

    // Reordering sections
    const moveSection = (index: number, direction: 'up' | 'down') => {
        const sections = [...editForm.courseSections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= sections.length) return;

        // Swap positions
        const temp = sections[index];
        sections[index] = sections[targetIndex];
        sections[targetIndex] = temp;

        // Recalculate position variables
        const updated = sections.map((sec, idx) => ({
            ...sec,
            position: idx
        }));

        setEditForm(prev => ({
            ...prev,
            courseSections: updated
        }));
    };

    // Deleting a section from form
    const deleteSection = (index: number) => {
        const sections = editForm.courseSections.filter((_, idx) => idx !== index);
        const updated = sections.map((sec, idx) => ({
            ...sec,
            position: idx
        }));
        setEditForm(prev => ({
            ...prev,
            courseSections: updated
        }));
    };

    // Merge database definitions and code presets deduplicated
    const getAvailableSections = () => {
        const merged = [...adminSections];
        SECTION_PRESETS.forEach(preset => {
            const exists = merged.some(s => s.code === preset.code || s.title.toLowerCase() === preset.title.toLowerCase());
            if (!exists) {
                merged.push({
                    id: generateUUID(),
                    ...preset,
                    views: preset.view,
                    fields: preset.fields
                } as any);
            }
        });
        return merged;
    };

    // Adding a preset/dynamic section
    const addPresetSection = (sec: any) => {
        const nextPos = editForm.courseSections.length;
        const sId = sec.id || sec.section_id || sec.sectionId || generateUUID();
        const instId = generateUUID();

        const allowedViews = sec.views || sec.view || "title-description";

        const newSectionItem = {
            course_id: "",
            section_id: sId,
            sectionId: sId,
            id: instId,
            instanceId: instId,
            title: sec.title,
            position: nextPos,
            content: "[]",
            section: {
                id: sId,
                title: sec.title,
                code: sec.code,
                views: allowedViews,
                form: sec.form || null,
                description: sec.description || null,
                type: sec.type || null,
                content: sec.content || null,
                section_id: sId,
                fields: typeof sec.fields === 'string' ? sec.fields : JSON.stringify(sec.fields || []),
                created_by: sec.created_by || "system",
                updated_by: sec.updated_by || null,
                deleted_at: sec.deleted_at || null,
                created_at: sec.created_at || new Date().toISOString(),
                updated_at: sec.updated_at || new Date().toISOString(),
                section: null
            },
            view: allowedViews.split("|")[0]
        };

        setEditForm(prev => ({
            ...prev,
            courseSections: [...prev.courseSections, newSectionItem]
        }));
    };

    // Open Content editor dialog
    const openContentEditor = (index: number) => {
        const section = editForm.courseSections[index];
        let rows: any[] = [];
        try {
            rows = JSON.parse(section.content || "[]");
            if (!Array.isArray(rows)) rows = [];
        } catch {
            rows = [];
        }
        
        setActiveSectionIndex(index);
        setParsedContentRows(rows);
        setIsContentEditorOpen(true);
    };

    // Save edited content rows back to form state
    const saveContentRows = () => {
        if (activeSectionIndex === null) return;
        const sections = [...editForm.courseSections];
        sections[activeSectionIndex] = {
            ...sections[activeSectionIndex],
            content: JSON.stringify(parsedContentRows)
        };

        setEditForm(prev => ({
            ...prev,
            courseSections: sections
        }));
        setIsContentEditorOpen(false);
        setActiveSectionIndex(null);
    };

    // Submit Template Edit/Create
    const handleFormSubmit = async () => {
        if (!editForm.title.trim()) {
            setActionError("Template Title is required.");
            return;
        }
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        const cleanedSections = editForm.courseSections.map((sec: any) => {
            const sId = sec.section_id || sec.sectionId || sec.section?.id || sec.section?.section_id;
            return {
                course_id: sec.course_id || "",
                section_id: sId,
                sectionId: sId,
                title: sec.title,
                position: sec.position,
                content: sec.content || "[]",
                view: sec.view || sec.views || "title-description",
                section: sec.section ? {
                    ...sec.section,
                    id: sId,
                    section_id: sId
                } : {
                    id: sId,
                    section_id: sId,
                    title: sec.title,
                    code: sec.code || "",
                    views: sec.view || sec.views || "title-description",
                    fields: sec.fields || "[]"
                }
            };
        });

        const payload = {
            title: editForm.title,
            courseDetails: editForm.courseDetails,
            courseSections: cleanedSections
        };

        let res;
        if (editingTemplate) {
            res = await updateCourseTemplate(editingTemplate.id, payload);
        } else {
            res = await createCourseTemplate(payload);
        }

        setIsSubmitting(false);
        if (res.success) {
            setActionSuccess(editingTemplate ? "Template updated successfully!" : "Template created successfully!");
            fetchCourseTemplates();
            setTimeout(() => {
                setIsEditModalOpen(false);
                setEditingTemplate(null);
            }, 1200);
        } else {
            setActionError(res.message || "Failed to save template.");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <LayoutTemplate className="h-6 w-6 text-indigo-600 animate-pulse" />
                        <span>Course Templates</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Standardize course templates by configuring presets, layout schemas, batch setups, and syllabus.
                    </p>
                </div>
                
                {/* Search Bar & New Button (Screenshot 1 alignment) */}
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={handleOpenCreate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm text-sm h-10 px-5 gap-1.5"
                    >
                        <Plus className="h-4 w-4" />
                        new
                    </Button>

                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                type="text" 
                                placeholder="search" 
                                value={typedSearch} 
                                onChange={(e) => setTypedSearch(e.target.value)}
                                className="h-10 w-48 pl-9 text-xs border-slate-200 focus-visible:ring-indigo-500 rounded-lg"
                            />
                        </div>
                        <Button 
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10 px-4"
                        >
                            search
                        </Button>
                    </form>
                </div>
            </div>

            {/* Template Cards Grid (Screenshot 1 View) */}
            {isLoading && adminCourseTemplates.length === 0 ? (
                <div className="flex justify-center items-center py-32 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <span className="text-slate-500 text-xs font-semibold">Loading templates...</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedTemplates.map((template) => {
                            const details = template.data?.courseDetails || {};
                            const sections = template.data?.courseSections || [];
                            const category = adminCategories.find(c => c.id === details.category_id);

                            return (
                                <Card 
                                    key={template.id} 
                                    className="bg-white border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden group"
                                >
                                    <CardContent className="p-6 flex flex-col h-full justify-between gap-6">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                    {template.title}
                                                </h3>
                                                {category && (
                                                    <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 font-bold text-[9px] rounded-md py-0.5 px-1.5 shrink-0">
                                                        {category.title}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium mt-1">
                                                Created On : {template.createdAt}
                                            </p>
                                        </div>

                                        {/* Action buttons as text links at bottom left (Screenshot 1 match) */}
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold pt-4 border-t border-slate-50">
                                            <button 
                                                onClick={() => handleCreateCourseClick(template)}
                                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                Creat Course
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEdit(template.id)}
                                                className="text-indigo-600 hover:text-indigo-800 transition-colors"
                                            >
                                                Edit Template
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {filteredTemplates.length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold">
                                No course templates found. Create a new one using the "new" button.
                            </div>
                        )}
                    </div>

                    {/* Pagination controls matching Screenshot 1 layout */}
                    {totalItems > 0 && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="text-xs font-semibold text-slate-600">
                                {startIndex + 1} - {endIndex} of {totalItems}
                            </div>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, idx) => (
                                    <Button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`h-8 w-8 text-xs font-bold rounded-lg border transition-all ${
                                            currentPage === idx + 1 
                                                ? "bg-indigo-600 text-white border-indigo-600" 
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        {idx + 1}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TABLESS Template Editor Modal (Screenshot 3 View) */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="!max-w-none w-11/12 md:w-4/5 h-[94vh] max-h-[94vh] overflow-hidden flex flex-col rounded-2xl border-none shadow-2xl p-6 bg-white">
                    <DialogHeader className="flex-shrink-0 pb-4 border-b border-slate-100">
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Settings className="h-5 w-5 text-indigo-600 animate-spin-slow" />
                            {editingTemplate ? `Edit Course Template: ${editingTemplate.title}` : "Create New Course Template"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Define template structure, course defaults, pricing presets, and configure layout sections.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Tabless Scrollable Form (Screenshot 3) */}
                    <div className="flex-1 overflow-auto py-6 space-y-6 pr-2 custom-scrollbar">
                        {/* Part 1: Template Title */}
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                Template Settings
                            </h3>
                            <div className="space-y-1.5">
                                <Label htmlFor="templateTitle" className="text-xs font-bold text-slate-700">Template Title</Label>
                                <Input 
                                    id="templateTitle"
                                    type="text" 
                                    value={editForm.title} 
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="h-11 text-xs border-slate-200 bg-white focus-visible:ring-indigo-500 rounded-lg font-semibold"
                                    placeholder="Template Title (e.g. Master Program)"
                                    required
                                />
                            </div>
                        </div>

                        {/* Part 2: Course Details */}
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200/50 space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                Course Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700">Category</Label>
                                    <select 
                                        value={editForm.courseDetails.category_id}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            courseDetails: { ...prev.courseDetails, category_id: e.target.value }
                                        }))}
                                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                                    >
                                        <option value="">Select Category</option>
                                        {adminCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700">Live Projects</Label>
                                    <Input 
                                        type="text" 
                                        value={editForm.courseDetails.live_projects} 
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            courseDetails: { ...prev.courseDetails, live_projects: e.target.value }
                                        }))}
                                        className="h-11 text-xs border-slate-200 bg-white focus-visible:ring-indigo-500 rounded-lg"
                                        placeholder="e.g. 2"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700">Training Format</Label>
                                    <Input 
                                        type="text" 
                                        value={editForm.courseDetails.training_format} 
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            courseDetails: { ...prev.courseDetails, training_format: e.target.value }
                                        }))}
                                        className="h-11 text-xs border-slate-200 bg-white focus-visible:ring-indigo-500 rounded-lg"
                                        placeholder="e.g. Online"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700">Duration</Label>
                                    <Input 
                                        type="text" 
                                        value={editForm.courseDetails.duration} 
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            courseDetails: { ...prev.courseDetails, duration: e.target.value }
                                        }))}
                                        className="h-11 text-xs border-slate-200 bg-white focus-visible:ring-indigo-500 rounded-lg"
                                        placeholder="e.g. 40 Hours"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700">Price</Label>
                                    <Input 
                                        type="text" 
                                        value={editForm.courseDetails.price} 
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            courseDetails: { ...prev.courseDetails, price: e.target.value }
                                        }))}
                                        className="h-11 text-xs border-slate-200 bg-white focus-visible:ring-indigo-500 rounded-lg"
                                        placeholder="e.g. 9999"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                                    <Label className="text-xs font-bold text-slate-700">Description</Label>
                                    <Textarea 
                                        value={editForm.courseDetails.description} 
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            courseDetails: { ...prev.courseDetails, description: e.target.value }
                                        }))}
                                        className="text-xs border-slate-200 h-24 bg-white focus-visible:ring-indigo-500 rounded-lg p-3"
                                        placeholder="Template description"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Part 3: Course Sections Stack */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                Course Sections Configuration
                            </h3>

                            <div className="space-y-3">
                                {editForm.courseSections.map((section, index) => {
                                    let itemsLength = 0;
                                    try {
                                        const arr = JSON.parse(section.content || "[]");
                                        if (Array.isArray(arr)) itemsLength = arr.length;
                                    } catch {}

                                    return (
                                        <div 
                                            key={section.instanceId || section.id || index} 
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all"
                                        >
                                            <div className="space-y-1 flex-1 pr-4">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {index + 1}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500">Section -</span>
                                                    <Input 
                                                        type="text" 
                                                        value={section.title} 
                                                        onChange={(e) => {
                                                            const updated = [...editForm.courseSections];
                                                            updated[index].title = e.target.value;
                                                            setEditForm(prev => ({ ...prev, courseSections: updated }));
                                                        }}
                                                        className="h-9 w-60 text-xs font-bold text-slate-900 border-slate-200 focus-visible:ring-indigo-500 bg-white"
                                                    />
                                                    
                                                    {/* View layout selector dropdown */}
                                                    {(() => {
                                                        const allowedViews = (section.section?.views || section.section?.view || "title-description").split("|");
                                                        if (allowedViews.length <= 1) {
                                                            return (
                                                                <Badge variant="secondary" className="font-mono text-[9px] bg-slate-50 text-indigo-600 border border-slate-200 rounded">
                                                                    {section.view}
                                                                </Badge>
                                                            );
                                                        }
                                                        return (
                                                            <select
                                                                value={section.view}
                                                                onChange={(e) => {
                                                                    const updated = [...editForm.courseSections];
                                                                    updated[index] = { ...updated[index], view: e.target.value };
                                                                    setEditForm(prev => ({ ...prev, courseSections: updated }));
                                                                }}
                                                                className="h-8 rounded border border-slate-200 bg-white px-2 text-[10px] outline-none focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                                                            >
                                                                {allowedViews.map((v: string) => (
                                                                    <option key={v} value={v}>{v}</option>
                                                                ))}
                                                            </select>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] text-slate-500 pl-7">
                                                    <span>Code: <span className="font-mono text-slate-600">{section.section?.code}</span></span>
                                                    <span>•</span>
                                                    <span className="font-medium text-indigo-600 flex items-center gap-1">
                                                        <FileJson className="h-3 w-3" />
                                                        {itemsLength} Rows Defined
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-600"
                                                    onClick={() => moveSection(index, 'up')}
                                                    disabled={index === 0}
                                                    type="button"
                                                >
                                                    <ArrowUp className="h-4.5 w-4.5" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-600"
                                                    onClick={() => moveSection(index, 'down')}
                                                    disabled={index === editForm.courseSections.length - 1}
                                                    type="button"
                                                >
                                                    <ArrowDown className="h-4.5 w-4.5" />
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => openContentEditor(index)}
                                                    className="h-8 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                                                    type="button"
                                                >
                                                    Edit Rows
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-lg"
                                                    onClick={() => deleteSection(index)}
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4.5 w-4.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {editForm.courseSections.length === 0 && (
                                    <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs font-semibold">
                                        No sections mapped. Select presets below to add layouts!
                                    </div>
                                )}
                            </div>

                            {/* Preset Add Toolbar */}
                            <div className="flex flex-col gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-200/50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-bold text-slate-700">Add Predefined Section:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {getAvailableSections().slice(0, 8).map((sec: any) => (
                                            <Button
                                                key={sec.id || sec.title}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addPresetSection(sec)}
                                                className="h-8 text-[10px] font-bold border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 gap-1 bg-white"
                                                type="button"
                                            >
                                                <Plus className="h-3 w-3" />
                                                {sec.title}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 border-t border-slate-200/60">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Select from all schemas:</span>
                                    <div className="flex-1 flex gap-2">
                                        <select
                                            id="all-sections-select"
                                            className="h-9 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs outline-none focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                                        >
                                            <option value="">Choose a section type...</option>
                                            {getAvailableSections().map((sec: any) => (
                                                <option key={sec.id || sec.title} value={JSON.stringify(sec)}>
                                                    {sec.title} ({sec.code || sec.views || sec.view})
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                const selectEl = document.getElementById('all-sections-select') as HTMLSelectElement;
                                                if (selectEl && selectEl.value) {
                                                    try {
                                                        const sec = JSON.parse(selectEl.value);
                                                        addPresetSection(sec);
                                                        selectEl.value = "";
                                                    } catch {}
                                                }
                                            }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs font-semibold px-4 shrink-0"
                                        >
                                            Add Selected
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Messages & Actions Footer */}
                    <div className="flex-shrink-0 pt-4 border-t border-slate-100 flex flex-col gap-3">
                        {actionError && (
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <span>{actionError}</span>
                            </div>
                        )}
                        {actionSuccess && (
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>{actionSuccess}</span>
                            </div>
                        )}
                        
                        <DialogFooter className="gap-2">
                            <Button 
                                variant="outline" 
                                className="h-10 text-xs font-semibold border-slate-200 text-slate-600"
                                onClick={() => setIsEditModalOpen(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-xs font-semibold"
                                onClick={handleFormSubmit}
                                disabled={isSubmitting}
                                type="button"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                                Save Template
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* PREFILLED Course Creation Modal (Screenshot 2 Flow) */}
            <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border-none shadow-2xl p-6 bg-white">
                    <DialogHeader className="pb-4 border-b border-slate-100 flex-shrink-0">
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            <span>Create Course</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Define configuration and metadata details for the new course cloned from "{selectedPrefillTemplate?.title}".
                        </DialogDescription>
                    </DialogHeader>

                    {/* Pre-filled creation form */}
                    <div className="flex-1 overflow-auto py-4">
                        <CreateCourseForm 
                            prefillFromTemplate={selectedPrefillTemplate}
                            onSuccess={() => {
                                setIsCreateCourseOpen(false);
                                setSelectedPrefillTemplate(null);
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Inner Content Row Sub-Editor Modal */}
            <Dialog open={isContentEditorOpen} onOpenChange={setIsContentEditorOpen}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border-none shadow-2xl p-6">
                    <DialogHeader className="flex-shrink-0 pb-4 border-b border-slate-100">
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Edit Content Rows: {activeSectionIndex !== null ? editForm.courseSections[activeSectionIndex]?.title : ""}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Manage records/rows inside this template section block.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Rows Editor List */}
                    <div className="flex-1 overflow-auto py-4 space-y-4 pr-1 custom-scrollbar">
                        {parsedContentRows.map((row, rIdx) => {
                            // Extract field inputs definitions from the section
                            const fieldsStr = activeSectionIndex !== null ? editForm.courseSections[activeSectionIndex]?.section?.fields : "[]";
                            let fields: any[] = [];
                            try {
                                fields = JSON.parse(fieldsStr || "[]");
                            } catch {}

                            return (
                                <Card key={rIdx} className="border border-slate-200 bg-white relative rounded-xl shadow-sm overflow-hidden">
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between bg-slate-50/50 py-3 px-4 rounded-t-xl border-b border-slate-100">
                                        <CardTitle className="text-xs font-bold text-slate-700">Row #{rIdx + 1}</CardTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setParsedContentRows(prev => prev.filter((_, idx) => idx !== rIdx))}
                                            className="h-7 w-7 text-red-600 hover:bg-red-50 rounded-lg absolute top-2 right-2"
                                            type="button"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        {fields.map((f: any) => {
                                            const value = row[f.name] || "";
                                            
                                            return (
                                                <div key={f.name} className="space-y-1.5">
                                                    <Label className="text-[10px] font-bold text-slate-600 capitalize">{f.label}</Label>
                                                    {f.type === 'textarea' || f.type === 'richText' ? (
                                                        <Textarea 
                                                            value={value} 
                                                            onChange={(e) => {
                                                                const updated = [...parsedContentRows];
                                                                updated[rIdx] = { ...updated[rIdx], [f.name]: e.target.value };
                                                                setParsedContentRows(updated);
                                                            }}
                                                            className="text-xs border-slate-200 min-h-[60px] bg-white focus-visible:ring-indigo-500 rounded-lg"
                                                            placeholder={`Enter ${f.label}...`}
                                                        />
                                                    ) : (
                                                        <Input 
                                                            type={f.type === 'date' ? 'date' : 'text'} 
                                                            value={value} 
                                                            onChange={(e) => {
                                                                const updated = [...parsedContentRows];
                                                                updated[rIdx] = { ...updated[rIdx], [f.name]: e.target.value };
                                                                setParsedContentRows(updated);
                                                            }}
                                                            className="h-8 text-xs border-slate-200 bg-white focus-visible:ring-indigo-500 rounded-lg"
                                                            placeholder={`Enter ${f.label}...`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            );
                        })}

                        {parsedContentRows.length === 0 && (
                            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs font-semibold">
                                No content records defined. Click below to add a new row!
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                                const fieldsStr = activeSectionIndex !== null ? editForm.courseSections[activeSectionIndex]?.section?.fields : "[]";
                                let fields: any[] = [];
                                try {
                                    fields = JSON.parse(fieldsStr || "[]");
                                } catch {}

                                // Build empty initial object
                                const newObj: any = {};
                                fields.forEach((f: any) => {
                                    newObj[f.name] = "";
                                });

                                setParsedContentRows(prev => [...prev, newObj]);
                            }}
                            className="h-8 text-xs font-semibold gap-1 border-slate-200 text-slate-700 hover:bg-slate-50 bg-white"
                            type="button"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Record Row
                        </Button>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    setIsContentEditorOpen(false);
                                    setActiveSectionIndex(null);
                                }}
                                type="button"
                                className="border-slate-200 text-slate-600"
                            >
                                Cancel
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={saveContentRows}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                                type="button"
                            >
                                Save Content Rows
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
