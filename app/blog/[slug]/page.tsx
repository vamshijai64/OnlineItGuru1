import React from "react";
import ResourceDetail from "@/components/ResourceDetail";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paths = [`/blog/${slug}`, `/blogs/${slug}`];
  
  // Fetch SEO configuration from backend
  const seo = await fetchSeoWithFallback(paths);
  
  // Fetch resource details for fallback if SEO is not defined
  const blog = await fetchResourceDetailServer("blogs", slug);
  const title = blog?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const description = getExcerpt(blog?.content || "", 160) || "Read our latest blog post on OnlineITGuru.";
  
  return constructMetadata(seo, {
    title: `${title} | OnlineITGuru`,
    description,
    canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/blog/${slug}`,
    keywords: blog?.keywords || undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const paths = [`/blog/${slug}`, `/blogs/${slug}`];
  const seo = await fetchSeoWithFallback(paths);

  return (
    <>
      <JsonLd jsonLd={seo?.metadata?.jsonLd} />
      <ResourceDetail slug={slug} type="blog" />
    </>
  );
}
