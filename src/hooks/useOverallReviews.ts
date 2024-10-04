import { useQuery } from 'react-query';
import { getTotalReviews } from '@/services/reviewService';
import { Review } from '@/types/review';

export function useOverallReviews() {
  return useQuery<Review[]>(['totalReviews'], () => getTotalReviews());
}
