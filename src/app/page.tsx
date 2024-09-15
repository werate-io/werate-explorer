"use client";
import ReviewsList from "@/components/ReviewsList";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import AppWalletProvider from "@/components/AppWalletProvider";

const LazyMap = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <div className="relative top-0 left-0 h-full z-10">
        <Sidebar />
      </div>
      <div className="relative flex w-full">
        <AppWalletProvider>
          <LazyMap />
        </AppWalletProvider>
      </div>
      <div className="flex-shrink-0 w-1/3 overflow-y-auto">
        <ReviewsList />
      </div>
    </main>
  );
}