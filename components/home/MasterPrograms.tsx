"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Users, BookOpen, ArrowRight } from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';

export default function MasterPrograms() {
  const masterPrograms = useHomeStore((state) => state.masterPrograms);
  const loading = useHomeStore((state) => state.loading.masterPrograms);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-200 rounded-full">
            Master Programs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Become a Certified Expert
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Comprehensive master programs designed by industry experts to make you job-ready.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Programs Grid */}
        {!loading && masterPrograms.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {masterPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Left color accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-3xl" />

                <div className="flex gap-4 p-6 pl-8">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                    {program.image && (
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
                      {program.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mt-1 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {program.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {program.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {program.students.toLocaleString()} learners
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {program.courseCount} courses
                      </span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{program.price}</span>
                        <span className="ml-2 text-xs text-gray-400 line-through">₹{program.originalPrice}</span>
                      </div>
                      <Link
                        href={`/courses/${program.slug}`}
                        className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        Enroll <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && masterPrograms.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No master programs available right now.
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            View All Master Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}