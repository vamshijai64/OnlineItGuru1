"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Cloud, Brain, Database, Settings, Briefcase,
  BookOpen, PieChart, Cpu, BarChart2, CircleDot,
  FolderKanban, Wrench, Layout, Shield, Bitcoin,
  Monitor, Smartphone, Megaphone, Bot, LucideIcon
} from 'lucide-react';
import { Category } from '@/store/homeStore';

const iconMap: Record<string, LucideIcon> = {
  'fa fa-soundcloud': Cloud,
  'fa fa-pie-chart': PieChart,
  'fa fa-user': Cpu,
  'fa fa-bar-chart-o': BarChart2,
  'fa fa-codepen': Code2,
  'fa fa-lightbulb-o': Brain,
  'fa fa-opera': CircleDot,
  'fa fa-file-text': FolderKanban,
  'fa fa-wrench': Wrench,
  'fa fa-code': Layout,
  'fa fa-database': Database,
  'fa fa-shield': Shield,
  'fa fa-bitcoin': Bitcoin,
  'fa fa-windows': Monitor,
  'fa fa-mobile-phone': Smartphone,
  'fa fa-bullhorn': Megaphone,
  'fa fa-magic': Bot,
};

interface HomeCategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
  variant?: 'scroll' | 'grid';
}

export default function HomeCategoryFilter({ categories, selected, onSelect, variant = 'scroll' }: HomeCategoryFilterProps) {
  const containerClasses = variant === 'scroll'
    ? "flex flex-nowrap gap-3 justify-start md:justify-center overflow-x-auto pb-4 scrollbar-hide no-scrollbar"
    : "flex flex-wrap gap-3 justify-center";

  return (
    <div className={containerClasses}>
      {/* "All Courses" Button */}
      <motion.button
        onClick={() => onSelect('all')}
        className={`relative px-5 py-3 rounded-full flex items-center gap-2 font-medium transition-all duration-300 ${selected === 'all'
            ? 'text-white'
            : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
          }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {selected === 'all' && (
          <motion.div
            layoutId="categoryBg"
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
            initial={false}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          All Courses
        </span>
      </motion.button>

      {/* Dynamic Categories */}
      {categories.map((category) => {
        const Icon = iconMap[category.image] || Settings;
        const isSelected = selected === category.slug;

        return (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category.slug)}
            className={`relative px-5 py-3 rounded-full flex items-center gap-2 font-medium transition-all duration-300 ${isSelected
                ? 'text-white'
                : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSelected && (
              <motion.div
                layoutId="categoryBg"
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                initial={false}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {category.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
