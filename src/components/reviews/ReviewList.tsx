import React, { useState } from 'react';
import Error from 'next/error';
import ReviewItem from '@/components/reviews/ReviewItem';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';
import { Spinner } from "@/components/ui/spinner";
import { useTransformedReviews } from "@/hooks/useTransformedReviews";
import * as constants from "@/lib/constants";

const ReviewsList: React.FC = () => {
    const take = constants.TAKE;
    const [currentPage, setCurrentPage] = useState(1);
    const { reviews, totalReviews, isLoading, error } = useTransformedReviews(currentPage, take);

    const totalPages = Math.ceil(totalReviews / take);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (error) return <Error statusCode={500} title="Error loading reviews" />;
    return (
        isLoading ?
            (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Spinner size="medium" borderColor="rgba(239, 229, 255, 0.5)" />
            </div>)
            : (<div>
                    <ul className="space-y-4 sm:space-y-6 md:space-y-8 flex-grow">
                        {reviews.map((review, index) => (
                            <ReviewItem key={`${review.id}-${index}`} review={review} />
                        ))}
                    </ul>
                    <div className="flex w-full items-center justify-center mt-4 sm:mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            if (currentPage === 1) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            } else {
                                                handlePageChange(currentPage - 1);
                                            }
                                        }}
                                        className={currentPage === 1 ? 'disabled' : ''}
                                    />
                                </PaginationItem>
                                {Array(totalPages).fill('').map((_, index) => (
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
                                    <PaginationNext
                                        href="#"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )
    );
};

export default ReviewsList;