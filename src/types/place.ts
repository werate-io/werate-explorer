// src/types/place.ts
export interface Place {
  id: string;
  summary: {
    placeId: string;
    overallRating: number;
    reviewsCount: number;
    checkinsCount: number;
  };
  details: {
    placeId: string;
    name: string;
    address: string;
    telephone: string;
    geocodes: {
      main: {
        latitude: number;
        longitude: number;
      };
    };
    website: string;
    types: string[];
    category: string;
    openingHours: {
      display: string;
      openNow: boolean;
      regular: {
        close: string;
        day: number;
        open: string;
      }[];
    };
    photos: string[];
  };
}

import { z } from 'zod';

export enum PlaceCategory {
  RESTAURANT = 'RESTAURANT',
  DRINK = 'DRINK',
  OTHER = 'OTHER'
}

const placeCategory = z.nativeEnum(PlaceCategory);

const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number()
});

const geocodesSchema = z.object({
  main: coordinatesSchema
});

const hourOfOperationSchema = z.object({
  close: z.string(),
  day: z.number().int(),
  open: z.string()
});

const openingHoursSchema = z.object({
  display: z.string().optional().nullable(),
  openNow: z.boolean().optional().nullable(),
  regular: z.array(hourOfOperationSchema).optional().nullable()
});

const locationSchema = z.object({
  address: z.string().optional(),
  country: z.string().optional(),
  locality: z.string().optional(),
  postcode: z.string().optional(),
  region: z.string().optional()
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
  photos: z.array(z.string())
});

export type PlaceDetails = z.infer<typeof placeDetailsSchema>;
