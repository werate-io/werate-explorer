import apiClient from './apiClient';
import { ReviewsResponse } from '@/types/review';

export async function getReviews(page: number, take: number): Promise<ReviewsResponse> {
  console.log('page', page);
  const response = await apiClient.get('/reviews', {
    params: { _limit: take, _page: page }
  });
  return response.data;
}
