"use client";

import React from 'react';
import { motion } from "framer-motion";
import { TrendingUp, Briefcase, BarChart3, Target, CheckCircle2, ChevronRight, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOP_INDUSTRIES = [
    "Information Technology", "Finance", "Banking & Financial Services (BFSI)",
    "Insurance", "Healthcare & Life Sciences", "E-commerce", "Retail",
    "Marketing & Advertising", "Media & Entertainment", "Telecommunications",
    "Manufacturing", "EdTech", "Consulting & Professional Services",
    "Transportation & Logistics", "Cybersecurity & Fraud Analytics"
];

const TARGET_ROLES = [
    "Generative AI Engineer", "LLM Engineer", "NLP Engineer",
    "AI Application Developer", "AI Automation Engineer",
    "AI Solutions Architect", "Deep Learning Engineer",
    "AI Product Engineer", "Prompt Engineer", "AI/ML Engineer",
    "Data Scientist (AI/LLM)", "RAG Engineer / Vector DB Engineer",
    "Agentic AI Workflow Engineer", "Machine Learning Developer",
    "Chatbot/Conversational AI Developer"
];

export default function JobOutlook() {
    return (
        <section className="space-y-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit mb-4 italic uppercase">Gen AI Masters Program Job Outlook</h2>
                <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
            </div>

            <div className="bg-white rounded-3xl p-8 border border-blue-200 shadow-xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 grid lg:grid-cols-2 gap-12">
                    {/* Left Side: Growth & Stats */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                                Industry Growth
                            </h3>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                        <Briefcase className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-slate-900">47.5% Growth</p>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            The Generative AI market size is projected to grow at a CAGR of 47.5% during 2023-2030
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-slate-900">2.5 Million</p>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                            Career Opportunities Estimated for experienced Generative AI Engineers by 2026 in the IT industry across the globe
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-indigo-600" />
                                Top Industries
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {TOP_INDUSTRIES.map((industry, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-white hover:border-indigo-200 transition-colors">
                                        {industry}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Salary & Roles */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                Generative AI Average Annual Salary
                            </h3>
                            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-end justify-between h-40 gap-4 mb-4">
                                    {[
                                        { label: "Min", val: "₹5,00,000", h: "h-[40%]", color: "bg-cyan-400" },
                                        { label: "Average", val: "₹9,00,000", h: "h-[100%]", color: "bg-cyan-500" },
                                        { label: "Max", val: "₹13,10,000", h: "h-[70%]", color: "bg-cyan-600" },
                                    ].map((bar, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                            <span className="text-[10px] font-bold text-slate-800 whitespace-nowrap">{bar.val}</span>
                                            <motion.div
                                                initial={{ height: "0%" }}
                                                whileInView={{ height: bar.h.split('[')[1].split(']')[0] }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                                                className={`w-8 sm:w-12 ${bar.color} rounded-t-lg shadow-lg shadow-cyan-500/20`}
                                            />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{bar.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="py-2.5 px-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                                    <p className="text-sm font-semibold text-blue-800">The average salary for Generative AI is ₹9,00,000 per year.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Target className="h-5 w-5 text-indigo-600" />
                                Target Roles
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                {TARGET_ROLES.map((role, i) => (
                                    <div key={i} className="flex items-center gap-2 group">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                            {role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-xl font-bold text-slate-800 font-outfit">Know about your future prospect?</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-full shadow-lg shadow-blue-200 active:scale-95 transition-all text-lg">
                        Get in Touch
                    </Button>
                </div>
            </div>
        </section>
    );
}
