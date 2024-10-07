import { FlattenedReviews } from '@/types/review';
import { ProfileMe } from '@/types/user'; // Import the Profile type
import { create } from 'zustand';

interface ReviewState {
  totalReviews: FlattenedReviews[];
  selectedReview: FlattenedReviews | null;
  setTotalReviews: (total: FlattenedReviews[]) => void;
  setSelectedReview: (review: FlattenedReviews) => void;
}

interface UserState {
  profile: ProfileMe | null; // Add profile state
  playerId: string | null; // Add playerId state
  setProfile: (profile: ProfileMe) => void; // Function to set profile
  setPlayerId: (playerId: string) => void; // Function to set playerId
}

export const useReviewStore = create<ReviewState>((set) => ({
  totalReviews: [],
  selectedReview: null,
  setTotalReviews: (total: FlattenedReviews[]) => set({ totalReviews: total }),
  setSelectedReview: (review: FlattenedReviews) => set({ selectedReview: review })
}));

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  playerId: null,
  setProfile: (profile: ProfileMe) => set({ profile }),
  setPlayerId: (playerId: string) => set({ playerId })
}));
