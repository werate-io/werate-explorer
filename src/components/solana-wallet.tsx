import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { decodeUTF8 } from 'tweetnacl-util';
import bs58 from 'bs58';
import { postData } from '../services/werate-api';

interface WalletLinkResponse {
  data: {
    success: boolean;
    message?: string;
  };
}

const SolanaWallet = () => {
  const { publicKey, connected, signMessage, disconnect } = useWallet();
  const [isSolanaAuthenticated, setIsSolanaAuthenticated] = useState(false);
  const [attemptedSign, setAttemptedSign] = useState(false); // New state to prevent multiple alerts

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsSolanaAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!attemptedSign && isSolanaAuthenticated && connected) {
      sign();
      setAttemptedSign(true); // Set flag to prevent repeated attempts
    }
  }, [connected, publicKey, signMessage, isSolanaAuthenticated, attemptedSign]);

  const sign = async () => {
    if (!connected || !publicKey || !signMessage) {
      if (!attemptedSign) {
        alert('Please select a wallet!');
      }
      return;
    }

    const message = 'WeRate';
    try {
      const signature = await signMessage(decodeUTF8(message));

      const data = JSON.stringify({
        message,
        signature: bs58.encode(signature),
        publicKey: publicKey.toString()
      });
      const response = await postData<WalletLinkResponse>('/api/v1/wallets/link', data);

      if (response && response.data.success) {
        alert('Wallet is connected to your profile!');
      } else {
        disconnect();
        alert(response?.data?.message || 'An error occurred');
      }
    } catch (error) {
      setAttemptedSign(false);
      disconnect();
      console.error('Failed to sign the message:', error);
      alert('Failed to sign the message. Please try again.');
    }
  };

  return (
    <>
      {isSolanaAuthenticated && (
        <div style={{ position: 'absolute', top: 5, right: 5, zIndex: 1000 }}>
          <WalletMultiButton />
        </div>
      )}
    </>
  );
};

export default SolanaWallet;
