import type { NextApiRequest, NextApiResponse } from 'next';
import { register } from '@/services/auth';
import { RegisterResponse } from '@/types/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const response: RegisterResponse = await register(email, password);
      if (response.success) {
        res.status(201).json({ message: 'User registered successfully' });
      } else {
        res.status(400).json({ error: response.error });
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
