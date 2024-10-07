module.exports = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://explorer.werate.io/:path*' // Proxy to Backend
      }
    ];
  }
};
