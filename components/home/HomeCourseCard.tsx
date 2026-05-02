"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Users, ChevronRight, Award, LucideIcon, BookOpen, Code2, Cloud, Brain, Database, Briefcase, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HomeCourseCardProps {
  id: string;
  title: string;
  slug: string;
  category: string;
  rating: number;
  reviews: number;
  duration: string;
  students: number;
  image: string | null;
  delay?: number;
  isTrending?: boolean;
  isNew?: boolean;
}

const categoryStyles: Record<string, { gradient: string; icon: LucideIcon }> = {
  'Programming and Frameworks': { gradient: 'from-orange-500 to-red-600', icon: Code2 },
  'Cloud Computing': { gradient: 'from-blue-500 to-cyan-600', icon: Cloud },
  'AI': { gradient: 'from-purple-600 to-pink-600', icon: Brain },
  'Data Science': { gradient: 'from-emerald-500 to-teal-600', icon: Database },
  'Business': { gradient: 'from-indigo-600 to-violet-600', icon: Briefcase },
  'default': { gradient: 'from-purple-600 to-blue-600', icon: BookOpen }
};

const defaultHighlights = [
  "Comprehensive Curriculum",
  "Hands-on Projects",
  "Industry Expert Guidance",
  "Certification of Completion",
  "Placement Assistance"
];

export default function HomeCourseCard({ 
  title, 
  slug,
  category,
  rating = 4.8, 
  reviews = 1234,
  duration = '6 weeks',
  students = 2500,
  image,
  delay = 0,
  isTrending = false,
  isNew = false
}: HomeCourseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const style = categoryStyles[category] || categoryStyles['default'];
  const Icon = style.icon;
  const gradient = style.gradient;

  return (
    <motion.div
      className="relative h-[420px] perspective-1000"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <Link 
          href={`/courses/${slug}`}
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-[#0a0a0f] border border-white/10 flex flex-col p-6 shadow-2xl shadow-black/50"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {isTrending && (
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                🔥 Trending
              </span>
            )}
            {isNew && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                ✨ New
              </span>
            )}
            {!isTrending && !isNew && (
               <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
               💎 Premium
             </span>
            )}
          </div>
          
          {/* Icon / Image Placeholder */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Category */}
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
            {category}
          </span>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
            {title}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`} 
                />
              ))}
            </div>
            <span className="text-white text-sm font-bold">{rating}</span>
            <span className="text-gray-600 text-xs">({reviews.toLocaleString()})</span>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-gray-400 text-xs mt-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-500" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>{students.toLocaleString()} Students</span>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-5">
            <Button 
              className={`w-full bg-gradient-to-r ${gradient} hover:brightness-110 text-white border-0 rounded-xl h-12 font-bold transition-all shadow-lg shadow-black/20`}
            >
              Enroll Now
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Link>
        
        {/* Back of card */}
        <Link 
          href={`/courses/${slug}`}
          className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-[#0a0a0f] border border-white/10 flex flex-col p-6 shadow-2xl shadow-black/50"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" />
            Key Highlights
          </h4>
          
          <ul className="space-y-4 flex-1">
            {defaultHighlights.map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-start gap-3 text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isFlipped ? 1 : 0, x: isFlipped ? 0 : -20 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${gradient} flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.4)]`} />
                <span className="text-sm font-medium leading-tight">{item}</span>
              </motion.li>
            ))}
          </ul>
          
          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Certificate Included</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button 
              variant="outline"
              className="w-full border-white/10 hover:bg-white/5 text-white rounded-xl h-11 font-bold transition-all"
            >
              View Curriculum
            </Button>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
