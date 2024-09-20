import '@/styles/global.css';
import React from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
