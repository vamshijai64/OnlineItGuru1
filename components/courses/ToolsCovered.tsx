"use client";

import { motion } from "framer-motion";

const tools = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Express",
    "MongoDB", "PostgreSQL", "Prisma", "Docker", "AWS", "Figma",
    "GitHub", "Vercel", "Jest", "Cypress", "Redux", "Zustand"
];

export default function ToolsCovered() {
    return (
        <section className="py-12">
            <h2 className="text-2xl font-bold font-outfit text-slate-900 mb-8">26+ Tools & Technologies Covered</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600">{tool}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
