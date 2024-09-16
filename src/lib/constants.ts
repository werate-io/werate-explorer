export type TimelineFilter = '1D' | '1W' | '1M' | '1Y';
export type TimelineData = Record<TimelineFilter, { date: string; count: number }[]>;

export const reviewTimelineData: TimelineData = {
  '1D': [
    { date: '00:00', count: 10 },
    { date: '04:00', count: 5 },
    { date: '08:00', count: 15 },
    { date: '12:00', count: 20 },
    { date: '16:00', count: 25 },
    { date: '20:00', count: 18 }
  ],
  '1W': [
    { date: 'Mon', count: 50 },
    { date: 'Tue', count: 40 },
    { date: 'Wed', count: 60 },
    { date: 'Thu', count: 45 },
    { date: 'Fri', count: 55 },
    { date: 'Sat', count: 70 },
    { date: 'Sun', count: 65 }
  ],
  '1M': [
    { date: 'Week 1', count: 200 },
    { date: 'Week 2', count: 180 },
    { date: 'Week 3', count: 220 },
    { date: 'Week 4', count: 240 }
  ],
  '1Y': [
    { date: 'Jan', count: 1000 },
    { date: 'Feb', count: 1200 },
    { date: 'Mar', count: 1100 },
    { date: 'Apr', count: 1300 },
    { date: 'May', count: 1400 },
    { date: 'Jun', count: 1600 },
    { date: 'Jul', count: 1500 },
    { date: 'Aug', count: 1700 },
    { date: 'Sep', count: 1800 },
    { date: 'Oct', count: 1900 },
    { date: 'Nov', count: 2000 },
    { date: 'Dec', count: 2200 }
  ]
};

export const continentData = [
  { name: 'North America', value: 30 },
  { name: 'Europe', value: 25 },
  { name: 'Asia', value: 20 },
  { name: 'South America', value: 15 },
  { name: 'Africa', value: 7 },
  { name: 'Oceania', value: 3 }
];

export const ratingCategoriesData = [
  { name: 'Location', min: 2, q1: 3, median: 3.5, q3: 4, max: 5 },
  { name: 'Service', min: 1, q1: 2, median: 3, q3: 4, max: 5 },
  { name: 'Value', min: 1, q1: 2.5, median: 3.5, q3: 4.5, max: 5 },
  { name: 'Amenities', min: 1, q1: 2, median: 3, q3: 3.5, max: 5 }
];

export const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF'];

export const sidebarVariants = {
  open: {
    width: 500,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  closed: {
    width: 30,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

export const contentVariants = {
  open: { opacity: 1, x: 0, transition: { delay: 0.2 } },
  closed: { opacity: 0, x: -10, transition: { duration: 0.2 } }
};

export const phoneUsageData = [
  { name: 'Android', percentage: 50 },
  { name: 'iOS', percentage: 40 },
  { name: 'Saga', percentage: 10 }
];

export const TAKE = 3;
