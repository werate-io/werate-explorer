import { ActionResponse } from '@/types/actions';
import { postData } from './werate-api';
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function postWalletLink(data: object): Promise<ActionResponse<any>> {
  const result = await postData<any>('/api/v1/wallets/link', data);
  return { data: result } as ActionResponse<any>;
}
