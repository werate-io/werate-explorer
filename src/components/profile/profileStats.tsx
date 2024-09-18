import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { StatCard } from '@/components/StatCard';

export default function ProfileWithStats() {
  return (
    <>
      <Card className="w-full bg-purple-800 p-4 rounded-lg shadow-lg">
        <CardTitle className="text-white text-2xl font-bold">Profile</CardTitle>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar className="h-12 w-12 bg-slate-50">
            <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-white text-1xl font-bold mb-1">Jane Doe</CardTitle>
            <p className="text-sm text-muted text-white font-mono rounded break-all">
              0x9xQ5qCkYpZxiJm86zYJ8vR6uD4QyQb8sfX6sJ2H6nTTk
            </p>
          </div>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StatCard title="Reviews" value={697738} change={1118} />
        <StatCard title="Venues" value={58704} change={203} />
        <StatCard title="Countries" value={195} change={2} />
        <StatCard title="Avg Rating" value={195} change={-2} />
      </div>
    </>
  );
}
