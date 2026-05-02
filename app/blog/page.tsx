"use client";

import { useHomeStore } from "@/store/homeStore";
import ResourceListing from "@/components/ResourceListing";

export default function BlogListing() {
    const { blogsPage, loading, fetchPublicBlogs } = useHomeStore();

    return (
        <ResourceListing
            title="Insights & Resources"
            description="Stay updated with the latest trends in technology, career growth, and educational innovation."
            resources={blogsPage?.items || []}
            loading={loading.blogs}
            fetchData={fetchPublicBlogs}
            pagination={blogsPage?.pagination}
            type="blog"
        />
    );
}
