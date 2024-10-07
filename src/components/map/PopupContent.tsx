'use client';
import React from 'react'; // Ensure React is imported
import { useState } from 'react';
import { Star, MapPin, Clock, MessageSquare, Loader } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/Carousel';
import { usePlace, useReviewsByPlaceId } from '@/hooks/usePlace';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { formatDistanceToNow } from 'date-fns';

const Feature = ({ label }: { label: string }) => (
  <div className="flex items-center space-x-2">
    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span>{label}</span>
  </div>
);

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);
// export default function PopupContent({ placeId, onClick }: { placeId: string; onClick: () => void }) {
const PopupContent = ({ placeId }: { placeId: string }) => {
  const [isOpen] = useState(true);
  const { data: placeData } = usePlace(placeId);
  const { data: reviewsByPlaceId, isLoading: isReviewsByPlaceIdLoading } =
    useReviewsByPlaceId(placeId);
  // New loading state check
  const isPlaceDataLoading = true;
  if (isPlaceDataLoading || isReviewsByPlaceIdLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Loader /> {/* Replace with your spinner component */}
      </div>
    );
  }
  if (!isOpen) return null;

  return (
    <Card className="rounded-t-xl overflow-hidden max-h-[90vh] overflow-y-auto animate-slide-up shadow-lg">
      <CardContent className="p-0">
        <div className="relative">
          {/* carousel of photo */}
          {placeData?.details.photos && placeData?.details.photos.length > 0 && (
            <Carousel className="w-full mt-4">
              <CarouselContent>
                {placeData?.details.photos.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={src}
                        alt={`${placeData?.details.name} photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}

          {/*  <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white rounded-full"
            onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button> */}
          <div className="absolute bottom-2 left-2 bg-gray-900 text-white px-2 py-1 rounded">
            {placeData?.details.photos.length === 1
              ? `${placeData?.details.photos.length} photo`
              : `${placeData?.details.photos.length} photos`}
          </div>
        </div>
        <div className="p-4 space-y-1">
          <CardHeader className="p-0">
            <CardTitle>{placeData?.details.name}</CardTitle>
            {/* <p className="text-gray-500">{placeData?.details.category}</p> */}
          </CardHeader>
          <div className="flex items-center space-x-2">
            <RatingStars rating={placeData?.summary.overallRating ?? 0} />
            <span className="text-sm text-gray-500">({placeData?.summary.reviewsCount})</span>
          </div>
          <p className="text-sm text-gray-500">{placeData?.details.category}</p>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-2 mt-4">
                {placeData?.details.types.map((feature: string) => (
                  <Feature key={feature} label={feature} />
                ))}
              </div>
              <div className="flex items-start space-x-2 mt-4">
                <MapPin className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <p className="text-xs sm:text-base md:text-md lg:text-sm xl:text-base text-muted-foreground break-words whitespace-normal overflow-wrap-anywhere">
                  {placeData?.details.location.address}, {placeData?.details.location.locality},{' '}
                  {placeData?.details.location.country}
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-green-600 font-medium">
                  {placeData?.details.openingHours.display}
                </span>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">
                    {placeData?.summary.reviewsCount} reviews
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    {placeData?.summary.checkinsCount} check-ins
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              {reviewsByPlaceId?.content.map((review) => (
                <div key={review.id} className="space-y-4">
                  <div className="flex flex-row items-start space-x-4">
                    {/* I want border for avatar rounded */}
                    <Avatar className="w-10 h-10 border-2 border-purple-300 rounded-full">
                      <AvatarImage
                        src="https://robohash.org/mail@ashallendesign.co.uk"
                        alt={review.reviewAuthorNickname ?? ''}
                      />
                      <AvatarFallback>
                        {review.reviewAuthorNickname && (
                          <>
                            {review.reviewAuthorNickname.charAt(0)}
                            {review.reviewAuthorNickname.split(' ')[1]?.charAt(0)}
                          </>
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{review.reviewAuthorNickname}</h3>
                      {/* TODO: Add review count and photos count of user */}
                      <div className="items-center mt-1">
                        <RatingStars rating={review.rating} />
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-base md:text-md lg:text-sm xl:text-base text-muted-foreground mt-2 break-words whitespace-normal overflow-wrap-break-word line-clamp-3">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopupContent;
