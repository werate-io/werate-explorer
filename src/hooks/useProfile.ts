import { useQuery } from 'react-query';
import { getUserProfile } from '@/services/userService';
import { Profile } from '@/types/user';

export function useProfile() {
  return useQuery<Profile>(['profile'], () => getUserProfile());
}
