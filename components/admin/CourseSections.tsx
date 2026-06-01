

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
    Settings,
    FileText,
    ChevronDown,
    ChevronUp
} from "lucide-react";

import { SECTION_PRESETS, generateUUID } from "@/lib/section-presets";

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
        fetchCourseTemplates,
        fetchCourseTemplateById,
        courseSections,
        fetchCourseSections,
        createCourseSectionItem,
        updateCourseSectionItem,
        deleteCourseSectionItem,
        updateCourseSectionPositions
    } = useAdminStore();

    const [course, setCourse] = useState<any | null>(null);
    const [templateSections, setTemplateSections] = useState<any[]>([]);
    const [noTemplateError, setNoTemplateError] = useState<boolean>(false);

    const [localSections, setLocalSections] = useState<any[]>([]);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Form settings states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<any | null>(null);
    const [form, setForm] = useState({
        title: "",
        sectionId: "",
        view: "",
        position: 0
    });

    // Content entry states
    const [isContentOpen, setIsContentOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any | null>(null);
    const [contentRows, setContentRows] = useState<any[]>([]);
    const [schemaFields, setSchemaFields] = useState<any[]>([]);

    // Operation notification states
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete confirm dialogue targets
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        const loadCourseAndSections = async () => {
            if (courseId) {
                const c = await fetchCourseById(courseId);
                if (c) {
                    setCourse(c);
                    const templateId = c.courseTemplateId || c.course_template_id;
                    if (templateId && templateId !== "none" && templateId !== "course-template-id") {
                        await fetchCourseSections(courseId);
                        
                        // Fetch the associated template and store its sections
                        const templateRes = await fetchCourseTemplateById(templateId);
                        if (templateRes) {
                            const { courseSections: tSections } = getTemplateData(templateRes);
                            setTemplateSections(tSections || []);
                        }
                        
                        setNoTemplateError(false);
                    } else {
                        setNoTemplateError(true);
                    }
                }
            }
        };
        loadCourseAndSections();
        fetchSections(1, 100);
        fetchCourseTemplates();
    }, [courseId, fetchCourseById, fetchCourseSections, fetchSections, fetchCourseTemplates, fetchCourseTemplateById]);

    useEffect(() => {
        if (courseSections) {
            setLocalSections([...courseSections].sort((a, b) => a.position - b.position));
        }
    }, [courseSections]);

    // Drag-and-Drop Sort Matrix Triggers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== index) setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent, index: number) => {
        if (dragOverIndex === index) setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(null);
        if (draggedIndex === null || draggedIndex === index) return;

        const sectionsClone = [...localSections];
        const targetItem = sectionsClone[draggedIndex];
        sectionsClone.splice(draggedIndex, 1);
        sectionsClone.splice(index, 0, targetItem);

        const updatedPositionsList = sectionsClone.map((sec, idx) => ({ ...sec, position: idx }));
        setLocalSections(updatedPositionsList);
        setDraggedIndex(null);
        setHasChanges(true);
    };

    const handleSavePositions = async () => {
        setIsSaving(true);
        setActionError(null);
        setActionSuccess(null);

        const positions = localSections.map((sec, idx) => ({
            id: sec.id,
            position: idx
        }));
        const ok = await updateCourseSectionPositions(courseId, positions);
        if (ok) {
            setHasChanges(false);
            setActionSuccess("Sorting alignment layout preserved perfectly!");
        } else {
            setActionError("Failed to update layout positioning changes.");
        }
        setIsSaving(false);
    };

    const openCreate = () => {
        setEditingSection(null);
        setActionError(null);
        setActionSuccess(null);
        const baselineDef = templateSections[0];
        setForm({
            title: baselineDef ? baselineDef.title : "",
            sectionId: baselineDef ? (baselineDef.section_id || baselineDef.sectionId || baselineDef.id) : "",
            view: baselineDef ? (baselineDef.view || baselineDef.section?.views || "default").split("|")[0] : "default",
            position: localSections.length
        });
        setIsFormOpen(true);
    };

    const openEdit = (sec: any) => {
        setEditingSection(sec);
        setActionError(null);
        setActionSuccess(null);
        setForm({
            title: sec.title || "",
            sectionId: sec.section?.id || sec.section_id || "",
            view: sec.view || "default",
            position: sec.position || 0
        });
        setIsFormOpen(true);
    };

    const handleTemplateChange = (secId: string) => {
        const matched = templateSections.find(s => (s.section_id === secId || s.sectionId === secId || s.id === secId));
        if (matched) {
            setForm(prev => ({
                ...prev,
                sectionId: secId,
                title: matched.title || "",
                view: (matched.view || matched.section?.views || "default").split("|")[0]
            }));
        }
    };

    const removeContentRow = (idx: number) => {
        setContentRows(prev => prev.filter((_, i) => i !== idx));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        if (editingSection) {
            const targetSectionId = editingSection.id || editingSection.sectionId || editingSection.section_id || editingSection.section?.id;
            const res = await updateCourseSectionItem(targetSectionId, {
                title: form.title,
                view: form.view
            });
            setIsSubmitting(false);

            if (res.success) {
                setActionSuccess('Row item text matrices updated!');
                await fetchCourseById(courseId); // ✅ actually refreshes sections
                setTimeout(() => setIsContentOpen(false), 1200);
            } else {
                setActionError(res.message || "Failed to adjust layout structure elements.");
            }
        } else {
            const matched = templateSections.find(s => (s.section_id === form.sectionId || s.sectionId === form.sectionId || s.id === form.sectionId));
            const payload = {
                courseId: courseId,
                course_id: courseId,
                sectionId: form.sectionId,
                section_id: form.sectionId,
                title: form.title,
                view: form.view,
                content: "[]",
                position: form.position,
                section: matched?.section ? {
                    id: matched.section.id || form.sectionId,
                    section_id: matched.section.section_id || form.sectionId,
                    title: matched.section.title || matched.title,
                    code: matched.section.code || "",
                    views: matched.section.views || matched.view || "title-description",
                    fields: typeof matched.section.fields === 'string' 
                        ? matched.section.fields 
                        : JSON.stringify(matched.section.fields || [])
                } : null
            };
            const res = await createCourseSectionItem(payload);
            setIsSubmitting(false);

            if (res.success) {
                setActionSuccess("Section layout configuration applied successfully!");
                await fetchCourseSections(courseId);
                setTimeout(() => setIsFormOpen(false), 1200);
            } else {
                setActionError(res.message || "Failed to adjust layout structure elements.");
            }
        }
    };

    const openContentEditor = (sec: any) => {
        setSelectedSection(sec);
        setActionError(null);
        setActionSuccess(null);

        let parsedRows: any[] = [];
        if (sec.content) {
            if (typeof sec.content === 'object') {
                parsedRows = Array.isArray(sec.content) ? sec.content : [];
            } else {
                try {
                    parsedRows = JSON.parse(sec.content);
                } catch {
                    parsedRows = [];
                }
            }
        }
        setContentRows(parsedRows);

        let parsedFields: any[] = [];
        const targetSchemaFields = sec.section?.fields;
        if (targetSchemaFields) {
            try {
                parsedFields = typeof targetSchemaFields === 'string' ? JSON.parse(targetSchemaFields) : targetSchemaFields;
            } catch {
                parsedFields = [];
            }
        }

        if (!Array.isArray(parsedFields) || parsedFields.length === 0) {
            parsedFields = [
                { label: "Item Title", name: "itemTitle", type: "text" },
                { label: "Item Description", name: "itemDescription", type: "textarea" }
            ];
        }
        setSchemaFields(parsedFields);
        setIsContentOpen(true);
    };

    const addContentRow = () => {
        const newRowObj: any = {};
        schemaFields.forEach(f => { newRowObj[f.name] = ""; });
        setContentRows(prev => [...prev, newRowObj]);
    };

    const updateContentValue = (rowIdx: number, fieldName: string, value: string) => {
        const rowsClone = [...contentRows];
        rowsClone[rowIdx] = { ...rowsClone[rowIdx], [fieldName]: value };
        setContentRows(rowsClone);
    };

    const handleSaveContent = async () => {
        if (!selectedSection) return;
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        const targetSectionId = selectedSection.id || selectedSection.sectionId || selectedSection.section_id || selectedSection.section?.id;
        const res = await updateCourseSectionItem(targetSectionId, {
            content: JSON.stringify(contentRows)
        });
        setIsSubmitting(false);

        if (res.success) {
            setActionSuccess("Row item text matrices updated!");
            await fetchCourseSections(courseId);
            setTimeout(() => setIsContentOpen(false), 1200);
        } else {
            setActionError(res.message || "Failed to store data elements row configurations.");
        }
    };

    const confirmDelete = async () => {
        if (deleteIndex === null) return;
        setIsSubmitting(true);

        const targetSec = localSections[deleteIndex];
        const targetSectionId = targetSec.id || targetSec.sectionId || targetSec.section_id || targetSec.section?.id;
        const res = await deleteCourseSectionItem(targetSectionId);
        setIsSubmitting(false);
        setIsDeleteOpen(false);

        if (res.success) {
           await fetchCourseById(courseId);
            setDeleteIndex(null);
        } else {
            setActionError(res.message || "Failed to strip selected workspace widget node.");
        }
    };

    if (noTemplateError || !course?.courseTemplateId) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <Card className="max-w-xl w-full border border-slate-200 p-8 bg-white rounded-2xl text-center shadow-sm">
                    <Settings className="h-10 w-10 text-indigo-500 animate-spin-slow mx-auto mb-4" />
                    <h3 className="text-base font-bold text-slate-800">No Blueprint Template Associated</h3>
                    <p className="text-slate-500 text-xs mt-2">
                        Please update this course configuration first using the core administration edit modal and map a template layout type.
                    </p>
                    <Button variant="outline" className="mt-5 text-xs font-semibold" onClick={onBack}>Back to Courses</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack} className="h-10 w-10 border-slate-200">
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Widgets Architecture Map: <span className="text-indigo-600">{courseTitle}</span>
                        </h1>
                        <p className="text-slate-400 text-xs mt-0.5">Template Instance ID: {course.courseTemplateId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <Button onClick={handleSavePositions} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs h-9">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Save Arrangement Sorting
                        </Button>
                    )}
                    <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 font-semibold text-xs h-9 gap-1.5">
                        <Plus className="h-4 w-4" /> Attach Layout Block
                    </Button>
                </div>
            </div>

            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden rounded-xl">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/60">
                            <TableRow className="border-b border-slate-100">
                                <TableHead className="w-12 px-6"></TableHead>
                                <TableHead className="w-10"></TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs py-3">Widget Label Name</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs py-3">Render Layout View</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-xs py-3">Active Dataset Records</TableHead>
                                <TableHead className="font-semibold text-slate-700 text-right px-6 py-3">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {localSections.map((sec, index) => {
                                let totalRecords = 0;
                                try {
                                    const parsed = typeof sec.content === 'string' ? JSON.parse(sec.content || "[]") : sec.content;
                                    if (Array.isArray(parsed)) totalRecords = parsed.length;
                                } catch { }

                                const isExpanded = !!expandedSections[sec.id || `sec-${index}`];

                                return (
                                    <Fragment key={index}>
                                        <TableRow
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragEnter={(e) => handleDragEnter(e, index)}
                                            onDragLeave={(e) => handleDragLeave(e, index)}
                                            onDrop={(e) => handleDrop(e, index)}
                                            className={`border-b border-slate-50 transition-colors cursor-move ${dragOverIndex === index ? "bg-indigo-50/40" : "hover:bg-slate-50/20"}`}
                                        >
                                            <TableCell className="w-12 px-6"><GripVertical className="h-4 w-4 text-slate-400" /></TableCell>
                                            <TableCell className="w-10">
                                                <Button
                                                    variant="ghost" size="icon" className="h-7 w-7 text-slate-400"
                                                    onClick={() => setExpandedSections(p => ({ ...p, [sec.id || `sec-${index}`]: !isExpanded }))}
                                                >
                                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-900 text-xs">{sec.title}</TableCell>
                                            <TableCell><Badge variant="outline" className="font-mono text-[10px] text-indigo-600 bg-indigo-50/50">{sec.view}</Badge></TableCell>
                                            <TableCell className="text-xs text-slate-500 font-bold">{totalRecords} entries populated</TableCell>
                                            <TableCell className="text-right px-6 py-3">
                                                <Button variant="outline" size="sm" onClick={() => openContentEditor(sec)} className="h-8 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 mr-1.5 gap-1 shadow-sm">
                                                    <Braces className="h-3.5 w-3.5" /> Configure Row Data
                                                </Button>
                                                <Button variant="outline" size="icon" onClick={() => openEdit(sec)} className="h-8 w-8 text-slate-600 mr-1.5"><Edit className="h-3.5 w-3.5" /></Button>
                                                <Button variant="outline" size="icon" onClick={() => { setDeleteIndex(index); setIsDeleteOpen(true); }} className="h-8 w-8 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                                            </TableCell>
                                        </TableRow>

                                        {isExpanded && (
                                            <TableRow className="bg-slate-50/30">
                                                <TableCell colSpan={6} className="px-14 py-4">
                                                    <div className="bg-white border border-slate-100 rounded-xl p-4 space-y-2 text-xs text-slate-600 shadow-inner">
                                                        <span className="font-bold text-slate-700 block mb-1">Raw Content Object Blueprint Schema:</span>
                                                        <pre className="font-mono text-[10px] p-2 bg-slate-50 rounded-lg max-h-32 overflow-y-auto break-all whitespace-pre-wrap">{sec.content || "[]"}</pre>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* HEADER CREATION / EDIT DIALOG */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-xl w-[90vw] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-slate-900">
                            {editingSection ? "Adjust Widget Configuration Labels" : "Attach New UI Layout Widget Section"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
                        {!editingSection && (
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Baseline Widget Template Reference</Label>
                                <Select value={form.sectionId} onValueChange={handleTemplateChange}>
                                    <SelectTrigger className="h-10 text-xs">
                                        <SelectValue placeholder="Select Global Component Node Schema Definition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templateSections.map(s => {
                                            const sId = s.section_id || s.sectionId || s.id;
                                            return (
                                                <SelectItem key={sId} value={sId}>
                                                    {s.title} {s.section?.code ? `(${s.section.code})` : ""}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Custom UI Header Label Title</Label>
                            <Input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 text-xs font-semibold" required />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">Display Component Rendering Formats</Label>
                            <Select value={form.view} onValueChange={(v) => setForm({ ...form, view: v })}>
                                <SelectTrigger className="h-10 text-xs font-mono">
                                    <SelectValue placeholder="Select UI Layout Pipe Route Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(() => {
                                        const currentDef = templateSections.find(s => (s.section_id === form.sectionId || s.sectionId === form.sectionId || s.id === form.sectionId));
                                        const possibleViews: string = (currentDef?.section?.views || currentDef?.view || "title-description") as string;
                                        return possibleViews.split("|").map((v: string) => <SelectItem key={v} value={v}>{v}</SelectItem>);
                                    })()}
                                </SelectContent>
                            </Select>
                        </div>

                        <DialogFooter className="pt-4 border-t border-slate-50">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                            <Button type="submit" size="sm" className="bg-indigo-600 text-white font-bold px-4" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Apply Setup Properties
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DATA RECORDS CONTEXT EDITOR MODAL */}
            <Dialog open={isContentOpen} onOpenChange={setIsContentOpen}>
                <DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-lg font-bold text-slate-900">Dynamic Fields Content Entry Matrix: {selectedSection?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-indigo-700 font-mono">Target Form Keys: {schemaFields.map(f => `${f.label}`).join(", ")}</span>
                            <Button type="button" size="sm" onClick={addContentRow} className="bg-indigo-600 text-white text-xs font-bold h-8 px-3 rounded-lg">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add Matrix Data Row
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {contentRows.map((row, rowIdx) => (
                                <div key={rowIdx} className="bg-white p-4 border border-slate-200 rounded-xl relative group shadow-sm">
                                    <div className="absolute top-4 right-4 flex items-center gap-2">
                                        <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-100">Dataset Row Item #{rowIdx + 1}</Badge>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeContentRow(rowIdx)} className="h-7 w-7 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-2 pr-12">
                                        {schemaFields.map((field) => {
                                            const val = row[field.name] || "";
                                            const isRichBlock = field.type === 'textarea' || field.type === 'richText';

                                            return (
                                                <div key={field.name} className={`space-y-1 ${isRichBlock ? 'col-span-2' : ''}`}>
                                                    <Label className="text-[11px] font-bold text-slate-600">{field.label}</Label>
                                                    {isRichBlock ? (
                                                        <Textarea value={val} onChange={(e) => updateContentValue(rowIdx, field.name, e.target.value)} className="text-xs h-16 border-slate-200" placeholder={`Enter ${field.label}...`} />
                                                    ) : (
                                                        <Input type={field.type === 'date' ? 'date' : 'text'} value={val} onChange={(e) => updateContentValue(rowIdx, field.name, e.target.value)} className="h-9 text-xs border-slate-200 font-medium" placeholder={`Enter ${field.label}...`} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="flex-shrink-0 pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsContentOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleSaveContent} size="sm" className="bg-indigo-600 text-white font-bold" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null} Persist Document Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CONFIRM CONTEXT RECORD REMOVAL DIALOG */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle className="text-sm font-bold text-slate-900">Remove Layout Section Node</DialogTitle></DialogHeader>
                    <DialogDescription className="text-xs text-slate-400 leading-relaxed">Are you certain you want to clear this block element? Its content rows data list configuration will be wiped completely from this course blueprint model sheet array loop structure.</DialogDescription>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button className="bg-red-600 text-white text-xs font-bold px-4" size="sm" disabled={isSubmitting} onClick={confirmDelete}>Confirm Strip Node</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}