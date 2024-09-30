'use client';

import React from 'react';
import SidebarBase from './SidebarBase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';
import StatsSection from '@/components/StatCard';
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
import {
  COLORS,
  continentData,
  phoneUsageData,
  ratingCategoriesData,
  reviewTimelineData,
  TimelineFilter
} from '@/lib/constants';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  side: 'left' | 'right';
}

export default function Sidebar({ isOpen, setIsOpen, side }: SidebarProps) {
  const [timelineFilter, setTimelineFilter] = React.useState<TimelineFilter>('1D');

  return (
    <SidebarBase isOpen={isOpen} setIsOpen={setIsOpen} side={side}>
      <SidebarContent
        timelineFilter={timelineFilter}
        setTimelineFilter={(filter: TimelineFilter) => setTimelineFilter(filter)}
      />
    </SidebarBase>
  );
}

interface SidebarContentProps {
  timelineFilter: TimelineFilter;
  setTimelineFilter: (filter: TimelineFilter) => void;
}

function SidebarContent({ timelineFilter, setTimelineFilter }: SidebarContentProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-primary text-white border-none">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-bold">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs md:text-sm">
            The WeRate Explorer is an open-source mapping system that shows all reviews made by
            consumers using the WeRate mobile app. Each review is immutable, permanently stored on
            Arweave, and verifiable at any point in time by the reviewer.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4 bg-slate-50 border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Timeline of Reviews</CardTitle>
          <Select value={timelineFilter} onValueChange={setTimelineFilter}>
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
              <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} dot={false} />
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
    </div>
  );
}
