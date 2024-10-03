import { mockReviews } from '@/mock';
import { Review } from '@/types/review';
import { create } from 'zustand';

interface ReviewState {
  totalReviews: Review[];
  selectedReview: Review;
  setTotalReviews: (total: Review[]) => void;
  setSelectedReview: (review: Review) => void;
}

const mockReviewsState = mockReviews;
const mockInitialReviewState = mockReviews[0];

export const useReviewStore = create<ReviewState>((set) => ({
  totalReviews: mockReviewsState,
  selectedReview: mockInitialReviewState,
  setTotalReviews: (total: Review[]) => set({ totalReviews: total }),
  setSelectedReview: (review: Review) => set({ selectedReview: review })
}));
