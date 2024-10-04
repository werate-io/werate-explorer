'use client';

import React, { useRef, useState } from 'react';
import { Review } from '@/types/review';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/DialogShad';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/Carousel';
import { Check, Loader2, StarIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { MapPin } from 'lucide-react';
import { useReviewStore } from '@/zustand/store';
import 'leaflet/dist/leaflet.css';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const { setSelectedReview } = useReviewStore();
  const mapRef = useRef<L.Map | null>(null); // Ensure mapRef is initialized

  const handleMapPinClick = () => {
    setSelectedReview(review as unknown as Review);
    if (mapRef.current) {
      const map = mapRef.current;
      map.flyTo([review.metadata.latitude, review.metadata.longitude], 15, {
        animate: true,
        duration: 1.5
      });
    } else {
      console.error('Map reference is not set.'); // Log error if mapRef is null
    }
  };

  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add state for dialog

  function renderStars(starRatings: number) {
    const totalStars = 5;
    const validStarRatings = Math.max(0, Math.min(totalStars, starRatings));
    const fullStars = Math.floor(validStarRatings);
    const hasHalfStar = validStarRatings % 1 >= 0.5;

    return (
      <div className="flex items-center space-x-0.5">
        {[...Array(totalStars)].map((_, index) => (
          <StarIcon
            key={index}
            color="#6e1fed"
            size={16}
            className={`w-4 h-4 ${
              index < fullStars
                ? 'text-[#6e1fed] fill-[#6e1fed]'
                : index === fullStars && hasHalfStar
                  ? 'text-purple-400 fill-purple-400 half-star'
                  : 'text-purple-400'
            }`}
          />
        ))}
      </div>
    );
  }

  async function handleVerify() {
    setIsVerifying(true);
    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsVerified(true);
    setIsVerifying(false);
  }

  async function handleMintNFT() {
    setIsMinting(true);
    try {
      // TODO: Implement actual minting logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating minting process
      setIsMinted(true);
    } catch (error) {
      console.error('Minting failed:', error);
      // TODO: Handle error (e.g., show error message to user)
    } finally {
      setIsMinting(false);
    }
  }

  const handleVerifyClick = () => {
    handleVerify(); // Call the verify function
    setIsDialogOpen(true); // Open the dialog after verification
  };

  const ReviewSummary = () => (
    <>
      <Flex gap="3" align="center" justify="between" className="flex-col sm:flex-row">
        <Flex gap="2" align="center" className="flex-col sm:flex-row">
          <Avatar className="w-12 h-12 bg-purple-500 text-white">
            <span className=" text-white text-xl font-semibold">{review.metadata.name}</span>
          </Avatar>
          <Box className="text-center sm:text-left mt-2 sm:mt-0">
            <CardTitle className="text-sm sm:text-base md:text-lg">
              {review.metadata.name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              <div className="flex items-center text-sm text-gray-500">
                {review.metadata.category}, {review.metadata.region}, {review.metadata.country}
              </div>{' '}
            </CardDescription>
          </Box>
        </Flex>

        <div className="flex flex-col items-center sm:items-end mt-2 sm:mt-0">
          {renderStars(review.rating)}
          <p className="text-xs sm:text-sm text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>
      </Flex>
      <div>
        <div className="mt-4 flex justify-between">
          {' '}
          {/* Existing parent div */}
          <div>
            {' '}
            {/* Added parent div for buttons */}
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => handleMapPinClick()}>
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>{' '}
          {/* Closing parent div for View on Map */}
          <div>
            {' '}
            {/* Added parent div for Verify button */}
            <Button onClick={() => handleVerifyClick()}>Verify</Button>
          </div>{' '}
          {/* Closing parent div for Verify */}
        </div>
      </div>
    </>
  );

  const ReviewSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2">
        <Skeleton className="h-[200px] w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );

  const FullReviewContent = () => (
    <>
      {isVerifying && <ReviewSkeleton />}
      {!isVerified && !isVerifying && (
        <Button onClick={() => handleVerify()} className="w-full mt-4">
          Verify Review
        </Button>
      )}
      {isVerified && (
        <>
          <p className="text-xs sm:text-base md:text-md lg:text-sm xl:text-base text-muted-foreground mt-2 break-words whitespace-normal overflow-wrap-anywhere">
            {review.text}
          </p>
          {review.images.length > 0 && (
            <Carousel className="w-full max-w-xs mx-auto mt-4">
              <CarouselContent>
                {review.images.map((src, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={src}
                        alt={`${review.metadata.name} photo ${index + 1}`}
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
          {!isMinted && (
            <Button onClick={handleMintNFT} className="w-full mt-4" disabled={isMinting}>
              {isMinting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Minting...
                </>
              ) : (
                'Mint as NFT'
              )}
            </Button>
          )}
          {isMinted && (
            <div className="flex items-center justify-center w-full mt-4 p-2 bg-green-100 text-green-700 rounded-md">
              <Check className="mr-2" />
              Successfully minted as NFT
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <Card
        className="p-3 sm:p-4 bg-purple-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => setSelectedReview(review)}>
        <CardHeader className="p-2">
          <ReviewSummary />
        </CardHeader>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {' '}
        {/* Update Dialog component */}
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] w-[90vw] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto">
            <ReviewSummary />
            <FullReviewContent />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewItem;
