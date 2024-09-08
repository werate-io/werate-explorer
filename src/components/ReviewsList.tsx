"use client";
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from './ui/card';
import { Spinner } from './ui/spinner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from './ui/pagination';
import { Flex } from './ui/flex';
import { Box } from './ui/box';
import ShowMoreText from './ui/show-more-text';

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
    const [take] = useState(3); // Number of items per page
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [currentPage, skip]);

    const fetchReviews = async () => {
        setLoading(true);
        setReviews([]); // Clear the reviews state before fetching new data
        try {
            const response = await axios.get(`/api/v1/game/players/reviews?skip=${skip}&take=${take}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const reviewsData: Review[] = response.data.content;
            setTotalReviews(response.data.total_elements); // Set total number of reviews
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
                                country: (() => {
                                    const lastSpaceIndex = placeData.details.address.lastIndexOf(' ');
                                    return lastSpaceIndex !== -1 ? placeData.details.address.substring(lastSpaceIndex + 1).trim() : '';
                                })(), type: placeData.details.category,
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

            setReviews(validReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSkip((page - 1) * take);
    };

    const renderStars = (starRatings: number) => {
        const totalStars = 5;
        const validStarRatings = Math.max(0, Math.min(totalStars, starRatings)); // Ensure starRatings is between 0 and totalStars
        const fullStars = Math.floor(validStarRatings);
        const emptyStars = totalStars - fullStars;

        return (
            <div className="flex items-center text-yellow-600 space-x-1 sm:space-x-2 md:space-x-3">
                {Array(fullStars).fill('★').map((star, index) => (
                    <span key={`full-${index}`} className="text-xs sm:text-sm md:text-base">★</span>
                ))}
                {Array(emptyStars).fill('☆').map((star, index) => (
                    <span key={`empty-${index}`} className="text-xs sm:text-sm md:text-base text-gray-400">☆</span>
                ))}
            </div>
        );
    };
    
    if (!isAuthenticated) {
        return <div>Please log in to view reviews.</div>;
    }
    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {loading &&
                <Spinner size="medium" borderColor="rgba(239, 229, 255, 0.5)" />
            }
            {!loading && (
                <div className="reviews-list-container w-full h-full p-4 sm:p-8 bg-white flex flex-col">
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black mb-4 sm:mb-6">Ratings & Reviews</h2>
                    <div className="flex justify-center items-center mb-4 sm:mb-6">
                        <div className="total-reviews-container flex flex-col items-center bg-white p-4 rounded-lg shadow-lg sm:shadow-md md:shadow-lg w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 md:mb-3 text-center md:text-left">Total Reviews</h3>
                            <span className="text-3xl sm:text-4xl md:text-6xl font-bold text-purple-600">{totalReviews}</span>
                        </div>
                    </div>
                    <ul className="space-y-4 sm:space-y-6 md:space-y-8 flex-grow">
                        {reviews.map((review, index) => (
                            <li key={`${review.id}-${index}`}>
                                <Card className="p-3 sm:p-4 md:p-6 bg-[#EFE5FF] rounded-lg shadow-lg">
                                    <CardHeader className="p-2">
                                        <Flex gap="3" align="center" justify="between" className="flex-col md:flex-row">
                                            {/* Avatar and Venue Information */}
                                            <Flex gap="2" align="center" className="flex-col md:flex-row">
                                                <Avatar>
                                                    <AvatarImage src={review.photos[0]} alt={review.venueLocation.name} />
                                                    <AvatarFallback>
                                                        {review.venueLocation.name && (
                                                            <>
                                                                {review.venueLocation.name.charAt(0)}
                                                                {review.venueLocation.name.split(' ')[1]?.charAt(0)}
                                                            </>
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Box className="text-center md:text-left mt-2 sm:mt-0">
                                                    <CardTitle className="text-sm sm:text-sm md:text-md lg:text-lg">{review.venueLocation.name}</CardTitle>
                                                    <CardDescription>
                                                        {`${review.venueLocation.type}, ${review.venueLocation.country}`}
                                                    </CardDescription>
                                                </Box>
                                            </Flex>

                                            {/* Rating and Timestamp */}
                                            <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
                                                <div className="flex items-center">
                                                    {renderStars(review.starRatings)}
                                                </div>
                                                <div className="flex h-5 items-center space-x-2 md:space-x-4 text-xs md:text-sm">
                                                    <p className="text-xs md:text-sm text-muted-foreground">
                                                        {review.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        </Flex>
                                    </CardHeader>
                                    <CardContent className="p-2">
                                        <p className="text-xs sm:text-base md:text-md lg:text-sm xl:text-base text-muted-foreground mt-2">
                                            <ShowMoreText
                                                text={review.description}
                                                maxLength={100}
                                                className="inline"
                                                style={{ display: 'inline' }}
                                            />
                                        </p>
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                    </ul>
                    <div className="flex w-full items-center justify-center mt-4 sm:mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} />
                                </PaginationItem>
                                {Array(Math.ceil(totalReviews / take)).fill('').map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href="#"
                                            onClick={() => handlePageChange(index + 1)}
                                            className={currentPage === index + 1 ? 'bg-primary text-white' : ''}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsList;