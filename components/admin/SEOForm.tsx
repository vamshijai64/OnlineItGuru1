"use client";

import React, { useEffect, useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { fetchPublicSeo, SeoPageItem, SeoMetaTagItem } from "@/lib/admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { 
    AlertCircle, 
    CheckCircle2, 
    Info, 
    Loader2, 
    Save, 
    Settings, 
    FileCode, 
    Globe, 
    Sparkles 
} from "lucide-react";

interface SEOFormProps {
    objectType: string; // e.g. "App\\Course"
    objectId: string | null | undefined;
    defaultPath: string; // e.g. "/courses/react-native"
    defaultTitle?: string;
    defaultDescription?: string;
    onSaveSuccess?: () => void;
}

export default function SEOForm({
    objectType,
    objectId,
    defaultPath,
    defaultTitle = "",
    defaultDescription = "",
    onSaveSuccess
}: SEOFormProps) {
    const { 
        createSeoPage, 
        updateSeoPage, 
        fetchSeoMetaTags, 
        adminSeoMetaTags, 
        isLoading: isStoreLoading 
    } = useAdminStore();

    const [activeSubTab, setActiveSubTab] = useState<"basic" | "meta" | "advanced">("basic");
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const [seoRecordId, setSeoRecordId] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form fields
    const [path, setPath] = useState(defaultPath);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [canonicalUrl, setCanonicalUrl] = useState("");
    const [robotIndex, setRobotIndex] = useState("index");
    const [robotFollow, setRobotFollow] = useState("follow");
    const [changeFrequency, setChangeFrequency] = useState("monthly");
    const [priority, setPriority] = useState(0.5);
    const [focusKeyword, setFocusKeyword] = useState("");
    const [schema, setSchema] = useState("");
    const [tagsHtml, setTagsHtml] = useState("");

    // Dynamic Meta Tags (mapping id to input string)
    const [metaTagsValues, setMetaTagsValues] = useState<Record<number, string>>({});

    // Load initial SEO data
    useEffect(() => {
        if (!objectId) return;

        const loadData = async () => {
            setIsLocalLoading(true);
            try {
                // 1. Fetch meta tag definitions if not loaded
                await fetchSeoMetaTags(1, 100);

                // 2. Fetch SEO configuration for this object
                const res = await fetchPublicSeo({ object: objectType, objectId });
                const seoPage: SeoPageItem | undefined = res?.data?.page;

                if (seoPage) {
                    setSeoRecordId(seoPage.id);
                    setPath(seoPage.path || defaultPath);
                    setTitle(seoPage.title || "");
                    setDescription(seoPage.description || "");
                    setCanonicalUrl(seoPage.canonicalUrl || "");
                    setRobotIndex(seoPage.robotIndex || "index");
                    setRobotFollow(seoPage.robotFollow || "follow");
                    setChangeFrequency(seoPage.changeFrequency || "monthly");
                    setPriority(seoPage.priority ?? 0.5);
                    setFocusKeyword(seoPage.focusKeyword || "");
                    setSchema(seoPage.schema || "");
                    setTagsHtml(seoPage.tagsHtml || "");

                    // Map loaded metaTags values
                    const initialMetas: Record<number, string> = {};
                    if (res?.data?.metaTags) {
                        res.data.metaTags.forEach((m: any) => {
                            if (m.seoMetaTagId) {
                                initialMetas[m.seoMetaTagId] = m.content || "";
                            }
                        });
                    }
                    setMetaTagsValues(initialMetas);
                } else {
                    // Initialize with Smart Defaults
                    setSeoRecordId(null);
                    setPath(defaultPath);
                    
                    // Clean title fallback
                    const cleanTitle = defaultTitle.trim();
                    setTitle(cleanTitle ? `${cleanTitle} | OnlineITGuru` : "OnlineITGuru");
                    
                    // Clean description fallback (first 160 chars)
                    const cleanDesc = defaultDescription
                        .replace(/<[^>]*>/g, '') // Strip HTML
                        .replace(/\s+/g, ' ')
                        .trim();
                    setDescription(cleanDesc.substring(0, 160));
                    
                    // Canonical fallback
                    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://onlineitguru.com";
                    setCanonicalUrl(`${siteUrl}${defaultPath}`);

                    setRobotIndex("index");
                    setRobotFollow("follow");
                    setChangeFrequency("monthly");
                    setPriority(0.5);
                    setFocusKeyword("");
                    setSchema("");
                    setTagsHtml("");
                    setMetaTagsValues({});
                }
            } catch (err) {
                console.error("Error loading SEO data:", err);
            } finally {
                setIsLocalLoading(false);
            }
        };

        loadData();
    }, [objectId, objectType, defaultPath, defaultTitle, defaultDescription, fetchSeoMetaTags]);

    // Handle Title Length Gauge
    const getTitleGaugeColor = () => {
        const len = title.length;
        if (len >= 50 && len <= 60) return "bg-emerald-500";
        if (len >= 40 && len < 50) return "bg-amber-400";
        if (len > 60 && len <= 70) return "bg-amber-400";
        return "bg-rose-500";
    };

    const getTitleFeedback = () => {
        const len = title.length;
        if (len === 0) return { text: "Title is empty", color: "text-slate-400" };
        if (len >= 50 && len <= 60) return { text: "Optimal length (50-60 characters)", color: "text-emerald-600 font-medium" };
        if (len < 40) return { text: "Too short", color: "text-rose-500" };
        if (len > 70) return { text: "Too long (will be truncated in search results)", color: "text-rose-500" };
        return { text: "Acceptable, but can be optimized", color: "text-amber-500" };
    };

    // Handle Description Length Gauge
    const getDescriptionGaugeColor = () => {
        const len = description.length;
        if (len >= 140 && len <= 160) return "bg-emerald-500";
        if (len >= 120 && len < 140) return "bg-amber-400";
        if (len > 160 && len <= 180) return "bg-amber-400";
        return "bg-rose-500";
    };

    const getDescriptionFeedback = () => {
        const len = description.length;
        if (len === 0) return { text: "Description is empty", color: "text-slate-400" };
        if (len >= 140 && len <= 160) return { text: "Optimal length (140-160 characters)", color: "text-emerald-600 font-medium" };
        if (len < 100) return { text: "Too short (provide more context)", color: "text-rose-500" };
        if (len > 170) return { text: "Too long (will be truncated in search results)", color: "text-rose-500" };
        return { text: "Acceptable, but can be optimized", color: "text-amber-500" };
    };

    const handleMetaTagChange = (tagId: number, val: string) => {
        setMetaTagsValues(prev => ({
            ...prev,
            [tagId]: val
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!objectId) return;

        setMessage(null);

        // Prepare child meta-tags array
        const metaTagsPayload = Object.entries(metaTagsValues)
            .filter(([_, value]) => value.trim() !== "")
            .map(([key, value]) => ({
                seoMetaTagId: parseInt(key),
                content: value.trim()
            }));

        // Validate JSON Schema if present
        if (schema.trim()) {
            try {
                JSON.parse(schema);
            } catch (err) {
                setMessage({ type: "error", text: "Invalid JSON-LD schema syntax. Please enter a valid JSON object." });
                setActiveSubTab("advanced");
                return;
            }
        }

        const payload = {
            path,
            object: objectType,
            objectId,
            title,
            description,
            canonicalUrl,
            robotIndex,
            robotFollow,
            changeFrequency,
            priority: parseFloat(priority.toString()),
            focusKeyword,
            schema: schema.trim() || null,
            tagsHtml: tagsHtml.trim() || null,
            metaTags: metaTagsPayload,
            linkTags: [],
            images: []
        };

        let result;
        if (seoRecordId) {
            result = await updateSeoPage(seoRecordId, payload);
        } else {
            result = await createSeoPage(payload);
            if (result.success && result.data?.id) {
                setSeoRecordId(result.data.id);
            }
        }

        if (result.success) {
            setMessage({ type: "success", text: "SEO page settings saved successfully!" });
            if (onSaveSuccess) onSaveSuccess();
        } else {
            setMessage({ type: "error", text: result.message || "Failed to save SEO settings." });
        }
    };

    // Render creation guard notice if no object ID
    if (!objectId) {
        return (
            <Card className="border border-indigo-100 bg-indigo-50/50 backdrop-blur-sm rounded-xl py-10 text-center">
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-indigo-600/10 p-4 rounded-full text-indigo-600 animate-pulse">
                        <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-indigo-950">Configure SEO Settings</h3>
                    <p className="text-indigo-600 text-sm max-w-sm">
                        Please save the basic details of this record first. Once the item is created, you can access and manage its SEO rules here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (isLocalLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-slate-500 text-sm">Fetching page configurations...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setActiveSubTab("basic")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                            activeSubTab === "basic"
                                ? "bg-indigo-50 text-indigo-600 animate-fade-in"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                        <Globe className="h-4 w-4" />
                        Basic SEO
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSubTab("meta")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                            activeSubTab === "meta"
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                        <Settings className="h-4 w-4" />
                        Custom Meta Tags
                        {adminSeoMetaTags.length > 0 && (
                            <Badge className="ml-1 bg-indigo-100 text-indigo-600 hover:bg-indigo-150">
                                {adminSeoMetaTags.length}
                            </Badge>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSubTab("advanced")}
                        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                            activeSubTab === "advanced"
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                        <FileCode className="h-4 w-4" />
                        Advanced / Schema
                    </button>
                </div>

                <Button 
                    type="submit" 
                    disabled={isStoreLoading} 
                    className="bg-indigo-600 hover:bg-indigo-700 font-semibold gap-2 shadow-sm rounded-lg"
                >
                    {isStoreLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save SEO Settings
                </Button>
            </div>

            {/* Notification alert */}
            {message && (
                <div className={`p-4 rounded-xl flex items-start gap-3 ${
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

            {/* Sub-Tab Contents */}
            {activeSubTab === "basic" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Core Fields */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="seo-path" className="text-slate-700 font-bold">Relative Path</Label>
                            <Input
                                id="seo-path"
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                placeholder="/courses/example"
                                required
                                className="rounded-lg border-slate-200 focus-visible:ring-indigo-500"
                            />
                            <p className="text-slate-400 text-xs">The route this setting targets (e.g. `/blog/my-slug`).</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo-title" className="text-slate-700 font-bold flex justify-between">
                                <span>SEO Meta Title</span>
                                <span className="text-slate-400 text-xs">{title.length} chars</span>
                            </Label>
                            <Input
                                id="seo-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Write a catchy search engine title"
                                required
                                className="rounded-lg border-slate-200 focus-visible:ring-indigo-500"
                            />
                            {/* Length Indicator Progress Bar */}
                            <div className="space-y-1">
                                <Progress 
                                    value={Math.min((title.length / 75) * 100, 100)} 
                                    className={`h-1.5 ${getTitleGaugeColor()}`}
                                />
                                <p className={`text-xs ${getTitleFeedback().color}`}>{getTitleFeedback().text}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo-desc" className="text-slate-700 font-bold flex justify-between">
                                <span>SEO Meta Description</span>
                                <span className="text-slate-400 text-xs">{description.length} chars</span>
                            </Label>
                            <Textarea
                                id="seo-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the page content in 150-160 characters..."
                                required
                                rows={4}
                                className="rounded-lg border-slate-200 focus-visible:ring-indigo-500 resize-none"
                            />
                            {/* Length Indicator Progress Bar */}
                            <div className="space-y-1">
                                <Progress 
                                    value={Math.min((description.length / 200) * 100, 100)} 
                                    className={`h-1.5 ${getDescriptionGaugeColor()}`}
                                />
                                <p className={`text-xs ${getDescriptionFeedback().color}`}>{getDescriptionFeedback().text}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: SEO Configuration settings */}
                    <div className="space-y-6 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            <Settings className="h-4 w-4 text-indigo-600" />
                            Search Configurations
                        </h4>

                        <div className="space-y-2">
                            <Label htmlFor="seo-canonical" className="text-slate-700 font-semibold">Canonical URL</Label>
                            <Input
                                id="seo-canonical"
                                value={canonicalUrl}
                                onChange={(e) => setCanonicalUrl(e.target.value)}
                                placeholder="https://onlineitguru.com/..."
                                className="rounded-lg bg-white border-slate-200 focus-visible:ring-indigo-500"
                            />
                            <p className="text-slate-400 text-xs">Avoid duplicate content issues by setting the master URL.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seo-focus" className="text-slate-700 font-semibold">Focus Keyword</Label>
                            <Input
                                id="seo-focus"
                                value={focusKeyword}
                                onChange={(e) => setFocusKeyword(e.target.value)}
                                placeholder="e.g. generative AI tutorial"
                                className="rounded-lg bg-white border-slate-200 focus-visible:ring-indigo-500"
                            />
                            <p className="text-slate-400 text-xs">Used for content checks (not directly output to html).</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="seo-index" className="text-slate-700 font-semibold">Robots Index</Label>
                                <Select value={robotIndex} onValueChange={setRobotIndex}>
                                    <SelectTrigger id="seo-index" className="bg-white border-slate-200 rounded-lg">
                                        <SelectValue placeholder="Index status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="index">index (Visible)</SelectItem>
                                        <SelectItem value="noindex">noindex (Hidden)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="seo-follow" className="text-slate-700 font-semibold">Robots Follow</Label>
                                <Select value={robotFollow} onValueChange={setRobotFollow}>
                                    <SelectTrigger id="seo-follow" className="bg-white border-slate-200 rounded-lg">
                                        <SelectValue placeholder="Follow status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="follow">follow (Follow links)</SelectItem>
                                        <SelectItem value="nofollow">nofollow (Ignore links)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="seo-freq" className="text-slate-700 font-semibold">Sitemap Change Freq</Label>
                                <Select value={changeFrequency} onValueChange={setChangeFrequency}>
                                    <SelectTrigger id="seo-freq" className="bg-white border-slate-200 rounded-lg">
                                        <SelectValue placeholder="Change frequency" />
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
                            <div className="space-y-2">
                                <Label htmlFor="seo-priority" className="text-slate-700 font-semibold">Sitemap Priority ({priority})</Label>
                                <Input
                                    id="seo-priority"
                                    type="number"
                                    step="0.1"
                                    min="0.0"
                                    max="1.0"
                                    value={priority}
                                    onChange={(e) => setPriority(parseFloat(e.target.value) || 0.5)}
                                    className="rounded-lg bg-white border-slate-200 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSubTab === "meta" && (
                <Card className="border border-slate-100 shadow-sm rounded-xl">
                    <CardHeader className="bg-slate-50/50 pb-4">
                        <CardTitle className="text-md font-bold text-slate-800 flex items-center gap-2">
                            <Settings className="h-4 w-4 text-indigo-600" />
                            Dynamic Meta Tag Settings
                        </CardTitle>
                        <CardDescription>
                            Configure additional meta tags below. Definitions are loaded dynamically from the system database.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {adminSeoMetaTags.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">
                                No custom meta-tag definitions found in database. Create them in the main SEO settings panel.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {adminSeoMetaTags.map((tag: SeoMetaTagItem) => (
                                    <div key={tag.id} className="space-y-2">
                                        <Label htmlFor={`meta-tag-${tag.id}`} className="text-slate-700 font-bold flex items-center gap-1.5">
                                            {tag.inputLabel || tag.name}
                                            {tag.inputInfo && (
                                                <div className="group relative inline-block text-slate-400 hover:text-slate-600 cursor-pointer">
                                                    <Info className="h-3.5 w-3.5" />
                                                    <span className="absolute hidden group-hover:block bg-slate-900 text-white text-xs p-2 rounded shadow-md -top-8 left-6 w-48 z-10">
                                                        {tag.inputInfo}
                                                    </span>
                                                </div>
                                            )}
                                        </Label>
                                        
                                        {tag.inputType === "textarea" ? (
                                            <Textarea
                                                id={`meta-tag-${tag.id}`}
                                                value={metaTagsValues[tag.id] || ""}
                                                onChange={(e) => handleMetaTagChange(tag.id, e.target.value)}
                                                placeholder={tag.inputPlaceholder || `Enter content for meta tag: ${tag.name}`}
                                                rows={3}
                                                className="rounded-lg border-slate-200 focus-visible:ring-indigo-500 resize-none"
                                            />
                                        ) : (
                                            <Input
                                                id={`meta-tag-${tag.id}`}
                                                value={metaTagsValues[tag.id] || ""}
                                                onChange={(e) => handleMetaTagChange(tag.id, e.target.value)}
                                                placeholder={tag.inputPlaceholder || `Enter content for meta tag: ${tag.name}`}
                                                className="rounded-lg border-slate-200 focus-visible:ring-indigo-500"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {activeSubTab === "advanced" && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="seo-schema" className="text-slate-700 font-bold">JSON-LD Structured Schema</Label>
                        <Textarea
                            id="seo-schema"
                            value={schema}
                            onChange={(e) => setSchema(e.target.value)}
                            placeholder='{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Example Course Title",
  "description": "Short description..."
}'
                            rows={8}
                            className="rounded-lg font-mono text-sm border-slate-200 focus-visible:ring-indigo-500"
                        />
                        <p className="text-slate-400 text-xs">Enter a valid JSON-LD structure wrapper to inject rich search details.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seo-tags" className="text-slate-700 font-bold">Raw Custom Tags HTML</Label>
                        <Textarea
                            id="seo-tags"
                            value={tagsHtml}
                            onChange={(e) => setTagsHtml(e.target.value)}
                            placeholder='<meta name="custom-seo-agent" content="Antigravity" />'
                            rows={4}
                            className="rounded-lg font-mono text-sm border-slate-200 focus-visible:ring-indigo-500"
                        />
                        <p className="text-slate-400 text-xs">Warning: Any HTML written here will be injected as-is in the head of the page.</p>
                    </div>
                </div>
            )}
        </form>
    );
}
