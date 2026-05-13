"use client";

import { Plus, Loader2, Users, ChevronLeft, ChevronRight, Calendar, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserManagement() {
    const { adminUsers, usersPagination, fetchUsersList, createUserItem, updateUserItem, deleteUserItem, isLoading } = useAdminStore();
    
    const [viewState, setViewState] = useState<'list' | 'create' | 'edit'>('list');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        status: "active",
        role: "user"
    });

    useEffect(() => {
        fetchUsersList(1, 10);
    }, [fetchUsersList]);

    const handlePageChange = (newPage: number) => {
        fetchUsersList(newPage, 10);
    };

    const handleOpenCreate = () => {
        setFormData({ 
            name: "", firstName: "", lastName: "", email: "", password: "", phone: "", status: "active", role: "user" 
        });
        setViewState('create');
    };

    const handleOpenEdit = (user: any) => {
        setSelectedUser(user);
        setFormData({
            name: user.name || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            password: "", // Leave empty when editing to not change unless provided
            phone: user.phone || "",
            status: user.status || "active",
            role: user.role || (user.roles && user.roles.length > 0 ? user.roles[0] : "user")
        });
        setViewState('edit');
    };

    const handleOpenDelete = (user: any) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = async () => {
        setIsSaving(true);
        const res = await createUserItem(formData);
        setIsSaving(false);
        if (res.success) {
            setViewState('list');
            fetchUsersList(1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleEdit = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        // Exclude password if empty
        const updateData = { ...formData };
        if (!updateData.password) {
            delete (updateData as any).password;
        }
        const res = await updateUserItem(selectedUser.id, updateData);
        setIsSaving(false);
        if (res.success) {
            setViewState('list');
            fetchUsersList(1, 10);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const res = await deleteUserItem(selectedUser.id);
        setIsSaving(false);
        if (res.success) {
            setIsDeleteModalOpen(false);
            fetchUsersList(1, 10);
        } else {
            alert(res.message);
        }
    };

    if (viewState === 'create' || viewState === 'edit') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setViewState('list')}>
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{viewState === 'create' ? 'Create New User' : 'Edit User'}</h1>
                        <p className="text-slate-500">{viewState === 'create' ? 'Add a new member to the platform.' : 'Modify existing user details.'}</p>
                    </div>
                </div>

                <Card className="border-none shadow-sm max-w-4xl">
                    <CardContent className="p-8 space-y-2">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="name" className="font-semibold text-slate-700">Display Name</Label>
                                <Input id="name" className="h-11" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Kumar" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="firstName" className="font-semibold text-slate-700">First Name</Label>
                                <Input id="firstName" className="h-11" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="e.g. Rahul" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName" className="font-semibold text-slate-700">Last Name</Label>
                                <Input id="lastName" className="h-11" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="e.g. Kumar" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-slate-700">Email Address</Label>
                                <Input id="email" type="email" className="h-11" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="rahul@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="font-semibold text-slate-700">Phone Number</Label>
                                <Input id="phone" className="h-11" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-semibold text-slate-700">Password</Label>
                                <Input id="password" type="password" className="h-11" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={viewState === 'edit' ? "Leave empty to keep unchanged" : "••••••••"} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role" className="font-semibold text-slate-700">Role</Label>
                                <select 
                                    id="role" 
                                    className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.role} 
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="instructor">Instructor</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status" className="font-semibold text-slate-700">Status</Label>
                                <select 
                                    id="status" 
                                    className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.status} 
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-100">
                            <Button variant="outline" size="lg" onClick={() => setViewState('list')}>Cancel</Button>
                            <Button size="lg" onClick={viewState === 'create' ? handleCreate : handleEdit} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {viewState === 'create' ? 'Create User' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 w-full min-w-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage system users, roles, and access.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                    <Plus className="h-4 w-4" />
                    New User
                </Button>
            </div>

            <Card className="border-none shadow-sm w-full overflow-hidden">
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A complete list of registered users on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {isLoading && !isSaving ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User Details</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adminUsers.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-indigo-100 h-10 w-10 flex items-center justify-center rounded-full text-indigo-700 font-bold uppercase">
                                                        {item.name ? item.name.charAt(0) : 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{item.name}</div>
                                                        <div className="text-sm text-slate-500">{item.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize bg-slate-50">
                                                    {item.role || (item.roles && item.roles.length > 0 ? item.roles[0] : "User")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className={item.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                                                    {item.status || 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-2 h-[72px]">
                                                <Button onClick={() => handleOpenEdit(item)} variant="ghost" size="sm" className="text-indigo-600">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => handleOpenDelete(item)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {adminUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {usersPagination && usersPagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        Showing page <span className="font-bold text-slate-900">{usersPagination.page}</span> of <span className="font-bold text-slate-900">{usersPagination.totalPages}</span>
                                    </p>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(usersPagination.page - 1)}
                                            disabled={usersPagination.page === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handlePageChange(usersPagination.page + 1)}
                                            disabled={usersPagination.page === usersPagination.totalPages}
                                        >
                                            Next <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-slate-900">{selectedUser?.name}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
