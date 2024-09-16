import React from 'react';
import { UIReview } from '@/types/review';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import ShowMoreText from '@/components/ui/show-more-text';

interface ReviewItemProps {
  review: UIReview;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const renderStars = (starRatings: number) => {
    const totalStars = 5;
    const validStarRatings = Math.max(0, Math.min(totalStars, starRatings)); // Ensure starRatings is between 0 and totalStars
    const fullStars = Math.floor(validStarRatings);
    const emptyStars = totalStars - fullStars;

    return (
      <div className="flex items-center text-yellow-600 space-x-1 sm:space-x-2 md:space-x-3">
        {Array(fullStars)
          .fill('★')
          .map((star, index) => (
            <span key={`full-${index}`} className="text-xs sm:text-sm md:text-base">
              ★
            </span>
          ))}
        {Array(emptyStars)
          .fill('☆')
          .map((star, index) => (
            <span key={`empty-${index}`} className="text-xs sm:text-sm md:text-base text-gray-400">
              ☆
            </span>
          ))}
      </div>
    );
  };
  return (
    <li key={review.id}>
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
              <Box className="text-center md:text-left mt-2 sm:mt-0 p-2">
                <CardTitle className="text-sm sm:text-sm md:text-md lg:text-lg">
                  {review.venueLocation.name}
                </CardTitle>
                <CardDescription>
                  {`${review.venueLocation.type}, ${review.venueLocation.country}`}
                </CardDescription>
              </Box>
            </Flex>

            {/* Rating and Timestamp */}
            <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
              <div className="flex items-center">{renderStars(review.starRatings)}</div>
              <div className="flex h-5 items-center space-x-2 md:space-x-4 text-xs md:text-sm">
                <p className="text-xs md:text-sm text-muted-foreground">{review.timestamp}</p>
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
  );
};

export default ReviewItem;
