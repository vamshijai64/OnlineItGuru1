"use client";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
    Users, 
    BookOpen, 
    BarChart3, 
    Settings, 
    LayoutDashboard, 
    LogOut,
    Bell,
    Search,
    Tag,
    HelpCircle,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/auth/AuthForm";
import { useAdminStore } from "@/store/adminStore";

// Separate View Components
import DashboardOverview from "@/components/admin/DashboardOverview";
import CourseManagement from "@/components/admin/CourseManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import CategoryCourses from "@/components/admin/CategoryCourses";
import OfferManagement from "@/components/admin/OfferManagement";
import InterviewManagement from "@/components/admin/InterviewManagement";
import ReviewManagement from "@/components/admin/ReviewManagement";
import CourseSections from "@/components/admin/CourseSections";

export default function AdminDashboard() {
    const { user, logout } = useAuthStore();
    const { 
        adminCourses, fetchAllCourses, 
        adminCategories, fetchCategories, 
        adminOffers, fetchOffers,
        adminInterviewQuestions, fetchInterviewQuestions,
        adminReviews, fetchReviews
    } = useAdminStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'categories' | 'offers' | 'interviews' | 'reviews' | 'category-courses' | 'course-sections'>('overview');
    const [previousTab, setPreviousTab] = useState<'overview' | 'courses' | 'categories' | 'offers' | 'interviews' | 'reviews' | 'category-courses' | 'course-sections'>('courses');
    
    // State for drill-downs
    const [selectedCategory, setSelectedCategory] = useState<{slug: string, title: string} | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<{id: string, title: string} | null>(null);

    const navigateToTab = (newTab: typeof activeTab) => {
        setPreviousTab(activeTab);
        setActiveTab(newTab);
    };

    useEffect(() => {
        if (activeTab === 'courses' && adminCourses.length === 0) {
            fetchAllCourses();
        }
        if (activeTab === 'categories' && adminCategories.length === 0) {
            fetchCategories();
        }
        if (activeTab === 'offers' && adminOffers.length === 0) {
            fetchOffers();
        }
        if (activeTab === 'interviews' && adminInterviewQuestions.length === 0) {
            fetchInterviewQuestions();
        }
        if (activeTab === 'reviews' && adminReviews.length === 0) {
            fetchReviews();
        }
    }, [activeTab, adminCourses.length, adminCategories.length, adminOffers.length, adminInterviewQuestions.length, adminReviews.length, fetchAllCourses, fetchCategories, fetchOffers, fetchInterviewQuestions, fetchReviews]);

    const handleLogout = () => {
        logout();
        router.push("/admin");
    };

    if (!user || !user.roles.includes("admin")) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <AuthForm type="admin" />
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-2 font-bold text-xl uppercase tracking-tighter text-indigo-600">
                        <LayoutDashboard className="h-6 w-6" />
                        <span>Admin Panel</span>
                    </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigateToTab('overview')}
                        className={`w-full justify-start gap-3 ${activeTab === 'overview' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Overview
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigateToTab('courses')}
                        className={`w-full justify-start gap-3 ${activeTab === 'courses' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <BookOpen className="h-4 w-4" />
                        Courses
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigateToTab('categories')}
                        className={`w-full justify-start gap-3 ${activeTab === 'categories' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Settings className="h-4 w-4" />
                        Categories
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigateToTab('offers')}
                        className={`w-full justify-start gap-3 ${activeTab === 'offers' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <Tag className="h-4 w-4" />
                        Offers
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigateToTab('interviews')}
                        className={`w-full justify-start gap-3 ${activeTab === 'interviews' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <HelpCircle className="h-4 w-4" />
                        Interviews
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={() => navigateToTab('reviews')}
                        className={`w-full justify-start gap-3 ${activeTab === 'reviews' ? 'text-indigo-600 bg-indigo-50 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        Reviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100">
                        <Users className="h-4 w-4" />
                        Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </Button>
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <Button 
                        variant="ghost" 
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4 bg-slate-100 px-3 py-1.5 rounded-lg w-96">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search everything..." 
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.[0] || "A"}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {activeTab === 'overview' && <DashboardOverview userName={user.name} />}
                    {activeTab === 'courses' && (
                        <CourseManagement 
                            onViewSections={(id, title) => {
                                setSelectedCourse({id, title});
                                navigateToTab('course-sections');
                            }} 
                        />
                    )}
                    {activeTab === 'categories' && (
                        <CategoryManagement 
                            onViewCourses={(slug, title) => {
                                setSelectedCategory({slug, title});
                                navigateToTab('category-courses');
                            }} 
                        />
                    )}
                    {activeTab === 'offers' && <OfferManagement />}
                    {activeTab === 'interviews' && <InterviewManagement />}
                    {activeTab === 'reviews' && <ReviewManagement />}
                    
                    {activeTab === 'category-courses' && selectedCategory && (
                        <CategoryCourses 
                            categorySlug={selectedCategory.slug} 
                            categoryTitle={selectedCategory.title} 
                            onBack={() => navigateToTab('categories')} 
                            onViewSections={(id, title) => {
                                setSelectedCourse({id, title});
                                navigateToTab('course-sections');
                            }}
                        />
                    )}
                    {activeTab === 'course-sections' && selectedCourse && (
                        <CourseSections 
                            courseId={selectedCourse.id} 
                            courseTitle={selectedCourse.title} 
                            onBack={() => navigateToTab(previousTab)} 
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
