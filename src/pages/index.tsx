'use client';
import React, { useState, useEffect } from 'react';
import RightSidebar from '@/components/RightSidebar';
import Sidebar from '@/components/Sidebar';
import dynamic from 'next/dynamic';
import AppWalletProvider from '@/components/AppWalletProvider';
import MobileNavBar from '@/components/MobileNavBar';

const LazyMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function Home() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const toggleWallet = () => console.log('Toggle wallet'); // Define toggleWallet

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AppWalletProvider>
      <main className="relative h-screen w-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <LazyMap />
        </div>
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:flex">
          <Sidebar isOpen={isLeftSidebarOpen} setIsOpen={setIsLeftSidebarOpen} side="left" />
          <div className="flex-grow" />
          <RightSidebar isOpen={isRightSidebarOpen} setIsOpen={setIsRightSidebarOpen} side="right" />
        </div>
        <MobileNavBar
          isLeftSidebarOpen={isLeftSidebarOpen}
          isRightSidebarOpen={isRightSidebarOpen}
          setIsLeftSidebarOpen={setIsLeftSidebarOpen} // Add this line
          setIsRightSidebarOpen={setIsRightSidebarOpen} // Add this line
          toggleWallet={toggleWallet}
        />
      </main>
    </AppWalletProvider>
  );
}
