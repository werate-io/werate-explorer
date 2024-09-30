import { TimelineFilter } from "@/lib/constants";

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
    os: string;
    count: number;
  }[];
  continentData: {
    continent: string;
    count: number;
  }[];
  ratingCategoriesData: {
    rating: number;
    count: number;
  }[];
}
