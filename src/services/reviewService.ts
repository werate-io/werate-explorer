import { getData } from './werate-api';
import { ReviewsResponse } from '@/types/review';

export async function getReviews(skip: number, take: number): Promise<ReviewsResponse> {
  const response = await getData('/reviews', {
    take: take,
    skip: skip
  });
  return response.data;
}
