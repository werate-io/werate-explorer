import { hashReview } from '../utils/hashing';
import { UIReview } from '../types/review';
import { getTransaction } from 'arweavekit/transaction';

export interface GetTransactionProps {
  transactionId: string;
  environment: 'local' | 'mainnet';
}

export const reviewVerify = async (review: UIReview) => {
  const reviewHash = hashReview(review);
  const params: GetTransactionProps = {
    transactionId: review.arweave_tx_id,
    environment: 'mainnet'
  };

  try {
    const data = await getTransaction(params);
    if (data.transaction.hash == reviewHash) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
