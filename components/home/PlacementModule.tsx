"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Meta", logo: "/logos/meta.svg" },
    { name: "Netflix", logo: "/logos/netflix.svg" },
    { name: "Apple", logo: "/logos/apple.svg" },
];

const stats = [
    { label: "Partner Companies", value: "200+" },
    { label: "Highest Package", value: "$120K" },
    { label: "Average Hike", value: "75%" },
    { label: "Placement Rate", value: "98%" },
];

interface PlacementModuleProps {
    theme?: "light" | "dark";
}

export default function PlacementModule({ theme = "dark" }: PlacementModuleProps) {
    const isLight = theme === "light";

    return (
        <section className={isLight 
            ? "py-24 bg-slate-50/50 text-slate-800 overflow-hidden relative border-t border-b border-slate-100" 
            : "py-24 bg-[#020617] text-white overflow-hidden relative"
        }>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={isLight 
                    ? "absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px] animate-pulse" 
                    : "absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse"
                } />
                <div className={isLight 
                    ? "absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse" 
                    : "absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"
                } style={{ animationDelay: '2s' }} />
                
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.015]" />
                
                <div className={isLight 
                    ? "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#f8fafc_80%)]" 
                    : "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_80%)]"
                } />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={isLight 
                            ? "inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-200 rounded-full" 
                            : "inline-block px-6 py-2 mb-6 text-sm font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/30 rounded-full shadow-lg"
                        }>
                            Why Choose Us
                        </h2>
                        <p className={isLight 
                            ? "mt-2 text-3xl font-bold tracking-tight sm:text-4xl font-outfit text-slate-900" 
                            : "mt-2 text-3xl font-bold tracking-tight sm:text-4xl font-outfit text-white"
                        }>
                            Master Your Future with <span className={isLight 
                                ? "bg-gradient-to-r from-pink-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent" 
                                : "bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 bg-clip-text text-transparent"
                            }>Online IT Guru</span>
                        </p>
                        <p className={isLight ? "mt-6 text-lg leading-8 text-slate-600" : "mt-6 text-lg leading-8 text-slate-300"}>
                            We don&apos;t just provide courses; we build careers. From expert-led live training to dedicated placement support, discover why thousands of professionals trust us for their digital transformation journey.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label}>
                                    <p className={isLight ? "text-3xl font-bold font-outfit text-indigo-600" : "text-3xl font-bold font-outfit text-white"}>{stat.value}</p>
                                    <p className={isLight ? "text-sm text-slate-500 uppercase tracking-wide font-medium" : "text-sm text-slate-400 uppercase tracking-wide font-medium"}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={isLight 
                            ? "bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.03)] relative overflow-hidden" 
                            : "bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl relative overflow-hidden"
                        }
                    >
                        <div className={isLight 
                            ? "absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" 
                            : "absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
                        } />
                        
                        <p className={isLight 
                            ? "text-center text-[12px] font-bold tracking-[0.2em] text-pink-500 mb-10" 
                            : "text-center text-[12px] font-bold tracking-[0.2em] text-pink-400 mb-10"
                        }>
                            Reliable Career Partners
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {partners.map((partner) => (
                                <div key={partner.name} className={isLight 
                                    ? "flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 group" 
                                    : "flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100 group"
                                }>
                                    <div className={isLight 
                                        ? "h-14 w-full bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center text-sm font-semibold border border-slate-100 group-hover:border-pink-500/20 group-hover:bg-pink-50/30 group-hover:text-pink-600 transition-all" 
                                        : "h-14 w-full bg-white/5 rounded-2xl flex items-center justify-center text-xs font-bold border border-white/5 group-hover:border-pink-500/30 group-hover:bg-white/10 transition-all"
                                    }>
                                        {partner.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
