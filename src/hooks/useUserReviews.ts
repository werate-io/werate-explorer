import { useEffect, useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import { Review } from '@/types/review';

export const useUserReviews = (skip: number, take: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const { data: resp, isLoading, error } = useReviews(skip, take);

  useEffect(() => {
    if (resp) {
      setTotalReviews(resp.total_elements);
      setReviews(resp.content);
    }
  }, [resp]);
  return { reviews, totalReviews, isLoading, error };
};
