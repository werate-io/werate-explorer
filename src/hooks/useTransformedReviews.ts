import { useEffect, useState, useCallback } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { getPlaceById } from '@/services/placeService';
import { Review, UIReview } from '@/types/review';
import { Place } from '@/types/place';

export const useTransformedReviews = (skip: number, take: number) => {
  const [reviews, setReviews] = useState<UIReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const { data: resp, isLoading, error } = useReviews(skip, take);

  const transformReviews = useCallback(async (reviewsData: Review[]) => {
    const transformedReviews: UIReview[] = await Promise.all(
      reviewsData.map(async (review) => {
        let placeData: Place | null = null;
        if (review.placeId) {
          placeData = await getPlaceById(review.placeId);
        }

        return {
          id: review.id,
          description: review.text,
          starRatings: review.rating || 0,
          photos: review.photoUrls,
          timestamp: new Date(review.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          biometricsHash: '',
          userId: review.reviewAuthorNickname || '',
          bohemianId: '',
          venueLocation: placeData
            ? {
                name: placeData.details.name,
                country: placeData.details.location.country,
                locality: placeData.details.location.locality,
                region: placeData.details.location.region,
                type: placeData.details.category,
                lat: placeData.details.geocodes.main.latitude,
                long: placeData.details.geocodes.main.longitude
              }
            : {
                name: 'Unknown',
                country: 'Unknown',
                type: 'Unknown',
                locality: 'Unknown',
                region: 'Unknown',
                lat: 0,
                long: 0
              },
          device: review.avatarId
        };
      })
    );

    setReviews(transformedReviews);
  }, []);

  useEffect(() => {
    if (resp) {
      setTotalReviews(resp.total_elements);
      transformReviews(resp.content);
    }
  }, [resp, transformReviews]);

  return { reviews, totalReviews, isLoading, error };
};
