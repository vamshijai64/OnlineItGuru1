"use client";

import { useHomeStore } from "@/store/homeStore";
import ResourceListing from "@/components/ResourceListing";

export default function InterviewQuestionsListing() {
    const { interviewQuestionsPage, loading, fetchPublicInterviewQuestions } = useHomeStore();

    return (
        <ResourceListing
            title="Interview Questions"
            description="Prepare for your next tech interview with our curated list of commonly asked questions and expert answers."
            resources={interviewQuestionsPage?.items || []}
            loading={loading.interviewQuestions}
            fetchData={fetchPublicInterviewQuestions}
            pagination={interviewQuestionsPage?.pagination}
            type="interview-question"
        />
    );
}
