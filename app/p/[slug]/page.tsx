import React from "react";
import PublicPageDetailClient from "@/components/pages/PublicPageDetailClient";
import {
  fetchSeoWithFallback,
  constructMetadata,
  fetchPublicPagesServer,
  getExcerpt,
  JsonLd
} from "@/lib/seo";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paths = [`/p/${slug}`, `/${slug}`];
  
  // Fetch SEO configuration from backend
  const seo = await fetchSeoWithFallback(paths);
  
  // Fetch resource details for fallback if SEO is not defined
  const pages = await fetchPublicPagesServer();
  const page = pages.find((p) => p.slug === slug);
  
  const title = page?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const description = getExcerpt(page?.content || "", 160) || "Read more about OnlineITGuru.";
  
  return constructMetadata(seo, {
    title: `${title} | OnlineITGuru`,
    description,
    canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/p/${slug}`,
  });
}

export default async function PublicPageDetail({ params }: Props) {
  const { slug } = await params;
  const paths = [`/p/${slug}`, `/${slug}`];
  const seo = await fetchSeoWithFallback(paths);
  const pages = await fetchPublicPagesServer();

  return (
    <>
      <JsonLd jsonLd={seo?.metadata?.jsonLd} />
      <PublicPageDetailClient slug={slug} initialPages={pages} />
    </>
  );
}
