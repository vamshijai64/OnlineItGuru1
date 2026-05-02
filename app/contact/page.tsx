"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin, Clock, Shield, Award, Video } from 'lucide-react';

import SectionHeader from '@/components/ui/SectionHeader';
import ContactForm from '@/components/contact/ContactForm';

const contactMethods = [
  { 
    icon: Phone, 
    title: 'Call Us', 
    value: '+91 80012 34567', 
    subtitle: 'Mon-Sat 9am-8pm IST',
    gradient: 'from-green-500 to-emerald-500',
    action: 'tel:+918001234567'
  },
  { 
    icon: Mail, 
    title: 'Email Us', 
    value: 'info@onlineitguru.com', 
    subtitle: 'We reply within 2 hours',
    gradient: 'from-blue-500 to-cyan-500',
    action: 'mailto:info@onlineitguru.com'
  },
  { 
    icon: MessageCircle, 
    title: 'Live Chat', 
    value: 'Start a conversation', 
    subtitle: 'Available 24/7',
    gradient: 'from-purple-500 to-pink-500',
    action: '#'
  },
];

const benefits = [
  { icon: Clock, title: 'Response within 2 hours', description: 'Our team is available 24/7 to assist you' },
  { icon: Video, title: 'Free Demo Session', description: 'Experience our teaching before you commit' },
  { icon: Award, title: '100% Placement Assistance', description: "We're with you till you succeed" },
  { icon: Shield, title: 'Money-back Guarantee', description: 'Full refund within first 7 days' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 container mx-auto max-w-6xl">
          <SectionHeader 
            badge="Get in Touch"
            title="Let's Start Your Journey"
            subtitle="Have questions about our courses or career guidance? We're here to help. Reach out to us through any of the channels below."
          />
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                className="block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-6`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-xl font-bold text-white mb-1">{method.value}</p>
                  <p className="text-gray-400 text-sm">{method.subtitle}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-6">
                  Why Choose Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Career?
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Take the first step towards your dream career. Our counselors are here to guide you through every step of the journey.
                </p>
              </motion.div>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Office Location */}
              <motion.div
                className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Our Corporate Office</h4>
                    <p className="text-gray-400">Plot No. 12, Hitech City Main Rd,<br />Hyderabad, Telangana 500081</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right - Form */}
            <ContactForm showTitle={false} />
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 mb-8">
              Find quick answers to common questions about our courses and programs.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {[
                { q: 'What payment options are available?', a: 'We offer flexible payment plans, EMI options, and accept all major credit cards and UPI.' },
                { q: 'Can I get a refund if not satisfied?', a: 'Yes! We offer a full refund within the first 7 days, no questions asked.' },
                { q: 'Are the certifications recognized?', a: 'Yes, our certifications are industry-recognized and valued by top employers globally.' },
                { q: 'Do you provide placement assistance?', a: 'Absolutely! We have 200+ hiring partners and a dedicated placement cell.' },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
