import React from 'react';
import { motion, useInView } from 'framer-motion';

export interface TimelineStepProps {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
  index?: number;
}

export default function TimelineStep({
  step,
  title,
  description,
  icon: Icon,
  isLast = false,
  index = 0
}: TimelineStepProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-8 md:gap-12"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
    >
      {/* Timeline line and Icon */}
      <div className="flex flex-col items-center">
        <motion.div
          className="relative z-10 w-15 h-13 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]"
          initial={{ scale: 0, rotate: -45 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring' }}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>

        {!isLast && (
          <motion.div
            className="w-px h-full bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent min-h-[120px]"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: index * 0.15 + 0.4 }}
            style={{ transformOrigin: 'top' }}
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        className="flex-1 pb-16"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
      >
        <div className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold mb-3">
          Step {step}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-outfit tracking-tight">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed max-w-lg text-sm md:text-base font-medium">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
}
