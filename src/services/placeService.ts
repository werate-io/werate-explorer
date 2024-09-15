import apiClient from './apiClient';
import { Place } from '@/types/place';

export async function getPlaceById(placeId: string): Promise<Place> {
    try {
        const response = await apiClient.get(`/places/${placeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching place with ID ${placeId}:`, error);
        throw new Error('Failed to fetch place data. Please try again later.');
    }
}