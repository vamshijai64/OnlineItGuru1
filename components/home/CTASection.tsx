"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-12 md:p-20 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-900/40 border border-white/5 shadow-2xl text-center"
        >
          {/* Subtle Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-outfit tracking-tight">
              Start Your Journey Today
            </h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
              Join 10,000+ professionals who have transformed their careers with us.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/courses">
                <button className="h-14 px-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  Browse Courses
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link href="/contact">
                <button className="h-14 px-10 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                  Talk to Advisor
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
