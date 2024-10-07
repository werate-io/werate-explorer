import React, { useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/StatCard';
import { MapPinIcon, StarIcon, GlobeIcon, WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '../ui/wallet-adapter-react-ui';
import { postWalletLink } from '../../services/walletService';
import { decodeUTF8 } from 'tweetnacl-util';
import bs58 from 'bs58';
import { useProfile } from '@/hooks/useProfile';
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton';
import { useAuth } from '@/context/AuthContext';

export default function ProfileWithStats() {
  const { isLoggedIn, signOut } = useAuth();
  const { publicKey, connected, connecting, signMessage, disconnect } = useWallet();
  const { data: profile, isLoading } = useProfile();

  useEffect(() => {
    if (connected && publicKey && signMessage) {
      sign();
    }
  }, [connected, publicKey, signMessage]);

  const sign = useCallback(async () => {
    try {
      if (!publicKey) throw new Error('Wallet not connected!');
      if (!signMessage) throw new Error('Wallet does not support message signing!');

      const message = 'Hackathon-WeRate';
      const signature = await signMessage(decodeUTF8(message));

      const data = {
        message,
        signature: bs58.encode(signature),
        publicKey: publicKey.toString()
      };

      // Connect a user's wallet to the profile
      const response = await postWalletLink(data);
      if (response && response.data.error) {
        disconnect();
        alert(response?.data?.message || 'An error occurred');
      } else {
        alert('Wallet is connected to your profile!');
      }
    } catch (error: unknown) {
      alert(`Sign Message failed: ${(error as Error)?.message}`);
      disconnect();
    }
  }, [publicKey, signMessage]);

  if (!isLoggedIn || !publicKey) {
    return (
      <Card className="w-full bg-primary p-4 rounded-lg shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center gap-4 p-4">
          <CardTitle className="text-white text-2xl font-bold"></CardTitle>

          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-800 text-white font-bold py-2 w-full px-4 rounded text-sm flex items-center gap-2">
            <WalletIcon className="h-5 w-5" />
            {!connecting ? (
              <span className="ml-2">Connect Wallet</span>
            ) : (
              <span className="ml-2">Connecting ...</span>
            )}
          </WalletMultiButton>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <>
          <Card className="w-full bg-primary p-4 rounded-lg shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between gap-4 p-4">
              <CardTitle className="text-white text-lg md:text-xl font-bold">Profile</CardTitle>
              <Button
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-800 text-white p-2 rounded"
                onClick={() => {
                  disconnect();
                  signOut();
                }}>
                <WalletIcon className="h-5 w-5" />
                Disconnect
              </Button>
            </CardHeader>
            <CardHeader className="flex flex-row items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-slate-50">
                  <AvatarImage src={profile?.favoriteAvatarId} alt="User avatar" />
                  <AvatarFallback>{profile?.nickname?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-white text-1xl font-bold mb-1">
                    {profile?.nickname}
                  </CardTitle>
                  <p className="text-sm text-muted text-white font-mono rounded break-all">
                    {publicKey.toBase58()}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <StatCard title="Reviews" value={profile?.reviewCount ?? 0} icon={StarIcon} />
            <StatCard title="Venues" value={profile?.avatarCount ?? 0} icon={MapPinIcon} />
            <StatCard title="Countries" value={profile?.uniqueVisitsCount ?? 0} icon={GlobeIcon} />
            <StatCard title="Avg Rating" value={profile?.overallRating ?? 0} icon={StarIcon} />
          </div>
        </>
      )}
    </>
  );
}
