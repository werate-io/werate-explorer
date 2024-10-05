import type { NextApiRequest, NextApiResponse } from 'next';
import instance from '@/services/werate-api';
import { setCookie } from 'cookies-next';
import { getUserId } from '@/services/userService';
import { useUserStore } from '@/zustand/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const response = await instance.post(`/api/v2/login`, { email, password });
      if (response.data) {
        setCookie('authToken', response.data.accessToken, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
          secure: true
        });
        const profile = await getUserId();
        const setProfile = useUserStore.getState().setProfile;
        setProfile(profile);
        res.status(200).json({ accessToken: response.data.accessToken });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
