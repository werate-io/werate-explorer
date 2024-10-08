import { WalletReadyState } from '@solana/wallet-adapter-base';
import type { Wallet } from '@solana/wallet-adapter-react';
import type { FC, MouseEventHandler } from 'react';
import React from 'react';
import { Button } from './Button';
import { WalletIcon } from './WalletIcon';

export interface WalletListItemProps {
  handleClick: MouseEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  wallet: Wallet;
}

export const WalletListItem: FC<WalletListItemProps> = ({ handleClick, tabIndex, wallet }) => {
  return (
    <li>
      <Button onClick={handleClick} startIcon={<WalletIcon wallet={wallet} />} tabIndex={tabIndex}>
        {wallet.adapter.name && typeof wallet.adapter.name === 'string' ? (
          <span>{wallet.adapter.name}</span>
        ) : (
          <span>Unknown Wallet</span>
        )}

        {wallet.readyState === WalletReadyState.Installed ? (
          <span>Detected</span>
        ) : wallet.adapter.name == 'Solflare' ? (
          <span>Preferred</span>
        ) : (
          ''
        )}
      </Button>
    </li>
  );
};
