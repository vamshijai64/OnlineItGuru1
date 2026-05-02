"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, BookOpen, Send, Lock } from "lucide-react";

interface ContactFormProps {
  showTitle?: boolean;
}

export default function ContactForm({ showTitle = true }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert("Thank you! Our counselor will reach out to you shortly.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-10 md:p-14 rounded-[2.0rem] bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl w-full max-w-2xl mx-auto"
    >
      {showTitle && (
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Get Started Today
          </h2>
          <p className="text-slate-400 text-lg">
            Fill the form and our team will reach out to you
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
            />
          </div>

          <div className="relative group">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <select
              required
              className="w-full h-14 pl-12 pr-10 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all cursor-pointer"
            >
              <option value="" disabled selected className="bg-slate-900 text-slate-500">Select Course Interest</option>
              <option value="fullstack" className="bg-slate-900">Full Stack Development</option>
              <option value="datascience" className="bg-slate-900">Data Science</option>
              <option value="uiux" className="bg-slate-900">UI/UX Design</option>
              <option value="cloud" className="bg-slate-900">Cloud Computing</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative group">
          <textarea
            placeholder="Your Message (Optional)"
            className="w-full min-h-[160px] p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] group border border-white/20"
        >
          {isSubmitting ? "Processing..." : "Request Free Demo"}
          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>

        {/* Footer Info */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-6">
          <Lock className="w-4 h-4 text-amber-500/80" />
          <span>Your information is secure and never shared</span>
        </div>
      </form>
    </motion.div>
  );
}
