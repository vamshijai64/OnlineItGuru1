"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useHomeStore } from "@/store/homeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { AdminCourse, CourseTemplateItem } from "@/lib/admin-api";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface CreateCourseFormProps {
    courseToEdit?: AdminCourse | null;
    prefillFromTemplate?: CourseTemplateItem | null;
    onSuccess?: () => void;
}

export default function CreateCourseForm({ courseToEdit, prefillFromTemplate, onSuccess }: CreateCourseFormProps) {
    const {
        createCourse,
        updateCourse,
        adminCourses,
        fetchAllCourses,
        isLoading,
        error,
        successMessage,
        clearMessages,
        adminCourseTemplates,
        fetchCourseTemplates
    } = useAdminStore();

    const { categories, fetchCategories } = useHomeStore();

    const [formData, setFormData] = useState({
        type: "Standard Course",
        title: "",
        subTitle: "",
        slug: "",
        extraUrlTitle: "Resources",
        extraUrls: "",
        categoryId: "",
        courseTemplateId: "",
        courseOverview: "",
        duration: "",
        assignments: 0,
        liveProjects: "0",
        downloadableResources: 0,
        selfPacedPrice: "",
        liveOnlinePrice: "",
        youtubeDemoUrl: "",
        demoVideo: "",
        previewImage: "",
        syllabus: "",
        rating: 5,
        totalReviews: 0,
        totalLearners: 0,
        selectedCourses: [] as string[],
        status: "active"
    });

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
        if (adminCourses.length === 0) {
            fetchAllCourses();
        }
        if (adminCourseTemplates.length === 0) {
            fetchCourseTemplates();
        }
    }, [categories, fetchCategories, adminCourses, fetchAllCourses, adminCourseTemplates, fetchCourseTemplates]);

    // Clear stale messages (like delete course success) upon component mount
    useEffect(() => {
        clearMessages();
    }, [clearMessages]);

    // Bind existing course data if editing
    useEffect(() => {
        if (courseToEdit) {
            setFormData({
                type: courseToEdit.type || courseToEdit.courseType || "Standard Course",
                title: courseToEdit.title || "",
                subTitle: courseToEdit.subTitle || courseToEdit.subtitle || "",
                slug: courseToEdit.slug || "",
                extraUrlTitle: courseToEdit.extraUrlTitle || "Resources",
                extraUrls: courseToEdit.extraUrls || "",
                categoryId: courseToEdit.categoryId || "",
                courseTemplateId: courseToEdit.courseTemplateId || (courseToEdit as any).course_template_id || "",
                courseOverview: courseToEdit.courseOverview || courseToEdit.description || "",
                duration: courseToEdit.duration || "",
                assignments: Number(courseToEdit.assignments) || 0,
                liveProjects: String(courseToEdit.liveProjects ?? "0"),
                downloadableResources: Number(courseToEdit.downloadableResources ?? courseToEdit.resources ?? 0),
                selfPacedPrice: String(courseToEdit.selfPacedPrice ?? courseToEdit.price ?? ""),
                liveOnlinePrice: String(courseToEdit.liveOnlinePrice ?? courseToEdit.livePrice ?? ""),
                youtubeDemoUrl: courseToEdit.youtubeDemoUrl || courseToEdit.youtubeDemo || "",
                demoVideo: courseToEdit.demoVideo || "",
                previewImage: courseToEdit.previewImage || "",
                syllabus: courseToEdit.syllabus || "",
                rating: Number(courseToEdit.rating ?? 5),
                totalReviews: Number(courseToEdit.totalReviews ?? 0),
                totalLearners: Number(courseToEdit.totalLearners ?? 0),
                selectedCourses: courseToEdit.selectedCourses || [],
                status: courseToEdit.status || "active"
            });
        }
    }, [courseToEdit]);

    // Bind template details if pre-filling
    useEffect(() => {
        if (prefillFromTemplate) {
            setFormData(prev => ({
                ...prev,
                title: prefillFromTemplate.title || "",
                categoryId: prefillFromTemplate.data?.courseDetails?.category_id || "",
                courseTemplateId: prefillFromTemplate.id,
                courseOverview: prefillFromTemplate.data?.courseDetails?.description || "",
                duration: prefillFromTemplate.data?.courseDetails?.duration || "",
                liveProjects: prefillFromTemplate.data?.courseDetails?.live_projects || "0",
                selfPacedPrice: prefillFromTemplate.data?.courseDetails?.price || "",
                liveOnlinePrice: prefillFromTemplate.data?.courseDetails?.price || "",
                slug: (prefillFromTemplate.title || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
            }));
        }
    }, [prefillFromTemplate]);

    // Prefill details when template is selected in the dropdown
    useEffect(() => {
        if (formData.courseTemplateId && adminCourseTemplates.length > 0) {
            const template = adminCourseTemplates.find(t => t.id === formData.courseTemplateId);
            if (template) {
                setFormData(prev => ({
                    ...prev,
                    categoryId: prev.categoryId || template.data?.courseDetails?.category_id || "",
                    courseOverview: prev.courseOverview || template.data?.courseDetails?.description || "",
                    duration: prev.duration || template.data?.courseDetails?.duration || "",
                    liveProjects: prev.liveProjects === "0" || !prev.liveProjects ? (template.data?.courseDetails?.live_projects || "0") : prev.liveProjects,
                    selfPacedPrice: prev.selfPacedPrice || template.data?.courseDetails?.price || "",
                    liveOnlinePrice: prev.liveOnlinePrice || template.data?.courseDetails?.price || "",
                }));
            }
        }
    }, [formData.courseTemplateId, adminCourseTemplates]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => {
            const updates: any = { title: value };
            if (!courseToEdit) {
                // Auto-generate Slug in create mode
                updates.slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
            }
            return { ...prev, ...updates };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Coerce types to align with backend expectancies
        const payload = {
            ...formData,
            assignments: Number(formData.assignments),
            downloadableResources: Number(formData.downloadableResources),
            rating: Number(formData.rating),
            totalReviews: Number(formData.totalReviews),
            totalLearners: Number(formData.totalLearners),
            courseTemplateId: formData.courseTemplateId || "",
            course_template_id: formData.courseTemplateId || "",
        };

        let res;
        if (courseToEdit) {
            res = await updateCourse(courseToEdit.id, payload);
        } else {
            res = await createCourse(payload);
        }

        if (res.success && onSuccess) {
            setTimeout(() => {
                onSuccess();
                clearMessages();
            }, 1800);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[76vh] overflow-y-auto pr-4 custom-scrollbar">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="whitespace-pre-line">{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Selection */}
                <div className="space-y-2">
                    <Label htmlFor="type" className="font-semibold text-slate-700">Course Type</Label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                        <option value="Standard Course">Standard Course</option>
                        <option value="Master Program">Master Program</option>
                        <option value="Live Online Training">Live Online Training</option>
                        <option value="Self Paced Course">Self Paced Course</option>
                    </select>
                </div>

                {/* Status Selection */}
                <div className="space-y-2">
                    <Label htmlFor="status" className="font-semibold text-slate-700">Publishing Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                    >
                        <option value="active">Active (Published)</option>
                        <option value="draft">Draft (Hidden)</option>
                    </select>
                </div>

                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold text-slate-700">Course Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Data Science Masters Program"
                        className="h-11 border-slate-200"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug" className="font-semibold text-slate-700">Slug URL path</Label>
                    <Input
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="e.g. data-science-masters-program"
                        className="h-11 border-slate-200 font-mono text-xs"
                        required
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="subTitle" className="font-semibold text-slate-700">Subtitle / Tagline</Label>
                    <Input
                        id="subTitle"
                        name="subTitle"
                        value={formData.subTitle}
                        onChange={handleChange}
                        placeholder="e.g. Job-ready program with placement support"
                        className="h-11 border-slate-200"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="courseOverview" className="font-semibold text-slate-700">Course Description & Overview</Label>
                    <Textarea
                        id="courseOverview"
                        name="courseOverview"
                        value={formData.courseOverview}
                        onChange={handleChange}
                        placeholder="Detailed syllabus introduction and overview text..."
                        rows={4}
                        className="border-slate-200 bg-slate-50 focus:bg-white transition-all text-sm leading-relaxed p-4"
                    />
                </div>

                {/* Categorization & Layout */}
                <div className="space-y-2">
                    <Label htmlFor="categoryId" className="font-semibold text-slate-700">Course Category</Label>
                    <Select
                        value={formData.categoryId}
                        onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))}
                    >
                        <SelectTrigger id="categoryId" className="w-full h-11 bg-white border-slate-200 text-sm">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {!prefillFromTemplate && (
                    <div className="space-y-2">
                        <Label htmlFor="courseTemplateId" className="font-semibold text-slate-700">Course Template (Optional)</Label>
                        <Select
                            value={formData.courseTemplateId || "none"}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, courseTemplateId: val === "none" ? "" : val }))}
                        >
                            <SelectTrigger id="courseTemplateId" className="w-full h-11 bg-white border-slate-200 font-medium text-slate-700 text-sm">
                                <SelectValue placeholder="No Template (Default)" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="none">-- No Template (Default) --</SelectItem>
                                {adminCourseTemplates.map(tmpl => (
                                    <SelectItem key={tmpl.id} value={tmpl.id}>{tmpl.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Pricing Structure */}
                <div className="space-y-2">
                    <Label htmlFor="selfPacedPrice" className="font-semibold text-slate-700">Self-Paced Price (₹)</Label>
                    <Input
                        id="selfPacedPrice"
                        name="selfPacedPrice"
                        value={formData.selfPacedPrice}
                        onChange={handleChange}
                        placeholder="e.g. 25000"
                        className="h-11 border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="liveOnlinePrice" className="font-semibold text-slate-700">Live Online Price (₹)</Label>
                    <Input
                        id="liveOnlinePrice"
                        name="liveOnlinePrice"
                        value={formData.liveOnlinePrice}
                        onChange={handleChange}
                        placeholder="e.g. 40000"
                        className="h-11 border-slate-200"
                    />
                </div>

                {/* Key Training Metrics */}
                <div className="space-y-2">
                    <Label htmlFor="duration" className="font-semibold text-slate-700">Program Duration</Label>
                    <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 6 Months or 40 Hours"
                        className="h-11 border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="liveProjects" className="font-semibold text-slate-700">Live Projects Count</Label>
                    <Input
                        id="liveProjects"
                        name="liveProjects"
                        value={formData.liveProjects}
                        onChange={handleChange}
                        placeholder="e.g. 5"
                        className="h-11 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="assignments" className="font-semibold text-slate-700">Assignments Count</Label>
                    <Input
                        id="assignments"
                        name="assignments"
                        type="number"
                        value={formData.assignments}
                        onChange={handleChange}
                        placeholder="e.g. 20"
                        className="h-11 border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="downloadableResources" className="font-semibold text-slate-700">Downloadable Resources Count</Label>
                    <Input
                        id="downloadableResources"
                        name="downloadableResources"
                        type="number"
                        value={formData.downloadableResources}
                        onChange={handleChange}
                        placeholder="e.g. 30"
                        className="h-11 border-slate-200"
                    />
                </div>

                {/* Media assets */}
                <div className="space-y-2">
                    <Label htmlFor="previewImage" className="font-semibold text-slate-700">Preview Image URL</Label>
                    <Input
                        id="previewImage"
                        name="previewImage"
                        value={formData.previewImage}
                        onChange={handleChange}
                        placeholder="https://cdn.com/preview.jpg"
                        className="h-11 border-slate-200 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="demoVideo" className="font-semibold text-slate-700">Demo MP4 Video URL</Label>
                    <Input
                        id="demoVideo"
                        name="demoVideo"
                        value={formData.demoVideo}
                        onChange={handleChange}
                        placeholder="https://cdn.com/demo.mp4"
                        className="h-11 border-slate-200 text-xs"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="youtubeDemoUrl" className="font-semibold text-slate-700">YouTube Demo URL</Label>
                    <Input
                        id="youtubeDemoUrl"
                        name="youtubeDemoUrl"
                        value={formData.youtubeDemoUrl}
                        onChange={handleChange}
                        placeholder="https://youtube.com/watch?v=..."
                        className="h-11 border-slate-200 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="syllabus" className="font-semibold text-slate-700">Syllabus PDF URL</Label>
                    <Input
                        id="syllabus"
                        name="syllabus"
                        value={formData.syllabus}
                        onChange={handleChange}
                        placeholder="https://cdn.com/syllabus.pdf"
                        className="h-11 border-slate-200 text-xs"
                    />
                </div>

                {/* Reviews & Social Stats */}
                <div className="space-y-2">
                    <Label htmlFor="rating" className="font-semibold text-slate-700">Assigned Rating (1-5)</Label>
                    <Input
                        id="rating"
                        name="rating"
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={handleChange}
                        className="h-11 border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="totalReviews" className="font-semibold text-slate-700">Total Reviews Count</Label>
                    <Input
                        id="totalReviews"
                        name="totalReviews"
                        type="number"
                        value={formData.totalReviews}
                        onChange={handleChange}
                        className="h-11 border-slate-200"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="totalLearners" className="font-semibold text-slate-700">Enrolled Learners Count</Label>
                    <Input
                        id="totalLearners"
                        name="totalLearners"
                        type="number"
                        value={formData.totalLearners}
                        onChange={handleChange}
                        className="h-11 border-slate-200"
                    />
                </div>

                {/* Extra Resource Link */}
                <div className="space-y-2">
                    <Label htmlFor="extraUrlTitle" className="font-semibold text-slate-700">Extra Resource Link Title</Label>
                    <Input
                        id="extraUrlTitle"
                        name="extraUrlTitle"
                        value={formData.extraUrlTitle}
                        onChange={handleChange}
                        placeholder="e.g. Resource Links"
                        className="h-11 border-slate-200"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="extraUrls" className="font-semibold text-slate-700">Extra URLs (Separated by |)</Label>
                    <Input
                        id="extraUrls"
                        name="extraUrls"
                        value={formData.extraUrls}
                        onChange={handleChange}
                        placeholder="e.g. https://domain.com/docs|https://domain.com/git"
                        className="h-11 border-slate-200 font-mono text-xs"
                    />
                </div>

                {/* Master Program Child Course Mapping */}
                {formData.type === "Master Program" && (
                    <div className="space-y-2 md:col-span-2 border-t border-slate-100 pt-6 mt-4">
                        <Label className="font-bold text-slate-900 text-sm">Mapped Sub-Courses in Program</Label>
                        <p className="text-xs text-slate-500 mb-2">Select the courses that make up this Master Program bundle.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 shadow-inner">
                            {adminCourses
                                .filter(c => !courseToEdit || c.id !== courseToEdit.id)
                                .map(course => {
                                    const isSelected = formData.selectedCourses.includes(course.id);
                                    return (
                                        <label
                                            key={course.id}
                                            className={`flex items-center gap-2.5 p-2 rounded-lg bg-white border cursor-pointer transition-all select-none ${isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {
                                                    setFormData(prev => {
                                                        const list = [...prev.selectedCourses];
                                                        if (isSelected) {
                                                            return { ...prev, selectedCourses: list.filter(id => id !== course.id) };
                                                        } else {
                                                            return { ...prev, selectedCourses: [...list, course.id] };
                                                        }
                                                    });
                                                }}
                                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-xs font-semibold text-slate-700 truncate" title={course.title}>
                                                {course.title}
                                            </span>
                                        </label>
                                    );
                                })}
                            {adminCourses.length === 0 && (
                                <div className="text-xs text-slate-500 py-6 text-center col-span-full">
                                    No courses are currently available to map.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 mt-6 z-10">
                <Button type="button" variant="outline" size="lg" className="h-11" onClick={() => onSuccess?.()}>Cancel</Button>
                <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px] h-11 text-sm font-semibold" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (courseToEdit ? "Update Course" : "Create Course")}
                </Button>
            </div>
        </form>
    );
}
