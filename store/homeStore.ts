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


export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}
export interface Blog {
  id: string;
  title: string;
  slug: string;
  featureImage: string | null;
  publishedAt: string;
  type: string;
}

interface ApiCourse {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  price: string;
  livePrice: string;
  rating: number;
  totalLearners: number;
  totalReviews: number;
  duration: string | null;
  previewImage: string | null;
  courseCount: number;
  category: { id: string; title: string; slug: string };
}
export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: string;
  originalPrice: string;
  image: string | null;
  badge: string | null;
  courseCount?: number;
  totalReviews?: number;
}
interface ApiBlog {
  id: string;
  title: string;
  slug: string;
  featureImage: string | null;
  publishedAt: string;
  type: string;
}
export interface InterviewQuestion {
  id: string;
  title: string;
  slug: string;
  featureImage: string | null;
  publishedAt: string;
}
export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  featureImage: string | null;
  publishedAt: string;
}

const categoryImageMap: Record<string, string> = {
  'Cloud Computing': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
  'AI': 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'Software Testing Tools': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  'Programming and Frameworks': 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
  'Big Data': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80';
const blogImageMap: Record<string, string> = {
  'blog': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
  'tutorial': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  'interview_question': 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80',
};
const BASE_IMAGE_URL = 'http://13.233.34.177:3000/';

function mapCourse(c: ApiCourse): Course {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    category: c.category.title,
    instructor: 'ITGuru Expert',
    rating: c.rating,
    students: c.totalLearners,
    totalReviews: c.totalReviews,
    courseCount: c.courseCount,
    duration: c.duration ? `${c.duration} hrs` : 'Self-paced',
    price: Number(c.price).toLocaleString('en-IN'),
    originalPrice: Number(c.livePrice).toLocaleString('en-IN'),
    image: c.previewImage
      ? `${BASE_IMAGE_URL}${c.previewImage}`
      : (categoryImageMap[c.category.title] ?? DEFAULT_IMAGE),
    badge: null,
  };
}
function mapBlog(b: ApiBlog): Blog {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    featureImage: b.featureImage
      ? `${BASE_IMAGE_URL}${b.featureImage}`
      : (blogImageMap[b.type] ?? blogImageMap['blog']),
    publishedAt: b.publishedAt,
    type: b.type,
  };
}
function mapInterviewQuestion(item: ApiBlog): InterviewQuestion {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    featureImage: item.featureImage
      ? `${BASE_IMAGE_URL}${item.featureImage}`
      : 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80',
    publishedAt: item.publishedAt,
  };
}
function mapTutorial(item: ApiBlog): Tutorial {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    featureImage: item.featureImage
      ? `${BASE_IMAGE_URL}${item.featureImage}`
      : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    publishedAt: item.publishedAt,
  };
}

interface HomeState {
  hero: HeroData;
  features: Feature[];
  courses: Course[];
  masterPrograms: Course[];
  blogs: Blog[];
  interviewQuestions: InterviewQuestion[];
  loading: {
    courses: boolean;
    masterPrograms: boolean;
    blogs: boolean;
    interviewQuestions: boolean;
    tutorials: boolean;
  };
  tutorials: Tutorial[];
  error: string | null;

  setHero: (data: HeroData) => void;
  setFeatures: (data: Feature[]) => void;
  setCourses: (data: Course[]) => void;
  setLoading: (key: keyof HomeState['loading'], value: boolean) => void;
  setError: (msg: string | null) => void;
  fetchCourses: () => Promise<void>;
  fetchMasterPrograms: () => Promise<void>;
  fetchBlogs: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

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

