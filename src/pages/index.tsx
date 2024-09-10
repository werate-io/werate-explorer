import React from 'react';
import dynamic from 'next/dynamic';
import '@/styles/Home.module.css';

const LazyMap = dynamic(() => import('@/components/map'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw' }}>
      <LazyMap />
    </main>
  );
}
