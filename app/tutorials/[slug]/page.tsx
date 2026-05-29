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
  const paths = [`/tutorials/${slug}`, `/tutorial/${slug}`];
  
  // Fetch SEO configuration from backend
  const seo = await fetchSeoWithFallback(paths);
  
  // Fetch resource details for fallback if SEO is not defined
  const tutorial = await fetchResourceDetailServer("tutorials", slug);
  const title = tutorial?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const description = getExcerpt(tutorial?.content || "", 160) || "Learn with our step-by-step tutorial on OnlineITGuru.";
  
  return constructMetadata(seo, {
    title: `${title} | OnlineITGuru`,
    description,
    canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tutorials/${slug}`,
    keywords: tutorial?.keywords || undefined,
  });
}

export default async function TutorialPostPage({ params }: Props) {
  const { slug } = await params;
  const paths = [`/tutorials/${slug}`, `/tutorial/${slug}`];
  const seo = await fetchSeoWithFallback(paths);

  return (
    <>
      <JsonLd jsonLd={seo?.metadata?.jsonLd} />
      <ResourceDetail slug={slug} type="tutorial" />
    </>
  );
}
