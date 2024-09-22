import { Place } from '@/types/place';
import { getData } from '@/services/werate-api';

export async function getPlaceById(placeId: string): Promise<Place> {
  const response = await getData(`/places/${placeId}`);
  if (!response.ok) throw new Error('Failed to fetch place');
  return response.json();
}
