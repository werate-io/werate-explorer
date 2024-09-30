'use client';
import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import dynamic from 'next/dynamic';
import RightSidebar from '@/components/RightSidebar';
import Sidebar from '@/components/Sidebar';
import AppWalletProvider from '@/components/AppWalletProvider';
import MobileNavBar from '@/components/MobileNavBar';

const LazyMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
    if (!isLeftSidebarOpen) {
      setIsRightSidebarOpen(false);
    }
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
    if (!isRightSidebarOpen) {
      setIsLeftSidebarOpen(false);
    }
  };

  const toggleWallet = () => {
    // Implement wallet toggle logic here
  };

  return (
    <AppWalletProvider>
      <main className="relative h-screen w-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyMap />
        </div>
        {!isMobile && (
          <div className="absolute inset-0 z-10 pointer-events-none flex">
            <Sidebar isOpen={isLeftSidebarOpen} setIsOpen={toggleLeftSidebar} side="left" />
            <div className="flex-grow" />
            <RightSidebar isOpen={isRightSidebarOpen} setIsOpen={toggleRightSidebar} side="right" />
          </div>
        )}
        {isMobile && (
          <MobileNavBar
            isLeftSidebarOpen={isLeftSidebarOpen}
            isRightSidebarOpen={isRightSidebarOpen}
            setIsLeftSidebarOpen={toggleLeftSidebar}
            setIsRightSidebarOpen={toggleRightSidebar}
            toggleWallet={toggleWallet}
          />
        )}
      </main>
    </AppWalletProvider>
  );
}
