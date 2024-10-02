import { useQuery } from 'react-query';
import { getReviews } from '@/services/reviewService';
import { ReviewsResponse } from '@/types/review';

export function useReviews(skip: number, take: number) {
  return useQuery<ReviewsResponse>(['reviews', skip, take], () => getReviews(skip, take));
}
