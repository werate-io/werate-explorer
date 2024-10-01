export interface Review {
  id: string;
  placeId: string;
  reviewAuthorNickname: string | null;
  reviewAuthorWisdom: string | null;
  rating: number;
  text: string;
  avatarId: string;
  likeCount: number;
  createdAt: string;
  photoUrls: string[];
}

export interface UIReview {
  id: string;
  description: string;
  starRatings: number;
  photos: string[];
  timestamp: string;
  biometricsHash: string;
  userId: string;
  bohemianId: string;
  venueLocation: {
    name: string;
    country: string;
    type: string;
    lat: number;
    long: number;
  };
  device: string;
  hash: string;
  arweave_tx_id: string;
}

export interface ReviewsResponse {
  content: Review[];
  totalElements: number;
}

import {z} from 'zod';

export const reviewSchema = z.object({
	text: z.string().min(10),
	created_at: z.date(),
	location_rating: z.number().int().min(0).max(5),
	vibe_rating: z.number().int().min(0).max(5),
	price_rating: z.number().int().min(0).max(5),
	quality_rating: z.number().int().min(0).max(5),
	service_rating: z.number().int().min(0).max(5),
	overall_rating: z.number().int().min(0).max(5),
	cleanliness_rating: z.number().int().min(0).max(5)
});

export type VerifyReview = z.infer<typeof reviewSchema>;