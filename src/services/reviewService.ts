import instance from './werate-api';
import { OverallReviewStatisticsResponse, Review, ReviewsResponse } from '@/types/review';

export async function getReviews(skip: number, take: number): Promise<ReviewsResponse> {
  const response = await instance.get<ReviewsResponse>('/api/v1/game/players/reviews', {
    params: {
      take,
      skip
    }
  });
  return response.data;
}

export async function getOverallReviewStatistics(): Promise<OverallReviewStatisticsResponse> {
  const response = await instance.get<OverallReviewStatisticsResponse>(
    '/api/v1/game/reviews/statistics'
  );
  return response.data;
}

export async function getTotalReviews(): Promise<Review[]> {
  const response = await instance.get<Review[]>('/api/v1/game/reviews');
  return response.data;
}

export async function getReviewsByPlaceId(placeId: string): Promise<ReviewsResponse> {
  const response = await instance.get<ReviewsResponse>(
    `/api/v1/places/${placeId}/reviews?skip=0&take=5`
  );
  return response.data;
}
