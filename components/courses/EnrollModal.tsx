"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  price: string;
  courseTitle: string;
}

const countryCodes = [
  { code: 'US', prefix: '+1' },
  { code: 'IN', prefix: '+91' },
  { code: 'CA', prefix: '+1' },
  { code: 'GB', prefix: '+44' },
  { code: 'AU', prefix: '+61' },
  { code: 'SG', prefix: '+65' },
  { code: 'AE', prefix: '+971' },
];

export default function EnrollModal({ isOpen, onClose, price, courseTitle }: EnrollModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-transparent"
            // bg-black/80 backdrop-blur-sm
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-2xl bg-[#020617] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 border border-white/10"
          >
            {/* Background Atmosphere - matching CourseBanner */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="absolute top-[-30%] left-[-20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse" />
              <div className="absolute bottom-[-30%] right-[-20%] w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_95%)]" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center z-20 text-slate-300 hover:text-white hover:scale-105 transition-all shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Portion: Benefits List */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center select-none relative z-10">
              <h2 className="text-xl md:text-2xl font-extrabold mb-5 font-outfit tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-100 to-white">
                  Get Lifetime Access to
                </span>
              </h2>

              <ul className="space-y-3.5 md:space-y-4">
                {[
                  "100+ Courses",
                  "High-Quality videos",
                  "Live Projects",
                  "Free Doubt Clarification Sessions",
                  "24x7 Support",
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 text-xs md:text-sm font-bold text-rose-100/90"
                  >
                    <span className="text-sm leading-none text-pink-500 font-extrabold">→</span>
                    <span className="leading-snug">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right Portion: Form Box */}
            <div className="md:w-1/2 p-4 md:p-6 flex items-center justify-center relative z-10">
              <div className="bg-[#0b1329]/60 backdrop-blur-xl rounded-xl p-5 md:p-6 shadow-xl w-full max-w-sm border border-white/10 relative min-h-[300px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form
                      key="enroll-form"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Name Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          required
                          className="w-full border-b border-slate-700 focus:border-[#F5A623] py-1.5 px-1 text-white placeholder-slate-400 focus:outline-none text-sm transition-colors bg-transparent"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          required
                          className="w-full border-b border-slate-700 focus:border-[#F5A623] py-1.5 px-1 text-white placeholder-slate-400 focus:outline-none text-sm transition-colors bg-transparent"
                        />
                      </div>

                      {/* Phone Input Row */}
                      <div className="flex gap-3 items-end">
                        {/* Country Code Selector */}
                        <div className="w-20 border-b border-slate-700 py-1 flex items-center justify-between text-slate-300 relative">
                          <select
                            value={selectedCountry.code}
                            onChange={(e) => {
                              const country = countryCodes.find(c => c.code === e.target.value);
                              if (country) setSelectedCountry(country);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          >
                            {countryCodes.map((c) => (
                              <option key={c.code} value={c.code} className="bg-[#0b1329] text-white">
                                {c.code} ({c.prefix})
                              </option>
                            ))}
                          </select>
                          <span className="text-sm text-slate-200 font-medium">{selectedCountry.code}</span>
                          <span className="text-sm text-slate-400 font-bold">{selectedCountry.prefix}</span>
                        </div>

                        {/* Phone Number Field */}
                        <div className="flex-1">
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Phone"
                            required
                            className="w-full border-b border-slate-700 focus:border-[#F5A623] py-1.5 px-1 text-white placeholder-slate-400 focus:outline-none text-sm transition-colors bg-transparent"
                          />
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#f5a623] hover:bg-[#e0951c] text-black font-extrabold py-3 px-4 rounded-lg text-xs md:text-sm tracking-wider transition-all duration-300 text-center uppercase shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          `BUY NOW FOR ₹ ${price}`
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-3 py-3"
                    >
                      <div className="mx-auto w-12 h-12 bg-[#eafaf1]/10 text-[#2ecc71] rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircle className="w-7 h-7" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Enrollment Initiated!
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
                        Thank you, <span className="font-semibold text-white">{name}</span>. We've registered your interest for <span className="font-semibold text-white">{courseTitle}</span>.
                      </p>
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400/90 p-2.5 rounded-lg text-[11px] leading-normal flex items-start gap-2 text-left">
                        <PhoneCall className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>Our academic counselor will reach out to you shortly at <strong>{selectedCountry.prefix} {phone}</strong>.</span>
                      </div>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false);
                          setName('');
                          setEmail('');
                          setPhone('');
                          onClose();
                        }}
                        className="mt-3 px-5 py-1.5 h-auto text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg"
                      >
                        Close
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
