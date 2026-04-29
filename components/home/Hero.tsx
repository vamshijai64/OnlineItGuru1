

"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight,Award , Play, Code2, Cloud, Database, Cpu, Layers, Zap } from "lucide-react";
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
        ctx.fillStyle = "rgba(139, 92, 246, 0.4)";
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
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.3})`;
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
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ background: "transparent" }}
    />
  );
}

// ─── Floating Icons ───────────────────────────────────────────────────────────
function FloatingIcons() {
  const icons = [
    { Icon: Code2,    color: "from-violet-500 to-purple-600", delay: 0   },
    { Icon: Cloud,    color: "from-blue-500 to-cyan-500",     delay: 0.5 },
    { Icon: Database, color: "from-emerald-500 to-teal-500",  delay: 1   },
    { Icon: Cpu,      color: "from-orange-500 to-amber-500",  delay: 1.5 },
    { Icon: Layers,   color: "from-pink-500 to-rose-500",     delay: 2   },
    { Icon: Zap,      color: "from-yellow-500 to-orange-500", delay: 2.5 },
  ];

  const positions = [
    { top: "10%", left: "5%"    },
    { top: "20%", right: "8%"   },
    { top: "60%", left: "3%"    },
    { top: "70%", right: "5%"   },
    { bottom: "15%", left: "10%"  },
    { bottom: "25%", right: "12%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 lg:opacity-30">
      {icons.map(({ Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={positions[index]}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1], rotate: [0, 360], y: [0, -20, 0] }}
          transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-2xl backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Animated Headline ────────────────────────────────────────────────────────
function AnimatedHeadline({ text, subtext }: { text: string; subtext: string }) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: i * 0.1, delayChildren: 0.04 },
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
    hidden:  { 
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
        className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span variants={child} key={index} className="inline-block mr-3">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-cyan-200"
              style={{ backgroundSize: "200% 200%", animation: "gradient-shift 3s ease infinite" }}
            >
              {word}
            </span>
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
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
  //  All data from store — one selector per value
  const badge        = useHomeStore((state) => state.hero.badge);
  const headline     = useHomeStore((state) => state.hero.headline);
  const subtext      = useHomeStore((state) => state.hero.subtext);
  const primaryCTA   = useHomeStore((state) => state.hero.primaryCTA);
  const secondaryCTA = useHomeStore((state) => state.hero.secondaryCTA);
  const stats        = useHomeStore((state) => state.hero.stats);

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gray-950 pt-0">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <ParticleNetwork />
        <FloatingIcons />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>

              {/* Badge — from store */}
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-white/70 text-sm font-medium">{badge}</span>
              </div>

              {/* Headline + Subtext — from store */}
              <AnimatedHeadline text={headline} subtext={subtext} />

              {/* CTAs — from store */}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link href={primaryCTA.href}>
                  <Button className="w-60 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-8 h-15 text-base font-semibold shadow-xl shadow-purple-500/20 transition-all group border border-white/20">
                    {primaryCTA.label}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-60 border-white/10 text-white hover:bg-white/5 rounded-full px-8 h-15 text-base font-semibold backdrop-blur-md bg-white/5"
                >
                  <Play className="w-4 h-4 mr-2 text-cyan-400" />
                  {secondaryCTA.label}
                </Button>
              </div>

              {/* Stats — from store */}
              <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors shadow-sm">
                      <stat.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white tracking-tight">{stat.value}</p>
                      <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>

          {/* Right — Hero Image (UI unchanged) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block order-1 lg:order-2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl shadow-2xl overflow-hidden aspect-[1.2] bg-slate-900 border border-white/10">
                <div
                  className="w-full h-full bg-cover bg-center opacity-70"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
              </div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Certified Experts</p>
                  <p className="text-xs text-gray-400">Industry recognized</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
