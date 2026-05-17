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

    return (
        <section className="space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit mb-4">Hiring Sprints</h2>
                <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Description Column */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Our Hiring Sprints give you the chance to hear directly from Hiring Managers and Business Heads about job roles, projects, growth opportunities, and the recruitment process. Ask questions, clarify doubts, and perform your best in the interview.
                    </p>
                </div>

                <div className="lg:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {displayData.map((sprint, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center group"
                        >
                            <div className="h-16 w-full flex items-center justify-center mb-6">
                                {sprint.logo ? (
                                    <img 
                                        src={sprint.logo} 
                                        alt={sprint.company} 
                                        className="max-h-full max-w-[120px] object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="font-bold text-slate-400">{sprint.company}</span>
                                )}
                            </div>
                            
                            <h3 className="font-bold text-slate-900 text-lg mb-4">{sprint.role}</h3>
                            
                            <ul className="space-y-2 text-slate-500 text-sm font-medium w-full">
                                <li className="flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    {sprint.location}
                                </li>
                                <li className="flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    {sprint.type}
                                </li>
                                <li className="flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    {sprint.experience}
                                </li>
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
