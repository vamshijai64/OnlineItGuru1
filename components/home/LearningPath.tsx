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
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-6 border border-indigo-500/20">
            Our Approach
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white font-outfit mb-6 tracking-tight">
            Your Journey to Success
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
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
