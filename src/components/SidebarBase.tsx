'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, BarChart, UserCircle } from 'lucide-react'
import { TimelineFilter } from '@/lib/constants'

interface SidebarBaseProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  side: 'left' | 'right'
  children: React.ReactNode
}

interface TimelineFilterProps {
  timelineFilter: string
  setTimelineFilter: (filter: string) => void
}

export default function SidebarBase({ isOpen, setIsOpen, side, children }: SidebarBaseProps) {
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('1W')

  const sidebarVariants = {
    open: { width: '450px', opacity: 1 },
    closed: { width: '40px', opacity: 1 }
  }

  const contentVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: side === 'left' ? -300 : 300 }
  }

  const SidebarIcon = side === 'left' ? BarChart : UserCircle

  return (
    <motion.div
      className={`h-full bg-white/80 backdrop-blur-sm text-slate-800 shadow-lg relative pointer-events-auto ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial="open"
    >
      <motion.div
        className={`absolute top-1/2 ${
          isOpen ? (side === 'left' ? '-right-4' : '-left-4') : '0'
        } transform -translate-y-1/2 z-50 bg-white rounded-full p-1 cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          side === 'left' ? (
            <ChevronLeftIcon className="w-6 h-6 text-primary" />
          ) : (
            <ChevronRightIcon className="w-6 h-6 text-primary" />
          )
        ) : (
          <SidebarIcon className="w-6 h-6 text-primary" />
        )}
      </motion.div>
      <motion.div
        variants={contentVariants}
        className="p-4 h-full overflow-y-auto"
        animate={isOpen ? 'open' : 'closed'}
      >
        {React.Children.map(children, child =>
          React.isValidElement<TimelineFilterProps>(child)
            ? React.cloneElement(child as React.ReactElement<TimelineFilterProps>, { timelineFilter, setTimelineFilter })
            : child
        )}
      </motion.div>
    </motion.div>
  )
}