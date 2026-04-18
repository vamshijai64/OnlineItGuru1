// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import { Layers, Users, Briefcase, Monitor, Award, Headphones } from "lucide-react";

// const features = [
//     {
//         icon: Layers,
//         title: "Structured Curriculum",
//         description: "Industry-aligned syllabi designed with hiring managers to ensure you learn what matters.",
//         color: "from-blue-500 to-blue-600",
//         bg: "bg-blue-50",
//     },
//     {
//         icon: Users,
//         title: "Expert Mentorship",
//         description: "Learn directly from industry leaders with 10+ years of real-world experience.",
//         color: "from-purple-500 to-purple-600",
//         bg: "bg-purple-50",
//     },
//     {
//         icon: Briefcase,
//         title: "Placement Guarantee",
//         description: "95% placement rate with access to 200+ hiring partners across top companies.",
//         color: "from-[#e94560] to-[#ff6b81]",
//         bg: "bg-red-50",
//     },
//     {
//         icon: Monitor,
//         title: "Hands-On Projects",
//         description: "Build portfolio-worthy projects that demonstrate your skills to employers.",
//         color: "from-emerald-500 to-emerald-600",
//         bg: "bg-emerald-50",
//     },
//     {
//         icon: Award,
//         title: "Recognized Certification",
//         description: "Earn industry-recognized certificates that boost your professional credibility.",
//         color: "from-amber-500 to-amber-600",
//         bg: "bg-amber-50",
//     },
//     {
//         icon: Headphones,
//         title: "Lifetime Support",
//         description: "Access to community, resources, and career support even after course completion.",
//         color: "from-cyan-500 to-cyan-600",
//         bg: "bg-cyan-50",
//     },
// ];

// export default function WhyChooseUs() {
//     return (
//         <section className="py-24 bg-white overflow-hidden">
//             <div className="max-w-7xl mx-auto px-6 lg:px-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     className="text-center max-w-2xl mx-auto mb-16"
//                 >
//                     <span className="text-[#e94560] text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
//                     <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 font-outfit">
//                         Everything You Need to{" "}
//                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e94560] to-[#ff6b81]">
//                             Succeed
//                         </span>
//                     </h2>
//                     <p className="mt-4 text-slate-500 text-lg leading-relaxed">
//                         We provide a complete ecosystem for your career transformation.
//                     </p>
//                 </motion.div>

//                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {features.map((feature, i) => (
//                         <motion.div
//                             key={feature.title}
//                             initial={{ opacity: 0, y: 20 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ delay: i * 0.1 }}
//                             className="group relative p-8 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xl transition-all duration-500"
//                         >
//                             <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
//                                 <feature.icon
//                                     className={`w-7 h-7 ${feature.color.includes('e94560') ? 'text-[#e94560]' : 'text-indigo-600'}`}
//                                     style={{ color: feature.color.includes('e94560') ? '#e94560' : undefined }}
//                                 />
//                             </div>
//                             <h3 className="text-lg font-bold text-slate-900 mb-2 font-outfit">{feature.title}</h3>
//                             <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }

// "use client";
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//     Zap,
//     Shield,
//     BarChart2,
//     Users,
//     Clock,
//     Star,
// } from 'lucide-react';

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Feature {
//     icon: React.ElementType;
//     title: string;
//     description: string;
//     gradient?: string;
// }

// // ─── Features Data ────────────────────────────────────────────────────────────
// const features: Feature[] = [
//     {
//         icon: Zap,
//         title: 'Lightning Fast',
//         description: 'Experience blazing-fast performance optimized for every device and connection.',
//         gradient: 'from-yellow-400 to-orange-500',
//     },
//     {
//         icon: Shield,
//         title: 'Secure & Reliable',
//         description: 'Enterprise-grade security ensures your data stays safe and protected at all times.',
//         gradient: 'from-green-400 to-teal-500',
//     },
//     {
//         icon: BarChart2,
//         title: 'Powerful Analytics',
//         description: 'Gain deep insights with real-time analytics and intuitive dashboards.',
//         gradient: 'from-blue-400 to-indigo-500',
//     },
//     {
//         icon: Users,
//         title: 'Team Collaboration',
//         description: 'Work seamlessly with your team using built-in collaboration tools.',
//         gradient: 'from-pink-400 to-rose-500',
//     },
//     {
//         icon: Clock,
//         title: 'Save Time',
//         description: 'Automate repetitive tasks and focus on what actually moves the needle.',
//         gradient: 'from-purple-400 to-violet-600',
//     },
//     {
//         icon: Star,
//         title: 'Premium Support',
//         description: 'Get 24/7 priority support from our dedicated team of experts.',
//         gradient: 'from-amber-400 to-yellow-500',
//     },
// ];

// // ─── Section Header ───────────────────────────────────────────────────────────
// function SectionHeader({
//     badge,
//     title,
//     subtitle,
// }: {
//     badge: string;
//     title: string;
//     subtitle: string;
// }) {
//     return (
//         <div className="text-center mb-16">
//             <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-gray-800 bg-purple-500/10 border border-purple-500/20 rounded-full">
//                 {badge}
//             </span>
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
//             <p className="text-gray-800 max-w-2xl mx-auto text-lg">{subtitle}</p>
//         </div>
//     );
// }

// // ─── Feature Card ─────────────────────────────────────────────────────────────
// function FeatureCard({
//     icon: Icon,
//     title,
//     description,
//     gradient = 'from-purple-500 to-blue-500',
//     delay = 0,
// }: Feature & { delay?: number }) {
//     const [isHovered, setIsHovered] = useState(false);

//     return (
//         <motion.div
//             className="relative group cursor-pointer"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: '-50px' }}
//             transition={{ duration: 0.6, delay: delay * 0.1, ease: [0.22, 1, 0.36, 1] }}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {/* Glassmorphism card */}
//             <div className="relative h-full p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-purple-500/20">
//                 {/* Animated gradient border */}
//                 <div
//                     className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//                     style={{
//                         background: `linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)`,
//                         animation: isHovered ? 'shimmer 2s infinite' : 'none',
//                     }}
//                 />

//                 {/* Glow effect */}
//                 <div
//                     className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
//                 />

//                 {/* Content */}
//                 <div className="relative z-10">
//                     {/* Icon container */}
//                     <motion.div
//                         className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6`}
//                         animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <Icon className="w-7 h-7 text-white" />
//                     </motion.div>

//                     {/* Title */}
//                     <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-purple-400 transition-all duration-300">
//                         {title}
//                     </h3>

//                     {/* Description */}
//                     <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
//                         {description}
//                     </p>
//                 </div>

//                 {/* Corner accent */}
//                 <div
//                     className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-500`}
//                 />

//             </div>

//             <style>{`
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//       `}</style>
//         </motion.div>
//     );
// }

// // ─── Why Choose Us (Main Export) ──────────────────────────────────────────────
// export default function WhyChooseUs() {
//     return (
//         <section className="relative py-24 px-6">
//             <div className="container mx-auto max-w-6xl">
//                 <SectionHeader
//                     badge="Why Choose Us"
//                     title="Everything You Need to Succeed"
//                     subtitle="Our comprehensive platform provides all the tools and support you need to master new skills and advance your career."
//                 />

//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {features.map((feature, index) => (
//                         <FeatureCard key={index} {...feature} delay={index} />
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }


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
      <div className="container mx-auto max-w-6xl">
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
