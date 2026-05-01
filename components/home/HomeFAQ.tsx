"use client";

import { motion } from "framer-motion";

const faqs = [
  { 
    q: 'What payment options are available?', 
    a: 'We offer flexible payment plans, EMI options, and accept all major credit cards.' 
  },
  { 
    q: 'Can I get a refund if not satisfied?', 
    a: 'Yes! We offer a full refund within the first 7 days, no questions asked.' 
  },
  { 
    q: 'Are the certifications recognized?', 
    a: 'Yes, our certifications are industry-recognized and valued by top employers.' 
  },
  { 
    q: 'Do you provide placement assistance?', 
    a: 'Absolutely! We have 200+ hiring partners and 95% placement rate.' 
  },
];

export default function HomeFAQ() {
  return (
    <section className="py-24 px-6 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-outfit">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Find quick answers to common questions about our courses and programs.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/30 transition-colors group"
              >
                <h4 className="text-white font-bold text-lg mb-3 group-hover:text-indigo-400 transition-colors">
                  {faq.q}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
