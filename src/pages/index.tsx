'use client';
import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import RightSidebar from '@/components/RightSidebar';
<<<<<<< HEAD
import AppWalletProvider from "@/components/AppWalletProvider";
=======
import Sidebar from '@/components/Sidebar';
import AppWalletProvider from '@/components/AppWalletProvider';
import MobileNavBar from '@/components/MobileNavBar';
>>>>>>> main

const LazyMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const toggleWallet = () => console.log('Toggle wallet');

  return (
<<<<<<< HEAD
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="relative top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="relative flex w-full">
        <AppWalletProvider>
          <LazyMap />
        </AppWalletProvider>
      </div>
      <div className="flex-shrink-0 w-1/3 overflow-y-auto">
        <RightSidebar />
      </div>
    </main>
=======
    <AppWalletProvider>
      <main className="relative h-screen w-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyMap />
        </div>
        {!isMobile && (
          <div className="absolute inset-0 z-10 pointer-events-none flex">
            <Sidebar isOpen={isLeftSidebarOpen} setIsOpen={setIsLeftSidebarOpen} side="left" />
            <div className="flex-grow" />
            <RightSidebar
              isOpen={isRightSidebarOpen}
              setIsOpen={setIsRightSidebarOpen}
              side="right"
            />
          </div>
        )}
        {isMobile && (
          <MobileNavBar
            isLeftSidebarOpen={isLeftSidebarOpen}
            isRightSidebarOpen={isRightSidebarOpen}
            setIsLeftSidebarOpen={setIsLeftSidebarOpen}
            setIsRightSidebarOpen={setIsRightSidebarOpen}
            toggleWallet={toggleWallet}
          />
        )}
      </main>
    </AppWalletProvider>
>>>>>>> main
  );
}
