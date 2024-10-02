import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ChevronRightIcon, StarIcon, UsersIcon, GlobeIcon, LucideIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-center items-center mb-2">
          <div className="flex items-center">
            {Icon && <Icon className="h-5 w-5 mr-2 text-primary" />}
            <h3 className="text-sm font-medium text-primary">{title}</h3>
          </div>
          <ChevronRightIcon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex justify-center items-end">
          <div>
            <p className="text-center text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsSectionProps {
  totalReviews: number;
  totalUsers: number;
  totalContinents: number;
}

export default function StatsSection({
  totalReviews,
  totalUsers,
  totalContinents
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Reviews" value={totalReviews} icon={StarIcon} />
      <StatCard title="WeRaters" value={totalUsers} icon={UsersIcon} />
      <StatCard title="Countries" value={totalContinents} icon={GlobeIcon} />
    </div>
  );
}
