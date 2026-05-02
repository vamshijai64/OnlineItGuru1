"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Award, Users, Star } from 'lucide-react';

const trainers = [
    {
        name: "Dr. Ananya Iyer",
        designation: "Lead Data Scientist",
        company: "Ex-Google, Meta",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop",
        expertise: ["Python", "Machine Learning", "TensorFlow"],
        experience: "12+",
        students: "5K+",
        rating: "4.9",
        linkedinUrl: "#",
    },
    {
        name: "Rahul Sharma",
        designation: "Senior Full-Stack Dev",
        company: "Ex-Microsoft",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
        expertise: ["Next.js", "Node.js", "AWS"],
        experience: "8+",
        students: "3K+",
        rating: "4.8",
        linkedinUrl: "#",
    },
    {
        name: "Vikram Malhotra",
        designation: "Product Design Manager",
        company: "Ex-Apple",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop",
        expertise: ["UI/UX", "Figma", "Product Strategy"],
        experience: "10+",
        students: "4K+",
        rating: "4.9",
        linkedinUrl: "#",
    },
    {
        name: "Sarah Jenkins",
        designation: "Cloud Architecture",
        company: "Ex-AWS Expert",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
        expertise: ["Cloud Native", "Kubernetes", "DevOps"],
        experience: "15+",
        students: "10K+",
        rating: "5.0",
        linkedinUrl: "#",
    }
];

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
    return (
        <div className="text-center mb-16">
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-[#e94560] bg-[#e94560]/10 border border-[#e94560]/20 rounded-full"
            >
                {badge}
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight font-outfit"
            >
                {title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed"
            >
                {subtitle}
            </motion.p>
        </div>
    );
}

function TrainerCard({
    name,
    designation,
    company,
    image,
    expertise = [],
    experience,
    students,
    rating,
    linkedinUrl,
    index = 0
}: any) {
    const [isHovered, setIsHovered] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 20;
        const y = (e.clientY - rect.top - rect.height / 2) / 20;
        setTilt({ x: -y, y: x });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <motion.div
            className="relative group perspective-1000"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="relative p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/10 h-full hover:border-[#ec4899]/30"
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                }}
                transition={{ duration: 0.1 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Animated border */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#ec4899] via-purple-600 to-[#ec4899]"
                        animate={{
                            backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{ backgroundSize: '200% 200%', opacity: 0.1 }}
                    />
                </div>

                {/* Profile Image */}
                <div className="relative mx-auto w-32 h-32 mb-6">
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[#ec4899] opacity-60"
                        animate={{ rotate: isHovered ? 360 : 0 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                    <img
                        src={image}
                        alt={name}
                        className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full object-cover"
                    />

                    {/* LinkedIn badge */}
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#0077B5] flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-20"
                        >
                            <Linkedin className="w-5 h-5 text-white" />
                        </a>
                    )}
                </div>

                {/* Info */}
                <div className="text-center relative z-10">
                    <h3 className="text-xl font-bold text-white mb-1 font-outfit">{name}</h3>
                    <p className="text-gray-400 mb-1 text-sm">{designation}</p>
                    <p className="text-[#ec4899] text-sm font-semibold mb-6">{company}</p>

                    {/* Expertise badges */}
                    <div className="flex flex-wrap justify-center items-center gap-2 mb-6 min-h-[60px]">
                        {expertise.slice(0, 3).map((skill: string, i: number) => (
                            <span
                                key={i}
                                className="px-4 py-1 rounded-full bg-[#ec4899]/10 text-[#f472b6] text-[10px] font-bold border border-[#ec4899]/10 leading-none"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Stats - appear on hover */}
                    <motion.div
                        className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: isHovered ? 1 : 0.6 }}
                    >
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                                <Award className="w-3.5 h-3.5 text-[#e94560]" />
                                {experience}
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">Years</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                                <Users className="w-3.5 h-3.5 text-[#e94560]" />
                                {students}
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">Students</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
                                <Star className="w-3.5 h-3.5 text-[#e94560]" />
                                {rating}
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">Rating</div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ExpertTrainers() {
    return (
        <section className="relative py-24 px-6 bg-[#020617] overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto max-w-7xl relative z-10">
                <SectionHeader
                    badge="Our Experts"
                    title="Learn From Industry Leaders"
                    subtitle="Our trainers bring decades of experience from the world's top tech companies."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trainers.map((trainer, index) => (
                        <TrainerCard key={index} {...trainer} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
