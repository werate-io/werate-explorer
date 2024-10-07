import instance from './werate-api';
import {
  FlattenedReviews,
  OverallReviewStatisticsResponse,
  PlaceReviewsResponse,
  ReviewsResponse
} from '@/types/review';

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

/* export async function getTotalReviews(): Promise<Review[]> {
  const response = await instance.get<Review[]>('/api/v1/game/reviews');
  return response.data;
} */

export async function getTotalReviews(
  skip: number = 0,
  take: number = 10,
  allReviews: FlattenedReviews[] = []
): Promise<FlattenedReviews[]> {
  // Fetch reviews with current skip and take values
  const response = await instance.get<ReviewsResponse>('/api/v1/game/players/reviews', {
    params: {
      take,
      skip
    }
  });

  // Add newly fetched reviews to the total
  const fetchedReviews = response.data.content;
  allReviews = [...allReviews, ...fetchedReviews];

  // If fewer reviews than requested were fetched, stop recursion
  if (fetchedReviews.length < take) {
    return allReviews;
  }

  // Otherwise, wait 100ms and fetch the next batch
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Recursively fetch next set of reviews
      const nextSkip = skip + take;
      const result = await getTotalReviews(nextSkip, take, allReviews);
      resolve(result);
    }, 100);
  });
}

export async function getReviewsByPlaceId(placeId: string): Promise<PlaceReviewsResponse> {
  const response = await instance.get<PlaceReviewsResponse>(
    `/api/v1/places/${placeId}/reviews?skip=0&take=5`
  );
  return response.data;
}
