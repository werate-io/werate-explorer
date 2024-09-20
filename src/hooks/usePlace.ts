import { useQuery } from 'react-query';
import { getPlaceById } from '@/services/placeService';
import { Place } from '@/types/place';

export function usePlace(placeId: string) {
  return useQuery<Place>(['place', placeId], () => getPlaceById(placeId));
}
