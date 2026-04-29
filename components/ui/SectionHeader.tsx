"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-12 ${
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-4"
        >
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-bold text-white mb-4 font-outfit tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-slate-400 text-lg max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
