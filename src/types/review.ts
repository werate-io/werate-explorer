/* eslint-disable @typescript-eslint/naming-convention */
export interface Review {
  id: string;
  placeId: string;
  playerId: string;
  placeCategory: string | null;
  reviewAuthorNickname: string | null;
  reviewAuthorWisdom: string | null;
  rating: number;
  categoryRatings: {
    overall: number;
    location: number;
    vibe: number;
    price: number;
    quality: number;
    cleanliness: number;
    service: number;
  };
  metadata: {
    name: string;
    category: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    region: string;
    country: string;
    device: string;
    locality: string;
    postalCode: string;
    images: string[];
  };
  bohemianId: string;
  biometricsHash: string;
  text: string;
  avatarId: string;
  likeCount: number;
  createdAt: string;
  images: string[];
  hash: string;

  arweave_txn_id: string;
}

export interface FlattenedReviews {
  userId: string;
  text: string;
  created_at: string;
  location_rating: number;
  vibe_rating: number;
  price_rating: number;
  quality_rating: number;
  service_rating: number;
  overall_rating: number;
  cleanliness_rating: number;
  imagesHash: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface ReviewsResponse {
  content: FlattenedReviews[];

  total_elements: number;
}
export type TimelineFilter = '1D' | '1W' | '1M' | '1Y';
export type TimelineData = Record<TimelineFilter, { date: string; count: number }[]>;

export interface OverallReviewStatisticsResponse {
  totalReviews: number;
  totalUniqueUsers: number;
  totalUniqueCountries: number;
  timeline: {
    [key in TimelineFilter]: {
      date: TimelineFilter;
      count: number;
    }[];
  };
  phoneUsageData: {
    name: string;
    percentage: number;
  }[];
  countryData: {
    country: string;
    count: number;
  }[];
  ratingCategoriesData: {
    name: string;
    median: number;
    q1: number;
    q3: number;
    min: number;
    max: number;
  }[];
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

export interface ReviewAddress {
  address: string;
  latitude: number;
  longitude: number;
}
