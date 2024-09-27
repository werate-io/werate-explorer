import React, { useState, useMemo, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import ReviewItem from '@/components/reviews/ReviewItem';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/Pagination';
import { UIReview } from '@/types/review';
import * as constants from '@/lib/constants';
import { Skeleton } from '@/components/ui/Skeleton';

// Mock data
const mockReviews: UIReview[] = [
  {
    id: '1',
    description:
      'This place is absolutely beautiful! The scenery is breathtaking, the facilities are well-maintained, and there are plenty of activities for visitors of all ages. The park staff is friendly and helpful, always ready to assist with any questions or concerns. I particularly enjoyed the hiking trails, which offer stunning views of the surrounding landscape. The picnic areas are clean and well-equipped, making it perfect for a family day out. The park also hosts various events throughout the year, adding to its charm and appeal. Overall, I highly recommend visiting this park for a refreshing and enjoyable outdoor experience',
    starRatings: 4,
    photos: ['https://picsum.photos/200', 'https://picsum.photos/201'],
    timestamp: 'Oct 1, 2024',
    biometricsHash: 'abc123',
    userId: 'user1',
    bohemianId: 'bohemian1',
    venueLocation: {
      name: 'Cool Cafe',
      country: 'USA',
      type: 'Cafe',
      lat: 40.7128,
      long: -74.006
    },
    device: 'iPhone 12'
  },
  {
    id: '2',
    description:
      'This place is absolutely beautiful! The scenery is breathtaking, the facilities are well-maintained, and there are plenty of activities for visitors of all ages. The park staff is friendly and helpful, always ready to assist with any questions or concerns. I particularly enjoyed the hiking trails, which offer stunning views of the surrounding landscape. The picnic areas are clean and well-equipped, making it perfect for a family day out. The park also hosts various events throughout the year, adding to its charm and appeal. Overall, I highly recommend visiting this park for a refreshing and enjoyable outdoor experience',
    starRatings: 3,
    photos: ['https://picsum.photos/200', 'https://picsum.photos/200'],
    timestamp: 'Oct 1, 2024',
    biometricsHash: 'abc123',
    userId: 'user1',
    bohemianId: 'bohemian1',
    venueLocation: {
      name: 'Cool Cafe',
      country: 'USA',
      type: 'Cafe',
      lat: 40.7128,
      long: -74.006
    },
    device: 'iPhone 12'
  }
  // ... Add more mock reviews here
];

function ReviewSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

function ReviewsList() {
  const { publicKey } = useWallet();
  const take = constants.TAKE;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const totalReviews = mockReviews.length;
  const totalPages = Math.ceil(totalReviews / take);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * take;
    return mockReviews.slice(startIndex, startIndex + take);
  }, [currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setIsLoading(true);
        setCurrentPage(page);
        // Simulate loading delay
        setTimeout(() => setIsLoading(false), 1000);
      }
    },
    [totalPages]
  );

  // Simulate initial loading
  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <p className="text-xl font-semibold text-center">Connect your wallet to view reviews</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-4 sm:space-y-6 md:space-y-8 flex-grow">
        {isLoading
          ? Array(take)
              .fill(0)
              .map((_, index) => (
                <li key={index}>
                  <ReviewSkeleton />
                </li>
              ))
          : paginatedReviews.map((review) => <ReviewItem key={review.id} review={review} />)}
      </ul>
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
            {Array(totalPages)
              .fill('')
              .map((_, index) => (
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
    </div>
  );
}

export default ReviewsList;
