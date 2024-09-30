import { useQuery } from 'react-query';
import { getPlaceById } from '@/services/placeService';
import type { Place } from '@/types/place';
import type { ActionResponse } from '@/types/actions';

export function usePlace(placeId: string) {
  return useQuery<ActionResponse<Place>>(['place', placeId], () => getPlaceById(placeId));
}
