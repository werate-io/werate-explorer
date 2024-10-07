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
  id: string;
  userId: string;
  placeId: string;
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
  content: Review[];
  total_elements: number;
}
export interface PlaceReviewsResponse {
  content: Review[];

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

export interface ReviewAddress {
  address: string;
  latitude: number;
  longitude: number;
}
