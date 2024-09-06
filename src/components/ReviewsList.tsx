import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UIReview {
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

interface Review {
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

const ReviewsList: React.FC = () => {
    const [reviews, setReviews] = useState<UIReview[]>([]);
    const [skip, setSkip] = useState(0);
    const [take] = useState(10); // Number of items per page
    const [loading, setLoading] = useState(false);
    const [expandedReview, setExpandedReview] = useState(null);


    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/v1/game/players/reviews?skip=${skip}&take=${take}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                const reviewsData: Review[] = response.data.content;
                const transformedReviews = await Promise.allSettled(reviewsData.map(async (review) => {
                    if (!review.placeId) return null;

                    try {
                        const placeResponse = await axios.get(`/api/v1/places/${review.placeId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                        });

                        if (placeResponse.status === 200) {
                            const placeData = placeResponse.data;

                            const uiReview: UIReview = {
                                id: review.id,
                                description: review.text,
                                starRatings: review.rating || 0, // Ensure rating is a valid number
                                photos: review.photoUrls,
                                // convert createdAt to a human-readable date
                                timestamp: new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }),
                                biometricsHash: '', // Assuming this needs to be fetched from another API
                                userId: review.reviewAuthorNickname || '',
                                bohemianId: '', // Assuming this needs to be fetched from another API
                                venueLocation: {
                                    name: placeData.details.name,
                                    country: placeData.details.address,
                                    type: placeData.details.category,
                                    lat: placeData.details.geocodes.main.latitude,
                                    long: placeData.details.geocodes.main.longitude,
                                },
                                device: review.avatarId, // Assuming this is the device info
                            };

                            return uiReview;
                        }
                    } catch (error) {
                        console.error(`Error fetching place data for placeId ${review.placeId}:`, error);
                        return null;
                    }
                }));

                const validReviews = transformedReviews
                    .filter(result => result.status === 'fulfilled' && result.value !== null)
                    .map(result => (result as PromiseFulfilledResult<UIReview>).value);

                setReviews(prevReviews => [...prevReviews, ...validReviews]);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [skip, take]);

    const loadMoreReviews = () => {
        setSkip(prevSkip => prevSkip + take);
    };

    const toggleReadMore = (index) => {
        setExpandedReview(expandedReview === index ? null : index);
    };

    const renderStars = (starRatings: number) => {
        const totalStars = 5;
        const validStarRatings = Math.max(0, Math.min(totalStars, starRatings)); // Ensure starRatings is between 0 and totalStars
        const fullStars = Math.floor(validStarRatings);
        const emptyStars = totalStars - fullStars;

        return (
            <div className="flex items-center text-yellow-600 space-x-1">
                {Array(fullStars).fill('★').map((star, index) => (
                    <span key={`full-${index}`} className="text-xs">★</span>
                ))}
                {Array(emptyStars).fill('☆').map((star, index) => (
                    <span key={`empty-${index}`} className="text-xs text-gray-400">☆</span>
                ))}
            </div>
        );
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
                    <button type="button" className="bg-primary text-white py-2 px-4 rounded inline-flex items-center" disabled>
                        Loading
                        <svg className="animate-spin h-5 w-5 ml-3 text-white" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
                            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="url(#gradient)" />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#A0AEC0', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                        </svg>
                    </button>
                </div>
            )}
            {!loading && (
                <div className="reviews-list-container p-8 bg-white">
                    <h2 className="text-4xl font-semibold text-black mb-6">Ratings & Reviews</h2>
                    <div className="flex justify-center items-center">
                        <div className="total-reviews-container flex flex-col items-center bg-white p-4 mb-4 rounded-lg shadow-lg relative w-40 h-40">
                            <h3 className="text-lg lg:text-lg font-bold mb-2">Total Reviews</h3>
                            <span className="text-6xl font-bold text-purple-600">{reviews.length}</span>
                        </div>
                    </div>
                    <ul className="space-y-6">
                        {reviews.map((review, index) => (
                            <li key={review.id || index} className="p-4 bg-[#EFE5FF] bg-opacity-100 rounded-lg shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-white">{review.userId}</span>
                                        <span className="lg:text">{review.venueLocation.name}</span>
                                        <span className="text-sm text-gray-400">{review.venueLocation.type}</span>
                                        {renderStars(review.starRatings)}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">{review.timestamp}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-1xl lg:text-1xl font-bold">
                                    {expandedReview === index ? review.description : `${review.description.substring(0, 200)}...`}
                                {review.description.length > 200 && (
                                    <span
                                        onClick={() => toggleReadMore(index)}
                                        className="text-purple-500 cursor-pointer"
                                    >
                                        {expandedReview === index ? ' Show less' : ' Read more'}
                                    </span>
                                )}
                                    </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    <p>
                                        Location: {review.venueLocation.country}
                                        (Lat: {review.venueLocation.lat}, Long: {review.venueLocation.long})
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={loadMoreReviews}
                            disabled={loading}
                            className="px-6 py-2 bg-purple-700 text-white font-semibold rounded hover:bg-purple-900"
                        >
                            Load More
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;