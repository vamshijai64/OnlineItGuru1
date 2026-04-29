"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useHomeStore } from "@/store/homeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

interface CreateCourseFormProps {
    onSuccess?: () => void;
}

export default function CreateCourseForm({ onSuccess }: CreateCourseFormProps) {
    const { createCourse, isLoading, error, successMessage, clearMessages } = useAdminStore();
    const { categories, fetchCategories } = useHomeStore();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        status: "active",
        subtitle: "",
        description: "",
        previewImage: "",
        demoVideo: "",
        categoryId: "",
        duration: "",
        liveProjects: "0",
        trainingFormat: "Online",
        price: 0,
        livePrice: 0,
        rating: 4.5,
        totalLearners: 0,
        resources: "",
        assignments: "Yes",
        syllabus: "",
        totalReviews: 0,
        extraUrls: "",
        extraUrlTitle: "",
        youtubeDemo: "",
        courseType: "course"
    });

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories();
        }
    }, [categories, fetchCategories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createCourse(formData);
        if (res.success && onSuccess) {
            setTimeout(() => {
                onSuccess();
                clearMessages();
            }, 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
            
            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Python Training" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. python-training" required />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} placeholder="Brief catchphrase" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detailed course description" rows={4} />
                </div>

                {/* Media */}
                <div className="space-y-2">
                    <Label htmlFor="previewImage">Preview Image URL</Label>
                    <Input id="previewImage" name="previewImage" value={formData.previewImage} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="youtubeDemo">YouTube Demo URL</Label>
                    <Input id="youtubeDemo" name="youtubeDemo" value={formData.youtubeDemo} onChange={handleChange} placeholder="https://youtube.com/..." />
                </div>

                {/* Classification */}
                <div className="space-y-2">
                    <Label htmlFor="categoryId">Category</Label>
                    <select 
                        id="categoryId" 
                        name="categoryId" 
                        value={formData.categoryId} 
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="courseType">Course Type</Label>
                    <select 
                        id="courseType" 
                        name="courseType" 
                        value={formData.courseType} 
                        onChange={handleChange}
                        className="w-full h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    >
                        <option value="course">Standard Course</option>
                        <option value="master">Master Program</option>
                    </select>
                </div>

                {/* Pricing & Stats */}
                <div className="space-y-2">
                    <Label htmlFor="price">Original Price</Label>
                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="livePrice">Offer Price</Label>
                    <Input id="livePrice" name="livePrice" type="number" value={formData.livePrice} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 40 Hours" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="trainingFormat">Format</Label>
                    <Input id="trainingFormat" name="trainingFormat" value={formData.trainingFormat} onChange={handleChange} placeholder="Online / Offline" />
                </div>

                {/* Syllabus & Resources */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="syllabus">Syllabus</Label>
                    <Textarea id="syllabus" name="syllabus" value={formData.syllabus} onChange={handleChange} placeholder="Course syllabus content" rows={3} />
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white">
                <Button type="button" variant="outline" onClick={() => onSuccess?.()}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Course"}
                </Button>
            </div>
        </form>
    );
}
