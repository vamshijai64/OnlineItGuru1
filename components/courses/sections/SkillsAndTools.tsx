"use client";

import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle2, Layout, Boxes } from "lucide-react";

const SKILLS_DATA = [
    "Python Programming", "Statistical Analysis", "Exploratory Data Analysis",
    "Machine Learning", "Deep Learning", "NLP Techniques",
    "Generative AI", "LLM Engineering", "Prompt Engineering",
    "Retrieval Augmented Generation (RAG)", "Vector Databases", "Agentic AI",
    "Model Fine-tuning", "API Integration", "AI Application Deployment"
];

const TOOLS_DATA = [
    { name: "Python", logo: "https://cdn.simpleicons.org/python/3776AB" },
    { name: "Scikit-learn", logo: "https://cdn.simpleicons.org/scikitlearn/F7931E" },
    { name: "NumPy", logo: "https://cdn.simpleicons.org/numpy/013243" },
    { name: "Pandas", logo: "https://cdn.simpleicons.org/pandas/150458" },
    { name: "Seaborn", logo: "https://cdn.simpleicons.org/python/3776AB" }, // Seaborn doesn't have a simpleicon, using python color
    { name: "Matplotlib", logo: "https://cdn.simpleicons.org/python/3776AB" },
    { name: "Plotly", logo: "https://cdn.simpleicons.org/plotly/3F4F75" },
    { name: "Keras", logo: "https://cdn.simpleicons.org/keras/D00000" },
    { name: "TensorFlow", logo: "https://cdn.simpleicons.org/tensorflow/FF6F00" },
    { name: "Gensim", logo: "https://cdn.simpleicons.org/python/3776AB" },
];

export default function SkillsAndTools() {
    return (
        <div className="space-y-12">
            {/* Skills Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-outfit">15+ Skills Covered</h2>
                        <p className="text-sm text-slate-500 mt-1">Comprehensive skill-set for modern AI engineers</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                        {SKILLS_DATA.map((skill, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 group"
                            >
                                <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                </div>
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                                    {skill}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tools Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Boxes className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-outfit">10+ Tools Covered</h2>
                        <p className="text-sm text-slate-500 mt-1">Master the industry-standard toolchain</p>
                    </div>
                </div>
                
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {TOOLS_DATA.map((tool, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="flex flex-col items-center justify-center gap-3 group cursor-pointer"
                            >
                                <div className="h-16 w-24 flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-indigo-200 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                                    <img 
                                        src={tool.logo} 
                                        alt={tool.name}
                                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors text-center">
                                    {tool.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 group">
                            View More Tools
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            className={className}
        >
            <path d="m9 18 6-6-6-6"/>
        </svg>
    );
}
