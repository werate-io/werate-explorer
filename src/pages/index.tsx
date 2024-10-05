'use client';
import React, { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import RightSidebar from '@/components/RightSidebar';
import LeftSidebar from '@/components/LeftSidebar';
import AppWalletProvider from '@/components/AppWalletProvider';
import MobileNavBar from '@/components/MobileNavBar';
import { useAuth } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
const Map = dynamic(() => import('@/components/MapboxMap'), {
  ssr: false
});

export default function Home() {
  const { signOut, isLoggedIn } = useAuth();
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [, setDataBounds] = useState<string>('');
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
    signOut();
  };

  return (
    <AppWalletProvider>
      <main className="relative h-screen w-screen overflow-hidden">
        <div className="relative inset-0 z-10"></div>
        {!isMobile && (
          <>
            <Navbar />
            <div className="absolute inset-0 pointer-events-none flex z-10">
              <div className="pointer-events-auto z-50">
                <LeftSidebar isOpen={isLeftSidebarOpen} setIsOpen={toggleLeftSidebar} side="left" />
              </div>
              <Map setDataBounds={setDataBounds} reviews={[]} highlightedId={null} />
              {isLoggedIn && (
                <div className="pointer-events-auto z-40">
                <RightSidebar
                  isOpen={isRightSidebarOpen}
                  setIsOpen={toggleRightSidebar}
                  side="right"
                />
                </div>
              )}
            </div>
          </>
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
