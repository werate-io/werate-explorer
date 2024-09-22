import { useQuery } from 'react-query';
import { getReviews } from '@/services/reviewService';
import { ReviewsResponse } from '@/types/review';

export function useReviews(page: number, take: number) {
  return useQuery<ReviewsResponse>(['reviews', page, take], () => getReviews(page, take));
}
