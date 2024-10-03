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
    latitude: number;
    longitude: number;
    region: string;
    country: string;
    device: string;
  };
  text: string;
  avatarId: string;
  likeCount: number;
  createdAt: string;
  photoUrls: string[];
  hash: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  arweave_tx_id: string;
}

export interface UIReview {
  id: string;
  placeId: string;
  description: string;
  starRatings: number;
  photos: string[];
  timestamp: string;
  biometricsHash: string;
  userId: string;
  bohemianId: string;
  categoryRatings: {
    overall: number;
    location: number;
    vibe: number;
    price: number;
    quality: number;
    cleanliness: number;
    service: number;
  };
  venueLocation: {
    name: string;
    country: string;
    locality: string;
    region: string;
    type: string;
    lat: number;
    long: number;
  };
  device: string;
  hash: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  arweave_tx_id: string;
}

export interface ReviewsResponse {
  content: Review[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  total_elements: number;
}

export interface OverallReviewStatisticsResponse {
  totalReviews: number;
  totalUniqueUsers: number;
  totalUniqueCountries: number;
  timeline: {
    date: TimelineFilter;
    count: number;
  }[];
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
export type TimelineFilter = '1D' | '1W' | '1M' | '1Y';
export type TimelineData = Record<TimelineFilter, { date: string; count: number }[]>;
