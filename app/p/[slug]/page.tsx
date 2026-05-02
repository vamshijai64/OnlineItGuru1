"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useHomeStore } from "@/store/homeStore";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PublicPageDetail() {
  const params = useParams();
  const slug = params?.slug as string;

  const fetchPublicPages = useHomeStore((s) => s.fetchPublicPages);
  const publicPages = useHomeStore((s) => s.publicPages);
  const loading = useHomeStore((s) => s.loading.publicPages);

  useEffect(() => {
    if (publicPages.length === 0) {
      fetchPublicPages();
    }
  }, []);

  const page = publicPages.find((p) => p.slug === slug);

  if (loading && !page) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!page && !loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
        <Link href="/" className="text-purple-600 font-semibold hover:underline">Return to Home</Link>
      </div>
    );
  }

  if (!page) return null;

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
            <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium">{page.title}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-10 font-outfit leading-tight border-b border-gray-100 pb-6">
            {page.title}
          </h1>

          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-purple-600 prose-li:marker:text-purple-600 prose-ul:space-y-2 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </main>
  );
}
