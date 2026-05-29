import React from "react";
import HomePageClient from "@/components/home/HomePageClient";
import { getSeoByPath, constructMetadata, JsonLd } from "@/lib/seo";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPath("/");
  return constructMetadata(seo, {
    title: "Online Courses | Online IT Certification Training | OnlineITGuru",
    description: "Best online course provider in the world. Learn in-demand IT skills from top industry experts.",
    canonicalUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/`,
  });
}

export default async function HomePage() {
  const seo = await getSeoByPath("/");
  return (
    <>
      <JsonLd jsonLd={seo?.metadata?.jsonLd} />
      <HomePageClient />
    </>
  );
}
