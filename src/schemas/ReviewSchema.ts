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

export type Review = z.infer<typeof reviewSchema>;
