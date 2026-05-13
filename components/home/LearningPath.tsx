import React from 'react';
import TimelineStep from './TimelineStep';
import { ClipboardCheck, Video, Code2, Target, Award, Briefcase } from 'lucide-react';

const steps = [
  {
    step: "1",
    title: "Enrollment & Onboarding",
    description: "Quick registration process with personalized learning path assessment.",
    icon: ClipboardCheck,
  },
  {
    step: "2",
    title: "Live Interactive Sessions",
    description: "Engage with expert trainers in real-time with Q&A and discussions.",
    icon: Video,
  },
  {
    step: "3",
    title: "Hands-on Practice",
    description: "Apply concepts through labs, exercises, and coding challenges.",
    icon: Code2,
  },
  {
    step: "4",
    title: "Project Development",
    description: "Build portfolio-worthy projects with mentor guidance.",
    icon: Target,
  },
  {
    step: "5",
    title: "Certification",
    description: "Earn industry-recognized certificates upon completion.",
    icon: Award,
  },
  {
    step: "6",
    title: "Career Placement",
    description: "Get placed with our 200+ hiring partners worldwide.",
    icon: Briefcase,
  }
];

export default function LearningPath() {
  return (
    <section className="py-24 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex px-6 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6 border border-purple-500/30 shadow-lg">
            Our Approach
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit mb-6 tracking-tight">
            Your <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">Journey to Success</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            A proven 6-step methodology that has helped thousands transform their careers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              {...step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
