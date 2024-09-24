'use client';
import React from 'react';
import LeftSidebar from '@/components/LeftSidebar';
import dynamic from 'next/dynamic';
import RightSidebar from '@/components/RightSidebar';
import Navbar from '@/components/Navbar';

const LazyMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="flex relative top-0 left-0 h-full z-10">
        <LeftSidebar />
      </div>
      <div className="flex flex-col flex-grow w-auto">
        <Navbar />
        <LazyMap />
      </div>
      <div className="flex relative top-0 right-0 z-10">
        <RightSidebar />
      </div>
    </main>
  );
}
