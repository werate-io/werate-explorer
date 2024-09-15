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