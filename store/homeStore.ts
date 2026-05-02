import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Headphones,GraduationCap,Calendar,Video,Code,Cloud,Star,BookOpen,Award, LucideIcon } from 'lucide-react';
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
export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;        // fa icon class from API
  position: number;
}
export interface ResourcePage<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface CoursesPage extends ResourcePage<Course> {}
export interface CourseSection {
  id: string;
  title: string;
  sectionId: string;
  courseId: string;
  position: number;
  content: string; // JSON string
  view: string;
  section: {
    id: string;
    title: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  price: string;
  livePrice: string;
  rating: number;
  totalLearners: number;
  totalReviews: number;
  duration: string | null;
  liveProjects: string;
  resources: number;
  assignments: number;
  sectionCount: number;
  previewImage: string | null;
  youtubeDemo: string | null;
  category: { id: string; title: string; slug: string };
  reviews?: any[];
}

export interface PublicPage {
  id: string;
  title: string;
  slug: string;
  content: string;
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
  categories: Category[];
  categoryCoursesPage: CoursesPage | null;
  currentCategory: Category | null;
  courseDetail: CourseDetail | null;
  courseSections: CourseSection[];
  loading: {
    courses: boolean;
    masterPrograms: boolean;
    blogs: boolean;
    interviewQuestions: boolean;
    tutorials: boolean;
    categories: boolean;
    categoryCourses: boolean;
    courseDetail: boolean;
    courseSections: boolean;
    publicPages: boolean;
  };
  tutorials: Tutorial[];
  publicPages: PublicPage[];
  blogsPage: ResourcePage<Blog> | null;
  tutorialsPage: ResourcePage<Tutorial> | null;
  interviewQuestionsPage: ResourcePage<InterviewQuestion> | null;

  error: string | null;

