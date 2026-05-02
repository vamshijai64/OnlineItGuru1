

"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Play, Code2, Cloud, Database, Cpu, Layers, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useHomeStore } from "@/store/homeStore";

// ─── Particle Network ─────────────────────────────────────────────────────────
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: null as number | null, y: null as number | null, radius: 150 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    canvas.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    canvas.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    class Particle {
      x: number; y: number; size: number;
      baseX: number; baseY: number; density: number;
      speedX: number; speedY: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 1000);
        this.y = Math.random() * (canvas?.height || 1000);
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "rgba(139, 92, 246, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > (canvas?.width || 0) || this.x < 0) this.speedX *= -1;
        if (this.y > (canvas?.height || 0) || this.y < 0) this.speedY *= -1;
        if (mouse.x && mouse.y) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 2;
            this.y -= forceDirectionY * force * 2;
          }
        }
      }
    }

    const init = () => {
      particles = [];
      const count = Math.min(((canvas?.width || 1000) * (canvas?.height || 1000)) / 15000, 100);
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };
    init();

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const opacity = 1 - distance / 120;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.draw(); p.update(); });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ background: "transparent" }}
    />
  );
}

// ─── Floating Icons ───────────────────────────────────────────────────────────
function FloatingIcons() {
  const icons = [
    { Icon: Code2, color: "from-violet-500 to-purple-600", delay: 0 },
    { Icon: Cloud, color: "from-blue-500 to-cyan-500", delay: 0.5 },
    { Icon: Database, color: "from-emerald-500 to-teal-500", delay: 1 },
    { Icon: Cpu, color: "from-orange-500 to-amber-500", delay: 1.5 },
    { Icon: Layers, color: "from-pink-500 to-rose-500", delay: 2 },
    { Icon: Zap, color: "from-yellow-500 to-orange-500", delay: 2.5 },
  ];

  const positions = [
    { top: "10%", left: "5%" },
    { top: "20%", right: "8%" },
    { top: "60%", left: "3%" },
    { top: "70%", right: "5%" },
    { bottom: "15%", left: "10%" },
    { bottom: "25%", right: "12%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={positions[index]}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1], rotate: [0, 360], y: [0, -20, 0] }}
          transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-2xl backdrop-blur-sm`}
            style={{ boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.4)' }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Animated Headline ────────────────────────────────────────────────────────
function AnimatedHeadline({ text, subtext }: { text: string; subtext: string }) {
  // Split specifically for the "replica" requirement
  const line1 = "Learn the Most";
  const line2 = "In-Demand";
  const line3 = "Skills";

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
  };

  return (
    <div className="text-left">
      <motion.h1
        className="text-4xl md:text-4xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-white flex flex-col"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={child} className="block">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
            {line1}
          </span>
        </motion.span>

        <motion.span variants={child} className="block py-1">
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400"
            style={{ backgroundSize: "200% 200%", animation: "gradient-shift 4s ease infinite" }}
          >
            {line2}
          </span>
        </motion.span>

        <motion.span variants={child} className="block">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-200">
            {line3}
          </span>
        </motion.span>
      </motion.h1>

      <motion.p
        className="mt-8 text-lg md:text-xl text-gray-300/90 max-w-2xl leading-relaxed border-l-2 border-purple-500/30 pl-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        {subtext}
      </motion.p>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export default function Hero() {
  const badge = useHomeStore((state) => state.hero.badge);
  const headline = useHomeStore((state) => state.hero.headline);
  const subtext = useHomeStore((state) => state.hero.subtext);
  const primaryCTA = useHomeStore((state) => state.hero.primaryCTA);
  const secondaryCTA = useHomeStore((state) => state.hero.secondaryCTA);

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gray-950">
      {/* Background Section - Exact Replica as per Reference */}
      <div className="absolute inset-0">
        {/* Animated background gradient */}
        <div className="absolute inset-4 bg-gradient-to-br from-gray-950 via-purple-1150/10 to-gray-1250" />

        {/* Particle network */}
        <ParticleNetwork />

        {/* Floating tech icons */}
        <FloatingIcons />

        {/* Gradient orbs - Color adjusted for pink/mixed replica */}
        {/* Orb behind text - Bright Pink/Mixed - INTENSIFIED */}
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[500px] bg-pink-700/25 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
        {/* Bottom Right Orb - Blue/Mixed */}
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[110px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* 4 Corners Dark Mixed Colors as requested */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-900/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 lg:pt-40 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left content */}
            <div className="flex flex-col px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center self-start gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-10"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">{badge}</span>
              </motion.div>

              <AnimatedHeadline
                text={headline}
                subtext={subtext}
              />

              <motion.div
                className="flex flex-wrap gap-4 mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Link href={primaryCTA.href}>
                  <Button className="w-56 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-xl shadow-purple-500/20 border border-white/10 group transition-all">
                    {primaryCTA.label}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="w-56 h-14 rounded-full border-white/10 text-white hover:bg-white/5 font-semibold backdrop-blur-md bg-white/5 transition-all">
                    {secondaryCTA.label}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right - Hero image/visual */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl opacity-50" />
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                  alt="Students learning"
                  className="relative rounded-3xl shadow-2xl shadow-purple-500/20 border border-white/10 w-full"
                />

                {/* Floating cards */}
                <motion.div
                  className="absolute -left-8 top-1/4 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <Award className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Certified</div>
                      <div className="text-gray-400 text-xs">Industry Recognition</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-8 bottom-1/4 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <Code2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">Live Classes</div>
                      <div className="text-gray-400 text-xs">Interactive Learning</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
