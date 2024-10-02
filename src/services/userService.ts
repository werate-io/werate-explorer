import { getData } from './werate-api';
import { Profile } from '@/types/user';

export async function getUserProfile(): Promise<Profile> {
  return await getData<Profile>('/api/v1/users/me/profile');
}
