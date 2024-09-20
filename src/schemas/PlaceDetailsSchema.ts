import {z} from 'zod';

export enum PlaceCategory {
  RESTAURANT = 'RESTAURANT',
  DRINK = 'DRINK',
  OTHER = 'OTHER',
}

const placeCategory = z.nativeEnum(PlaceCategory);

const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const geocodesSchema = z.object({
  main: coordinatesSchema,
});

const hourOfOperationSchema = z.object({
  close: z.string(),
  day: z.number().int(),
  open: z.string(),
});

const openingHoursSchema = z.object({
  display: z.string().optional().nullable(),
  openNow: z.boolean().optional().nullable(),
  regular: z.array(hourOfOperationSchema).optional().nullable(),
});

const locationSchema = z.object({
	address: z.string().optional(),
	country: z.string().optional(),
	locality: z.string().optional(),
	postcode: z.string().optional(),
	region: z.string().optional(),
});

export const placeDetailsSchema = z.object({
	placeId: z.string(),
	name: z.string(),
	location: locationSchema.optional(),
	address: z.string().optional().nullable(),
	telephone: z.string().optional().nullable(),
	geocodes: geocodesSchema,
	website: z.string().optional().nullable(),
	types: z.array(z.string()),
	category: placeCategory,
	openingHours: openingHoursSchema.optional().nullable(),
	photos: z.array(z.string()),
});

export type PlaceDetails = z.infer<typeof placeDetailsSchema>;