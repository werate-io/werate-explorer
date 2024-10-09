import { useEffect, useState } from 'react';
import { getReviews } from '../services/reviewService';
import { getPlaceById } from '../services/placeService';
import { Review } from '@/types/review';
export const useUserReviews = (skip: number, take: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchReviewsAndPlaces = async () => {
      try {
        const fetchedReviews = await getReviews(skip, take);
        const reviewsWithPlaces = await Promise.all(
          fetchedReviews.content.map(async (review: Review) => {
            const placeDetails = await getPlaceById(review.placeId);
            return {
              ...review,
              metadata: {
                ...review.metadata,
                name: placeDetails.details.name,
                longitude: placeDetails.details.geocodes.main.longitude,
                latitude: placeDetails.details.geocodes.main.latitude,
                address: placeDetails.details.address,
                types: placeDetails.details.types,
                category: placeDetails.details.category,
                images: placeDetails.details.photos
              }
            };
          })
        );
        setTotalReviews(fetchedReviews.total_elements);
        setReviews(reviewsWithPlaces);
      } catch (error) {
        setError(error as Error);
        console.error('Error fetching reviews and places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndPlaces();
  }, [skip, take]);

  return { reviews, totalReviews, loading, error };
};
