import { ActionResponse } from '@/types/actions';
import instance from './werate-api';
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postWalletLink(data: object): Promise<ActionResponse<any>> {
  const response = await instance.post<any>('/api/v1/wallets/link', data);
  return { data: response.data } as ActionResponse<any>;
}
