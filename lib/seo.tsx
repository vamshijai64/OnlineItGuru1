import { Metadata } from 'next';
import React from 'react';

export interface SeoResponseData {
  page?: {
    id: number;
    path: string;
    object: string;
    objectId: string;
    title: string;
    description: string;
    canonicalUrl: string;
    robotIndex: string;
    robotFollow: string;
    changeFrequency: string;
    priority: number;
    schema: string | null;
    focusKeyword: string;
    tagsHtml: string;
  };
  metaTags?: Array<{
    id: number;
    seoMetaTagId: number;
    name: string;
    content: string;
  }>;
  settings?: {
    site_title: string;
    robot_index: string;
    robot_follow: string;
    twitter_username: string;
  };
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    robots?: {
      index?: boolean;
      follow?: boolean;
      raw?: string;
    };
    alternates?: {
      canonical?: string;
    };
    twitter?: {
      title?: string;
      description?: string;
      site?: string;
      creator?: string;
    };
    verification?: {
      google?: string;
    };
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      type?: string | null;
      images?: Array<{
        url: string;
        width?: number;
        height?: number;
        alt?: string;
      }>;
    };
    jsonLd?: Array<any>;
    otherMeta?: Record<string, string>;
  };
}

export async function getSeoByPath(path: string): Promise<SeoResponseData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.warn("[SEO] NEXT_PUBLIC_API_URL is not defined in environment variables.");
    return null;
  }
  try {
    const res = await fetch(`${apiUrl}/public/seo?path=${encodeURIComponent(path)}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const payload = await res.json();
    return payload?.data || null;
  } catch (error) {
    console.error(`[SEO] Error fetching SEO for path: ${path}`, error);
    return null;
  }
}

export async function fetchSeoWithFallback(paths: string[]): Promise<SeoResponseData | null> {
  for (const path of paths) {
    const seo = await getSeoByPath(path);
    if (seo?.metadata) {
      return seo;
    }
  }
  return null;
}

export function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function getExcerpt(content?: string, length = 160): string {
  const text = stripHtml(content);
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

interface FallbackConfig {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  keywords?: string;
}

export function constructMetadata(seo: SeoResponseData | null, fallback: FallbackConfig): Metadata {
  const meta = seo?.metadata;

  const title = meta?.title || fallback.title || "OnlineITGuru";
  const description = meta?.description || fallback.description || "Explore professional training programs, courses, and certifications.";
  const keywords = meta?.keywords || fallback.keywords || "";
  const canonical = meta?.alternates?.canonical || meta?.canonicalUrl || fallback.canonicalUrl;

  const robots = meta?.robots ? {
    index: meta.robots.index ?? true,
    follow: meta.robots.follow ?? true,
  } : {
    index: true,
    follow: true,
  };

  return {
    title,
    description,
    keywords,
    robots,
    alternates: canonical ? { canonical } : undefined,
    twitter: meta?.twitter ? {
      card: "summary_large_image",
      title: meta.twitter.title || title,
      description: meta.twitter.description || description,
      site: meta.twitter.site,
      creator: meta.twitter.creator,
    } : {
      card: "summary_large_image",
      title,
      description,
      site: "@onlineitguru",
    },
    openGraph: meta?.openGraph ? {
      title: meta.openGraph.title || title,
      description: meta.openGraph.description || description,
      url: meta.openGraph.url || canonical,
      type: (meta.openGraph.type as any) || "website",
      images: meta.openGraph.images || [],
    } : {
      title,
      description,
      url: canonical,
      type: "website",
    },
    verification: meta?.verification ? {
      google: meta.verification.google,
    } : undefined,
  };
}

export async function fetchResourceDetailServer(type: string, slug: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/public/${type}/${slug}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data || null;
    }

    // Fallback searching if direct slug detail endpoint fails
    const searchRes = await fetch(`${apiUrl}/public/${type}?search=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 }
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      const items = data?.data?.items || [];
      return items.find((item: any) => item.slug === slug) || items[0] || null;
    }
  } catch (error) {
    console.error(`[SEO] Failed to fetch resource server-side (${type}/${slug}):`, error);
  }
  return null;
}

export async function fetchCategoryDetailServer(slug: string): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/public/categories/${slug}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data || null;
    }
    const listRes = await fetch(`${apiUrl}/public/categories`, {
      next: { revalidate: 60 }
    });
    if (listRes.ok) {
      const data = await listRes.json();
      const list = data?.data || [];
      return list.find((c: any) => c.slug === slug) || null;
    }
  } catch (error) {
    console.error(`[SEO] Failed to fetch category server-side (${slug}):`, error);
  }
  return null;
}

export async function fetchPublicPagesServer(): Promise<any[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/public/pages`, {
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data || [];
    }
  } catch (error) {
    console.error(`[SEO] Failed to fetch public pages server-side:`, error);
  }
  return [];
}

export function JsonLd({ jsonLd }: { jsonLd?: Array<any> }) {
  if (!jsonLd || jsonLd.length === 0) return null;
  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
