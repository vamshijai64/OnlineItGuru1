"use client";

import React, { use } from "react";
import ResourceDetail from "@/components/ResourceDetail";

export default function TutorialPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    return <ResourceDetail slug={slug} type="tutorial" />;
}
