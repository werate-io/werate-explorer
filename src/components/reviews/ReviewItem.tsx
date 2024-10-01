'use client';

import React, { useState } from 'react';
import { UIReview, VerifyReview } from '@/types/review';
import { PlaceDetails } from '@/types/place';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { Flex } from '@/components/ui/Flex';
import { Box } from '@/components/ui/Box';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/DialogShad';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/Carousel';
import { Star, Check, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWallet } from '@solana/wallet-adapter-react';
import { reviewMint } from '../../services/ReviewMint';
import { reviewVerify } from '../../services/ReviewVerify';

interface ReviewItemProps {
  review: UIReview;
  verifyReview: VerifyReview;
  placeDetails: PlaceDetails;
}

export function ReviewItem({ review, verifyReview, placeDetails }: ReviewItemProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const wallet = useWallet();

  function renderStars(starRatings: number) {
    const totalStars = 5;
    const validStarRatings = Math.max(0, Math.min(totalStars, starRatings));
    return (
      <div className="flex items-center space-x-1">
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < validStarRatings ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  }

  async function handleVerify() {
    setIsVerifying(true);
    const verify_result = await reviewVerify(
      verifyReview,
      review.userId,
      review.photos,
      placeDetails,
      review.arweave_tx_id
    );
    if (verify_result) {
      setIsVerified(true);
      setIsVerifying(false);
    } else {
      alert('Verify failed');
    }
  }

  async function handleMintNFT() {
    setIsMinting(true);
    const mint_result = await reviewMint(review.id, review.hash, wallet);
    if (mint_result) {
      setIsMinted(true);
    } else {
      alert('Minting failed');
    }
  }

  const ReviewSummary = () => (
    <Flex gap="3" align="center" justify="between" className="flex-col md:flex-row">
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

      <div className="flex flex-col items-center md:items-start mt-2 md:mt-0">
        {renderStars(review.starRatings)}
        <p className="text-xs md:text-sm text-muted-foreground">{review.timestamp}</p>
      </div>
    </Flex>
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
        <Button onClick={handleVerify} className="w-full mt-4">
          Verify Review
        </Button>
      )}
      {isVerified && (
        <>
          <p className="text-xs sm:text-base md:text-md lg:text-sm xl:text-base text-muted-foreground mt-2">
            {review.description}
          </p>
          <Carousel className="w-full max-w-xs mx-auto mt-4">
            <CarouselContent>
              {review.photos.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <img
                      src={src}
                      alt={`${review.venueLocation.name} photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
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
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-3 sm:p-4 md:p-6 bg-[#EFE5FF] rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
          <CardHeader className="p-2">
            <ReviewSummary />
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        <ReviewSummary />
        <FullReviewContent />
      </DialogContent>
    </Dialog>
  );
}

export default ReviewItem;
