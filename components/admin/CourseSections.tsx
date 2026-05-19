"use client";

import { useState, useEffect, Fragment } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    ChevronLeft,
    Loader2,
    GripVertical,
    Plus,
    Edit,
    Trash2,
    Database,
    Braces,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Settings,
    FileText,
    ChevronDown,
    ChevronUp
} from "lucide-react";

const getTemplateData = (template: any) => {
    let courseDetails = {};
    let courseSections: any[] = [];

    if (template && template.data) {
        if (typeof template.data === 'string') {
            try {
                const parsed = JSON.parse(template.data);
                courseDetails = parsed.courseDetails || {};
                courseSections = parsed.courseSections || [];
            } catch (e) {
                console.error("Failed to parse template.data string:", e);
            }
        } else if (typeof template.data === 'object') {
            courseDetails = template.data.courseDetails || {};
            courseSections = template.data.courseSections || [];
        }
    }
    return { courseDetails, courseSections };
};

export default function CourseSections({
    courseId,
    courseTitle,
    onBack
}: {
    courseId: string;
    courseTitle: string;
    onBack: () => void;
}) {
    const {
        adminSections,
        fetchSections,
        isLoading,
        fetchCourseById,
        fetchCourseTemplateById,
        updateCourseTemplate,
        adminCourseTemplates,
        fetchCourseTemplates,
        updateCourse
    } = useAdminStore();

    const [course, setCourse] = useState<any | null>(null);
    const [template, setTemplate] = useState<any | null>(null);
    const [noTemplateError, setNoTemplateError] = useState<boolean>(false);

    const [localSections, setLocalSections] = useState<any[]>([]);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Dialog Modal States
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any | null>(null);
    const [form, setForm] = useState({
        title: "",
        sectionId: "",
        view: "",
        position: 0
    });

    // Content Editor States (Actual Section Row Data Editor)
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any | null>(null);
    const [contentRows, setContentRows] = useState<any[]>([]);
    const [schemaFields, setSchemaFields] = useState<any[]>([]);

    // Notification feedback states
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete section confirmation states
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Initialize list and definitions
    useEffect(() => {
        const loadCourseAndTemplate = async () => {
            if (courseId) {
                const c = await fetchCourseById(courseId);
                if (c) {
                    setCourse(c);
                    const templateId = c.courseTemplateId || c.course_template_id;
                    const isValidId = templateId &&
                        templateId !== "course-template-id" &&
                        templateId !== "course_template_id" &&
                        templateId !== "none";
                    if (isValidId) {
                        const t = await fetchCourseTemplateById(templateId);
                        if (t) {
                            setTemplate(t);
                            const { courseSections: parsedSections } = getTemplateData(t);
                            setLocalSections([...parsedSections].sort((a, b) => a.position - b.position));
                            setNoTemplateError(false);
                        } else {
                            setNoTemplateError(true);
                        }
                    } else {
                        setNoTemplateError(true);
                    }
                }
            }
        };
        loadCourseAndTemplate();
        fetchSections(1, 100);
        fetchCourseTemplates();
    }, [courseId, fetchCourseById, fetchCourseTemplateById, fetchSections, fetchCourseTemplates]);

    // Drag-and-Drop Handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleDragLeave = (e: React.DragEvent, index: number) => {
        if (dragOverIndex === index) {
            setDragOverIndex(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (draggedIndex === null || draggedIndex === index) return;

        const newSections = [...localSections];
        const draggedItem = newSections[draggedIndex];
        newSections.splice(draggedIndex, 1);
        newSections.splice(index, 0, draggedItem);

        // Re-index positions
        const reindexed = newSections.map((sec, idx) => ({
            ...sec,
            position: idx
        }));

        setLocalSections(reindexed);
        setDraggedIndex(null);
        setHasChanges(true);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleSavePositions = async () => {
        if (!template) return;
        setIsSaving(true);
        setActionError(null);
        setActionSuccess(null);

        const { courseDetails } = getTemplateData(template);
        const payload = {
            title: template.title,
            courseDetails,
            courseSections: localSections
        };

        const res = await updateCourseTemplate(template.id, payload);
        if (res.success) {
            setHasChanges(false);
            setActionSuccess("Sorting order saved successfully!");
            // Refresh
            const t = await fetchCourseTemplateById(template.id);
            if (t) {
                setTemplate(t);
                const { courseSections: parsedSections } = getTemplateData(t);
                setLocalSections([...parsedSections].sort((a, b) => a.position - b.position));
            }
        } else {
            setActionError(res.message || "Failed to save reordered positions.");
        }
        setIsSaving(false);
    };

    // Open Add Section modal
    const openCreate = () => {
        setEditingSection(null);
        setActionError(null);
        setActionSuccess(null);

        // Auto-select first template definition if available
        const defaultDef = adminSections[0];
        setForm({
            title: defaultDef ? defaultDef.title : "",
            sectionId: defaultDef ? defaultDef.id : "",
            view: defaultDef ? (defaultDef.views || "default").split("|")[0] : "default",
            position: localSections.length
        });
        setIsFormOpen(true);
    };

    // Open Edit Header modal
    const openEdit = (sec: any) => {
        setEditingSection(sec);
        setActionError(null);
        setActionSuccess(null);
        setForm({
            title: sec.title || "",
            sectionId: sec.section?.id || "",
            view: sec.view || "default",
            position: sec.position || 0
        });
        setIsFormOpen(true);
    };

    // Update form when template dropdown selection switches
    const handleTemplateChange = (secId: string) => {
        const matched = adminSections.find(s => s.id === secId);
        if (matched) {
            setForm(prev => ({
                ...prev,
                sectionId: secId,
                title: matched.title || "",
                view: (matched.views || "default").split("|")[0]
            }));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!template) return;
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        let updatedSections = [];
        if (editingSection) {
            // Edit Header of existing section
            updatedSections = localSections.map((sec, idx) => {
                if (idx === localSections.indexOf(editingSection)) {
                    return {
                        ...sec,
                        title: form.title,
                        view: form.view
                    };
                }
                return sec;
            });
        } else {
            // Add new section template mapping
            const selectedDef = adminSections.find(s => s.id === form.sectionId);
            const newSectionItem = {
                course_id: "",
                title: form.title,
                position: form.position,
                content: "[]",
                section: {
                    id: form.sectionId,
                    title: selectedDef?.title || "",
                    code: selectedDef?.code || "",
                    views: selectedDef?.views || "",
                    fields: selectedDef?.fields || "[]"
                },
                view: form.view
            };
            updatedSections = [...localSections, newSectionItem];
        }

        const { courseDetails } = getTemplateData(template);
        const payload = {
            title: template.title,
            courseDetails,
            courseSections: updatedSections
        };

        const res = await updateCourseTemplate(template.id, payload);
        setIsSubmitting(false);

        if (res.success) {
            setActionSuccess(editingSection ? "Section updated successfully!" : "Section added successfully!");
            // Refresh
            const t = await fetchCourseTemplateById(template.id);
            if (t) {
                setTemplate(t);
                const { courseSections: parsedSections } = getTemplateData(t);
                setLocalSections([...parsedSections].sort((a, b) => a.position - b.position));
            }
            setTimeout(() => {
                setIsFormOpen(false);
            }, 1200);
        } else {
            setActionError(res.message || "Failed to save curriculum section layout.");
        }
    };

    // Content Editor Handlers (Editing Section Data Records)
    const openContentEditor = (sec: any) => {
        setSelectedSection(sec);
        setActionError(null);
        setActionSuccess(null);

        // Decode content array
        let parsedRows: any[] = [];
        if (sec.content) {
            if (typeof sec.content === 'object') {
                parsedRows = Array.isArray(sec.content) ? sec.content : [];
            } else {
                try {
                    parsedRows = JSON.parse(sec.content);
                    if (!Array.isArray(parsedRows)) parsedRows = [];
                } catch {
                    parsedRows = [];
                }
            }
        }

        // Fallback to global section content if local content is empty
        if (parsedRows.length === 0 && sec.section?.content) {
            try {
                const globalParsed = JSON.parse(sec.section.content);
                if (Array.isArray(globalParsed)) {
                    parsedRows = globalParsed;
                }
            } catch { }
        }
        setContentRows(parsedRows);

        // Decode schema fields
        let parsedFields: any[] = [];
        const rawFields = sec.section?.fields;
        if (rawFields) {
            if (typeof rawFields === 'object') {
                parsedFields = Array.isArray(rawFields) ? rawFields : [];
            } else {
                try {
                    parsedFields = JSON.parse(rawFields);
                    if (!Array.isArray(parsedFields)) parsedFields = [];
                } catch {
                    parsedFields = [];
                }
            }
        }

        // If schema is empty, provide dynamic default schema fields
        if (parsedFields.length === 0) {
            parsedFields = [
                { label: "Item Title", name: "itemTitle", type: "text" },
                { label: "Item Description", name: "itemDescription", type: "textarea" }
            ];
        }
        setSchemaFields(parsedFields);
        setIsContentOpen(true);
    };

    const addContentRow = () => {
        const newRow: any = {};
        schemaFields.forEach(f => {
            newRow[f.name] = "";
        });
        setContentRows(prev => [...prev, newRow]);
    };

    const removeContentRow = (idx: number) => {
        setContentRows(prev => prev.filter((_, i) => i !== idx));
    };

    const updateContentValue = (rowIdx: number, fieldName: string, value: string) => {
        const updated = [...contentRows];
        updated[rowIdx] = { ...updated[rowIdx], [fieldName]: value };
        setContentRows(updated);
    };

    const handleSaveContent = async () => {
        if (!selectedSection || !template) return;
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        const updatedSections = localSections.map((sec, idx) => {
            if (idx === localSections.indexOf(selectedSection)) {
                return {
                    ...sec,
                    content: JSON.stringify(contentRows)
                };
            }
            return sec;
        });

        const { courseDetails } = getTemplateData(template);
        const payload = {
            title: template.title,
            courseDetails,
            courseSections: updatedSections
        };

        const res = await updateCourseTemplate(template.id, payload);
        setIsSubmitting(false);
        if (res.success) {
            setActionSuccess("Section contents saved successfully!");
            // Refresh
            const t = await fetchCourseTemplateById(template.id);
            if (t) {
                setTemplate(t);
                const { courseSections: parsedSections } = getTemplateData(t);
                setLocalSections([...parsedSections].sort((a, b) => a.position - b.position));
            }
            setTimeout(() => {
                setIsContentOpen(false);
            }, 1200);
        } else {
            setActionError(res.message || "Failed to update section record items.");
        }
    };

    // Deletion Handlers
    const triggerDelete = (index: number) => {
        setDeleteIndex(index);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteIndex === null || !template) return;
        setIsSubmitting(true);
        setActionError(null);

        const updatedSections = localSections.filter((_, idx) => idx !== deleteIndex);
        const reindexed = updatedSections.map((sec, idx) => ({
            ...sec,
            position: idx
        }));

        const { courseDetails } = getTemplateData(template);
        const payload = {
            title: template.title,
            courseDetails,
            courseSections: reindexed
        };

        const res = await updateCourseTemplate(template.id, payload);
        setIsSubmitting(false);
        setIsDeleteOpen(false);
        if (res.success) {
            // Refresh
            const t = await fetchCourseTemplateById(template.id);
            if (t) {
                setTemplate(t);
                const { courseSections: parsedSections } = getTemplateData(t);
                setLocalSections([...parsedSections].sort((a, b) => a.position - b.position));
            }
        } else {
            setActionError(res.message || "Failed to remove course widget.");
        }
    };

    const hasValidTemplate = course &&
        (course.courseTemplateId || course.course_template_id) &&
        (course.courseTemplateId || course.course_template_id) !== "course-template-id" &&
        (course.courseTemplateId || course.course_template_id) !== "course_template_id" &&
        (course.courseTemplateId || course.course_template_id) !== "none";

    if (noTemplateError || !hasValidTemplate) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <Card className="max-w-xl w-full border border-slate-200/80 shadow-xl shadow-slate-100/50 rounded-2xl overflow-hidden bg-white">
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-5">
                        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="h-5 w-5 text-indigo-500 animate-spin-slow" />
                            <span>Attach Course Template</span>
                        </CardTitle>
                        <CardDescription className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                            This course does not have a course template attached. Please select a template to build and configure its curriculum sections.
                        </CardDescription>
                    </div>
                    <CardContent className="space-y-5 p-6 bg-white">
                        <div className="space-y-2">
                            <Label htmlFor="templateSelect" className="text-xs font-bold text-slate-700">Available Templates</Label>
                            <Select
                                onValueChange={async (templateId) => {
                                    setActionError(null);
                                    setActionSuccess(null);
                                    try {
                                        const updatedPayload = {
                                            type: course.type || course.courseType || "Standard Course",
                                            title: course.title || "",
                                            subTitle: course.subTitle || course.subtitle || "",
                                            slug: course.slug || "",
                                            extraUrlTitle: course.extraUrlTitle || "Resources",
                                            extraUrls: course.extraUrls || "",
                                            categoryId: course.categoryId || "",
                                            courseOverview: course.courseOverview || course.description || "",
                                            description: course.description || course.courseOverview || "",
                                            duration: course.duration || "",
                                            assignments: Number(course.assignments) || 0,
                                            liveProjects: String(course.liveProjects ?? "0"),
                                            downloadableResources: Number(course.downloadableResources ?? course.resources ?? 0),
                                            selfPacedPrice: String(course.selfPacedPrice ?? course.price ?? ""),
                                            liveOnlinePrice: String(course.liveOnlinePrice ?? course.livePrice ?? ""),
                                            youtubeDemoUrl: course.youtubeDemoUrl || course.youtubeDemo || "",
                                            demoVideo: course.demoVideo || "",
                                            previewImage: course.previewImage || "",
                                            syllabus: course.syllabus || "",
                                            rating: Number(course.rating ?? 5),
                                            totalReviews: Number(course.totalReviews ?? 0),
                                            totalLearners: Number(course.totalLearners ?? 0),
                                            selectedCourses: Array.isArray(course.selectedCourses) ? course.selectedCourses : [],
                                            status: course.status || "active",
                                            courseTemplateId: templateId,
                                            course_template_id: templateId
                                        };
                                        const res = await updateCourse(course.id, updatedPayload);
                                        if (res.success) {
                                            setActionSuccess("Template associated successfully! Loading curriculum...");
                                            // Reload course details
                                            const c = await fetchCourseById(courseId);
                                            if (c) {
                                                setCourse(c);
                                                const t = await fetchCourseTemplateById(templateId);
                                                if (t) {
                                                    setTemplate(t);
                                                    const { courseSections: parsedSections } = getTemplateData(t);
                                                    setLocalSections([...parsedSections].sort((a, b) => a.position - b.position));
                                                    setNoTemplateError(false);
                                                }
                                            }
                                        } else {
                                            setActionError(res.message || "Failed to attach template.");
                                        }
                                    } catch (err: any) {
                                        setActionError(err.message || "Failed to attach template.");
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full bg-white border-slate-200 text-slate-800 h-11 rounded-xl text-xs font-semibold">
                                    <SelectValue placeholder="-- Select Course Template --" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {adminCourseTemplates.map((t) => (
                                        <SelectItem key={t.id} value={t.id} className="text-xs font-semibold text-slate-700">{t.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {actionError && (
                            <div className="bg-red-50 text-red-600 border border-red-200 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                <span>{actionError}</span>
                            </div>
                        )}
                        {actionSuccess && (
                            <div className="bg-emerald-50 text-emerald-600 border border-emerald-200 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                <span>{actionSuccess}</span>
                            </div>
                        )}
                    </CardContent>
                    <div className="flex justify-between border-t border-slate-100 pt-4 px-6 pb-6 bg-slate-50/30">
                        <Button variant="ghost" className="text-xs font-bold text-slate-500 hover:bg-slate-100" onClick={onBack}>Back to Courses</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onBack}
                        className="h-10 w-10 border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Curriculum for <span className="text-indigo-600">{courseTitle}</span>
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Organize lessons, map active layouts, and visual design records inside page widgets.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <Button
                            onClick={handleSavePositions}
                            disabled={isSaving}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-md shadow-emerald-100"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Save Sort Order
                        </Button>
                    )}
                    <Button
                        onClick={openCreate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Add Custom Widget
                    </Button>
                </div>
            </div>

            {/* Table Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
                <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg font-bold text-slate-900">Interactive Curriculum Map</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">
                        Drag the handles to rearrange display positions. Edit schemas or change content records directly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading && localSections.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/30">
                                <TableRow className="border-b border-slate-100">
                                    <TableHead className="w-12 px-6 py-4"></TableHead>
                                    <TableHead className="w-10 py-4"></TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Section Display Title</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Template Binding</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">View Type</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Row Content Records</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-right px-6 py-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {localSections.map((sec, index) => {
                                    let recordCount = 0;
                                    let parsedRows: any[] = [];
                                    try {
                                        let parsed = JSON.parse(sec.content || "[]");
                                        if ((!Array.isArray(parsed) || parsed.length === 0) && sec.section?.content) {
                                            parsed = JSON.parse(sec.section.content);
                                        }
                                        if (Array.isArray(parsed)) {
                                            parsedRows = parsed;
                                            recordCount = parsed.length;
                                        }
                                    } catch { }

                                    const isExpanded = !!expandedSections[sec.id || `sec-${index}`];

                                    return (
                                        <Fragment key={sec.id || `sec-${index}`}>
                                            <TableRow
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, index)}
                                                onDragOver={handleDragOver}
                                                onDragEnter={(e) => handleDragEnter(e, index)}
                                                onDragLeave={(e) => handleDragLeave(e, index)}
                                                onDrop={(e) => handleDrop(e, index)}
                                                onDragEnd={handleDragEnd}
                                                className={`transition-colors cursor-move border-b border-slate-100
                                                    ${draggedIndex === index ? "opacity-30 bg-slate-100" : ""}
                                                    ${dragOverIndex === index ? "!bg-indigo-50/70 outline outline-2 outline-indigo-500 shadow-md relative z-10" : "hover:bg-slate-50/30"}
                                                `}
                                            >
                                                <TableCell className="w-12 px-6 py-4">
                                                    <div className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-100 rounded text-slate-400">
                                                        <GripVertical className="h-4 w-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="w-10 py-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const id = sec.id || `sec-${index}`;
                                                            setExpandedSections(prev => ({
                                                                ...prev,
                                                                [id]: !prev[id]
                                                            }));
                                                        }}
                                                        className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="font-bold text-slate-900 py-4">
                                                    <div>{sec.title}</div>
                                                    {recordCount > 0 && (
                                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                                            {parsedRows.slice(0, 3).map((item: any, idx: number) => {
                                                                const text = item.title || item.itemTitle || item.name || item.heading || Object.values(item)[0] || "";
                                                                if (!text) return null;
                                                                return (
                                                                    <Badge key={idx} variant="secondary" className="text-[9px] bg-slate-50 text-slate-500 font-semibold border border-slate-200/60 px-1.5 py-0">
                                                                        {String(text).substring(0, 25)}
                                                                    </Badge>
                                                                );
                                                            })}
                                                            {recordCount > 3 && (
                                                                <span className="text-[9px] text-slate-400 font-semibold self-center ml-0.5">
                                                                    +{recordCount - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-slate-700">
                                                            {sec.section?.title || "Custom Section"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {sec.section?.code || "custom.code"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="outline" className="font-semibold px-2 py-0.5 rounded text-indigo-600 bg-indigo-50/50 border-indigo-100 font-mono text-[10px]">
                                                        {sec.view}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                        <Database className="h-3.5 w-3.5 text-indigo-500" />
                                                        {recordCount} records
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right px-6 py-4">
                                                    {/* Edit Records Data Button */}
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openContentEditor(sec)}
                                                        className="h-8 text-xs font-semibold text-indigo-600 border-slate-200 hover:bg-indigo-50 mr-1.5 gap-1 shadow-sm"
                                                    >
                                                        <Braces className="h-3.5 w-3.5 text-indigo-600" />
                                                        Edit Data Content
                                                    </Button>

                                                    {/* Edit Section Header Settings */}
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEdit(sec)}
                                                        className="h-8 w-8 text-slate-600 border-slate-200 hover:bg-slate-100 mr-1.5"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>

                                                    {/* Delete Section Button */}
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => triggerDelete(index)}
                                                        className="h-8 w-8 text-red-600 border-slate-200 hover:bg-red-50 hover:border-red-100"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            {isExpanded && (
                                                <TableRow className="bg-slate-50/40 hover:bg-slate-50/40 border-b border-slate-100">
                                                    <TableCell colSpan={9} className="px-14 py-5">
                                                        <div className="bg-white border border-slate-100 rounded-xl p-5 space-y-4 shadow-sm">
                                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                                                    <Database className="h-4 w-4 text-indigo-500" />
                                                                    Active Content Records ({recordCount})
                                                                </span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openContentEditor(sec)}
                                                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-[10px] h-7 px-2.5 rounded-lg border border-indigo-100 gap-1"
                                                                >
                                                                    <Braces className="h-3 w-3" />
                                                                    Edit Content Data
                                                                </Button>
                                                            </div>

                                                            {recordCount === 0 ? (
                                                                <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                                                    <p className="text-xs text-slate-500 font-semibold mb-2.5">
                                                                        No active records populated inside this section yet.
                                                                    </p>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => openContentEditor(sec)}
                                                                        className="h-8 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg gap-1 px-3 shadow-md shadow-indigo-100"
                                                                    >
                                                                        <Plus className="h-3.5 w-3.5" />
                                                                        Add First Record
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                                                                    {parsedRows.map((item: any, rowIdx: number) => {
                                                                        let parsedFields: any[] = [];
                                                                        const rawFields = sec.section?.fields;
                                                                        if (rawFields) {
                                                                            if (typeof rawFields === 'object') {
                                                                                parsedFields = Array.isArray(rawFields) ? rawFields : [];
                                                                            } else {
                                                                                try {
                                                                                    parsedFields = JSON.parse(rawFields);
                                                                                } catch { }
                                                                            }
                                                                        }
                                                                        if (parsedFields.length === 0) {
                                                                            parsedFields = [
                                                                                { label: "Item Title", name: "itemTitle" },
                                                                                { label: "Item Description", name: "itemDescription" }
                                                                            ];
                                                                        }

                                                                        return (
                                                                            <div key={rowIdx} className="bg-slate-50/60 border border-slate-200/50 rounded-xl p-3.5 space-y-2 hover:border-indigo-100 hover:bg-white transition-all shadow-sm">
                                                                                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                                                                                    <Badge variant="secondary" className="text-[9px] bg-slate-100 text-indigo-700 font-bold border-none px-1.5 py-0.5 rounded">
                                                                                        Record #{rowIdx + 1}
                                                                                    </Badge>
                                                                                </div>
                                                                                <div className="space-y-2 text-xs">
                                                                                    {Object.entries(item).map(([key, val]) => {
                                                                                        if (key === 'undefined' || !val) return null;
                                                                                        const fieldObj = parsedFields.find(f => f.name === key);
                                                                                        const label = fieldObj?.label || key;
                                                                                        const isHtml = fieldObj?.type === 'richText' || String(val).includes('<p>') || String(val).includes('<li>');
                                                                                        return (
                                                                                            <div key={key} className="flex flex-col gap-0.5">
                                                                                                <span className="text-[10px] font-bold text-slate-400 capitalize">{label}</span>
                                                                                                {isHtml ? (
                                                                                                    <div className="text-slate-700 font-medium leading-relaxed prose prose-sm max-w-none text-[11px]" dangerouslySetInnerHTML={{ __html: String(val) }} />
                                                                                                ) : (
                                                                                                    <span className="text-slate-700 font-semibold leading-relaxed text-[11px] break-words">{String(val)}</span>
                                                                                                )}
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    );
                                })}
                                {localSections.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-20 text-slate-500 font-medium text-sm">
                                            No curriculum sections configured. Click 'Add Custom Widget' to get started!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* HEADER CREATION / EDIT DIALOG */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-xl w-[90vw] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            {editingSection ? "Edit Section Properties" : "Configure Custom Section Header"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Define layout labels and select the view rendering styles.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                        {!editingSection && (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Section Definition Template</Label>
                                <Select
                                    value={form.sectionId}
                                    onValueChange={handleTemplateChange}
                                >
                                    <SelectTrigger className="h-10 w-full bg-white border-slate-200 text-xs font-semibold text-slate-700">
                                        <SelectValue placeholder="Select Widget Layout Template" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {adminSections.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.title} ({s.code})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Custom Display Title</Label>
                            <Input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Course Objectives"
                                className="h-10 text-xs border-slate-200 font-semibold text-slate-800"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">View Rendering Style</Label>
                            <Select
                                value={form.view}
                                onValueChange={(val) => setForm({ ...form, view: val })}
                            >
                                <SelectTrigger className="h-10 w-full bg-white border-slate-200 font-mono text-[11px] font-semibold text-slate-700">
                                    <SelectValue placeholder="Select View Type" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {(() => {
                                        const currentSecDef = adminSections.find(s => s.id === form.sectionId);
                                        const viewsList = (currentSecDef?.views || "default").split("|");
                                        return viewsList.map(v => (
                                            <SelectItem key={v} value={v}>{v}</SelectItem>
                                        ));
                                    })()}
                                </SelectContent>
                            </Select>
                        </div>
                    </form>

                    <div className="pt-2 border-t border-slate-100 flex flex-col gap-3">
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
                            <Button variant="outline" className="h-9 text-xs font-semibold" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button
                                type="button"
                                onClick={handleFormSubmit}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                                Save Configuration
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* VISUAL CONTENT ROW DATA EDITOR MODAL */}
            <Dialog open={isContentOpen} onOpenChange={setIsContentOpen}>
                <DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Database className="h-5 w-5 text-indigo-600" />
                            <span>Edit Row Content: {selectedSection?.title}</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Add and modify custom data values mapped dynamically to visual elements.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Scrollable Data Records Body */}
                    <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1 custom-scrollbar">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div>
                                <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                                    <Settings className="h-3.5 w-3.5 text-indigo-600 animate-spin-slow" />
                                    Active Schema Mapping
                                </span>
                                <span className="text-[10px] text-slate-500 block">
                                    Widget fields schema: {schemaFields.map(f => `${f.label} (${f.type})`).join(", ")}
                                </span>
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                onClick={addContentRow}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1.5 h-8"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Data Row
                            </Button>
                        </div>

                        {/* List of active JSON content cards */}
                        <div className="space-y-4">
                            {contentRows.map((row, rowIdx) => (
                                <div
                                    key={rowIdx}
                                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group hover:border-indigo-200 transition-all"
                                >
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-bold">
                                            Row #{rowIdx + 1}
                                        </Badge>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeContentRow(rowIdx)}
                                            className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Fields List inside this specific Row */}
                                    <div className="grid grid-cols-2 gap-4 mt-2 pr-12">
                                        {schemaFields.map((field) => {
                                            const val = row[field.name] || "";

                                            return (
                                                <div key={field.name} className={`space-y-1.5 ${field.type === 'textarea' || field.type === 'richText' ? 'col-span-2' : ''}`}>
                                                    <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                        {field.type === 'date' ? <Calendar className="h-3 w-3 text-slate-400" /> : null}
                                                        {field.type === 'textarea' || field.type === 'richText' ? <FileText className="h-3 w-3 text-slate-400" /> : null}
                                                        <span>{field.label}</span>
                                                    </Label>

                                                    {field.type === 'textarea' || field.type === 'richText' ? (
                                                        <Textarea
                                                            value={val}
                                                            onChange={(e) => updateContentValue(rowIdx, field.name, e.target.value)}
                                                            className="text-xs border-slate-200 focus:border-indigo-500 h-20"
                                                            placeholder={`Enter ${field.label}...`}
                                                        />
                                                    ) : field.type === 'date' ? (
                                                        <Input
                                                            type="date"
                                                            value={val}
                                                            onChange={(e) => updateContentValue(rowIdx, field.name, e.target.value)}
                                                            className="h-9 text-xs border-slate-200 focus:border-indigo-500 text-slate-700"
                                                        />
                                                    ) : (
                                                        <Input
                                                            type="text"
                                                            value={val}
                                                            onChange={(e) => updateContentValue(rowIdx, field.name, e.target.value)}
                                                            className="h-9 text-xs border-slate-200 focus:border-indigo-500 font-medium text-slate-800"
                                                            placeholder={`Enter ${field.label}...`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {contentRows.length === 0 && (
                                <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                                    No data records active. Click 'Add Data Row' above to build visual items!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Editor Action Feedback & Footer */}
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
                            <Button variant="outline" className="h-10 text-xs font-semibold" onClick={() => setIsContentOpen(false)}>Cancel</Button>
                            <Button
                                type="button"
                                onClick={handleSaveContent}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-xs font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                                Save Content Data
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* CONFIRM DELETE DIALOG */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 font-bold">Remove Course Widget</DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs leading-relaxed">
                            Are you absolutely sure you want to remove this section from the curriculum? All record items inside its content will be permanently lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={confirmDelete}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                            Confirm Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
