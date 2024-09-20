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