    // courses: [
    //   {
    //     id: 1,
    //     title: 'Full Stack Web Development',
    //     category: 'Web Development',
    //     duration: '6 months',
    //     students: 12400,
    //     rating: 4.9,
    //     price: 4999,
    //     originalPrice: 9999,
    //     image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
    //     badge: 'Bestseller',
    //     instructor: 'Rahul Sharma',
    //   },
    //   {
    //     id: 2,
    //     title: 'Data Science & Machine Learning',
    //     category: 'Data Science',
    //     duration: '5 months',
    //     students: 8900,
    //     rating: 4.8,
    //     price: 5999,
    //     originalPrice: 11999,
    //     image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    //     badge: 'Trending',
    //     instructor: 'Priya Nair',
    //   },
    //   {
    //     id: 3,
    //     title: 'DevOps & Cloud Computing',
    //     category: 'Cloud',
    //     duration: '4 months',
    //     students: 6200,
    //     rating: 4.7,
    //     price: 5499,
    //     originalPrice: 10999,
    //     image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    //     badge: 'New',
    //     instructor: 'Arun Patel',
    //   },
    //   {
    //     id: 4,
    //     title: 'React & Next.js Mastery',
    //     category: 'Frontend',
    //     duration: '3 months',
    //     students: 9800,
    //     rating: 4.9,
    //     price: 3999,
    //     originalPrice: 7999,
    //     image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    //     badge: 'Bestseller',
    //     instructor: 'Sneha Reddy',
    //   },
    //   {
    //     id: 5,
    //     title: 'Python for Automation & AI',
    //     category: 'Python',
    //     duration: '4 months',
    //     students: 11200,
    //     rating: 4.8,
    //     price: 4499,
    //     originalPrice: 8999,
    //     image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    //     instructor: 'Vikram Singh',
    //   },
    //   {
    //     id: 6,
    //     title: 'UI/UX Design Bootcamp',
    //     category: 'Design',
    //     duration: '3 months',
    //     students: 5400,
    //     rating: 4.7,
    //     price: 3499,
    //     originalPrice: 6999,
    //     image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    //     badge: 'New',
    //     instructor: 'Meera Krishnan',
    //   },
    // ],
    courses: [],
    interviewQuestions: [],
    masterPrograms: [],
    blogs: [],
    tutorials: [],   
    loading: {
      courses: false,
      masterPrograms: false,
      blogs: false,
      interviewQuestions: false,
      tutorials: false, 
    },
    error: null,

    setHero: (data) => set({ hero: data }),
    setFeatures: (data) => set({ features: data }),
    setCourses: (data) => set({ courses: data }),
    setLoading: (key, value) =>
      set((state) => ({ loading: { ...state.loading, [key]: value } })),
    setError: (msg) => set({ error: msg }),

    // fetchCourses: async () => {
    //   set((state) => ({ loading: { ...state.loading, courses: true }, error: null }));
    //   try {
    //     // ✅ Mock data — comment this out and uncomment API when ready
    //     const mockData = [
    //       {
    //         id: 1,
    //         title: 'Full Stack Web Development',
    //         category: 'Web Development',
    //         duration: '6 months',
    //         students: 12400,
    //         rating: 4.9,
    //         price: 4999,
    //         originalPrice: 9999,
    //         image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80',
    //         badge: 'Bestseller',
    //         instructor: 'Rahul Sharma',
    //       },
    //       {
    //         id: 2,
    //         title: 'Data Science & Machine Learning',
    //         category: 'Data Science',
    //         duration: '5 months',
    //         students: 8900,
    //         rating: 4.8,
    //         price: 5999,
    //         originalPrice: 11999,
    //         image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    //         badge: 'Trending',
    //         instructor: 'Priya Nair',
    //       },
    //       {
    //         id: 3,
    //         title: 'DevOps & Cloud Computing',
    //         category: 'Cloud',
    //         duration: '4 months',
    //         students: 6200,
    //         rating: 4.7,
    //         price: 5499,
    //         originalPrice: 10999,
    //         image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
    //         badge: 'New',
    //         instructor: 'Arun Patel',
    //       },
    //       {
    //         id: 4,
    //         title: 'React & Next.js Mastery',
    //         category: 'Frontend',
    //         duration: '3 months',
    //         students: 9800,
    //         rating: 4.9,
    //         price: 3999,
    //         originalPrice: 7999,
    //         image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    //         badge: 'Bestseller',
    //         instructor: 'Sneha Reddy',
    //       },
    //       {
    //         id: 5,
    //         title: 'Python for Automation & AI',
    //         category: 'Python',
    //         duration: '4 months',
    //         students: 11200,
    //         rating: 4.8,
    //         price: 4499,
    //         originalPrice: 8999,
    //         image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    //         instructor: 'Vikram Singh',
    //       },
    //       {
    //         id: 6,
    //         title: 'UI/UX Design Bootcamp',
    //         category: 'Design',
    //         duration: '3 months',
    //         students: 5400,
    //         rating: 4.7,
    //         price: 3499,
    //         originalPrice: 6999,
    //         image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    //         badge: 'New',
    //         instructor: 'Meera Krishnan',
    //       },
    //     ];
    //     set({ courses: mockData });

