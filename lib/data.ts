export interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    rating: number;
    reviewsCount: number;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    mode: "Online" | "Classroom" | "Hybrid";
    instructor: {
        name: string;
        role: string;
        image: string;
    };
    syllabus: {
        title: string;
        lessons: string[];
    }[];
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    image: string;
    category: string;
    readTime: string;
}

export const courses: Course[] = [
    {
        id: "1",
        slug: "full-stack-web-development",
        title: "Full-Stack Web Development Boot Camp",
        description: "Master React, Next.js, Node.js and MongoDB with hands-on projects and 100% placement support.",
        rating: 4.8,
        reviewsCount: 1250,
        duration: "6 Months",
        level: "Beginner",
        price: 499,
        originalPrice: 999,
        image: "/courses/full-stack.jpg",
        category: "Development",
        mode: "Online",
        instructor: {
            name: "Rahul Sharma",
            role: "Senior Full-Stack Developer",
            image: "/instructors/rahul.jpg",
        },
        syllabus: [
            {
                title: "Module 1: HTML, CSS & JavaScript",
                lessons: ["Intro to Web", "Advanced JavaScript", "DOM Manipulation"],
            },
            {
                title: "Module 2: React & Next.js",
                lessons: ["Hooks", "SSR vs CSR", "App Router"],
            },
        ],
    },
    {
        id: "2",
        slug: "data-science-machine-learning",
        title: "Data Science & Machine Learning with Python",
        description: "Learn statistics, data visualization, and predictive modeling with real-world datasets.",
        rating: 4.9,
        reviewsCount: 850,
        duration: "8 Months",
        level: "Intermediate",
        price: 599,
        originalPrice: 1199,
        image: "/courses/data-science.jpg",
        category: "Data Science",
        mode: "Hybrid",
        instructor: {
            name: "Dr. Ananya Iyer",
            role: "Lead Data Scientist",
            image: "/instructors/ananya.jpg",
        },
        syllabus: [],
    },
    {
        id: "3",
        slug: "ui-ux-design-masterclass",
        title: "UI/UX Design Masterclass: Figma to Pro",
        description: "Design stunning user interfaces and research-driven experiences. Perfect for career switchers.",
        rating: 4.7,
        reviewsCount: 620,
        duration: "4 Months",
        level: "Beginner",
        price: 399,
        originalPrice: 799,
        image: "/courses/uiux.jpg",
        category: "Design",
        mode: "Online",
        instructor: {
            name: "Vikram Malhotra",
            role: "Senior Product Designer",
            image: "/instructors/vikram.jpg",
        },
        syllabus: [],
    },
];

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "future-of-ai-education",
        title: "The Future of AI in Modern Education",
        excerpt: "Discover how Artificial Intelligence is reshaping the way we learn and teach in 2026.",
        content: "Full content of the blog post...",
        author: "Rahul Sharma",
        date: "Feb 15, 2026",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
        category: "AI & Tech",
        readTime: "5 min read",
    },
    {
        id: "2",
        slug: "career-transition-tech",
        title: "How to Transition Your Career into Tech",
        excerpt: "A step-by-step guide for professionals looking to make a switch into the technology sector.",
        content: "Full content of the blog post...",
        author: "Dr. Ananya Iyer",
        date: "Feb 10, 2026",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        category: "Career",
        readTime: "8 min read",
    },
];
