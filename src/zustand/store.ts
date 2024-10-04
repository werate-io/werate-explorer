import { mockReviews } from '@/mock';
import { Review } from '@/types/review';
import { ProfileMe } from '@/types/user'; // Import the Profile type
import { create } from 'zustand';

interface ReviewState {
  totalReviews: Review[];
  selectedReview: Review;
  setTotalReviews: (total: Review[]) => void;
  setSelectedReview: (review: Review) => void;
}

interface UserState {
  profile: ProfileMe | null; // Add profile state
  playerId: string | null; // Add playerId state
  setProfile: (profile: ProfileMe) => void; // Function to set profile
  setPlayerId: (playerId: string) => void; // Function to set playerId
}

const mockReviewsState = mockReviews;
const mockInitialReviewState = mockReviews[0];

export const useReviewStore = create<ReviewState>((set) => ({
  totalReviews: mockReviewsState,
  selectedReview: mockInitialReviewState,
  setTotalReviews: (total: Review[]) => set({ totalReviews: total }),
  setSelectedReview: (review: Review) => set({ selectedReview: review })
}));

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  playerId: null,
  setProfile: (profile: ProfileMe) => set({ profile }),
  setPlayerId: (playerId: string) => set({ playerId })
}));
