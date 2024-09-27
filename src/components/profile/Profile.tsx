import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/StatCard';
import { MapPinIcon, StarIcon, GlobeIcon } from 'lucide-react';
import { WalletIcon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function ProfileWithStats() {
  const { publicKey, disconnect } = useWallet();

  if (!publicKey) {
    return (
      <Card className="w-full bg-primary p-4 rounded-lg shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center gap-4 p-4">
          <CardTitle className="text-white text-2xl font-bold">Connect Your Wallet</CardTitle>

          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-800 text-white font-bold py-2 px-4 rounded text-sm flex items-center gap-2">
            <WalletIcon className="h-5 w-5" />
            <span className="ml-2">Connect Wallet</span>
          </WalletMultiButton>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full bg-primary p-4 rounded-lg shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between gap-4 p-4">
          <CardTitle className="text-white text-2xl font-bold">Profile</CardTitle>
          <Button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-800 text-white p-2 rounded"
            onClick={disconnect}>
            <Wallet className="h-5 w-5" />
            Disconnect
          </Button>
        </CardHeader>
        <CardHeader className="flex flex-row items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 bg-slate-50">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="User avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-white text-1xl font-bold mb-1">Jane Doe</CardTitle>
              <p className="text-sm text-muted text-white font-mono rounded break-all">
                {publicKey.toBase58()}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <StatCard title="Reviews" value={697738} change={203} icon={StarIcon} />
        <StatCard title="Venues" value={58704} change={203} icon={MapPinIcon} />
        <StatCard title="Countries" value={195} change={2} icon={GlobeIcon} />
        <StatCard title="Avg Rating" value={195} change={-2} icon={StarIcon} />
      </div>
    </>
  );
}
