import { getData } from './werate-api';
import { ReviewsResponse } from '@/types/review';

export async function getReviews(skip: number, take: number): Promise<ReviewsResponse> {
  return await getData<ReviewsResponse>('/api/v1/game/players/reviews', {
    take,
    skip,
  });
}