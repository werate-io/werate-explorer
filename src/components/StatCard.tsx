import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { ArrowUpIcon, ArrowDownIcon, ChevronRightIcon, StarIcon, UsersIcon, GlobeIcon, } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon?: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  const isPositive = change >= 0;
  const changeAbs = Math.abs(change);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
       <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {Icon && <Icon className="h-5 w-5 mr-2 text-gray-500" />}
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <div className="flex items-center mt-1">
              <div className={`p-1 rounded ${isPositive ? 'bg-green-100' : 'bg-red-100'} mr-1`}>
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 text-red-600" />
                )}
              </div>
              <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {changeAbs}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Reviews" value={697738} change={1118} icon={StarIcon} />
      <StatCard title="WeRaters" value={58704} change={-203} icon={UsersIcon} />
      <StatCard title="Countries" value={195} change={2} icon={GlobeIcon} />
    </div>
  );
}
