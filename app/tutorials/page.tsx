"use client";

import { useHomeStore } from "@/store/homeStore";
import ResourceListing from "@/components/ResourceListing";

export default function TutorialsListing() {
    const { tutorialsPage, loading, fetchPublicTutorials } = useHomeStore();

    return (
        <ResourceListing
            title="Free Tutorials"
            description="Learn new skills with our comprehensive, expert-led tutorials on the latest technologies."
            resources={tutorialsPage?.items || []}
            loading={loading.tutorials}
            fetchData={fetchPublicTutorials}
            pagination={tutorialsPage?.pagination}
            type="tutorial"
        />
    );
}
