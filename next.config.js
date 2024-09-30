module.exports = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mobile.werate.io/:path*' // Proxy to Backend
      }
    ];
  }
};
