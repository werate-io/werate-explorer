import { Review } from '@/types/review';

export const mockReviews: Review[] = [
  {
    id: 'rev1',
    placeId: 'place1',
    playerId: 'player1',
    placeCategory: 'Restaurant',
    reviewAuthorNickname: 'Foodie123',
    reviewAuthorWisdom: 'Seasoned Reviewer',
    rating: 4.5,
    categoryRatings: {
      overall: 4.5,
      location: 4,
      vibe: 5,
      price: 4,
      quality: 4.5,
      cleanliness: 4.8,
      service: 5
    },
    metadata: {
      latitude: 40.7128,
      longitude: -74.006,
      region: 'New York',
      country: 'USA',
      device: 'iPhone 12'
    },
    text: 'Great food and cozy atmosphere!',
    avatarId: 'avatar1',
    likeCount: 120,
    createdAt: '2024-10-01',
    photoUrls: ['url1', 'url2'],
    hash: 'hash1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_1'
  },
  {
    id: 'rev2',
    placeId: 'place2',
    playerId: 'player2',
    placeCategory: 'Cafe',
    reviewAuthorNickname: 'CoffeeLover',
    reviewAuthorWisdom: 'Casual Reviewer',
    rating: 4.0,
    categoryRatings: {
      overall: 4,
      location: 4,
      vibe: 4.5,
      price: 3.5,
      quality: 4.2,
      cleanliness: 4.3,
      service: 4.7
    },
    metadata: {
      latitude: 48.8566,
      longitude: 2.3522,
      region: 'Île-de-France',
      country: 'France',
      device: 'Pixel 6'
    },
    text: 'Nice coffee and ambiance.',
    avatarId: 'avatar2',
    likeCount: 90,
    createdAt: '2024-09-28',
    photoUrls: ['url3', 'url4'],
    hash: 'hash2',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_2'
  },
  {
    id: 'rev3',
    placeId: 'place3',
    playerId: 'player3',
    placeCategory: 'Bar',
    reviewAuthorNickname: 'NightOwl',
    reviewAuthorWisdom: 'Frequent Reviewer',
    rating: 3.8,
    categoryRatings: {
      overall: 3.8,
      location: 4,
      vibe: 5,
      price: 3.2,
      quality: 3.8,
      cleanliness: 3.5,
      service: 3.7
    },
    metadata: {
      latitude: 51.5074,
      longitude: -0.1278,
      region: 'London',
      country: 'UK',
      device: 'Samsung S21'
    },
    text: 'Good music, but drinks were overpriced.',
    avatarId: 'avatar3',
    likeCount: 75,
    createdAt: '2024-09-15',
    photoUrls: ['url5', 'url6'],
    hash: 'hash3',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_3'
  },
  {
    id: 'rev4',
    placeId: 'place4',
    playerId: 'player4',
    placeCategory: 'Museum',
    reviewAuthorNickname: 'HistoryBuff',
    reviewAuthorWisdom: 'Informed Reviewer',
    rating: 5.0,
    categoryRatings: {
      overall: 5,
      location: 4.8,
      vibe: 5,
      price: 4.7,
      quality: 5,
      cleanliness: 5,
      service: 4.9
    },
    metadata: {
      latitude: 34.0522,
      longitude: -118.2437,
      region: 'California',
      country: 'USA',
      device: 'iPhone 13'
    },
    text: 'Amazing exhibits and well-maintained.',
    avatarId: 'avatar4',
    likeCount: 200,
    createdAt: '2024-08-22',
    photoUrls: ['url7', 'url8'],
    hash: 'hash4',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_4'
  },
  {
    id: 'rev5',
    placeId: 'place5',
    playerId: 'player5',
    placeCategory: 'Park',
    reviewAuthorNickname: 'NatureLover',
    reviewAuthorWisdom: 'Eco Reviewer',
    rating: 4.8,
    categoryRatings: {
      overall: 4.8,
      location: 5,
      vibe: 4.7,
      price: 4.5,
      quality: 4.8,
      cleanliness: 4.6,
      service: 4.9
    },
    metadata: {
      latitude: 35.6895,
      longitude: 139.6917,
      region: 'Tokyo',
      country: 'Japan',
      device: 'OnePlus 9'
    },
    text: 'Beautiful park with stunning views!',
    avatarId: 'avatar5',
    likeCount: 150,
    createdAt: '2024-07-30',
    photoUrls: ['url9', 'url10'],
    hash: 'hash5',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_5'
  },
  // More reviews follow...
  {
    id: 'rev6',
    placeId: 'place6',
    playerId: 'player6',
    placeCategory: 'Beach',
    reviewAuthorNickname: 'SandyToes',
    reviewAuthorWisdom: 'Beach Enthusiast',
    rating: 4.7,
    categoryRatings: {
      overall: 4.7,
      location: 5,
      vibe: 4.5,
      price: 4.2,
      quality: 4.6,
      cleanliness: 4.7,
      service: 4.8
    },
    metadata: {
      latitude: 37.7749,
      longitude: -122.4194,
      region: 'California',
      country: 'USA',
      device: 'iPhone 12'
    },
    text: 'Sunny and relaxing beach spot!',
    avatarId: 'avatar6',
    likeCount: 130,
    createdAt: '2024-06-15',
    photoUrls: ['url11', 'url12'],
    hash: 'hash6',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_6'
  },
  {
    id: 'rev7',
    placeId: 'place7',
    playerId: 'player7',
    placeCategory: 'Hotel',
    reviewAuthorNickname: 'Globetrotter',
    reviewAuthorWisdom: 'Traveler',
    rating: 3.9,
    categoryRatings: {
      overall: 3.9,
      location: 4.2,
      vibe: 4,
      price: 3.5,
      quality: 3.7,
      cleanliness: 3.8,
      service: 4
    },
    metadata: {
      latitude: 25.276987,
      longitude: 55.296249,
      region: 'Dubai',
      country: 'UAE',
      device: 'Google Pixel 6'
    },
    text: 'Comfortable stay, but could be better.',
    avatarId: 'avatar7',
    likeCount: 60,
    createdAt: '2024-09-10',
    photoUrls: ['url13', 'url14'],
    hash: 'hash7',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_7'
  },
  {
    id: 'rev8',
    placeId: 'place8',
    playerId: 'player8',
    placeCategory: 'Mall',
    reviewAuthorNickname: 'Shopaholic',
    reviewAuthorWisdom: 'Shopping Expert',
    rating: 4.3,
    categoryRatings: {
      overall: 4.3,
      location: 4.5,
      vibe: 4.2,
      price: 3.8,
      quality: 4.4,
      cleanliness: 4.6,
      service: 4.3
    },
    metadata: {
      latitude: 41.9028,
      longitude: 12.4964,
      region: 'Rome',
      country: 'Italy',
      device: 'iPhone 11'
    },
    text: 'Great shopping experience!',
    avatarId: 'avatar8',
    likeCount: 110,
    createdAt: '2024-08-05',
    photoUrls: ['url15', 'url16'],
    hash: 'hash8',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    arweave_tx_id: 'arweave_tx_8'
  }
];
