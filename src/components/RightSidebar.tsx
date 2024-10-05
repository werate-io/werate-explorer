'use client';

import React from 'react';
import SidebarBase from './SidebarBase';
import ReviewsList from '@/components/reviews/ReviewList';
import ProfileWithStats from '@/components/profile/Profile';
import { useAuth } from '@/context/AuthContext';
interface RightSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  side: 'left' | 'right';
}

export default function RightSidebar({ isOpen, setIsOpen, side }: RightSidebarProps) {
  const { isLoggedIn } = useAuth(); // Access the auth context

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SidebarBase isOpen={isOpen} setIsOpen={setIsOpen} side={side}>
      <div className="space-y-4">
        <ProfileWithStats />
        <ReviewsList />
      </div>
    </SidebarBase>
  );
}
