module.exports = {
  images: {
    domains: [
      'pics.dmm.co.jp',
      'su-musume.com', // 既存の画像ドメイン
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/dmm/:path*',
        destination: 'https://api.dmm.com/:path*',
      },
    ];
  },
}
