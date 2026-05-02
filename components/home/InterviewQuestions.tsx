"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';

export default function InterviewQuestions() {
  const questions = useHomeStore((state) => state.interviewQuestions);
  const loading   = useHomeStore((state) => state.loading.interviewQuestions);

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-200 rounded-full">
            Interview Prep
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crack Your Next Interview
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Prepare with our curated list of real interview questions asked by top companies.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Questions List */}
        {!loading && questions.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/interview-questions/${q.slug}`}
                  className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                  </div>

                  {/* Title */}
                  <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {q.title}
                  </span>

                  {/* Arrow */}
                  <ChevronRight className="flex-shrink-0 w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && questions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No interview questions available right now.
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/interview-questions"
            className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            View All Questions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}