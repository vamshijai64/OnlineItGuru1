"use client";

import { Users, BookOpen, BarChart3, Bell, Settings } from "lucide-react";
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

interface DashboardOverviewProps {
    userName: string;
}

export default function DashboardOverview({ userName }: DashboardOverviewProps) {
    const stats = [
        { title: "Total Users", value: "1,284", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Active Courses", value: "42", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "Revenue", value: "$12,450", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Pending Reviews", value: "12", icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const recentActivity = [
        { id: 1, user: "John Doe", action: "Purchased Next.js Mastery", time: "2 hours ago", status: "Completed" },
        { id: 2, user: "Sarah Smith", action: "Started React Basics", time: "4 hours ago", status: "In Progress" },
        { id: 3, user: "Mike Johnson", action: "Left a review", time: "5 hours ago", status: "Pending" },
        { id: 4, user: "Emily Brown", action: "Joined platform", time: "1 day ago", status: "New" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome Back, {userName}</h1>
                <p className="text-slate-500">Here's what's happening with your platform today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-600">
                                <span>+12%</span>
                                <span className="text-slate-400 font-normal">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest transactions and user actions</CardDescription>
                        </div>
                        <Button variant="outline" size="sm">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentActivity.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell className="font-medium">{activity.user}</TableCell>
                                        <TableCell className="text-slate-500">{activity.action}</TableCell>
                                        <TableCell className="text-slate-500">{activity.time}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={
                                                activity.status === "Completed" ? "default" : 
                                                activity.status === "Pending" ? "outline" : 
                                                activity.status === "New" ? "secondary" : "outline"
                                            }>
                                                {activity.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                        <CardDescription>Real-time performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Server Load</span>
                                <span className="text-slate-900 font-bold">42%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[42%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Database Usage</span>
                                <span className="text-slate-900 font-bold">68%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[68%]" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <div className="bg-slate-50 p-4 rounded-2xl flex items-start gap-3">
                                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                                    <Settings className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">Weekly Backup</p>
                                    <p className="text-[10px] text-slate-500">Last backup: Today at 04:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
