'use client';

import React from 'react';
import { BarChart2, UserCircle, X } from 'lucide-react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

interface MobileNavBarProps {
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  setIsLeftSidebarOpen: (isOpen: boolean) => void;
  setIsRightSidebarOpen: (isOpen: boolean) => void;
  toggleWallet: () => void;
}

export default function MobileNavBar({
  isLeftSidebarOpen,
  isRightSidebarOpen,
  setIsLeftSidebarOpen,
  setIsRightSidebarOpen
}: MobileNavBarProps) {
  return (
    <>
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 md:hidden overflow-hidden">
          {isLeftSidebarOpen && (
            <div className="absolute inset-y-0 left-0 w-full sm:w-3/4 md:w-1/2 bg-white shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0">
              <div className="p-4 h-full overflow-y-auto">
                <button onClick={() => setIsLeftSidebarOpen(false)} className="mb-4">
                  <X className="w-6 h-6" />
                </button>
                <Sidebar isOpen={true} setIsOpen={() => {}} side="left" />
              </div>
            </div>
          )}
          {isRightSidebarOpen && (
            <div className="absolute inset-y-0 right-0 w-full sm:w-3/4 md:w-1/2 bg-white shadow-lg transition-transform duration-300 ease-in-out transform translate-x-0">
              <div className="p-4 h-full overflow-y-auto">
                <button onClick={() => setIsRightSidebarOpen(false)} className="mb-4">
                  <X className="w-6 h-6" />
                </button>
                <RightSidebar isOpen={true} setIsOpen={() => {}} side="right" />
              </div>
            </div>
          )}
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden z-50">
        <button
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className={`p-2 ${isLeftSidebarOpen ? 'text-primary' : 'text-gray-600'}`}>
          <BarChart2 className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          className={`p-2 ${isRightSidebarOpen ? 'text-primary' : 'text-gray-600'}`}>
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
