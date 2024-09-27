import { ActionResponse } from '@/types/actions';
import { Place } from '@/types/place';
import { getData } from './werate-api';

export async function getPlaceById(placeId: string): Promise<ActionResponse<Place>> {
  const place = await getData<Place>(`/places/${placeId}`);
  return { data: place } as ActionResponse<Place>;
}
