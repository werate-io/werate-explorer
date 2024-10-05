'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useUserReviews } from '@/hooks/useUserReviews';
import ReviewItem from '@/components/reviews/ReviewItem';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/Pagination';
import ReviewSkeleton from '@/components/skeletons/ReviewSkeleton';
import { TAKE } from '@/lib/constants';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2 } from 'lucide-react';
import { Review } from '@/types/review';
import { useAuth } from '@/context/AuthContext';

const ReviewsList: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Moved outside the conditional

  const skip = useMemo(() => (currentPage - 1) * TAKE, [currentPage]);
  const { reviews, totalReviews, isLoading, error } = useUserReviews(skip, TAKE);
  const totalPages = useMemo(() => Math.ceil(totalReviews / TAKE), [totalReviews]);

  useEffect(() => {
    setCurrentPage(1);
  }, [totalReviews]);

  const handlePageChange = useCallback((page: number) => {
    setLoading(true);
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [reviews, isLoading]);

  if (!isLoggedIn || !publicKey) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        {' '}
        {/* Ensure the parent has a height */}
        <p className="text-xl font-semibold text-center">Connect your wallet to view reviews</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <ul className="space-y-4 sm:space-y-6 md:space-y-8 flex-grow">
        {Array.from({ length: TAKE }, (_, index) => (
          <li key={index}>
            <ReviewSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (error) return <div>Error: {(error as Error).message}</div>;

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <p className="text-xl font-semibold text-center">No reviews available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <Loader2 className="animate-spin text-primary" size={36} />
        </div>
      )}
      <ReviewContent
        reviews={reviews}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

interface ReviewContentProps {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const ReviewContent: React.FC<ReviewContentProps> = ({
  reviews,
  currentPage,
  totalPages,
  handlePageChange
}) => (
  <div className="w-full">
    <ul className="space-y-4 sm:space-y-6 md:space-y-8 flex-grow">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </ul>
    <PaginationControls
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
    />
  </div>
);

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  handlePageChange
}) => (
  <div className="flex w-full items-center justify-center mt-4 sm:mt-6">
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(index + 1);
              }}
              className={currentPage === index + 1 ? 'bg-primary text-white' : ''}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
);

export default ReviewsList;
