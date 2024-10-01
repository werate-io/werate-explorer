import { useEffect, useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { getPlaceById } from '@/services/placeService';
import { Review, UIReview } from '@/types/review';
import { Place } from '@/types/place';

export const useTransformedReviews = (currentPage: number, take: number) => {
  const [reviews, setReviews] = useState<UIReview[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const { data: resp, isLoading, error } = useReviews(currentPage, take);

  useEffect(() => {
    if (isLoading) {
      setReviews([]);
    } else if (resp) {
      setTotalReviews(resp.totalElements);
      transformReviews(resp.content);
    }
  }, [resp, isLoading, currentPage, take]);

  const transformReviews = async (reviewsData: Review[]) => {
    const transformedReviews: UIReview[] = await Promise.all(
      reviewsData.map(async (review) => {
        let placeData: Place | null = null;
        if (review.placeId) {
          const response = await getPlaceById(review.placeId);
          placeData = response.data || null;
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
                country: (() => {
                  const lastSpaceIndex = placeData.details.address.lastIndexOf(' ');
                  return lastSpaceIndex !== -1
                    ? placeData.details.address.substring(lastSpaceIndex + 1).trim()
                    : '';
                })(),
                type: placeData.details.category,
                lat: placeData.details.geocodes.main.latitude,
                long: placeData.details.geocodes.main.longitude
              }
            : {
                name: 'Unknown',
                country: 'Unknown',
                type: 'Unknown',
                lat: 0,
                long: 0
              },
          device: review.avatarId,
          hash: 'bb884942e73bec66b9e6e9954459d1e29dff5c6e4e9d76fa35df545683ac530a',
          arweave_tx_id: 'BNttzDav3jHVnNiV7nYbQv-GY0HQ-4XXsdkE5K9ylHQ'
        };
      })
    );

    setReviews(transformedReviews);
  };

  return { reviews, totalReviews, isLoading, error };
};
