"use client";

import { ChevronLeft, Loader2, GripVertical, Settings2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export default function CourseSections({ courseId, courseTitle, onBack }: { courseId: string, courseTitle: string, onBack: () => void }) {
    const { courseSections, fetchCourseSections, updateCourseSectionPositions, isLoading } = useAdminStore();
    const [localSections, setLocalSections] = useState<any[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (courseId) {
            fetchCourseSections(courseId);
        }
    }, [courseId, fetchCourseSections]);

    useEffect(() => {
        setLocalSections([...courseSections].sort((a, b) => a.position - b.position));
        setHasChanges(false);
    }, [courseSections]);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // React requires some data to be set for drag to work
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
        e.preventDefault(); // Necessary to allow dropping
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

        setLocalSections(newSections);
        setDraggedIndex(null);
        setHasChanges(true);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleSavePositions = async () => {
        setIsSaving(true);
        // Map local sections to their new 0-based index positions
        const payload = localSections.map((sec, idx) => ({ id: sec.id, position: idx }));
        const success = await updateCourseSectionPositions(courseId, payload);
        if (success) {
            setHasChanges(false);
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Sections for {courseTitle}</h1>
                        <p className="text-slate-500">Manage curriculum structure, topics, and layout views.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <Button 
                            variant="secondary" 
                            onClick={handleSavePositions} 
                            disabled={isSaving}
                            className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Positions
                        </Button>
                    )}
                    <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                        <Settings2 className="h-4 w-4" />
                        Add Section
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>Curriculum Layout</CardTitle>
                    <CardDescription>Drag to reorder sections. Edit to change view types.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>Section Title</TableHead>
                                    <TableHead>Parent Tab</TableHead>
                                    <TableHead>View Type</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {localSections.map((sec: any, index: number) => (
                                    <TableRow 
                                        key={sec.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragLeave={(e) => handleDragLeave(e, index)}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`transition-colors cursor-move 
                                            ${draggedIndex === index ? "opacity-30 bg-slate-100" : ""}
                                            ${dragOverIndex === index ? "!bg-indigo-100 outline outline-2 outline-indigo-500 shadow-md relative z-10" : ""}
                                        `}
                                    >
                                        <TableCell className="w-12">
                                            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded">
                                                <GripVertical className="h-4 w-4 text-slate-400" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">{sec.title}</TableCell>
                                        <TableCell>{sec.section?.title || 'Unknown'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono bg-slate-50">
                                                {sec.view}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{index}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {localSections.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                            No sections found for this course. Add one to get started!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
