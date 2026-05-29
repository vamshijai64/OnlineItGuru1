import React from "react";
import CourseDetailShell from "@/components/courses/CourseDetailShell";
import {
  fetchSeoWithFallback,
  constructMetadata,
  fetchResourceDetailServer,
  getExcerpt,
  JsonLd
} from "@/lib/seo";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategories() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/public/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const payload = await res.json();
    return payload?.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const isCategory = categories.some((c: any) => c.slug === slug);
  
  // Dynamic SEO routes mapping: Try plural `/courses/slug` first, then singular `/course/slug`
  const paths = [`/courses/${slug}`, `/course/${slug}`];
  const seo = await fetchSeoWithFallback(paths);
  
  let title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  let description = "Explore our training program on OnlineITGuru.";
  let keywords = "";

  if (isCategory) {
    const category = categories.find((c: any) => c.slug === slug);
    if (category) {
      title = `${category.title} Courses`;
      description = category.description || `Browse our industry-leading ${category.title} training courses.`;
    }
  } else {
    const course = await fetchResourceDetailServer("courses", slug);
    if (course) {
      title = course.title;
      description = course.subtitle || getExcerpt(course.description, 160) || `Learn ${course.title} from top experts.`;
    }
  }

  return constructMetadata(seo, {
    title: `${title} | OnlineITGuru`,
    description,
    canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses/${slug}`,
    keywords,
  });
}

export default async function CoursesSlugPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getCategories();
  
  const paths = [`/courses/${slug}`, `/course/${slug}`];
  const seo = await fetchSeoWithFallback(paths);

  return (
    <>
      <JsonLd jsonLd={seo?.metadata?.jsonLd} />
      <CourseDetailShell slug={slug} initialCategories={categories} />
    </>
  );
}