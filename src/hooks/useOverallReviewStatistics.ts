import { useQuery } from 'react-query';
import { getOverallReviewStatistics, getReviews } from '@/services/reviewService';
import { OverallReviewStatisticsResponse, ReviewsResponse } from '@/types/review';

export function useOverallReviewStatistics() {
  return useQuery<OverallReviewStatisticsResponse>(['reviews'], () => getOverallReviewStatistics());
}
