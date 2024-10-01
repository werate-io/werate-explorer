import {hashReview} from '../utils/hashing'
import {Review} from '../schemas/ReviewSchema';
import {PlaceDetails} from '../schemas/PlaceDetailsSchema';
import { getTransaction } from 'arweavekit/transaction'

export interface GetTransactionProps {
    transactionId: string;
    environment: 'local' | 'mainnet';
}

export const reviewVerify = async (review: Review, userId: string, images: string[], placeDetails: PlaceDetails, arweave_tx_id: string) => {
    const reviewHash = hashReview(review, userId, images, placeDetails);
    const params: GetTransactionProps = {
        transactionId: arweave_tx_id,
        environment: 'mainnet'
    };

    try {
        const data = await getTransaction(params);
    
        if(data.transaction.hash == reviewHash) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
    
};