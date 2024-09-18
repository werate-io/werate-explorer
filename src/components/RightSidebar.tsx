'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import ReviewsList from '@/components/reviews/ReviewList';
import { sidebarVariants, contentVariants } from '@/lib/constants';
import ProfileWithStats from '@/components/profile/Profile';

export default function RightSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      className="h-full bg-white text-slate-800 shadow-lg fixed right-0 top-0 bottom-0 max-h-screen overflow-y-auto"
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial="open">
      <motion.div
        className="absolute top-1/2 -left-4 transform -translate-y-1/2 z-50 bg-white rounded-full p-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          left: isOpen ? '-12px' : '-16px',
          transition: 'left 0.3s'
        }}>
        {isOpen ? (
          <ChevronRightIcon className="w-6 h-6 text-purple-800" />
        ) : (
          <ChevronLeftIcon className="w-6 h-6 text-purple-800" />
        )}
      </motion.div>
      <motion.div
        variants={contentVariants}
        className="p-4 overflow-y-auto"
        animate={isOpen ? 'open' : 'closed'}>
        <ProfileWithStats />
      </motion.div>
      <motion.div
        variants={contentVariants}
        className="p-4 h-full overflow-y-auto"
        animate={isOpen ? 'open' : 'closed'}>
        <ReviewsList />
      </motion.div>
    </motion.div>
  );
}
