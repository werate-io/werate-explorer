'use client';
import ReviewsList from '@/components/ReviewsList';
import LeftSidebar from '@/components/LeftSidebar';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const LazyMap = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <Navbar />
      <div className="relative top-0 left-0 h-full z-10">
        <LeftSidebar />
      </div>
      <div className="relative flex">
        <LazyMap />
      </div>
      <div className="flex-shrink-0 w-1/3 overflow-y-auto">
        <ReviewsList />
      </div>
    </main>
  );
}
