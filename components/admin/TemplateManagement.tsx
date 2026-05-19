"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
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
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
    FileJson 
} from "lucide-react";
import { CourseTemplateItem } from "@/lib/admin-api";

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
        adminCategories,
        fetchCategories,
        adminSections,
        fetchSections,
        isLoading,
        error,
        successMessage,
        clearMessages
    } = useAdminStore();

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
                courseSections: [...sections].sort((a, b) => a.position - b.position)
            });
            setIsEditModalOpen(true);
        }
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

    // Deleting a section
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

    // Adding a preset/dynamic section
    const addPresetSection = (sec: any) => {
        const newSecId = generateUUID();
        const nextPos = editForm.courseSections.length;

        const newSectionItem = {
            course_id: "",
            title: sec.title,
            position: nextPos,
            content: "[]",
            section: {
                id: sec.id || newSecId,
                title: sec.title,
                code: sec.code,
                views: sec.views || sec.view || "title-description",
                form: sec.form || null,
                description: sec.description || null,
                type: sec.type || null,
                content: sec.content || null,
                section_id: sec.sectionId || null,
                fields: typeof sec.fields === 'string' ? sec.fields : JSON.stringify(sec.fields || []),
                created_by: sec.created_by || "system",
                updated_by: sec.updated_by || null,
                deleted_at: sec.deleted_at || null,
                created_at: sec.created_at || new Date().toISOString(),
                updated_at: sec.updated_at || new Date().toISOString(),
                section: null
            },
            view: sec.views || sec.view || "title-description"
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

    const handleFormSubmit = async () => {
        if (!editingTemplate) return;
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        const payload = {
            title: editForm.title,
            courseDetails: editForm.courseDetails,
            courseSections: editForm.courseSections
        };

        const res = await updateCourseTemplate(editingTemplate.id, payload);
        setIsSubmitting(false);
        if (res.success) {
            setActionSuccess("Template saved successfully!");
            fetchCourseTemplates();
            setTimeout(() => {
                setIsEditModalOpen(false);
            }, 1000);
        } else {
            setActionError(res.message || "Failed to save template.");
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <LayoutTemplate className="h-6 w-6 text-indigo-600" />
                    <span>Course Templates</span>
                </h1>
                <p className="text-slate-500 text-sm">
                    Configure structural presets, card layouts, schedule grids, and syllabus content for courses.
                </p>
            </div>

            {/* Template List Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-slate-900">All Core Templates</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                        Configure layout schemas for standard training programs and master courses.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading && adminCourseTemplates.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-b border-slate-100">
                                    <TableHead className="font-semibold text-slate-700 px-6 py-4">Template Title</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Category Mapped</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Sections Count</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Last Updated</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-right px-6 py-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminCourseTemplates.map((template) => {
                                    const details = template.data?.courseDetails || {};
                                    const sections = template.data?.courseSections || [];
                                    const category = adminCategories.find(c => c.id === details.category_id);

                                    return (
                                        <TableRow key={template.id} className="hover:bg-slate-50/40 border-b border-slate-100 transition-colors">
                                            <TableCell className="font-bold text-slate-900 px-6 py-4">
                                                {template.title}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {category ? (
                                                    <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 border font-semibold">
                                                        {category.title}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-slate-400 text-xs">None</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-semibold text-slate-700 py-4">
                                                {sections.length} sections
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-xs py-4">
                                                {new Date(template.updatedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right px-6 py-4">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 border-slate-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold gap-1.5"
                                                    onClick={() => handleOpenEdit(template.id)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Edit Layout
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {adminCourseTemplates.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-slate-500 text-sm font-medium">
                                            No templates found in database.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Template Core Editor Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
<DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            Configure Template: {editingTemplate?.title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Define structure, metadata parameters, and reorder elements.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Content Tabs */}
                    <div className="flex-1 overflow-auto py-4">
                        <Tabs defaultValue="sections" className="w-full h-full flex flex-col">
                            <TabsList className="grid grid-cols-2 max-w-sm mb-6 bg-slate-100 rounded-lg p-1">
                                <TabsTrigger value="sections" className="text-xs font-semibold rounded-md py-1.5">
                                    <Folder className="h-3.5 w-3.5 mr-1.5" />
                                    Sections Config
                                </TabsTrigger>
                                <TabsTrigger value="details" className="text-xs font-semibold rounded-md py-1.5">
                                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                                    Course Metadata
                                </TabsTrigger>
                            </TabsList>

                            {/* TAB 1: Sections Config */}
                            <TabsContent value="sections" className="flex-1 space-y-6">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <span className="text-xs font-bold text-slate-700">Add Predefined Section Preset:</span>
                                    <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-1 custom-scrollbar">
                                        {(adminSections.length > 0 ? adminSections : SECTION_PRESETS).map((sec: any) => (
                                            <Button 
                                                key={sec.id || sec.title}
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => addPresetSection(sec)}
                                                className="h-7 text-[10px] font-semibold border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 gap-1"
                                            >
                                                <Plus className="h-3 w-3" />
                                                {sec.title}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {editForm.courseSections.map((section, index) => {
                                        let itemsLength = 0;
                                        try {
                                            const arr = JSON.parse(section.content || "[]");
                                            if (Array.isArray(arr)) itemsLength = arr.length;
                                        } catch {}

                                        return (
                                            <div 
                                                key={index} 
                                                className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                            {index + 1}
                                                        </span>
                                                        <Input 
                                                            type="text" 
                                                            value={section.title} 
                                                            onChange={(e) => {
                                                                const updated = [...editForm.courseSections];
                                                                updated[index].title = e.target.value;
                                                                setEditForm(prev => ({ ...prev, courseSections: updated }));
                                                            }}
                                                            className="h-8 w-48 text-xs font-bold text-slate-900 border-slate-200 focus:border-indigo-500"
                                                        />
                                                        <Badge variant="secondary" className="font-mono text-[9px] bg-slate-50 text-slate-500 border border-slate-200 rounded">
                                                            {section.view}
                                                        </Badge>
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

                                                <div className="flex items-center gap-1.5">
                                                    {/* Move Up/Down */}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-600"
                                                        onClick={() => moveSection(index, 'up')}
                                                        disabled={index === 0}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 hover:bg-slate-100 rounded-lg text-slate-600"
                                                        onClick={() => moveSection(index, 'down')}
                                                        disabled={index === editForm.courseSections.length - 1}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                    {/* Content Row Editor */}
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => openContentEditor(index)}
                                                        className="h-8 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Edit Rows
                                                    </Button>
                                                    {/* Delete */}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-lg"
                                                        onClick={() => deleteSection(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {editForm.courseSections.length === 0 && (
                                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
                                            No sections mapped. Add a preset above!
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* TAB 2: Metadata */}
                            <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-xs font-bold text-slate-700">Template Title</Label>
                                        <Input 
                                            type="text" 
                                            value={editForm.title} 
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="h-10 text-xs border-slate-200"
                                            placeholder="Template Title (e.g. Courses)"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700">Training Category</Label>
                                        <select 
                                            value={editForm.courseDetails.category_id}
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                courseDetails: { ...prev.courseDetails, category_id: e.target.value }
                                            }))}
                                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-indigo-500 font-medium text-slate-700"
                                        >
                                            <option value="">None / Unmapped</option>
                                            {adminCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700">Duration Preset</Label>
                                        <Input 
                                            type="text" 
                                            value={editForm.courseDetails.duration} 
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                courseDetails: { ...prev.courseDetails, duration: e.target.value }
                                            }))}
                                            className="h-10 text-xs border-slate-200"
                                            placeholder="e.g. 40 Hours"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700">Live Projects Count</Label>
                                        <Input 
                                            type="text" 
                                            value={editForm.courseDetails.live_projects} 
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                courseDetails: { ...prev.courseDetails, live_projects: e.target.value }
                                            }))}
                                            className="h-10 text-xs border-slate-200"
                                            placeholder="e.g. 2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700">Training Format</Label>
                                        <Input 
                                            type="text" 
                                            value={editForm.courseDetails.training_format} 
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                courseDetails: { ...prev.courseDetails, training_format: e.target.value }
                                            }))}
                                            className="h-10 text-xs border-slate-200"
                                            placeholder="e.g. Live Online Class"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-700">Base Price (₹)</Label>
                                        <Input 
                                            type="text" 
                                            value={editForm.courseDetails.price} 
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                courseDetails: { ...prev.courseDetails, price: e.target.value }
                                            }))}
                                            className="h-10 text-xs border-slate-200"
                                            placeholder="e.g. 19999"
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label className="text-xs font-bold text-slate-700">Template Overview / Description</Label>
                                        <Textarea 
                                            value={editForm.courseDetails.description} 
                                            onChange={(e) => setEditForm(prev => ({
                                                ...prev,
                                                courseDetails: { ...prev.courseDetails, description: e.target.value }
                                            }))}
                                            className="text-xs border-slate-200 h-28"
                                            placeholder="Detail overview schema text..."
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Messages & Actions Footer */}
                    <div className="flex-shrink-0 pt-4 border-t border-slate-100 flex flex-col gap-3">
                        {actionError && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <span>{actionError}</span>
                            </div>
                        )}
                        {actionSuccess && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>{actionSuccess}</span>
                            </div>
                        )}
                        
                        <DialogFooter>
                            <Button 
                                variant="outline" 
                                className="h-10 text-xs font-semibold"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-xs font-semibold"
                                onClick={handleFormSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                                Save Template
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Inner Content Row Sub-Editor Modal */}
            <Dialog open={isContentEditorOpen} onOpenChange={setIsContentEditorOpen}>
                <DialogContent className="max-w-5xl w-[95vw] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-base font-bold text-slate-900">
                            Edit Content Rows: {activeSectionIndex !== null ? editForm.courseSections[activeSectionIndex]?.title : ""}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Manage records/rows inside this template section block.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Rows Editor List */}
                    <div className="flex-1 overflow-auto py-4 space-y-4">
                        {parsedContentRows.map((row, rIdx) => {
                            // Extract field inputs definitions from the section
                            const fieldsStr = activeSectionIndex !== null ? editForm.courseSections[activeSectionIndex]?.section?.fields : "[]";
                            let fields: any[] = [];
                            try {
                                fields = JSON.parse(fieldsStr || "[]");
                            } catch {}

                            return (
                                <Card key={rIdx} className="border border-slate-200 bg-white relative rounded-xl shadow-sm">
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between bg-slate-50/50 py-3 px-4 rounded-t-xl border-b border-slate-100">
                                        <CardTitle className="text-xs font-bold text-slate-700">Row #{rIdx + 1}</CardTitle>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => setParsedContentRows(prev => prev.filter((_, idx) => idx !== rIdx))}
                                            className="h-7 w-7 text-red-600 hover:bg-red-50 rounded-lg absolute top-2 right-2"
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
                                                            className="text-xs border-slate-200 min-h-[60px]"
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
                                                            className="h-8 text-xs border-slate-200"
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
                            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
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
                            className="h-8 text-xs font-semibold gap-1"
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
                            >
                                Cancel
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={saveContentRows}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
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
