export interface Profile {
  nickname: string;
  health: number;
  wisdom: number;
  favoriteAvatarId: string;
  reviewCount: number;
  upvoteCount: number;
  checkinCount: number;
  uniqueVisitsCount: number;
  avatarCount: number;
  watEarnedAmount: number;
  overallRating: number;
}

export interface ProfileMe {
  userId: string;
  email: string;
  nickname: string;
  countryCode: string;
  birthday: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  accessExpirationDate?: string;
  refreshExpirationDate?: string;
  preAuthToken?: string;
  error?: string;
}

export interface RegisterResponse {
  success?: boolean;
  error?: string;
}
