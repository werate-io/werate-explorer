import { AppProps } from 'next/app';
import React, { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/context/AuthContext'; // Import the AuthProvider
import '@/styles/global.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Head from 'next/head';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Head>
            <link rel="icon" href="/we-rate-icon.png" />
            <title>WeRate Explorer</title>
            <meta name="description" content="We Reward Reviews" />
          </Head>
          <Component {...pageProps} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default MyApp;