    //     //  Uncomment below when API is ready, and remove mockData above
    //     // const response = await axiosClient.get('/courses');
    //     // set({ courses: response.data });

    //   } catch (error: any) {
    //     const message = error?.response?.data?.message || 'Failed to load courses';
    //     set({ error: message });
    //   } finally {
    //     set((state) => ({ loading: { ...state.loading, courses: false } }));
    //   }
    // },

    fetchCourses: async () => {
      set((state) => ({ loading: { ...state.loading, courses: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/home');
        const mapped: Course[] = data.data.featuredCourses.map(mapCourse);
        set((state) => ({
          courses: mapped,
          loading: { ...state.loading, courses: false },
        }));
      } catch (error: any) {
        const message = error?.response?.data?.message || 'Failed to load courses';
        set((state) => ({
          error: message,
          loading: { ...state.loading, courses: false },
        }));
      }
    },

    fetchMasterPrograms: async () => {
      set((s) => ({ loading: { ...s.loading, masterPrograms: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/home');
        set((s) => ({
          masterPrograms: data.data.featuredMasterPrograms.map(mapCourse),
          loading: { ...s.loading, masterPrograms: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load master programs',
          loading: { ...s.loading, masterPrograms: false },
        }));
      }
    },
    fetchBlogs: async () => {
      set((s) => ({ loading: { ...s.loading, blogs: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/home');
        set((s) => ({
          blogs: data.data.latestBlogs.map(mapBlog),
          loading: { ...s.loading, blogs: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load blogs',
          loading: { ...s.loading, blogs: false },
        }));
      }
    },


    // ─── Fetch All at Once (use this in page.tsx) ────────────────────────────
    fetchAll: async () => {
      set({
        loading: { courses: true, masterPrograms: true, blogs: true, interviewQuestions: true, tutorials: true },
        error: null,
      });
      try {
        const { data } = await axiosClient.get('/public/home');
        const d = data.data;
        set({
          courses: d.featuredCourses.map(mapCourse),
          masterPrograms: d.featuredMasterPrograms.map(mapCourse),
          blogs: d.latestBlogs.map(mapBlog),
          interviewQuestions: d.latestInterviewQuestions.map(mapInterviewQuestion),
          tutorials: d.latestTutorials.map(mapTutorial),  // ← ADD
          loading: { courses: false, masterPrograms: false, blogs: false, interviewQuestions: false, tutorials: false },
        });
      } catch (err: any) {
        set({
          error: err?.response?.data?.message || 'Failed to load home data',
          loading: { courses: false, masterPrograms: false, blogs: false, interviewQuestions: false, tutorials: false },
        });
      }
    },

    // Add this separate action too:
    fetchInterviewQuestions: async () => {
      set((s) => ({ loading: { ...s.loading, interviewQuestions: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/home');
        set((s) => ({
          interviewQuestions: data.data.latestInterviewQuestions.map(mapInterviewQuestion),
          loading: { ...s.loading, interviewQuestions: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load interview questions',
          loading: { ...s.loading, interviewQuestions: false },
        }));
      }
    },
    fetchTutorials: async () => {
      set((s) => ({ loading: { ...s.loading, tutorials: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/home');
        set((s) => ({
          tutorials: data.data.latestTutorials.map(mapTutorial),
          loading: { ...s.loading, tutorials: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load tutorials',
          loading: { ...s.loading, tutorials: false },
        }));
      }
    },

  }))
);
