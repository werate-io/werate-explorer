import { useQuery } from 'react-query';
import { getPlaceById } from '@/services/placeService';
import type { Place } from '@/types/place';
import { PlaceReviewsResponse } from '@/types/review';

import { getReviewsByPlaceId } from '@/services/reviewService';
export function usePlace(placeId: string) {
  return useQuery<Place>(['place', placeId], () => getPlaceById(placeId));
}

export function useReviewsByPlaceId(placeId: string) {
  return useQuery<PlaceReviewsResponse>(['reviewsByPlaceId', placeId], () =>
    getReviewsByPlaceId(placeId)
  );
}
