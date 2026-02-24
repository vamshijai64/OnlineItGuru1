"use client";

import React from "react";
import { motion } from "framer-motion";
import { Layers, Users, Briefcase, Monitor, Award, Headphones } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "Structured Curriculum",
        description: "Industry-aligned syllabi designed with hiring managers to ensure you learn what matters.",
        color: "from-blue-500 to-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Users,
        title: "Expert Mentorship",
        description: "Learn directly from industry leaders with 10+ years of real-world experience.",
        color: "from-purple-500 to-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: Briefcase,
        title: "Placement Guarantee",
        description: "95% placement rate with access to 200+ hiring partners across top companies.",
        color: "from-[#e94560] to-[#ff6b81]",
        bg: "bg-red-50",
    },
    {
        icon: Monitor,
        title: "Hands-On Projects",
        description: "Build portfolio-worthy projects that demonstrate your skills to employers.",
        color: "from-emerald-500 to-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: Award,
        title: "Recognized Certification",
        description: "Earn industry-recognized certificates that boost your professional credibility.",
        color: "from-amber-500 to-amber-600",
        bg: "bg-amber-50",
    },
    {
        icon: Headphones,
        title: "Lifetime Support",
        description: "Access to community, resources, and career support even after course completion.",
        color: "from-cyan-500 to-cyan-600",
        bg: "bg-cyan-50",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="text-[#e94560] text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 font-outfit">
                        Everything You Need to{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e94560] to-[#ff6b81]">
                            Succeed
                        </span>
                    </h2>
                    <p className="mt-4 text-slate-500 text-lg leading-relaxed">
                        We provide a complete ecosystem for your career transformation.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative p-8 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl transition-all duration-500"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <feature.icon
                                    className={`w-7 h-7 ${feature.color.includes('e94560') ? 'text-[#e94560]' : 'text-indigo-600'}`}
                                    style={{ color: feature.color.includes('e94560') ? '#e94560' : undefined }}
                                />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 font-outfit">{feature.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
