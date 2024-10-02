'use client';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const Mapbox = dynamic(() => import('@/components/MapboxMap'));

const map = () => {
  const [, setDataBounds] = useState<string>('');
  return (
    <div className="h-full w-full">
      <Mapbox setDataBounds={setDataBounds} reviews={[]} highlightedId={null} />
    </div>
  );
};
export default map;
