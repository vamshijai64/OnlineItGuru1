"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';

// Gradient colors per index for visual variety
const cardGradients = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
];

export default function LatestTutorials() {
  const tutorials = useHomeStore((state) => state.tutorials);
  const loading = useHomeStore((state) => state.loading.tutorials);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-200 rounded-full">
            Tutorials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Learn Step by Step
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Free in-depth tutorials written by experts to help you master new technologies fast.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Tutorials Grid */}
        {!loading && tutorials.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/tutorials/${tutorial.slug}`}
                  className="group block bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-500"
                >
                  {/* Top image / gradient banner */}
                  <div className={`relative h-36 bg-gradient-to-br ${cardGradients[index % cardGradients.length]} overflow-hidden`}>
                    {tutorial.featureImage ? (
                      <img
                        src={tutorial.featureImage}
                        alt={tutorial.title}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      // Decorative play icon when no image
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-14 h-14 text-white/50" />
                      </div>
                    )}

                    {/* Tutorial badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      Tutorial
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {tutorial.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Free Tutorial
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 group-hover:gap-2 transition-all">
                        Start Learning <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && tutorials.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No tutorials available right now.
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/tutorials"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition"
          >
            View All Tutorials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}