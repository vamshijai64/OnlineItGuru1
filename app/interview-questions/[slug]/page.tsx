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
  const paths = [`/interview-questions/${slug}`, `/interview-question/${slug}`];
  
  // Fetch SEO configuration from backend
  const seo = await fetchSeoWithFallback(paths);
  
  // Fetch resource details for fallback if SEO is not defined
  const question = await fetchResourceDetailServer("interview-questions", slug);
  const title = question?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const description = getExcerpt(question?.content || "", 160) || "Explore top interview questions and answers on OnlineITGuru.";
  
  return constructMetadata(seo, {
    title: `${title} | OnlineITGuru`,
    description,
    canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/interview-questions/${slug}`,
    keywords: question?.keywords || undefined,
  });
}

export default async function InterviewQuestionPostPage({ params }: Props) {
  const { slug } = await params;
  const paths = [`/interview-questions/${slug}`, `/interview-question/${slug}`];
  const seo = await fetchSeoWithFallback(paths);

  return (
    <>
      <JsonLd jsonLd={seo?.metadata?.jsonLd} />
      <ResourceDetail slug={slug} type="interview-question" />
    </>
  );
}
