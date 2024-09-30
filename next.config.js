module.exports = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.werate.io/:path*' // Proxy to Backend
      }
    ];
  }
};
