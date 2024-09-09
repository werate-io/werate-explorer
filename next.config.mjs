// next.config.mjs
export default {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://mobile.werate.io/api/v1/:path*', // Proxy to Backend
      },
    ];
  },
};