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
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
    Loader2, 
    Plus, 
    Edit, 
    Trash2, 
    Settings, 
    CheckCircle2, 
    AlertCircle, 
    Grid,
    Braces
} from "lucide-react";
import { SectionItem } from "@/lib/admin-api";

export default function SectionManagement() {
    const { 
        adminSections,
        sectionsPagination,
        fetchSections,
        createSectionItem,
        updateSectionItem,
        deleteSectionItem,
        isLoading,
        error,
        successMessage,
        clearMessages
    } = useAdminStore();

    // Search and pagination states
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<SectionItem | null>(null);

    // Interactive Fields Builder state
    const [fieldsList, setFieldsList] = useState<{
        label: string;
        name: string;
        type: 'text' | 'textarea' | 'richText' | 'date' | 'select';
        sourceType?: string;
        apiUrl?: string;
    }[]>([]);

    const [form, setForm] = useState({
        title: "",
        code: "",
        views: "",
        description: "",
        type: ""
    });

    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Confirmation states
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        fetchSections(page, 10, search);
    }, [fetchSections, page, search]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const openCreate = () => {
        setEditingSection(null);
        setFieldsList([
            { label: "Item Title", name: "itemTitle", type: "text" },
            { label: "Item Description", name: "itemDescription", type: "textarea" }
        ]);
        setForm({
            title: "",
            code: "com.sadguru.",
            views: "title-description",
            description: "",
            type: "custom"
        });
        setActionError(null);
        setActionSuccess(null);
        setIsFormOpen(true);
    };

    const openEdit = (sec: SectionItem) => {
        setEditingSection(sec);
        
        let parsedFields: any[] = [];
        try {
            parsedFields = JSON.parse(sec.fields || "[]");
            if (!Array.isArray(parsedFields)) parsedFields = [];
        } catch {
            parsedFields = [];
        }

        setFieldsList(parsedFields);
        setForm({
            title: sec.title || "",
            code: sec.code || "",
            views: sec.views || "",
            description: sec.description || "",
            type: sec.type || ""
        });
        setActionError(null);
        setActionSuccess(null);
        setIsFormOpen(true);
    };

    // Add field to dynamic schema
    const addFieldRow = () => {
        setFieldsList(prev => [...prev, { label: "New Field", name: "newField", type: "text" }]);
    };

    // Remove field from dynamic schema
    const removeFieldRow = (idx: number) => {
        setFieldsList(prev => prev.filter((_, i) => i !== idx));
    };

    const updateFieldItem = (idx: number, key: string, value: any) => {
        const updated = [...fieldsList];
        if (key === 'label') {
            const nameVal = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
                .replace(/-([a-z])/g, (g: string) => g[1].toUpperCase()); // camelCase converter
            updated[idx] = { ...updated[idx], label: value, name: nameVal };
        } else {
            updated[idx] = { ...updated[idx], [key]: value };
        }
        setFieldsList(updated);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError(null);
        setActionSuccess(null);
        setIsSubmitting(true);

        const fieldsJsonString = JSON.stringify(fieldsList);

        const payload = {
            title: form.title,
            code: form.code,
            views: form.views, // Compatible mapper: Backend will resolve it
            fields: fieldsJsonString,
            description: form.description || null,
            type: form.type || null,
            content: null,
            form: null,
            sectionId: null
        };

        let res;
        if (editingSection) {
            res = await updateSectionItem(editingSection.id, payload);
        } else {
            res = await createSectionItem(payload);
        }

        setIsSubmitting(false);
        if (res.success) {
            setActionSuccess(res.message || "Section saved successfully!");
            fetchSections(page, 10, search);
            setTimeout(() => {
                setIsFormOpen(false);
            }, 1200);
        } else {
            setActionError(res.message || "Failed to save section definition.");
        }
    };

    const triggerDelete = (id: string) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsSubmitting(true);
        const res = await deleteSectionItem(deleteId);
        setIsSubmitting(false);
        setIsDeleteOpen(false);
        if (res.success) {
            fetchSections(page, 10, search);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Grid className="h-6 w-6 text-indigo-600" />
                        <span>Section Definitions</span>
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Create custom section types, view templates, and configure dynamic schema fields.
                    </p>
                </div>
                <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-md hover:shadow-lg transition-all"
                    onClick={openCreate}
                >
                    <Plus className="h-4 w-4" />
                    New Section Type
                </Button>
            </div>

            {/* List and Search Card */}
            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-xl">
                <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900">All Sections</CardTitle>
                        <CardDescription className="text-slate-500 text-xs">
                            Manage structural widgets mapped across page layouts and templates.
                        </CardDescription>
                    </div>
                    <div className="w-72">
                        <Input 
                            type="text" 
                            placeholder="Search by section title..." 
                            value={search} 
                            onChange={handleSearchChange}
                            className="h-10 text-xs border-slate-200"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading && adminSections.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/30">
                                <TableRow className="border-b border-slate-100">
                                    <TableHead className="font-semibold text-slate-700 px-6 py-4">Section Name</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Package Namespace Code</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Associated Views</TableHead>
                                    <TableHead className="font-semibold text-slate-700 py-4">Dynamic Fields Count</TableHead>
                                    <TableHead className="font-semibold text-slate-700 text-right px-6 py-4">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminSections.map((sec) => {
                                    let fieldsCount = 0;
                                    try {
                                        const arr = JSON.parse(sec.fields || "[]");
                                        if (Array.isArray(arr)) fieldsCount = arr.length;
                                    } catch {}

                                    return (
                                        <TableRow key={sec.id} className="hover:bg-slate-50/40 border-b border-slate-100 transition-colors">
                                            <TableCell className="font-bold text-slate-900 px-6 py-4">
                                                {sec.title}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-slate-500 py-4">
                                                {sec.code}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(sec.views || "default").split("|").map(v => (
                                                        <Badge key={v} variant="secondary" className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 rounded-md font-semibold">
                                                            {v}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 font-semibold text-slate-700">
                                                <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                                                    <Braces className="h-3.5 w-3.5" />
                                                    {fieldsCount} Fields
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right px-6 py-4">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-indigo-600 border-slate-200 mr-1.5 hover:bg-indigo-50"
                                                    onClick={() => openEdit(sec)}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600 border-slate-200 hover:bg-red-50 hover:border-red-100"
                                                    onClick={() => triggerDelete(sec.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {adminSections.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-20 text-slate-500 text-sm font-medium">
                                            No section definitions found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* CREATE / EDIT DIALOG */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
               <DialogContent className="!max-w-none w-3/4 h-[92vh] max-h-[92vh] overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {editingSection ? "Modify Section Schema" : "Design New Section Widget"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Define namespaces, view pipelines, and drag fields into the dynamic form constructor.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Form Layout Scroll Grid */}
                    <form onSubmit={handleFormSubmit} className="flex-1 overflow-auto py-4 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700">Section Title</Label>
                                <Input 
                                    type="text" 
                                    value={form.title} 
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="h-10 text-xs border-slate-200"
                                    placeholder="e.g. Objectives"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-700">Package Namespace Code</Label>
                                <Input 
                                    type="text" 
                                    value={form.code} 
                                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                                    className="h-10 text-xs font-mono border-slate-200"
                                    placeholder="e.g. com.sadguru.TitleDescription"
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-bold text-slate-700">Associated views (pipe-separated list)</Label>
                                <Input 
                                    type="text" 
                                    value={form.views} 
                                    onChange={(e) => setForm({ ...form, views: e.target.value })}
                                    className="h-10 text-xs border-slate-200 font-mono"
                                    placeholder="e.g. title-description|title-description-card"
                                    required
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-bold text-slate-700">Widget Description (Optional)</Label>
                                <Textarea 
                                    value={form.description} 
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="text-xs border-slate-200 h-16"
                                    placeholder="Detail outline of widget intent..."
                                />
                            </div>
                        </div>

                        {/* Interactive Fields Builder */}
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <Label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        <Settings className="h-4 w-4 text-indigo-600 animate-spin-slow" />
                                        <span>Dynamic Schema Form Builder</span>
                                    </Label>
                                    <span className="text-[10px] text-slate-500 block">
                                        Configure input fields that administrators must fill out for each row of this section.
                                    </span>
                                </div>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={addFieldRow}
                                    className="h-8 text-xs border-slate-200 text-indigo-600 font-semibold gap-1 hover:bg-indigo-50"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Schema Field
                                </Button>
                            </div>

                            {/* Rendered List of Schema Columns */}
                            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
                                {fieldsList.map((f, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-lg border border-slate-200"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                                            #{index + 1}
                                        </div>
                                        
                                        <div className="flex-1 grid grid-cols-3 gap-2">
                                            <div className="space-y-1">
                                                <Input 
                                                    type="text" 
                                                    value={f.label} 
                                                    onChange={(e) => updateFieldItem(index, 'label', e.target.value)}
                                                    className="h-8 text-xs border-slate-200 font-semibold text-slate-800"
                                                    placeholder="Field Label (e.g. Question)"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Input 
                                                    type="text" 
                                                    value={f.name} 
                                                    disabled
                                                    className="h-8 text-xs border-slate-200 bg-slate-100 font-mono text-slate-500"
                                                    placeholder="CamelCase variable name"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Select 
                                                    value={f.type} 
                                                    onValueChange={(val) => updateFieldItem(index, 'type', val)}
                                                >
                                                    <SelectTrigger className="h-8 w-full bg-white border-slate-200 text-xs font-semibold text-slate-700">
                                                        <SelectValue placeholder="Field Type" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="text">Text Box</SelectItem>
                                                        <SelectItem value="textarea">Textarea Block</SelectItem>
                                                        <SelectItem value="richText">Rich Text Box</SelectItem>
                                                        <SelectItem value="date">Calendar Date</SelectItem>
                                                        <SelectItem value="select">Dropdown Select</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-red-600 hover:bg-red-50 rounded-lg"
                                            onClick={() => removeFieldRow(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}

                                {fieldsList.length === 0 && (
                                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                                        No schema fields configured. Click 'Add Schema Field' above.
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Dialog Actions Footer */}
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
                                onClick={() => setIsFormOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-xs font-semibold"
                                onClick={handleFormSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : null}
                                Save Widget
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900 font-bold">Remove Section Type</DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs leading-relaxed">
                            Are you absolutely sure you want to delete this section definition? This action is permanent and might break rendering if referenced by course templates.
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
