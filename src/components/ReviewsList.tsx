import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, Flex, Badge, Button, Spinner } from '@shadcn/ui';

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
    const [expandedReview, setExpandedReview] = useState<number | null>(null);

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

    const toggleReadMore = (index: number) => {
        setExpandedReview(expandedReview === index ? null : index);
    };

    const renderStars = (starRatings: number) => {
        const totalStars = 5;
        const validStarRatings = Math.max(0, Math.min(totalStars, starRatings)); // Ensure starRatings is between 0 and totalStars
        const fullStars = Math.floor(validStarRatings);
        const emptyStars = totalStars - fullStars;

        return (
            <Flex align="center" color="yellow.600" spacing="1">
                {Array(fullStars).fill('★').map((star, index) => (
                    <Text key={`full-${index}`} size="xs">★</Text>
                ))}
                {Array(emptyStars).fill('☆').map((star, index) => (
                    <Text key={`empty-${index}`} size="xs" color="gray.400">☆</Text>
                ))}
            </Flex>
        );
    };

    return (
        <Box p="8" bg="white" minH="screen" display="flex" alignItems="center" justifyContent="center">
            {loading ? (
                <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center" bg="gray.100" bgOpacity="75" zIndex="50">
                    <Button variant="primary" disabled>
                        Loading
                        <Spinner ml="3" />
                    </Button>
                </Box>
            ) : (
                <Box className="reviews-list-container" p="8" bg="white">
                    <Heading size="2xl" mb="6">Ratings & Reviews</Heading>
                    <Flex justify="center" align="center">
                        <Card w="40" h="40" p="4" mb="4" rounded="lg" shadow="lg" bg="white">
                            <CardHeader>
                                <Heading size="lg" mb="2">Total Reviews</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text size="4xl" color="purple.600">{reviews.length}</Text>
                            </CardBody>
                        </Card>
                    </Flex>
                    <Box spacing="6">
                        {reviews.map((review, index) => (
                            <Card key={review.id || index} p="4" bg="#EFE5FF" rounded="lg" shadow="lg">
                                <CardHeader>
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Heading size="xl" color="white">{review.userId}</Heading>
                                            <Text>{review.venueLocation.name}</Text>
                                            <Text size="sm" color="gray.400">{review.venueLocation.type}</Text>
                                            {renderStars(review.starRatings)}
                                        </Box>
                                        <Text size="sm" color="gray.400">{review.timestamp}</Text>
                                    </Flex>
                                </CardHeader>
                                <CardBody mt="4">
                                    <Text size="xl" fontWeight="bold">
                                        {expandedReview === index ? review.description : `${review.description.substring(0, 200)}...`}
                                        {review.description.length > 200 && (
                                            <Text
                                                onClick={() => toggleReadMore(index)}
                                                color="purple.500"
                                                cursor="pointer"
                                            >
                                                {expandedReview === index ? ' Show less' : ' Read more'}
                                            </Text>
                                        )}
                                    </Text>
                                </CardBody>
                                <CardFooter mt="2">
                                    <Text size="sm" color="gray.400">
                                        Location: {review.venueLocation.country}
                                        (Lat: {review.venueLocation.lat}, Long: {review.venueLocation.long})
                                    </Text>
                                </CardFooter>
                            </Card>
                        ))}
                    </Box>
                    <Flex justify="center" mt="6">
                        <Button
                            onClick={loadMoreReviews}
                            disabled={loading}
                            variant="primary"
                        >
                            Load More
                        </Button>
                    </Flex>
                </Box>
            )}
        </Box>
    );
};

export default ReviewsList;