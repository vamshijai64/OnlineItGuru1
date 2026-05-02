"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Play, Building } from 'lucide-react';

const testimonials = [
  {
    name: "Aditya Sharma",
    role: "Senior Software Engineer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    quote: "The hands-on projects and expert mentorship completely transformed my career. I went from a junior role to a senior position at Google within 6 months.",
    rating: 5,
    previousRole: "Junior Developer",
    hasVideo: true
  },
  {
    name: "Sneha Reddy",
    role: "Data Scientist",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    quote: "The curriculum is industry-aligned and very practical. The support from mentors even after the course completion was exceptional.",
    rating: 5,
    previousRole: "Data Analyst",
    hasVideo: false
  },
  {
    name: "Vikram Malhotra",
    role: "Cloud Architect",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    quote: "One of the best investments I've made in my career. The placement assistance is real and very effective. Highly recommended!",
    rating: 5,
    previousRole: "IT Admin",
    hasVideo: true
  }
];

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-16">
      <motion.span 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-[#e94560] bg-[#e94560]/10 border border-[#e94560]/20 rounded-full uppercase tracking-wider"
      >
        {badge}
      </motion.span>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight font-outfit"
      >
        {title}
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function TestimonialCard({ 
  name, 
  role, 
  company,
  image, 
  quote, 
  rating = 5,
  previousRole,
  hasVideo = false,
  onPlayVideo,
  index = 0
}: any) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="relative h-full p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-[#e94560]/30 hover:shadow-2xl hover:shadow-[#e94560]/10">
        {/* Quote icon */}
        <Quote className="absolute top-6 right-6 w-12 h-12 text-[#e94560]/10" />
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
            />
          ))}
        </div>
        
        {/* Quote */}
        <p className="text-gray-300 leading-relaxed mb-8 text-lg italic font-medium">
          "{quote}"
        </p>
        
        {/* Transformation badge */}
        {previousRole && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#e94560]/10 to-purple-500/10 border border-[#e94560]/20">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 font-medium">{previousRole}</span>
              <motion.span 
                className="text-[#e94560]"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
              <span className="text-white font-bold">{role}</span>
            </div>
          </div>
        )}
        
        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={image} 
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#e94560]/50"
            />
            {hasVideo && (
              <button 
                onClick={onPlayVideo}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-[#e94560] to-purple-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#e94560]/20"
              >
                <Play className="w-3 h-3 text-white fill-white" />
              </button>
            )}
          </div>
          <div>
            <h4 className="text-white font-bold">{name}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Building className="w-3.5 h-3.5 text-[#e94560]" />
              <span className="font-medium">{company}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#e94560]/5 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <SectionHeader 
            badge="Success Stories"
            title="Hear From Our Graduates"
            subtitle="Real stories from real people who transformed their careers through our industry-aligned programs."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>
  );
}
