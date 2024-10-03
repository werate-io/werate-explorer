import { UIReview } from '../types/review';
import { createHash } from 'crypto';
import { ObfuscatedReview } from '../schemas/ObfuscatedReviewSchema';

const hashData = (...args: string[]) => {
  return createHash('sha256').update(args.filter(Boolean).join('')).digest('hex');
};

export const obfuscateReview = (review: UIReview): ObfuscatedReview => {
  /* eslint-disable */
  return {
    userId: review.userId,
    text: review.description,
    created_at: new Date(review.timestamp),
    location_rating: review.categoryRatings.location,
    vibe_rating: review.categoryRatings.vibe,
    price_rating: review.categoryRatings.price,
    quality_rating: review.categoryRatings.quality,
    service_rating: review.categoryRatings.service,
    overall_rating: review.categoryRatings.overall,
    cleanliness_rating: review.categoryRatings.cleanliness,
    imagesHash: hashData(...review.photos),
    latitude: review.venueLocation.lat,
    longitude: review.venueLocation.long,
    country: review.venueLocation.country
  };
  /* eslint-enable */
};

export const hashReview = (
  review: UIReview
): string => {
  const obfuscatedReview = obfuscateReview(review);

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
