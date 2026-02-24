"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LineChart, PieChart, Target } from "lucide-react";

export default function AnalyticsModule() {
    const metrics = [
        { label: "Course Completion", value: 75, icon: Target, color: "text-blue-600" },
        { label: "Assignment Score", value: 88, icon: BarChart3, color: "text-green-600" },
        { label: "Practice Time", value: 65, icon: LineChart, color: "text-purple-600" },
        { label: "Industry Readiness", value: 92, icon: PieChart, color: "text-orange-600" },
    ];

    return (
        <section className="py-12 bg-slate-50/50 rounded-3xl px-8 border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-2xl font-bold font-outfit text-slate-900">Performance Analytics</h2>
                    <p className="text-slate-500 mt-1">Track your growth and readiness for the industry.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm">
                    Live Progress Tracking
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {metrics.map((metric) => (
                    <Card key={metric.label} className="border-none shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-600">{metric.label}</CardTitle>
                            <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-2xl font-bold font-outfit text-slate-900">{metric.value}%</span>
                            </div>
                            <Progress value={metric.value} className="h-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-10 p-6 bg-indigo-600 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold font-outfit">Unlock Detailed Performance Insights</h3>
                    <p className="text-indigo-100 text-sm mt-1">Our AI-driven analytics help you focus on areas that need improvement.</p>
                </div>
                <div className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-lg text-sm cursor-pointer hover:bg-indigo-50 transition-colors">
                    View Detailed Dashboard
                </div>
            </div>
        </section>
    );
}
