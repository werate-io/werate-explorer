'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import StatsSection from '@/components/StatCard';
import {
  COLORS,
  contentVariants,
  continentData,
  phoneUsageData,
  ratingCategoriesData,
  reviewTimelineData,
  sidebarVariants,
  TimelineFilter
} from '@/lib/constants';

export default function LeftSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('1W');

  return (
    <motion.div
      className="h-full bg-white text-slate-800 shadow-lg relative"
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      initial="open"
    >
      <motion.div
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-50 bg-white rounded-full p-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          right: isOpen ? '-12px' : '-16px',
          transition: 'right 0.3s'
        }}
      >
        {isOpen ? (
          <ChevronLeftIcon className="w-6 h-6 text-primary" />
        ) : (
          <ChevronRightIcon className="w-6 h-6 text-primary" />
        )}
      </motion.div>
      <motion.div
        variants={contentVariants}
        className="p-4 h-full overflow-y-auto"
        animate={isOpen ? 'open' : 'closed'}
      >
        <Card className="mb-4 bg-primary text-white border-none">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              The WeRate Explorer is an open-source mapping system that shows all reviews made by
              consumers using the WeRate mobile app. Each review is immutable, permanently stored on
              Arweave, and verifiable at any point in time by the reviewer.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-slate-50 border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Timeline of Reviews</CardTitle>
            <Select
              value={timelineFilter}
              onValueChange={(value: TimelineFilter) => setTimelineFilter(value)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
                <SelectItem value="1Y">1Y</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={reviewTimelineData[timelineFilter]}>
                <XAxis dataKey="date" stroke="#8B5CF6" />
                <YAxis stroke="#8B5CF6" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-slate-50 border-none">
          <CardContent>
            <StatsSection />
          </CardContent>
        </Card>

        <Card className="mb-4 bg-slate-50 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Phone Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-6 flex rounded-full overflow-hidden">
              {phoneUsageData.map((entry, index) => (
                <div
                  key={entry.name}
                  style={{
                    width: `${entry.percentage}%`,
                    backgroundColor: COLORS[index]
                  }}
                  className="h-full"
                  title={`${entry.name}: ${entry.percentage}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs">
              {phoneUsageData.map((entry, index) => (
                <div key={entry.name} className="flex items-center">
                  <div
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span>
                    {entry.name}: {entry.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-slate-50 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Continents</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={continentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {continentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Rating Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={ratingCategoriesData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="median" fill="#8B5CF6" />
                <Bar dataKey="q1" fill="#A78BFA" stackId="a" />
                <Bar dataKey="q3" fill="#C4B5FD" stackId="a" />
                <Bar dataKey="min" fill="#DDD6FE" stackId="b" />
                <Bar dataKey="max" fill="#EDE9FE" stackId="b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