  setHero: (data: HeroData) => void;
  setFeatures: (data: Feature[]) => void;
  setCourses: (data: Course[]) => void;
  setLoading: (key: keyof HomeState['loading'], value: boolean) => void;
  setError: (msg: string | null) => void;
  fetchCourses: () => Promise<void>;
  fetchMasterPrograms: () => Promise<void>;
  fetchBlogs: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchCoursesByCategory: (slug: string, page?: number) => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<void>;
  fetchCourseBySlug: (slug: string) => Promise<void>;
  fetchCourseSections: (courseId: string) => Promise<void>;
  fetchPublicPages: () => Promise<void>;
  fetchPublicBlogs: (page?: number, limit?: number) => Promise<void>;
  fetchPublicTutorials: (page?: number, limit?: number) => Promise<void>;
  fetchPublicInterviewQuestions: (page?: number, limit?: number) => Promise<void>;
  fetchResourceBySlug: (type: string, slug: string) => Promise<any>;
  fetchAll: () => Promise<void>;
}

export const useHomeStore = create<HomeState>()(
  devtools((set) => ({

    hero: {
      badge: 'Empowering Next-Gen Tech Talent',
      headline: 'Accelerate Your Tech Career With Expert Guidance',
      subtext: 'Industry-aligned courses with guaranteed placement support. Learn from top experts, build real-world projects, and land your dream job in tech.',
      primaryCTA: { label: 'Explore Courses', href: '/courses' },
      secondaryCTA: { label: 'Request Free Demo' },
     
    },

    features: [
      { icon: Headphones, title: '24x7 Support', description: 'Round-the-clock assistance from our dedicated support team to help you succeed.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: GraduationCap, title: 'Expert Trainers', description: 'Learn from industry veterans with 15+ years of real-world experience.', gradient: 'from-purple-500 to-pink-500' },
  { icon: Calendar, title: 'Flexible Scheduling', description: 'Choose your own pace with batch timings that fit your lifestyle.', gradient: 'from-orange-500 to-amber-500' },
  { icon: Video, title: 'Live Interactive Classes', description: 'Engage in real-time with instructors and peers through live sessions.', gradient: 'from-green-500 to-emerald-500' },
  { icon: Code, title: 'Hands-on Projects', description: 'Build real-world applications with guided project-based learning.', gradient: 'from-red-500 to-rose-500' },
  { icon: Cloud, title: 'Lifetime LMS Access', description: 'Access course materials, recordings, and resources forever.', gradient: 'from-indigo-500 to-violet-500' },
    ],


    courses: [],
    interviewQuestions: [],
    masterPrograms: [],
    blogs: [],
    tutorials: [],
    categories: [],
    categoryCoursesPage: null,
    currentCategory: null,
    courseSections: [],
    publicPages: [],
    blogsPage: null,
    tutorialsPage: null,
    interviewQuestionsPage: null,
    loading: {
      courses: false,
      masterPrograms: false,
      blogs: false,
      interviewQuestions: false,
      tutorials: false,
      categoryCourses: false,
      courseDetail: false,
      courseSections: false,
      publicPages: false,
    },
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
    fetchCategories: async () => {
      set((s) => ({ loading: { ...s.loading, categories: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/categories');
        set((s) => ({
          categories: data.data,
          loading: { ...s.loading, categories: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load categories',
          loading: { ...s.loading, categories: false },
        }));
      }
    },
    fetchCoursesByCategory: async (slug, page = 1) => {
      set((s) => ({ loading: { ...s.loading, categoryCourses: true }, error: null }));
      try {
        // ← make sure URL matches exactly what your API expects
        const url = slug
          ? `/public/courses?category=${slug}&page=${page}&limit=9`
          : `/public/courses?page=${page}&limit=9`;

        const { data } = await axiosClient.get(url);
        set((s) => ({
          categoryCoursesPage: {
            items: data.data.items.map(mapCourse),
            pagination: data.data.pagination,
          },
          loading: { ...s.loading, categoryCourses: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load courses',
          loading: { ...s.loading, categoryCourses: false },
        }));
      }
    },
    fetchCategoryBySlug: async (slug) => {
      try {
        const { data } = await axiosClient.get(`/public/categories/${slug}`);
        set({ currentCategory: data.data });
      } catch {
        // fallback — find from already loaded categories
        set((s) => ({
          currentCategory: s.categories.find((c) => c.slug === slug) ?? null,
        }));
      }
    },
    fetchCourseBySlug: async (slug) => {
      set((s) => ({ loading: { ...s.loading, courseDetail: true }, error: null }));
      try {
        const { data } = await axiosClient.get(`/public/courses/${slug}`);
        set((s) => ({
          courseDetail: data.data,
          loading: { ...s.loading, courseDetail: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load course',
          loading: { ...s.loading, courseDetail: false },
        }));
      }
    },
    fetchCourseSections: async (courseId) => {
      set((s) => ({ loading: { ...s.loading, courseSections: true }, error: null }));
      try {
        const { data } = await axiosClient.get(`/public/course-sections?courseId=${courseId}`);
        const sortedSections = (data.data || []).sort((a: any, b: any) => a.position - b.position);
        set((s) => ({
          courseSections: sortedSections,
          loading: { ...s.loading, courseSections: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load course sections',
          loading: { ...s.loading, courseSections: false },
        }));
      }
    },
    fetchPublicPages: async () => {
      set((s) => ({ loading: { ...s.loading, publicPages: true }, error: null }));
      try {
        const { data } = await axiosClient.get('/public/pages');
        set((s) => ({
          publicPages: data.data,
          loading: { ...s.loading, publicPages: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load public pages',
          loading: { ...s.loading, publicPages: false },
        }));
      }
    },

    // ─── Fetch All at Once (use this in page.tsx) ────────────────────────────
    fetchAll: async () => {
      set({
        loading: { courses: true, masterPrograms: true, blogs: true, interviewQuestions: true, tutorials: true, categories: true, categoryCourses: true, courseDetail: true, courseSections: true, publicPages: true },
        error: null,
      });
      try {
        // Fetch home data + categories in parallel
        const [homeRes, catRes] = await Promise.all([
          axiosClient.get('/public/home'),
          axiosClient.get('/public/categories'),
        ]);
        const d = homeRes.data.data;
        set({
          courses: d.featuredCourses.map(mapCourse),
          masterPrograms: d.featuredMasterPrograms.map(mapCourse),
          blogs: d.latestBlogs.map(mapBlog),
          interviewQuestions: d.latestInterviewQuestions.map(mapInterviewQuestion),
          tutorials: d.latestTutorials.map(mapTutorial),
          categories: catRes.data.data,
          loading: { courses: false, masterPrograms: false, blogs: false, interviewQuestions: false, tutorials: false, categories: false, categoryCourses: false, courseDetail: false, courseSections: false, publicPages: false },
        });
      } catch (err: any) {
        set({
          error: err?.response?.data?.message || 'Failed to load home data',
          loading: { courses: false, masterPrograms: false, blogs: false, interviewQuestions: false, tutorials: false, categories: false, categoryCourses: false, courseDetail: false, courseSections: false, publicPages: false },
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

    fetchPublicBlogs: async (page = 1, limit = 12) => {
      set((s) => ({ loading: { ...s.loading, blogs: true }, error: null }));
      try {
        const { data } = await axiosClient.get(`/public/blogs?page=${page}&limit=${limit}`);
        set((s) => ({
          blogsPage: {
            items: data.data.items.map(mapBlog),
            pagination: data.data.pagination,
          },
          loading: { ...s.loading, blogs: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load blogs',
          loading: { ...s.loading, blogs: false },
        }));
      }
    },
    fetchPublicTutorials: async (page = 1, limit = 12) => {
      set((s) => ({ loading: { ...s.loading, tutorials: true }, error: null }));
      try {
        const { data } = await axiosClient.get(`/public/tutorials?page=${page}&limit=${limit}`);
        set((s) => ({
          tutorialsPage: {
            items: data.data.items.map(mapTutorial),
            pagination: data.data.pagination,
          },
          loading: { ...s.loading, tutorials: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load tutorials',
          loading: { ...s.loading, tutorials: false },
        }));
      }
    },
    fetchPublicInterviewQuestions: async (page = 1, limit = 12) => {
      set((s) => ({ loading: { ...s.loading, interviewQuestions: true }, error: null }));
      try {
        const { data } = await axiosClient.get(`/public/interview-questions?page=${page}&limit=${limit}`);
        set((s) => ({
          interviewQuestionsPage: {
            items: data.data.items.map(mapInterviewQuestion),
            pagination: data.data.pagination,
          },
          loading: { ...s.loading, interviewQuestions: false },
        }));
      } catch (err: any) {
        set((s) => ({
          error: err?.response?.data?.message || 'Failed to load interview questions',
          loading: { ...s.loading, interviewQuestions: false },
        }));
      }
    },
    fetchResourceBySlug: async (type, slug) => {
      try {
        const { data } = await axiosClient.get(`/public/${type}/${slug}`);
        return data.data;
      } catch (err: any) {
        console.error(`Failed to fetch ${type} by slug`, err);
        return null;
      }
    },
  }))
);
