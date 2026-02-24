"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    GraduationCap,
    BarChart4,
    FileText
} from "lucide-react";

const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Course Management", href: "/admin/courses", icon: BookOpen },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Content Management", href: "/admin/content", icon: FileText },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart4 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
            <div className="p-6 flex items-center gap-2 border-b border-white/5">
                <GraduationCap className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold font-outfit uppercase tracking-tighter">EduSpring</span>
            </div>

            <nav className="flex-grow p-4 space-y-2 mt-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <link.icon className="h-5 w-5" />
                            <span className="font-medium text-sm">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-lg transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Logout</span>
                </Link>
            </div>
        </aside>
    );
}
