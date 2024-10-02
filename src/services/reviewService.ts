import { getData } from './werate-api';
import { OverallReviewStatisticsResponse, ReviewsResponse } from '@/types/review';

export async function getReviews(skip: number, take: number): Promise<ReviewsResponse> {
  return await getData<ReviewsResponse>('/api/v1/game/players/reviews', {
    take,
    skip
  });
}

export async function getOverallReviewStatistics(): Promise<OverallReviewStatisticsResponse> {
  return await getData<OverallReviewStatisticsResponse>('/api/v1/game/reviews/statistics');
}
