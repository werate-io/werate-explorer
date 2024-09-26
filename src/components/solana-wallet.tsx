import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, useCallback } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { decodeUTF8 } from "tweetnacl-util";
import bs58 from 'bs58';
import { postData } from "../services/werate-api";

const PublicKey = () => {
  const { publicKey } = useWallet();

  return (
    <p>{publicKey ? `Public Key: ${publicKey.toBase58()}` : `Not Connected`}</p>
  );
};

const SolanaWallet = () => {
  const { publicKey, connected, signMessage, disconnect } = useWallet();
  const [isSolanaAuthenticated, setIsSolanaAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsSolanaAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isSolanaAuthenticated && connected && publicKey && signMessage) {
      sign();
    } else {
      alert("Not signed in or wallet not connected");
    }
  }, [connected, publicKey, signMessage]);

  const sign = useCallback(async () => {
		try {
			if (!publicKey) throw new Error('Wallet not connected!')
			if (!signMessage) throw new Error('Wallet does not support message signing!')

			const message = "werate";
			const signature = await signMessage(decodeUTF8(message));

      const data = JSON.stringify({
        message,
        signature: bs58.encode(signature),
        publicKey: publicKey.toString(),
      });

      // Connect a user's wallet to the profile
      const response = await postData('/api/v1/wallets/link', data);
      if (response && response.data.success) {
        alert('Wallet is connected to your profile!');
      } else {
        disconnect();
        alert(response?.data?.message || 'An error occurred');
      }
		} catch (error: unknown) {
      alert(`Sign Message failed: ${(error as Error)?.message}`);
      disconnect();
		}
	}, [publicKey, signMessage])

  return (
    <>
      {isSolanaAuthenticated && (
        <div style={{ position: "absolute", top: 5, right: 5, zIndex: 1000 }}>
          <WalletMultiButton />
          <PublicKey />
        </div>
      )}
    </>
  );
};

export default SolanaWallet;
