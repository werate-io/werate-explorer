import { getData } from './werate-api';
import { OverallReviewStatisticsResponse, Review, ReviewsResponse } from '@/types/review';

export async function getReviews(skip: number, take: number): Promise<ReviewsResponse> {
  return await getData<ReviewsResponse>('/api/v1/game/players/reviews', {
    take,
    skip
  });
}

export async function getOverallReviewStatistics(): Promise<OverallReviewStatisticsResponse> {
  return await getData<OverallReviewStatisticsResponse>('/api/v1/game/reviews/statistics');
}

export async function getTotalReviews(): Promise<Review[]> {
  return await getData<Review[]>('/api/v1/game/reviews');
}

export async function getReviewsByPlaceId(placeId: string): Promise<ReviewsResponse> {
  return await getData<ReviewsResponse>(`/api/v1/places/${placeId}/reviews?skip=0&take=5`);
}
