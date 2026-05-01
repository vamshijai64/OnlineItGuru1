"use client";

import { Plus, Loader2, LayoutDashboard } from "lucide-react";
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

export default function CategoryManagement({ onViewCourses }: { onViewCourses?: (slug: string, title: string) => void }) {
    const { adminCategories, isLoading } = useAdminStore();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
                    <p className="text-slate-500">Manage and organize course categories.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New Category
                </Button>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>A list of all training categories available on the platform.</CardDescription>
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
                                    <TableHead>Icon</TableHead>
                                    <TableHead>Category Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminCategories.map((cat: any) => (
                                    <TableRow key={cat.id}>
                                        <TableCell>
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                                <LayoutDashboard className="h-5 w-5" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">{cat.title}</TableCell>
                                        <TableCell className="text-slate-500">{cat.slug}</TableCell>
                                        <TableCell>{cat.position}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="mr-2"
                                                onClick={() => onViewCourses && onViewCourses(cat.slug, cat.title)}
                                            >
                                                View Courses
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Edit</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {adminCategories.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                            No categories found.
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
