import { hashReview } from '../utils/hashing';
import { Review } from '../types/review';

export interface GetTransactionProps {
  transactionId: string;
  environment: 'local' | 'mainnet';
}

export const reviewVerify = async (review: Review) => {
  const reviewHash = hashReview(review);

  try {
    if (reviewHash) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
