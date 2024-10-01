import { z } from 'zod';
/* eslint-disable */
export const obfuscatedReviewSchema = z.object({
  userId: z.string(),
  text: z.string(),
  created_at: z.date(),
  location_rating: z.number(),
  vibe_rating: z.number(),
  price_rating: z.number(),
  quality_rating: z.number(),
  service_rating: z.number(),
  overall_rating: z.number(),
  cleanliness_rating: z.number(),
  imagesHash: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional()
});
/* eslint-enable */
export type ObfuscatedReview = z.infer<typeof obfuscatedReviewSchema>;
