"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const benefits = [
    "Customized training programs for your team",
    "Dedicated account manager & support",
    "Flexible scheduling & delivery modes",
    "Progress tracking & analytics dashboard",
    "Industry-recognized certifications",
    "Post-training assessment & reporting",
];

export default function CorporateTraining() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-[#e94560]/10 to-purple-500/10 rounded-3xl blur-xl" />
                            <div className="relative rounded-2xl shadow-lg border border-slate-100 overflow-hidden aspect-[3/2] bg-slate-100">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80')" }}
                                />
                            </div>
                            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 hidden sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e94560] to-purple-600 flex items-center justify-center shadow-lg shadow-red-500/10">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-[#e94560]">200+</p>
                                        <p className="text-xs text-slate-500 font-medium">Corporate Partners</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="text-[#e94560] text-sm font-semibold uppercase tracking-wider">For Business</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 font-outfit">
                            Corporate Training Solutions
                        </h2>
                        <p className="mt-4 text-slate-500 text-lg leading-relaxed">
                            Upskill your workforce with tailored programs designed to meet your business objectives and keep your team ahead of industry trends.
                        </p>

                        <div className="mt-8 space-y-3">
                            {benefits.map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#e94560] mt-0.5 flex-shrink-0" />
                                    <span className="text-slate-600 text-sm sm:text-base">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/contact">
                            <Button className="mt-8 w-64 h-14 rounded-full bg-gradient-to-r from-[#e94560] to-purple-600 hover:opacity-90 text-white font-semibold shadow-xl shadow-red-500/20 border border-white/10 group transition-all">
                                Get a Custom Quote
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
