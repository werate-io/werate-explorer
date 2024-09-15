import { NextApiRequest, NextApiResponse } from 'next';
import { getReviews } from '@/services/reviewService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { page = 1, take = 3 } = req.query;
            const reviews = await getReviews(Number(page), Number(take));
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}