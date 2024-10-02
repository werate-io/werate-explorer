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
}

export interface ReviewsResponse {
  content: Review[];
  totalElements: number;
}

// src/reviews.ts

export interface MapReview {
  name: string;
  rating: number;
  id: string;
  latitude: number;
  longitude: number;
  content: string;
  country: string;
}

export const MapReviews: MapReview[] = [
  {
    id: '1',
    name: 'Talha',
    latitude: 50.8503,
    longitude: 4.3517,
    content: 'Great coffee shop with a cozy atmosphere.',
    country: 'Brussels Central, 1000 Brussels, Belgium',
    rating: 5
  },
  {
    id: '2',
    name: 'Bhanu',
    latitude: 50.8452,
    longitude: 4.3571,
    content: 'Lovely park, perfect for a walk!',
    country: 'Parc de Bruxelles, 1000 Brussels, Belgium',
    rating: 4
  },
  {
    id: '3',
    name: 'Daniel',
    latitude: 50.8549,
    longitude: 4.3756,
    content: 'Amazing museum with fantastic exhibitions.',
    country: 'Royal Museums of Fine Arts, 1000 Brussels, Belgium',
    rating: 3
  },
  {
    id: '4',
    name: 'Jordi',
    latitude: 50.8476,
    longitude: 4.3527,
    content: 'Delicious food at this restaurant.',
    country: 'Rue des Bouchers, 1000 Brussels, Belgium',
    rating: 3
  }
];
