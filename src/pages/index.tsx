'use client';
import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import RightSidebar from '@/components/RightSidebar';
import Sidebar from '@/components/Sidebar';
import AppWalletProvider from '@/components/AppWalletProvider';
import MobileNavBar from '@/components/MobileNavBar';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/MapboxMap'), {
  ssr: false
});

export default function Home() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const toggleWallet = () => console.log('Toggle wallet');

  return (
    <AppWalletProvider>
      <main className="relative h-screen w-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Map />
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
  );
}
