"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, UserCheck } from "lucide-react";

const SPRINTS_DATA = [
    {
        company: "LawSikho",
        role: "Data Analyst",
        location: "Remote",
        type: "Full-time",
        experience: "Fresher",
        logo: "https://cdn.simpleicons.org/python/3776AB"
    },
    {
        company: "PayU",
        role: "Business Analyst",
        location: "Gurgaon",
        type: "Full-time",
        experience: "Experienced",
        logo: "https://cdn.simpleicons.org/python/3776AB"
    },
    {
        company: "Tech Mahindra",
        role: "AI Data Scientist",
        location: "Mohali",
        type: "Full-time",
        experience: "Experienced",
        logo: "https://cdn.simpleicons.org/python/3776AB"
    }
];
import { CourseDetail } from '@/store/homeStore';

const DYNAMIC_SPRINTS: Record<string, typeof SPRINTS_DATA> = {
    salesforce: [
        {
            company: "Accenture",
            role: "Salesforce Developer",
            location: "Bangalore",
            type: "Full-time",
            experience: "1-3 Years",
            logo: "https://cdn.simpleicons.org/accenture/A100FF"
        },
        {
            company: "Cognizant",
            role: "Salesforce Admin",
            location: "Hyderabad",
            type: "Full-time",
            experience: "Fresher",
            logo: "https://cdn.simpleicons.org/cognizant/0033A0"
        },
        {
            company: "Deloitte",
            role: "Salesforce Consultant",
            location: "Pune",
            type: "Full-time",
            experience: "Experienced",
            logo: "https://cdn.simpleicons.org/deloitte/86BC25"
        }
    ],
    ai: [
        {
            company: "Google",
            role: "AI Research Engineer",
            location: "Mountain View",
            type: "Full-time",
            experience: "Experienced",
            logo: "https://cdn.simpleicons.org/google/4285F4"
        },
        {
            company: "OpenAI",
            role: "LLM Researcher",
            location: "Remote",
            type: "Full-time",
            experience: "Experienced",
            logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg"
        },
        {
            company: "NVIDIA",
            role: "Deep Learning Engineer",
            location: "Bangalore",
            type: "Full-time",
            experience: "2+ Years",
            logo: "https://cdn.simpleicons.org/nvidia/76B900"
        }
    ],
    python: [
        {
            company: "Meta",
            role: "Backend Engineer (Python)",
            location: "Remote",
            type: "Full-time",
            experience: "Experienced",
            logo: "https://cdn.simpleicons.org/meta/0668E1"
        },
        {
            company: "Uber",
            role: "Data Engineer",
            location: "Hyderabad",
            type: "Full-time",
            experience: "Fresher",
            logo: "https://cdn.simpleicons.org/uber/000000"
        }
    ]
};

export default function HiringSprints({ course }: { course: CourseDetail }) {
    const courseTitle = course.title.toLowerCase();
    
    // Select data based on keywords in course title
    let displayData = SPRINTS_DATA;
    if (courseTitle.includes("salesforce")) {
        displayData = DYNAMIC_SPRINTS.salesforce;
    } else if (courseTitle.includes("ai") || courseTitle.includes("generative") || courseTitle.includes("intelligence")) {
        displayData = DYNAMIC_SPRINTS.ai;
    } else if (courseTitle.includes("python") || courseTitle.includes("data science")) {
        displayData = DYNAMIC_SPRINTS.python;
    }

    // Helper to generate a clean, natural description paragraph matching the screenshot design style
    const getDescription = (sprint: typeof SPRINTS_DATA[0]) => {
        const expText = sprint.experience.toLowerCase().includes('year') || sprint.experience.toLowerCase().includes('experience')
            ? `candidates with ${sprint.experience}`
            : `${sprint.experience.toLowerCase()} candidates`;
        return `${sprint.company} is actively recruiting for a ${sprint.role} to join their team. This is a ${sprint.type.toLowerCase()} opportunity based in ${sprint.location}, suitable for ${expText}.`;
    };

    return (
        <section className="bg-slate-50/60 border border-slate-100/80 rounded-[2.5rem] p-8 md:p-12 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-6 border-b border-slate-200/60">
                <div className="max-w-2xl space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit tracking-tight">Hiring Sprints</h2>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base font-normal">
                        Our Hiring Sprints give you the chance to hear directly from Hiring Managers and Business Heads about job roles, projects, growth opportunities, and the recruitment process. Ask questions, clarify doubts, and perform your best in the interview.
                    </p>
                </div>
                <div className="text-slate-400 text-sm font-semibold tracking-wide shrink-0">
                    {displayData.length} {displayData.length === 1 ? 'Sprint' : 'Sprints'}
                </div>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayData.map((sprint, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left group"
                    >
                        {/* Logo Container */}
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 p-2.5 border border-slate-100 mb-6">
                            {sprint.logo ? (
                                <img 
                                    src={sprint.logo} 
                                    alt={sprint.company} 
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <span className="font-bold text-slate-400 text-lg">{sprint.company.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        
                        <h3 className="font-bold text-slate-900 text-xl font-outfit mb-3">{sprint.company}</h3>
                        
                        <p className="text-slate-600 text-sm leading-relaxed font-normal">
                            {getDescription(sprint)}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
