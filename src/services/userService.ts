import { getData } from './werate-api';
import { Profile } from '@/types/user';

export async function getUserProfile( ): Promise<Profile> {
  const response = await getData('/api/v1/users/me/profile');
  console.log(response);
  return response as Profile;
}
