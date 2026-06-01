"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { SeoPageItem, SeoSettingItem, SeoMetaTagItem } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
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
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Globe, 
    Settings, 
    Tag, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Calendar,
    ArrowUpDown
} from "lucide-react";

export default function SEOManagement() {
    const {
        adminSeoPages,
        seoPagesPagination,
        adminSeoSettings,
        seoSettingsPagination,
        adminSeoMetaTags,
        seoMetaTagsPagination,
        fetchSeoPages,
        fetchSeoSettings,
        fetchSeoMetaTags,
        createSeoPage,
        updateSeoPage,
        deleteSeoPage,
        createSeoSetting,
        updateSeoSetting,
        deleteSeoSetting,
        createSeoMetaTag,
        updateSeoMetaTag,
        deleteSeoMetaTag,
        isLoading
    } = useAdminStore();

    // Tabs state
    const [activeTab, setActiveTab] = useState<"pages" | "settings" | "tags">("pages");

    // Search query states
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch lists depending on active tab & search query
    useEffect(() => {
        if (activeTab === "pages") {
            fetchSeoPages(1, 10, debouncedSearch);
        } else if (activeTab === "settings") {
            fetchSeoSettings(1, 20, debouncedSearch);
        } else if (activeTab === "tags") {
            fetchSeoMetaTags(1, 20, debouncedSearch);
        }
    }, [activeTab, debouncedSearch, fetchSeoPages, fetchSeoSettings, fetchSeoMetaTags]);

    // Pagination helpers
    const handlePageChange = (page: number) => {
        if (activeTab === "pages") {
            fetchSeoPages(page, 10, debouncedSearch);
        } else if (activeTab === "settings") {
            fetchSeoSettings(page, 20, debouncedSearch);
        } else if (activeTab === "tags") {
            fetchSeoMetaTags(page, 20, debouncedSearch);
        }
    };

    // --- DIALOG MODALS STATES ---
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"page" | "setting" | "tag" | null>(null);
    const [modalAction, setModalAction] = useState<"create" | "edit">("create");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isActionSaving, setIsActionSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Delete Modals States
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "page" | "setting" | "tag"; id: number; name: string } | null>(null);

    // --- FORM DATA STATES ---
    // Page Form Data
    const [pageForm, setPageForm] = useState({
        path: "",
        object: "App\\Page",
        objectId: "",
        title: "",
        description: "",
        canonicalUrl: "",
        robotIndex: "index",
        robotFollow: "follow",
        changeFrequency: "monthly",
        priority: 0.5,
        focusKeyword: "",
        schema: "",
        tagsHtml: "",
        metaTags: {} as Record<number, string>
    });

    // Setting Form Data
    const [settingForm, setSettingForm] = useState({
        site_title: "",
        robot_index: "index",
        robot_follow: "follow",
        twitter_username: ""
    });

    // Meta Tag Definition Form Data
    const [tagForm, setTagForm] = useState({
        name: "",
        inputType: "text",
        inputLabel: "",
        inputPlaceholder: "",
        inputInfo: "",
        visibility: "public"
    });

    // --- PROGRESS GAUGES FOR STANDALONE EDIT DIALOG ---
    const getTitleGaugeColor = (val: string) => {
        const len = val.length;
        if (len >= 50 && len <= 60) return "bg-emerald-500";
        if (len >= 40 && len < 50) return "bg-amber-400";
        if (len > 60 && len <= 70) return "bg-amber-400";
        return "bg-rose-500";
    };

    const getTitleFeedback = (val: string) => {
        const len = val.length;
        if (len === 0) return { text: "Title is empty", color: "text-slate-400" };
        if (len >= 50 && len <= 60) return { text: "Optimal length (50-60 characters)", color: "text-emerald-600 font-medium" };
        if (len < 40) return { text: "Too short", color: "text-rose-500" };
        if (len > 70) return { text: "Too long (will be truncated in search results)", color: "text-rose-500" };
        return { text: "Acceptable, but can be optimized", color: "text-amber-500" };
    };

    const getDescriptionGaugeColor = (val: string) => {
        const len = val.length;
        if (len >= 140 && len <= 160) return "bg-emerald-500";
        if (len >= 120 && len < 140) return "bg-amber-400";
        if (len > 160 && len <= 180) return "bg-amber-400";
        return "bg-rose-500";
    };

    const getDescriptionFeedback = (val: string) => {
        const len = val.length;
        if (len === 0) return { text: "Description is empty", color: "text-slate-400" };
        if (len >= 140 && len <= 160) return { text: "Optimal length (140-160 characters)", color: "text-emerald-600 font-medium" };
        if (len < 100) return { text: "Too short", color: "text-rose-500" };
        if (len > 170) return { text: "Too long (will be truncated in search results)", color: "text-rose-500" };
        return { text: "Acceptable, but can be optimized", color: "text-amber-500" };
    };

    // --- HANDLE ACTIONS TRIGGER ---
    const handleOpenCreate = () => {
        setMessage(null);
        setModalAction("create");
        setSelectedId(null);
        
        if (activeTab === "pages") {
            setModalType("page");
            setPageForm({
                path: "",
                object: "",
                objectId: "",
                title: "",
                description: "",
                canonicalUrl: "",
                robotIndex: "index",
                robotFollow: "follow",
                changeFrequency: "monthly",
                priority: 0.5,
                focusKeyword: "",
                schema: "",
                tagsHtml: "",
                metaTags: {}
            });
            // Fetch tag definitions if they aren't loaded to populate meta tags subfield inputs
            fetchSeoMetaTags(1, 100);
        } else if (activeTab === "settings") {
            setModalType("setting");
            setSettingForm({
                site_title: "",
                robot_index: "index",
                robot_follow: "follow",
                twitter_username: ""
            });
        } else if (activeTab === "tags") {
            setModalType("tag");
            setTagForm({
                name: "",
                inputType: "text",
                inputLabel: "",
                inputPlaceholder: "",
                inputInfo: "",
                visibility: "public"
            });
        }
        setModalOpen(true);
    };

    const handleOpenEdit = (item: any) => {
        setMessage(null);
        setModalAction("edit");
        setSelectedId(item.id);

        if (activeTab === "pages") {
            setModalType("page");
            const pageItem = item as SeoPageItem;
            
            // Map values
            const mappedMetas: Record<number, string> = {};
            if (pageItem.metaTags) {
                pageItem.metaTags.forEach((m: any) => {
                    if (m.seoMetaTagId) {
                        mappedMetas[m.seoMetaTagId] = m.content || "";
                    }
                });
            }

            setPageForm({
                path: pageItem.path || "",
                object: pageItem.object || "",
                objectId: pageItem.objectId || "",
                title: pageItem.title || "",
                description: pageItem.description || "",
                canonicalUrl: pageItem.canonicalUrl || "",
                robotIndex: pageItem.robotIndex || "index",
                robotFollow: pageItem.robotFollow || "follow",
                changeFrequency: pageItem.changeFrequency || "monthly",
                priority: pageItem.priority ?? 0.5,
                focusKeyword: pageItem.focusKeyword || "",
                schema: pageItem.schema || "",
                tagsHtml: pageItem.tagsHtml || "",
                metaTags: mappedMetas
            });
            fetchSeoMetaTags(1, 100);
        } else if (activeTab === "settings") {
            setModalType("setting");
            const setItem = item as SeoSettingItem;
            setSettingForm({
                site_title: setItem.site_title || "",
                robot_index: setItem.robot_index || "index",
                robot_follow: setItem.robot_follow || "follow",
                twitter_username: setItem.twitter_username || ""
            });
        } else if (activeTab === "tags") {
            setModalType("tag");
            const tagItem = item as SeoMetaTagItem;
            setTagForm({
                name: tagItem.name || "",
                inputType: tagItem.inputType || "text",
                inputLabel: tagItem.inputLabel || "",
                inputPlaceholder: tagItem.inputPlaceholder || "",
                inputInfo: tagItem.inputInfo || "",
                visibility: tagItem.visibility || "public"
            });
        }
        setModalOpen(true);
    };

    const handleOpenDelete = (item: any) => {
        if (activeTab === "pages") {
            setDeleteTarget({ type: "page", id: item.id, name: item.path });
        } else if (activeTab === "settings") {
            setDeleteTarget({ type: "setting", id: item.id, name: item.site_title });
        } else if (activeTab === "tags") {
            setDeleteTarget({ type: "tag", id: item.id, name: item.name });
        }
        setDeleteModalOpen(true);
    };

    // --- FORM ACTIONS SUBMISSIONS ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsActionSaving(true);
        setMessage(null);

        try {
            let res;
            if (modalType === "page") {
                // Validate schema JSON syntax
                if (pageForm.schema.trim()) {
                    try {
                        JSON.parse(pageForm.schema);
                    } catch (err) {
                        setMessage({ type: "error", text: "Invalid JSON-LD schema syntax." });
                        setIsActionSaving(false);
                        return;
                    }
                }

                // Prepare child meta-tags array
                const metaTagsPayload = Object.entries(pageForm.metaTags)
                    .filter(([_, value]) => value.trim() !== "")
                    .map(([key, value]) => ({
                        seoMetaTagId: parseInt(key),
                        content: value.trim()
                    }));

                const payload = {
                    ...pageForm,
                    priority: parseFloat(pageForm.priority.toString()),
                    schema: pageForm.schema.trim() || null,
                    tagsHtml: pageForm.tagsHtml.trim() || null,
                    metaTags: metaTagsPayload,
                    object: pageForm.object || null,
                    objectId: pageForm.objectId || null
                };

                if (modalAction === "create") {
                    res = await createSeoPage(payload);
                } else {
                    res = await updateSeoPage(selectedId!, payload);
                }
            } else if (modalType === "setting") {
                if (modalAction === "create") {
                    res = await createSeoSetting(settingForm);
                } else {
                    res = await updateSeoSetting(selectedId!, settingForm);
                }
            } else if (modalType === "tag") {
                if (modalAction === "create") {
                    res = await createSeoMetaTag(tagForm);
                } else {
                    res = await updateSeoMetaTag(selectedId!, tagForm);
                }
            }

            if (res?.success) {
                setMessage({ type: "success", text: res.message || "Saved successfully!" });
                setTimeout(() => {
                    setModalOpen(false);
                    // Refresh active list
                    handlePageChange(1);
                }, 1000);
            } else {
                setMessage({ type: "error", text: res?.message || "Action failed." });
            }
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "An unexpected error occurred." });
        } finally {
            setIsActionSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsActionSaving(true);

        try {
            let res;
            if (deleteTarget.type === "page") {
                res = await deleteSeoPage(deleteTarget.id);
            } else if (deleteTarget.type === "setting") {
                res = await deleteSeoSetting(deleteTarget.id);
            } else if (deleteTarget.type === "tag") {
                res = await deleteSeoMetaTag(deleteTarget.id);
            }

            if (res?.success) {
                setDeleteModalOpen(false);
                handlePageChange(1);
            } else {
                alert(res?.message || "Failed to delete item.");
            }
        } catch (err: any) {
            alert(err.message || "An unexpected error occurred.");
        } finally {
            setIsActionSaving(false);
            setDeleteTarget(null);
        }
    };

    // Handle nested meta-tag values in page form
    const handlePageMetaTagChange = (tagId: number, val: string) => {
        setPageForm(prev => ({
            ...prev,
            metaTags: {
                ...prev.metaTags,
                [tagId]: val
            }
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Top title and buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SEO Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage relative page routes, global metadata settings, and dynamic meta-tag definitions.</p>
                </div>
                <Button 
                    onClick={handleOpenCreate} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 shadow-sm rounded-xl py-5"
                >
                    <Plus className="h-5 w-5" />
                    {activeTab === "pages" && "New SEO Page"}
                    {activeTab === "settings" && "New Global Setting"}
                    {activeTab === "tags" && "New Meta Tag"}
                </Button>
            </div>

            {/* Main Tabs Selection controls */}
            <div className="flex border-b border-slate-200">
                <button
                    onClick={() => { setActiveTab("pages"); setSearchQuery(""); }}
                    className={`flex items-center gap-2 px-6 py-4.5 text-sm font-bold border-b-2 transition-all ${
                        activeTab === "pages"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                >
                    <Globe className="h-4.5 w-4.5" />
                    SEO Pages
                </button>
                <button
                    onClick={() => { setActiveTab("settings"); setSearchQuery(""); }}
                    className={`flex items-center gap-2 px-6 py-4.5 text-sm font-bold border-b-2 transition-all ${
                        activeTab === "settings"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                >
                    <Settings className="h-4.5 w-4.5" />
                    Global Settings
                </button>
                <button
                    onClick={() => { setActiveTab("tags"); setSearchQuery(""); }}
                    className={`flex items-center gap-2 px-6 py-4.5 text-sm font-bold border-b-2 transition-all ${
                        activeTab === "tags"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                >
                    <Tag className="h-4.5 w-4.5" />
                    Meta Tag Definitions
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab === "pages" ? "paths or titles..." : activeTab === "settings" ? "settings..." : "meta tags..."}`}
                    className="pl-10 h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-xl bg-white shadow-sm"
                />
            </div>

            {/* LIST TABLE VIEWS */}
            <Card className="border-none shadow-sm overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-3">
                            <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
                            <p className="text-slate-400 text-sm font-medium">Fetching record details...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === "pages" && (
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                            <TableHead className="font-bold">Path / Route</TableHead>
                                            <TableHead className="font-bold">Meta Title</TableHead>
                                            <TableHead className="font-bold">Robots</TableHead>
                                            <TableHead className="font-bold">Sitemap</TableHead>
                                            <TableHead className="font-bold">Object Bind</TableHead>
                                            <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {adminSeoPages.map((page: SeoPageItem) => (
                                            <TableRow key={page.id} className="hover:bg-slate-50/60 transition-colors">
                                                <TableCell className="font-mono text-xs text-indigo-600 font-bold max-w-[200px] truncate">
                                                    {page.path}
                                                </TableCell>
                                                <TableCell className="font-semibold text-slate-800 max-w-[220px] truncate">
                                                    {page.title || "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        <Badge variant="outline" className={page.robotIndex === "noindex" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}>
                                                            {page.robotIndex}
                                                        </Badge>
                                                        <Badge variant="outline" className={page.robotFollow === "nofollow" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}>
                                                            {page.robotFollow}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-xs space-y-1">
                                                        <div className="text-slate-500 font-semibold">{page.changeFrequency}</div>
                                                        <div className="text-slate-400">Pri: <span className="font-bold text-slate-700">{page.priority}</span></div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-400 font-medium">
                                                    {page.object ? (
                                                        <div className="space-y-0.5">
                                                            <div className="text-slate-600 font-bold">{page.object.split('\\').pop()}</div>
                                                            <div className="text-[10px] font-mono text-slate-400">ID: {page.objectId}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-slate-300">Custom Route</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right flex items-center justify-end gap-2 pr-6 py-4">
                                                    <Button onClick={() => handleOpenEdit(page)} variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="h-4.5 w-4.5" />
                                                    </Button>
                                                    <Button onClick={() => handleOpenDelete(page)} variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50">
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {adminSeoPages.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                                                    No custom SEO pages found. Click 'New SEO Page' to get started.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}

                            {activeTab === "settings" && (
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                            <TableHead className="font-bold">Site Title</TableHead>
                                            <TableHead className="font-bold">Global Robots</TableHead>
                                            <TableHead className="font-bold">Twitter Handle</TableHead>
                                            <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {adminSeoSettings.map((setting: SeoSettingItem) => (
                                            <TableRow key={setting.id} className="hover:bg-slate-50/60 transition-colors">
                                                <TableCell className="font-bold text-slate-800">
                                                    {setting.site_title}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1.5">
                                                        <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                                            {setting.robot_index}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                                            {setting.robot_follow}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-slate-500 font-mono">
                                                    {setting.twitter_username ? `@${setting.twitter_username.replace(/^@/, '')}` : "—"}
                                                </TableCell>
                                                <TableCell className="text-right flex items-center justify-end gap-2 pr-6 py-4">
                                                    <Button onClick={() => handleOpenEdit(setting)} variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="h-4.5 w-4.5" />
                                                    </Button>
                                                    <Button onClick={() => handleOpenDelete(setting)} variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50">
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {adminSeoSettings.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-16 text-slate-400">
                                                    No global settings found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}

                            {activeTab === "tags" && (
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow>
                                            <TableHead className="font-bold">Meta Tag Name</TableHead>
                                            <TableHead className="font-bold">Input Label</TableHead>
                                            <TableHead className="font-bold">Input Type</TableHead>
                                            <TableHead className="font-bold">Visibility</TableHead>
                                            <TableHead className="text-right font-bold pr-6">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {adminSeoMetaTags.map((tag: SeoMetaTagItem) => (
                                            <TableRow key={tag.id} className="hover:bg-slate-50/60 transition-colors">
                                                <TableCell className="font-mono text-xs text-slate-900 font-bold">
                                                    {tag.name}
                                                </TableCell>
                                                <TableCell className="font-semibold text-slate-700">
                                                    {tag.inputLabel}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                                                        {tag.inputType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="capitalize text-slate-500 font-medium text-xs">
                                                    {tag.visibility}
                                                </TableCell>
                                                <TableCell className="text-right flex items-center justify-end gap-2 pr-6 py-4">
                                                    <Button onClick={() => handleOpenEdit(tag)} variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                                                        <Edit className="h-4.5 w-4.5" />
                                                    </Button>
                                                    <Button onClick={() => handleOpenDelete(tag)} variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50">
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {adminSeoMetaTags.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-16 text-slate-400">
                                                    No meta tag definitions found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            )}

                            {/* Pagination Controls */}
                            {activeTab === "pages" && seoPagesPagination && seoPagesPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between p-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{seoPagesPagination.page}</span> of <span className="font-bold text-slate-900">{seoPagesPagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handlePageChange(seoPagesPagination.page - 1)} disabled={seoPagesPagination.page === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => handlePageChange(seoPagesPagination.page + 1)} disabled={seoPagesPagination.page === seoPagesPagination.totalPages}>Next</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "settings" && seoSettingsPagination && seoSettingsPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between p-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{seoSettingsPagination.page}</span> of <span className="font-bold text-slate-900">{seoSettingsPagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handlePageChange(seoSettingsPagination.page - 1)} disabled={seoSettingsPagination.page === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => handlePageChange(seoSettingsPagination.page + 1)} disabled={seoSettingsPagination.page === seoSettingsPagination.totalPages}>Next</Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "tags" && seoMetaTagsPagination && seoMetaTagsPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between p-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{seoMetaTagsPagination.page}</span> of <span className="font-bold text-slate-900">{seoMetaTagsPagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handlePageChange(seoMetaTagsPagination.page - 1)} disabled={seoMetaTagsPagination.page === 1}>Previous</Button>
                                        <Button variant="outline" size="sm" onClick={() => handlePageChange(seoMetaTagsPagination.page + 1)} disabled={seoMetaTagsPagination.page === seoMetaTagsPagination.totalPages}>Next</Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* --- CREATE / EDIT FULL DIALOG MODAL --- */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-white shadow-2xl border border-slate-200">
                    <DialogHeader className="border-b border-slate-100 pb-3">
                        <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                            {modalType === "page" && <Globe className="h-5 w-5 text-indigo-600" />}
                            {modalType === "setting" && <Settings className="h-5 w-5 text-indigo-600" />}
                            {modalType === "tag" && <Tag className="h-5 w-5 text-indigo-600" />}
                            {modalAction === "create" ? "Create New" : "Edit"} {modalType === "page" ? "SEO Page" : modalType === "setting" ? "Global Setting" : "Meta Tag Definition"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Please configure details and click save. All edits will be published instantly.
                        </DialogDescription>
                    </DialogHeader>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 mt-4 ${
                            message.type === "success" 
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                                : "bg-rose-50 text-rose-800 border border-rose-100"
                        }`}>
                            {message.type === "success" ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="text-sm font-medium">{message.text}</div>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6 pt-4">
                        {modalType === "page" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-path" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Relative Path *</Label>
                                        <Input
                                            id="page-path"
                                            value={pageForm.path}
                                            onChange={(e) => setPageForm({...pageForm, path: e.target.value})}
                                            placeholder="/about-us"
                                            required
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-title" className="font-bold text-slate-700 text-xs uppercase tracking-wider flex justify-between">
                                            <span>SEO Title *</span>
                                            <span className="text-slate-400">{pageForm.title.length} chars</span>
                                        </Label>
                                        <Input
                                            id="page-title"
                                            value={pageForm.title}
                                            onChange={(e) => setPageForm({...pageForm, title: e.target.value})}
                                            placeholder="About Us | OnlineITGuru"
                                            required
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                        <Progress value={Math.min((pageForm.title.length / 75) * 100, 100)} className={`h-1 ${getTitleGaugeColor(pageForm.title)}`} />
                                        <p className={`text-[10px] ${getTitleFeedback(pageForm.title).color}`}>{getTitleFeedback(pageForm.title).text}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="page-desc" className="font-bold text-slate-700 text-xs uppercase tracking-wider flex justify-between">
                                        <span>Meta Description *</span>
                                        <span className="text-slate-400">{pageForm.description.length} chars</span>
                                    </Label>
                                    <Textarea
                                        id="page-desc"
                                        value={pageForm.description}
                                        onChange={(e) => setPageForm({...pageForm, description: e.target.value})}
                                        placeholder="Learn more about our company background and expert IT mentors..."
                                        required
                                        rows={3}
                                        className="rounded-lg border-slate-200 resize-none"
                                    />
                                    <Progress value={Math.min((pageForm.description.length / 200) * 100, 100)} className={`h-1 ${getDescriptionGaugeColor(pageForm.description)}`} />
                                    <p className={`text-[10px] ${getDescriptionFeedback(pageForm.description).color}`}>{getDescriptionFeedback(pageForm.description).text}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-object" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Object Mapping (Optional)</Label>
                                        <Input
                                            id="page-object"
                                            value={pageForm.object}
                                            onChange={(e) => setPageForm({...pageForm, object: e.target.value})}
                                            placeholder="App\Page"
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-object-id" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Object ID (Optional)</Label>
                                        <Input
                                            id="page-object-id"
                                            value={pageForm.objectId}
                                            onChange={(e) => setPageForm({...pageForm, objectId: e.target.value})}
                                            placeholder="12"
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-canonical" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Canonical URL</Label>
                                        <Input
                                            id="page-canonical"
                                            value={pageForm.canonicalUrl}
                                            onChange={(e) => setPageForm({...pageForm, canonicalUrl: e.target.value})}
                                            placeholder="https://onlineitguru.com/about-us"
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-focus" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Focus Keyword</Label>
                                        <Input
                                            id="page-focus"
                                            value={pageForm.focusKeyword}
                                            onChange={(e) => setPageForm({...pageForm, focusKeyword: e.target.value})}
                                            placeholder="online IT training"
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Robots Index</Label>
                                        <Select value={pageForm.robotIndex} onValueChange={(val) => setPageForm({...pageForm, robotIndex: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="index">index (Visible)</SelectItem>
                                                <SelectItem value="noindex">noindex (Hidden)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Robots Follow</Label>
                                        <Select value={pageForm.robotFollow} onValueChange={(val) => setPageForm({...pageForm, robotFollow: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="follow">follow (Follow links)</SelectItem>
                                                <SelectItem value="nofollow">nofollow (Ignore links)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Sitemap Frequency</Label>
                                        <Select value={pageForm.changeFrequency} onValueChange={(val) => setPageForm({...pageForm, changeFrequency: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="always">always</SelectItem>
                                                <SelectItem value="hourly">hourly</SelectItem>
                                                <SelectItem value="daily">daily</SelectItem>
                                                <SelectItem value="weekly">weekly</SelectItem>
                                                <SelectItem value="monthly">monthly</SelectItem>
                                                <SelectItem value="yearly">yearly</SelectItem>
                                                <SelectItem value="never">never</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="page-priority" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Sitemap Priority ({pageForm.priority})</Label>
                                        <Input
                                            id="page-priority"
                                            type="number"
                                            step="0.1"
                                            min="0.0"
                                            max="1.0"
                                            value={pageForm.priority}
                                            onChange={(e) => setPageForm({...pageForm, priority: parseFloat(e.target.value) || 0.5})}
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                </div>

                                {/* Custom JSON schema / custom raw tags */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="page-schema" className="font-bold text-slate-700 text-xs uppercase tracking-wider">JSON-LD Schema</Label>
                                    <Textarea
                                        id="page-schema"
                                        value={pageForm.schema}
                                        onChange={(e) => setPageForm({...pageForm, schema: e.target.value})}
                                        placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                                        rows={3}
                                        className="rounded-lg border-slate-200 font-mono text-xs resize-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="page-tags" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Raw Custom HTML Tags</Label>
                                    <Textarea
                                        id="page-tags"
                                        value={pageForm.tagsHtml}
                                        onChange={(e) => setPageForm({...pageForm, tagsHtml: e.target.value})}
                                        placeholder='<meta name="theme-color" content="#4f46e5" />'
                                        rows={2}
                                        className="rounded-lg border-slate-200 font-mono text-xs resize-none"
                                    />
                                </div>

                                {/* Dynamic Meta Tags fields */}
                                {adminSeoMetaTags.length > 0 && (
                                    <div className="border-t border-slate-100 pt-4 mt-2">
                                        <h4 className="font-bold text-slate-900 text-sm mb-3">Custom Meta Tags values</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {adminSeoMetaTags.map((tag: SeoMetaTagItem) => (
                                                <div key={tag.id} className="space-y-1.5">
                                                    <Label htmlFor={`modal-meta-${tag.id}`} className="font-bold text-slate-600 text-xs flex items-center gap-1">
                                                        {tag.inputLabel || tag.name}
                                                        {tag.inputInfo && (
                                                            <div className="group relative inline-block text-slate-400">
                                                                <Info className="h-3 w-3 cursor-pointer" />
                                                                <span className="absolute hidden group-hover:block bg-slate-950 text-white text-[10px] p-2 rounded shadow-md -top-8 left-4 w-40 z-10 font-normal">
                                                                    {tag.inputInfo}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Label>
                                                    {tag.inputType === "textarea" ? (
                                                        <Textarea
                                                            id={`modal-meta-${tag.id}`}
                                                            value={pageForm.metaTags[tag.id] || ""}
                                                            onChange={(e) => handlePageMetaTagChange(tag.id, e.target.value)}
                                                            placeholder={tag.inputPlaceholder || ""}
                                                            rows={2}
                                                            className="rounded-lg border-slate-200 text-xs resize-none"
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={`modal-meta-${tag.id}`}
                                                            value={pageForm.metaTags[tag.id] || ""}
                                                            onChange={(e) => handlePageMetaTagChange(tag.id, e.target.value)}
                                                            placeholder={tag.inputPlaceholder || ""}
                                                            className="rounded-lg h-9 border-slate-200 text-xs"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {modalType === "setting" && (
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="set-title" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Site Base Title *</Label>
                                    <Input
                                        id="set-title"
                                        value={settingForm.site_title}
                                        onChange={(e) => setSettingForm({...settingForm, site_title: e.target.value})}
                                        placeholder="OnlineITGuru"
                                        required
                                        className="rounded-lg h-10 border-slate-200"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Robot Index</Label>
                                        <Select value={settingForm.robot_index} onValueChange={(val) => setSettingForm({...settingForm, robot_index: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="index">index (Visible)</SelectItem>
                                                <SelectItem value="noindex">noindex (Hidden)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Robot Follow</Label>
                                        <Select value={settingForm.robot_follow} onValueChange={(val) => setSettingForm({...settingForm, robot_follow: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="follow">follow</SelectItem>
                                                <SelectItem value="nofollow">nofollow</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="set-twitter" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Site Twitter Username</Label>
                                    <Input
                                        id="set-twitter"
                                        value={settingForm.twitter_username}
                                        onChange={(e) => setSettingForm({...settingForm, twitter_username: e.target.value})}
                                        placeholder="onlineitguru"
                                        className="rounded-lg h-10 border-slate-200"
                                    />
                                </div>
                            </div>
                        )}

                        {modalType === "tag" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tag-name" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Meta Tag Name *</Label>
                                        <Input
                                            id="tag-name"
                                            value={tagForm.name}
                                            onChange={(e) => setTagForm({...tagForm, name: e.target.value})}
                                            placeholder="e.g. og:image or twitter:card"
                                            required
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tag-label" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Input Label *</Label>
                                        <Input
                                            id="tag-label"
                                            value={tagForm.inputLabel}
                                            onChange={(e) => setTagForm({...tagForm, inputLabel: e.target.value})}
                                            placeholder="e.g. Twitter Card Layout"
                                            required
                                            className="rounded-lg h-10 border-slate-200"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Input HTML Control</Label>
                                        <Select value={tagForm.inputType} onValueChange={(val) => setTagForm({...tagForm, inputType: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="text">text (Single-line Input)</SelectItem>
                                                <SelectItem value="textarea">textarea (Multi-line Area)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-bold text-slate-700 text-xs uppercase tracking-wider">Visibility Context</Label>
                                        <Select value={tagForm.visibility} onValueChange={(val) => setTagForm({...tagForm, visibility: val})}>
                                            <SelectTrigger className="rounded-lg h-10 border-slate-200 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">public (Visible on Head)</SelectItem>
                                                <SelectItem value="admin">admin (Admin internal only)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="tag-placeholder" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Placeholder Text</Label>
                                    <Input
                                        id="tag-placeholder"
                                        value={tagForm.inputPlaceholder}
                                        onChange={(e) => setTagForm({...tagForm, inputPlaceholder: e.target.value})}
                                        placeholder="e.g. summary_large_image"
                                        className="rounded-lg h-10 border-slate-200"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="tag-info" className="font-bold text-slate-700 text-xs uppercase tracking-wider">Help Info (Tooltip)</Label>
                                    <Input
                                        id="tag-info"
                                        value={tagForm.inputInfo}
                                        onChange={(e) => setTagForm({...tagForm, inputInfo: e.target.value})}
                                        placeholder="Brief descriptive help context..."
                                        className="rounded-lg h-10 border-slate-200"
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="border-t border-slate-100 pt-4 mt-6">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setModalOpen(false)}
                                className="rounded-lg border-slate-200"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isActionSaving}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-6"
                            >
                                {isActionSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- DELETE CONFIRMATION DIALOG --- */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent className="max-w-[400px] p-6 bg-white rounded-2xl border border-slate-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                            <AlertCircle className="h-5 w-5 text-rose-500" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs pt-1">
                            Are you absolutely sure you want to delete <span className="font-bold text-slate-900">"{deleteTarget?.name}"</span>? This will permanently erase the configuration from the database.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-6 flex gap-2">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="flex-1 rounded-lg">
                            Cancel
                        </Button>
                        <Button onClick={handleDelete} disabled={isActionSaving} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg">
                            {isActionSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
