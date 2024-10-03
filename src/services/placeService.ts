import { Place } from '@/types/place';
import { getData } from '@/services/werate-api';

export async function getPlaceById(placeId: string): Promise<Place> {
  return await getData<Place>(`/api/v1/places/${placeId}`);
}
