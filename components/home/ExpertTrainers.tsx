"use client";

import React from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const trainers = [
    {
        id: 1,
        name: "Dr. Ananya Iyer",
        title: "Lead Data Scientist",
        experience_years: 12,
        image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop",
        linkedin_url: "#",
        is_active: true
    },
    {
        id: 2,
        name: "Rahul Sharma",
        title: "Senior Full-Stack Developer",
        experience_years: 8,
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
        linkedin_url: "#",
        is_active: true
    },
    {
        id: 3,
        name: "Vikram Malhotra",
        title: "Product Design Manager",
        experience_years: 10,
        image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop",
        linkedin_url: "#",
        is_active: true
    },
    {
        id: 4,
        name: "Sarah Jenkins",
        title: "Cloud Architecture Expert",
        experience_years: 15,
        image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
        linkedin_url: "#",
        is_active: true
    }
];

export default function ExpertTrainers() {
    const active = trainers.filter((t) => t.is_active !== false).slice(0, 4);

    if (active.length === 0) return null;

    return (
        <section className="py-24 bg-[#f8f9fc]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="text-[#e94560] text-sm font-semibold uppercase tracking-wider">Our Experts</span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 font-outfit">
                        Learn From Industry Leaders
                    </h2>
                    <p className="mt-4 text-slate-500 text-lg leading-relaxed">
                        Our trainers bring decades of real-world experience from top tech companies.
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {active.map((trainer, i) => (
                        <motion.div
                            key={trainer.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-500"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={trainer.image_url}
                                    alt={trainer.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {trainer.linkedin_url && (
                                    <a
                                        href={trainer.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition-all translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300"
                                    >
                                        <Linkedin className="w-4 h-4 text-blue-600" />
                                    </a>
                                )}
                            </div>
                            <div className="p-5 text-center">
                                <h3 className="font-bold text-slate-900 font-outfit text-lg">{trainer.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{trainer.title}</p>
                                {trainer.experience_years > 0 && (
                                    <p className="text-xs text-[#e94560] font-bold mt-2 uppercase tracking-wide">
                                        {trainer.experience_years}+ years experience
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
