"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Video, Award } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import ContactForm from '@/components/contact/ContactForm';

const benefits = [
  { 
    icon: Clock, 
    title: 'Response within 2 hours', 
    description: 'Our team is available 24/7 to assist you',
    color: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  { 
    icon: Video, 
    title: 'Free Demo Session', 
    description: 'Experience our teaching before you commit',
    color: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  { 
    icon: Award, 
    title: '100% Placement Assistance', 
    description: "We're with you till you succeed",
    color: 'bg-green-500/20',
    iconColor: 'text-green-400'
  },
];

export default function HomeContact() {
  return (
    <section className="relative py-24 px-6 bg-[#020617] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader 
              badge="Get Started"
              title="Ready to Transform Your Career?"
              subtitle="Take the first step towards your dream career. Our counselors are here to guide you."
              align="left"
            />
            
            <div className="space-y-8 mt-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-5 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl mb-1">{benefit.title}</h4>
                    <p className="text-slate-400 text-base">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <ContactForm showTitle={false} />
        </div>
      </div>
    </section>
  );
}
