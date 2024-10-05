import { Place } from '@/types/place';
import instance from './werate-api';

export async function getPlaceById(placeId: string): Promise<Place> {
  const response = await instance.get<Place>(`/api/v1/places/${placeId}`);
  return response.data;
}
