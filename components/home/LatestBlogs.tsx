"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function LatestBlogs() {
  const blogs = useHomeStore((state) => state.blogs);
  const loading = useHomeStore((state) => state.loading.blogs);

  return (
    <section className="relative py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-200 rounded-full">
            Latest Blogs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stay Updated With Tech
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Read our latest articles, tutorials and industry insights to stay ahead in your career.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                  {blog.featureImage && (
                    <img
                      src={blog.featureImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-purple-600 bg-purple-50 rounded-full capitalize">
                    {blog.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {blog.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(blog.publishedAt)}
                    </span>
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No blogs available right now.
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition"
          >
            View All Blogs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}