'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, BarChart, UserCircle } from 'lucide-react';
import { TimelineFilter } from '@/types/review';

interface SidebarBaseProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  side: 'left' | 'right';
  children: React.ReactNode;
}

interface TimelineFilterProps {
  timelineFilter: TimelineFilter;
  setTimelineFilter: (filter: TimelineFilter) => void;
}

export default function SidebarBase({ isOpen, setIsOpen, side, children }: SidebarBaseProps) {
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('1W');

  const sidebarVariants = {
    open: { width: '100%', opacity: 1 },
    closed: { width: '25px', opacity: 1 }
  };

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: side === 'left' ? -300 : 300 }
  };

  const SidebarIcon = side === 'left' ? BarChart : UserCircle;

  return (
    <motion.div
      className={`h-full bg-white/80 backdrop-blur-sm text-slate-800 shadow-lg relative pointer-events-auto ${
        side === 'left' ? 'left-0' : 'right-0'
      } max-w-[450px] w-full`}
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial="closed">
      <motion.div
        className={`absolute top-1/2 ${
          side === 'left' ? '-right-3' : '-left-3'
        } transform -translate-y-1/2 z-50 bg-white rounded-full p-1 cursor-pointer hidden md:block`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        {!isOpen ? (
          <SidebarIcon className="w-6 h-6 text-primary" />
        ) : side === 'left' ? (
          <ChevronLeftIcon className="w-6 h-6 text-primary" />
        ) : (
          <ChevronRightIcon className="w-6 h-6 text-primary" />
        )}
      </motion.div>
      <motion.div
        variants={contentVariants}
        className="p-4 h-full overflow-y-auto"
        animate={isOpen ? 'open' : 'closed'}>
        {React.Children.map(children, (child) =>
          React.isValidElement<TimelineFilterProps>(child)
            ? React.cloneElement(child, {
                timelineFilter,
                setTimelineFilter: (filter: TimelineFilter) => setTimelineFilter(filter)
              })
            : child
        )}
      </motion.div>
    </motion.div>
  );
}
