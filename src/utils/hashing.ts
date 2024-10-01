import { Review } from '../schemas/ReviewSchema';
import { createHash } from 'crypto';
import { PlaceDetails } from '../schemas/PlaceDetailsSchema';
import { ObfuscatedReview } from '../schemas/ObfuscatedReviewSchema';

const hashData = (...args: string[]) => {
  return createHash('sha256').update(args.filter(Boolean).join('')).digest('hex');
};

export const obfuscateReview = (
  review: Review,
  userId: string,
  images: string[],
  placeDetails: PlaceDetails
): ObfuscatedReview => {
  /* eslint-disable */
  return {
    userId,
    text: review.text,
    created_at: review.created_at,
    location_rating: review.location_rating,
    vibe_rating: review.vibe_rating,
    price_rating: review.price_rating,
    quality_rating: review.quality_rating,
    service_rating: review.service_rating,
    overall_rating: review.overall_rating,
    cleanliness_rating: review.cleanliness_rating,
    imagesHash: hashData(...images),
    latitude: placeDetails.geocodes.main.latitude,
    longitude: placeDetails.geocodes.main.longitude,
    country: placeDetails.location?.country
  };
  /* eslint-enable */
};

export const hashReview = (
  review: Review,
  userId: string,
  images: string[],
  placeDetails: PlaceDetails
): string => {
  const obfuscatedReview = obfuscateReview(review, userId, images, placeDetails);

  const userHash = hashData(obfuscatedReview.userId);
  const reviewHash = hashData(
    obfuscatedReview.text,
    obfuscatedReview.created_at.toLocaleDateString(),
    obfuscatedReview.location_rating.toString(),
    obfuscatedReview.vibe_rating.toString(),
    obfuscatedReview.price_rating.toString(),
    obfuscatedReview.quality_rating.toString(),
    obfuscatedReview.service_rating.toString(),
    obfuscatedReview.overall_rating.toString(),
    obfuscatedReview.cleanliness_rating.toString()
  );

  const imagesHash = obfuscatedReview.imagesHash;
  const placeHash = hashData(
    obfuscatedReview.latitude.toString(),
    obfuscatedReview.longitude.toString(),
    obfuscatedReview.country ?? ''
  );

  return hashData(userHash, reviewHash, imagesHash, placeHash);
};
