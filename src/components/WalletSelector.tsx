'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/Button';

interface WalletSelectorProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function WalletSelector({ isOpen, setIsOpen }: WalletSelectorProps) {
  const { wallet, disconnect } = useWallet();

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {wallet ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 hidden md:inline">
            {wallet.adapter.name}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              disconnect();
              setIsOpen(false);
            }}
            className="text-xs md:text-sm">
            Disconnect
          </Button>
        </div>
      ) : (
        <WalletMultiButton className="!bg-primary hover:!bg-primary-dark text-white font-bold py-2 px-4 rounded text-xs md:text-sm" />
      )}
    </div>
  );
}
