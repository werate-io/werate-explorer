import instance from './werate-api';
import { Profile, ProfileMe } from '@/types/user';

export async function getUserProfile(): Promise<Profile> {
  const response = await instance.get<Profile>('/api/v1/users/me/profile');
  return response.data;
}
export async function getUserId(): Promise<ProfileMe> {
  const response = await instance.get<ProfileMe>('/api/v1/users/me'); // Ensure this endpoint is correct
  return response.data;
}
