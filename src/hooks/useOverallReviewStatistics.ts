import { useQuery } from 'react-query';
import { getOverallReviewStatistics } from '@/services/reviewService';
import { OverallReviewStatisticsResponse } from '@/types/review';

export function useOverallReviewStatistics() {
  return useQuery<OverallReviewStatisticsResponse>(['reviews'], () => getOverallReviewStatistics());
}
