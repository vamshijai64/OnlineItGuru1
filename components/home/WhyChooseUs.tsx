


"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHomeStore } from '@/store/homeStore';
import type { Feature } from '@/store/homeStore';

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-200 rounded-full">
        {badge}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-500 max-w-2xl mx-auto text-lg">{subtitle}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient = 'from-purple-500 to-blue-500', delay = 0 }: Feature & { delay?: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full p-8 rounded-3xl bg-white border border-gray-100 overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-purple-500/20">
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(139,92,246,0.1), transparent)`,
            animation: isHovered ? 'shimmer 2s infinite' : 'none',
          }}
        />
        <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

        <div className="relative z-10">
          <motion.div
            className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6`}
            animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-7 h-7 text-white" />
          </motion.div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-purple-400 transition-all duration-300">
            {title}
          </h3>
          <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
            {description}
          </p>
        </div>

        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-500`} />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  const features = useHomeStore((state) => state.features); // ✅ from store

  return (
    <section className="relative py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          badge="Why Choose Us"
          title="Everything You Need to Succeed"
          subtitle="Our comprehensive platform provides all the tools and support you need to master new skills and advance your career."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
