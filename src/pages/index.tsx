'use client';
import React from 'react';
import RightSidebar from '@/components/RightSidebar';
import Sidebar from '@/components/Sidebar';
import dynamic from 'next/dynamic';
import AppWalletProvider from '@/components/AppWalletProvider';

const LazyMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  return (
    <AppWalletProvider>
      <main className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        {/* <div className="flex-grow relative">
          <LazyMap />
        </div> */}
        <RightSidebar />
      </main>
    </AppWalletProvider>
  );
}
