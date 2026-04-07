import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Zap, Shield, BarChart2, Users, Clock, Star, BookOpen, Award, LucideIcon } from 'lucide-react';
import axiosClient from '@/lib/axios-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroStat {
    icon: LucideIcon;
    value: string;
    label: string;
}

export interface HeroData {
    badge: string;
    headline: string;
    subtext: string;
    primaryCTA: { label: string; href: string };
    secondaryCTA: { label: string };
    stats: HeroStat[];
}

// export interface HeroData {
//   badge: string;
//   title: string;
//   highlight: string;
//   subtitle: string;
//   primaryCTA: string;
//   secondaryCTA: string;
//   stats: Stat[];
// }

export interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
}

export interface Course {
    id: number;
    title: string;
    category: string;
    duration: string;
    students: number;
    rating: number;
    price: number;
    originalPrice: number;
    image: string;
    badge?: string;
    instructor: string;
}

interface HomeState {
    hero: HeroData;
    features: Feature[];
    courses: Course[];
    loading: { courses: boolean };
    error: string | null;
    setHero: (data: HeroData) => void;
    setFeatures: (data: Feature[]) => void;
    setCourses: (data: Course[]) => void;
    setLoading: (key: keyof HomeState['loading'], value: boolean) => void;
    setError: (msg: string | null) => void;
    fetchCourses: () => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useHomeStore = create<HomeState>()(
    devtools((set) => ({

        hero: {
            badge: 'Empowering Next-Gen Tech Talent',
            headline: 'Accelerate Your Tech Career With Expert Guidance',
            subtext: 'Industry-aligned courses with guaranteed placement support. Learn from top experts, build real-world projects, and land your dream job in tech.',
            primaryCTA: { label: 'Explore Courses', href: '/courses' },
            secondaryCTA: { label: 'Watch Demo' },
            stats: [
                { icon: Users, value: '15,000+', label: 'Students Trained' },
                { icon: BookOpen, value: '50+', label: 'Expert Courses' },
                { icon: Award, value: '95%', label: 'Placement Rate' },
            ],
        },

        features: [
            { icon: Zap, title: 'Lightning Fast Learning', description: 'Blazing-fast platform optimized for every device and connection speed.', gradient: 'from-yellow-400 to-orange-500' },
            { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security ensures your data stays safe at all times.', gradient: 'from-green-400 to-teal-500' },
            { icon: BarChart2, title: 'Powerful Analytics', description: 'Track your progress with real-time analytics and intuitive dashboards.', gradient: 'from-blue-400 to-indigo-500' },
            { icon: Users, title: 'Team Collaboration', description: 'Work seamlessly with peers using built-in collaboration tools.', gradient: 'from-pink-400 to-rose-500' },
            { icon: Clock, title: 'Save Time', description: 'Structured learning paths help you reach your goals faster.', gradient: 'from-purple-400 to-violet-600' },
            { icon: Star, title: 'Premium Support', description: 'Get 24/7 priority support from our dedicated team of experts.', gradient: 'from-amber-400 to-yellow-500' },
        ],

      courses: [
  {
    id: 1,
    title: 'Full Stack Web Development',
    category: 'Web Development',
    duration: '6 months',
    students: 12400,
    rating: 4.9,
    price: 4999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
    badge: 'Bestseller',
    instructor: 'Rahul Sharma',
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    category: 'Data Science',
    duration: '5 months',
    students: 8900,
    rating: 4.8,
    price: 5999,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    badge: 'Trending',
    instructor: 'Priya Nair',
  },
  {
    id: 3,
    title: 'DevOps & Cloud Computing',
    category: 'Cloud',
    duration: '4 months',
    students: 6200,
    rating: 4.7,
    price: 5499,
    originalPrice: 10999,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    badge: 'New',
    instructor: 'Arun Patel',
  },
  {
    id: 4,
    title: 'React & Next.js Mastery',
    category: 'Frontend',
    duration: '3 months',
    students: 9800,
    rating: 4.9,
    price: 3999,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    badge: 'Bestseller',
    instructor: 'Sneha Reddy',
  },
  {
    id: 5,
    title: 'Python for Automation & AI',
    category: 'Python',
    duration: '4 months',
    students: 11200,
    rating: 4.8,
    price: 4499,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    instructor: 'Vikram Singh',
  },
  {
    id: 6,
    title: 'UI/UX Design Bootcamp',
    category: 'Design',
    duration: '3 months',
    students: 5400,
    rating: 4.7,
    price: 3499,
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    badge: 'New',
    instructor: 'Meera Krishnan',
  },
],

        loading: { courses: false },
        error: null,

        setHero: (data) => set({ hero: data }),
        setFeatures: (data) => set({ features: data }),
        setCourses: (data) => set({ courses: data }),
        setLoading: (key, value) =>
            set((state) => ({ loading: { ...state.loading, [key]: value } })),
        setError: (msg) => set({ error: msg }),

      fetchCourses: async () => {
  set((state) => ({ loading: { ...state.loading, courses: true }, error: null }));
  try {
    // ✅ Mock data — comment this out and uncomment API when ready
    const mockData = [
      {
        id: 1,
        title: 'Full Stack Web Development',
        category: 'Web Development',
        duration: '6 months',
        students: 12400,
        rating: 4.9,
        price: 4999,
        originalPrice: 9999,
        image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
        badge: 'Bestseller',
        instructor: 'Rahul Sharma',
      },
      {
        id: 2,
        title: 'Data Science & Machine Learning',
        category: 'Data Science',
        duration: '5 months',
        students: 8900,
        rating: 4.8,
        price: 5999,
        originalPrice: 11999,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        badge: 'Trending',
        instructor: 'Priya Nair',
      },
      {
        id: 3,
        title: 'DevOps & Cloud Computing',
        category: 'Cloud',
        duration: '4 months',
        students: 6200,
        rating: 4.7,
        price: 5499,
        originalPrice: 10999,
        image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
        badge: 'New',
        instructor: 'Arun Patel',
      },
      {
        id: 4,
        title: 'React & Next.js Mastery',
        category: 'Frontend',
        duration: '3 months',
        students: 9800,
        rating: 4.9,
        price: 3999,
        originalPrice: 7999,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
        badge: 'Bestseller',
        instructor: 'Sneha Reddy',
      },
      {
        id: 5,
        title: 'Python for Automation & AI',
        category: 'Python',
        duration: '4 months',
        students: 11200,
        rating: 4.8,
        price: 4499,
        originalPrice: 8999,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
        instructor: 'Vikram Singh',
      },
      {
        id: 6,
        title: 'UI/UX Design Bootcamp',
        category: 'Design',
        duration: '3 months',
        students: 5400,
        rating: 4.7,
        price: 3499,
        originalPrice: 6999,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        badge: 'New',
        instructor: 'Meera Krishnan',
      },
    ];
    set({ courses: mockData });

    //  Uncomment below when API is ready, and remove mockData above
    // const response = await axiosClient.get('/courses');
    // set({ courses: response.data });

  } catch (error: any) {
    const message = error?.response?.data?.message || 'Failed to load courses';
    set({ error: message });
  } finally {
    set((state) => ({ loading: { ...state.loading, courses: false } }));
  }
},


    }))
);
