"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Meta", logo: "/logos/meta.svg" },
    { name: "Netflix", logo: "/logos/netflix.svg" },
    { name: "Apple", logo: "/logos/apple.svg" },
];

const stats = [
    { label: "Partner Companies", value: "200+" },
    { label: "Highest Package", value: "$120K" },
    { label: "Average Hike", value: "75%" },
    { label: "Placement Rate", value: "98%" },
];

export default function PlacementModule() {
    return (
        <section className="py-24 bg-indigo-900 text-white overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-base font-semibold leading-7 text-indigo-400 uppercase tracking-wider">
                            Hiring & Springs
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl font-outfit">
                            Get Hired by the World&apos;s <span className="text-indigo-400">Top Brands</span>
                        </p>
                        <p className="mt-6 text-lg leading-8 text-indigo-100">
                            Our placement cell (Springs) bridges the gap between our top-tier learners and global tech giants. We don&apos;t just train; we transform your career path.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-3xl font-bold font-outfit">{stat.value}</p>
                                    <p className="text-sm text-indigo-300 uppercase tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10"
                    >
                        <p className="text-center text-sm font-semibold uppercase tracking-widest text-indigo-300 mb-8">
                            Reliable Career Partners
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                            {partners.map((partner) => (
                                <div key={partner.name} className="flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                                    {/* Placeholder for real logos */}
                                    <div className="h-12 w-full bg-indigo-800/50 rounded flex items-center justify-center text-xs font-bold">
                                        {partner.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
