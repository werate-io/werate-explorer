import { useQuery } from 'react-query';
import { getTotalReviews } from '@/services/reviewService';
import { FlattenedReviews } from '@/types/review';

export function useOverallReviews() {
  return useQuery<FlattenedReviews[]>(['totalReviews'], () => getTotalReviews());
}
