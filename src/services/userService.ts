import { getData } from './werate-api';
import { Profile, ProfileMe } from '@/types/user';

export async function getUserProfile(): Promise<Profile> {
  return await getData<Profile>('/api/v1/users/me/profile');
}

export async function getUserId(): Promise<ProfileMe> {
  return await getData<ProfileMe>('/api/v1/users/me'); // Ensure this endpoint is correct
}
